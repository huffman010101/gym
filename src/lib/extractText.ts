import JSZip from 'jszip';

/*
 * Client-side text extraction for lecture material.
 *
 * Everything runs in the browser — files are never uploaded anywhere. Only the
 * extracted text is sent to the API when the study pack is generated.
 *
 * .pptx and .docx are ZIP archives of XML, so JSZip plus a tag strip is enough.
 * PDF needs a real parser, so pdfjs is loaded dynamically only when a PDF is
 * actually chosen — it is large and most users will only attach slides.
 */

export interface Extracted {
  name: string;
  chars: number;
  text: string;
  error?: string;
}

/** Total characters sent to the model. Roughly 4 chars per token, and the
 *  prompt plus a 16k-token response has to fit alongside it. */
export const MAX_TOTAL_CHARS = 400_000;

function decode(s: string): string {
  return s
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => String.fromCharCode(Number(d)))
    // Ampersand last, so "&amp;lt;" does not become "<".
    .replace(/&amp;/g, '&');
}

/*
 * Pulls text from the actual text-run elements (<a:t> in PowerPoint, <w:t> in
 * Word) rather than stripping all tags. Blind tag-stripping silently swallows
 * everything between a stray "<" and the next ">", which quietly ate content
 * like "PED < 1 inelastic" — exactly the maths notation lecture slides are full of.
 */
function xmlToText(xml: string, tag: 'a' | 'w'): string {
  const paraClose = tag === 'a' ? '</a:p>' : '</w:p>';
  const runRe = tag === 'a' ? /<a:t[^>]*>([\s\S]*?)<\/a:t>/g : /<w:t[^>]*>([\s\S]*?)<\/w:t>/g;

  return xml
    .split(paraClose)
    .map(para => {
      const runs: string[] = [];
      let m: RegExpExecArray | null;
      runRe.lastIndex = 0;
      while ((m = runRe.exec(para)) !== null) runs.push(decode(m[1]));
      return runs.join('').replace(/[ \t]+/g, ' ').trim();
    })
    .filter(Boolean)
    .join('\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

async function fromPptx(file: File): Promise<string> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const slideNames = Object.keys(zip.files)
    .filter(n => /^ppt\/slides\/slide\d+\.xml$/.test(n))
    .sort((a, b) => {
      const na = parseInt(a.match(/slide(\d+)\.xml/)![1], 10);
      const nb = parseInt(b.match(/slide(\d+)\.xml/)![1], 10);
      return na - nb;
    });

  const notesNames = new Set(
    Object.keys(zip.files).filter(n => /^ppt\/notesSlides\/notesSlide\d+\.xml$/.test(n))
  );

  const parts: string[] = [];
  for (let i = 0; i < slideNames.length; i++) {
    const xml = await zip.files[slideNames[i]].async('string');
    const body = xmlToText(xml, 'a');
    if (!body) continue;
    parts.push(`--- Slide ${i + 1} ---\n${body}`);

    // Speaker notes often carry the explanation the slide only gestures at.
    const noteName = `ppt/notesSlides/notesSlide${i + 1}.xml`;
    if (notesNames.has(noteName)) {
      const noteText = xmlToText(await zip.files[noteName].async('string'), 'a');
      // notesSlide XML repeats the slide body plus the slide number; keep it
      // only when it actually adds something.
      if (noteText && noteText.length > 20 && !body.includes(noteText.slice(0, 40))) {
        parts.push(`[Speaker notes] ${noteText}`);
      }
    }
  }
  if (!parts.length) throw new Error('No text found — the slides may be images only');
  return parts.join('\n\n');
}

async function fromDocx(file: File): Promise<string> {
  const zip = await JSZip.loadAsync(await file.arrayBuffer());
  const doc = zip.file('word/document.xml');
  if (!doc) throw new Error('Not a readable Word file');
  const text = xmlToText(await doc.async('string'), 'w');
  if (!text) throw new Error('No text found');
  return text;
}

async function fromPdf(file: File): Promise<string> {
  const pdfjs = await import('pdfjs-dist');
  // Run without a separate worker file: simpler than shipping and versioning
  // a worker asset, and extraction is a one-off action rather than a hot path.
  (pdfjs as unknown as { GlobalWorkerOptions: { workerSrc: string } }).GlobalWorkerOptions.workerSrc = '';

  const doc = await pdfjs.getDocument({
    data: new Uint8Array(await file.arrayBuffer()),
    useWorkerFetch: false,
    useSystemFonts: true,
  }).promise;

  const parts: string[] = [];
  for (let i = 1; i <= doc.numPages; i++) {
    const page = await doc.getPage(i);
    const content = await page.getTextContent();
    const text = content.items
      .map(it => ('str' in it ? it.str : ''))
      .join(' ')
      .replace(/\s+/g, ' ')
      .trim();
    if (text) parts.push(`--- Page ${i} ---\n${text}`);
  }
  if (!parts.length) throw new Error('No text found — this PDF may be scanned images');
  return parts.join('\n\n');
}

export async function extractFile(file: File): Promise<Extracted> {
  const name = file.name;
  const lower = name.toLowerCase();
  try {
    let text: string;
    if (lower.endsWith('.pptx')) text = await fromPptx(file);
    else if (lower.endsWith('.docx')) text = await fromDocx(file);
    else if (lower.endsWith('.pdf')) text = await fromPdf(file);
    else if (/\.(txt|md|csv|rtf)$/.test(lower)) text = await file.text();
    else if (lower.endsWith('.ppt') || lower.endsWith('.doc')) {
      throw new Error('Old format — open it and "Save As" .pptx or .docx');
    } else {
      throw new Error('Unsupported file type');
    }
    return { name, chars: text.length, text };
  } catch (e) {
    return { name, chars: 0, text: '', error: e instanceof Error ? e.message : 'Could not read this file' };
  }
}

/** Joins extracted files, trimming proportionally if the total is too large so
 *  no single lecture dominates and later files are not silently dropped. */
export function combine(files: Extracted[], pasted: string): { text: string; truncated: boolean } {
  const ok = files.filter(f => !f.error && f.text);
  const pastedPart = pasted.trim() ? `--- Pasted notes ---\n${pasted.trim()}\n\n` : '';
  const budget = MAX_TOTAL_CHARS - pastedPart.length;

  const total = ok.reduce((n, f) => n + f.text.length, 0);
  if (total <= budget) {
    return {
      text: pastedPart + ok.map(f => `=== ${f.name} ===\n${f.text}`).join('\n\n'),
      truncated: false,
    };
  }

  const share = budget / total;
  const parts = ok.map(f => {
    const keep = Math.floor(f.text.length * share);
    const slice = f.text.slice(0, keep);
    return `=== ${f.name} ===\n${slice}\n[...trimmed to fit]`;
  });
  return { text: pastedPart + parts.join('\n\n'), truncated: true };
}
