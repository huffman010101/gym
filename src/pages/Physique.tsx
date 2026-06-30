import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import BottomNav from '../components/BottomNav';
import type { BodyMetric, SkinEntry, ProgressPhoto } from '../lib/types';
import { ArrowLeft, Plus, Trash2, Camera, TrendingUp, TrendingDown, Minus, Check, Upload, X } from 'lucide-react';

type Tab = 'metrics' | 'photos' | 'skincare';

function load<T>(key: string): T[] {
  try { return JSON.parse(localStorage.getItem(key) || '[]') as T[]; }
  catch { return []; }
}
function save<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}
function todayStr(): string {
  return new Date().toISOString().split('T')[0];
}
function daysSince(dateStr: string): number {
  const then = new Date(dateStr + 'T00:00:00');
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24));
}

async function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = ev => {
      const img = new Image();
      img.onload = () => {
        const MAX = 800;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        const ctx = canvas.getContext('2d');
        if (!ctx) { reject(new Error('Canvas error')); return; }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.7));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

type MetricKey = 'weight' | 'waist' | 'shoulders' | 'arms';

export default function Physique() {
  const [tab, setTab] = useState<Tab>('metrics');

  // Metrics
  const [metrics, setMetrics] = useState<BodyMetric[]>([]);
  const [loggingMetric, setLoggingMetric] = useState(false);
  const [metricForm, setMetricForm] = useState({ weight: '', waist: '', shoulders: '', arms: '', notes: '' });

  // Photos
  const [photos, setPhotos] = useState<ProgressPhoto[]>([]);
  const [photoAngle, setPhotoAngle] = useState<'front' | 'side' | 'back'>('front');
  const [compareA, setCompareA] = useState('');
  const [compareB, setCompareB] = useState('');
  const [uploadError, setUploadError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // Skincare
  const [skinEntries, setSkinEntries] = useState<SkinEntry[]>([]);
  const [loggingSkin, setLoggingSkin] = useState(false);
  const [skinForm, setSkinForm] = useState({ retinol: false, bha: false, aha: false, spf: false, notes: '' });

  useEffect(() => {
    setMetrics(load<BodyMetric>('gymforge_body_metrics'));
    setPhotos(load<ProgressPhoto>('gymforge_photos'));
    setSkinEntries(load<SkinEntry>('gymforge_skin_entries'));
  }, []);

  // --- METRICS ---
  const saveMetric = () => {
    const w = parseFloat(metricForm.weight);
    const wa = parseFloat(metricForm.waist);
    const sh = parseFloat(metricForm.shoulders);
    const ar = parseFloat(metricForm.arms);
    if (isNaN(w) || isNaN(wa) || isNaN(sh) || isNaN(ar)) return;
    const m: BodyMetric = {
      id: Date.now().toString(), date: todayStr(),
      weight: w, waist: wa, shoulders: sh, arms: ar,
      notes: metricForm.notes || undefined,
    };
    const updated = [m, ...metrics];
    setMetrics(updated);
    save('gymforge_body_metrics', updated);
    setLoggingMetric(false);
    setMetricForm({ weight: '', waist: '', shoulders: '', arms: '', notes: '' });
  };

  const deleteMetric = (id: string) => {
    const updated = metrics.filter(m => m.id !== id);
    setMetrics(updated);
    save('gymforge_body_metrics', updated);
  };

  const sortedMetrics = [...metrics].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const latest = sortedMetrics[0];
  const prev = sortedMetrics[1];
  const vtaper = latest ? (latest.shoulders / latest.waist).toFixed(2) : null;
  const prevVtaper = prev ? (prev.shoulders / prev.waist).toFixed(2) : null;

  // Lookup map so we avoid unsafe index casts
  const prevNumMap: Record<MetricKey, number> | null = prev
    ? { weight: prev.weight, waist: prev.waist, shoulders: prev.shoulders, arms: prev.arms }
    : null;

  // --- PHOTOS ---
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadError('');
    try {
      const dataUrl = await compressImage(file);
      const photo: ProgressPhoto = {
        id: Date.now().toString(), date: todayStr(), angle: photoAngle, dataUrl,
      };
      const updated = [photo, ...photos];
      setPhotos(updated);
      save('gymforge_photos', updated);
    } catch {
      setUploadError('Failed to process photo. Try a smaller image.');
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  const deletePhoto = (id: string) => {
    const updated = photos.filter(p => p.id !== id);
    setPhotos(updated);
    save('gymforge_photos', updated);
    if (compareA === id) setCompareA('');
    if (compareB === id) setCompareB('');
  };

  const photoA = photos.find(p => p.id === compareA);
  const photoB = photos.find(p => p.id === compareB);

  // --- SKINCARE ---
  const saveSkin = () => {
    if (!skinForm.retinol && !skinForm.bha && !skinForm.aha && !skinForm.spf) return;
    const existing = skinEntries.find(e => e.date === todayStr());
    let updated: SkinEntry[];
    if (existing) {
      updated = skinEntries.map(e => e.date === todayStr()
        ? { ...e, retinol: skinForm.retinol, bha: skinForm.bha, aha: skinForm.aha, spf: skinForm.spf, notes: skinForm.notes || undefined }
        : e
      );
    } else {
      const entry: SkinEntry = {
        id: Date.now().toString(), date: todayStr(),
        retinol: skinForm.retinol, bha: skinForm.bha, aha: skinForm.aha, spf: skinForm.spf,
        notes: skinForm.notes || undefined,
      };
      updated = [entry, ...skinEntries];
    }
    setSkinEntries(updated);
    save('gymforge_skin_entries', updated);
    setLoggingSkin(false);
    setSkinForm({ retinol: false, bha: false, aha: false, spf: false, notes: '' });
  };

  const sortedSkin = [...skinEntries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const lastRetinol = sortedSkin.find(e => e.retinol);
  const lastBha = sortedSkin.find(e => e.bha);
  const lastAha = sortedSkin.find(e => e.aha);
  const lastSpf = sortedSkin.find(e => e.spf);

  const activeCheck = (active: boolean, label: string, key: 'retinol' | 'bha' | 'aha' | 'spf') => (
    <button
      onClick={() => setSkinForm(p => ({ ...p, [key]: !p[key] }))}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border font-semibold text-sm transition-all ${
        active ? 'bg-purple-500/20 border-purple-500/50 text-purple-300' : 'bg-white/5 border-white/10 text-gray-500'
      }`}
    >
      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0 ${
        active ? 'bg-purple-500 border-purple-500' : 'border-gray-600'
      }`}>
        {active && <Check size={10} />}
      </div>
      {label}
    </button>
  );

  const METRIC_ROWS: { label: string; key: MetricKey; unit: string; color: string }[] = [
    { label: 'Weight', key: 'weight', unit: 'kg', color: 'text-white' },
    { label: 'Waist', key: 'waist', unit: 'cm', color: 'text-red-400' },
    { label: 'Shoulders', key: 'shoulders', unit: 'cm', color: 'text-blue-400' },
    { label: 'Arms', key: 'arms', unit: 'cm', color: 'text-orange-400' },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white pb-24">
      <div className="px-4 pt-12 pb-4 bg-gradient-to-b from-purple-950/30 to-transparent">
        <Link to="/dashboard" className="inline-flex items-center text-gray-500 hover:text-white text-sm mb-4 transition-colors">
          <ArrowLeft size={15} className="mr-1" /> Dashboard
        </Link>
        <h1 className="text-3xl font-black tracking-tight">Physique</h1>
      </div>

      {/* Tabs */}
      <div className="px-4 mb-4">
        <div className="flex gap-2 bg-[#111] border border-white/10 rounded-2xl p-1">
          {(['metrics', 'photos', 'skincare'] as Tab[]).map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`flex-1 py-2 rounded-xl text-xs font-semibold capitalize transition-all ${
                tab === t ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}>
              {t}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 space-y-4">

        {/* ===== METRICS TAB ===== */}
        {tab === 'metrics' && (
          <>
            {latest && (
              <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
                <h2 className="font-bold text-base mb-3">Current Measurements</h2>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  {METRIC_ROWS.map(({ label, key, unit, color }) => {
                    const val = latest[key];
                    const prevVal = prevNumMap ? prevNumMap[key] : null;
                    const diff = prevVal !== null ? val - prevVal : null;
                    const isWaist = key === 'waist';
                    return (
                      <div key={key} className="bg-white/5 rounded-xl p-3">
                        <p className="text-gray-500 text-xs">{label}</p>
                        <p className={`text-xl font-black ${color}`}>{val}<span className="text-xs text-gray-500 ml-0.5">{unit}</span></p>
                        {diff !== null && diff !== 0 && (
                          <p className={`text-xs flex items-center gap-0.5 mt-0.5 ${
                            isWaist ? (diff < 0 ? 'text-green-400' : 'text-red-400')
                            : key === 'weight' ? (diff < 0 ? 'text-blue-400' : 'text-orange-400')
                            : 'text-green-400'
                          }`}>
                            {diff > 0 ? <TrendingUp size={10} /> : <TrendingDown size={10} />}
                            {diff > 0 ? '+' : ''}{diff.toFixed(1)}{unit}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
                {vtaper && (
                  <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-500/20 rounded-xl p-3 flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-400">V-Taper Ratio</p>
                      <p className="text-2xl font-black text-blue-400">{vtaper}</p>
                      <p className="text-gray-500 text-xs">Shoulders ÷ Waist (aim: 1.6+)</p>
                    </div>
                    {prevVtaper && (
                      <div className="text-right">
                        <p className={`text-sm font-bold flex items-center gap-1 justify-end ${
                          parseFloat(vtaper) > parseFloat(prevVtaper) ? 'text-green-400' : parseFloat(vtaper) < parseFloat(prevVtaper) ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {parseFloat(vtaper) > parseFloat(prevVtaper)
                            ? <TrendingUp size={14} /> : parseFloat(vtaper) < parseFloat(prevVtaper)
                            ? <TrendingDown size={14} /> : <Minus size={14} />}
                          {(parseFloat(vtaper) - parseFloat(prevVtaper)).toFixed(3)}
                        </p>
                        <p className="text-gray-600 text-xs">vs last log</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {!loggingMetric ? (
              <button onClick={() => setLoggingMetric(true)}
                className="w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-2xl py-3 text-purple-400 font-bold flex items-center justify-center gap-2 transition-colors">
                <Plus size={16} /> Log Today's Metrics
              </button>
            ) : (
              <div className="bg-[#111] rounded-2xl border border-purple-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Log Measurements</h2>
                  <button onClick={() => setLoggingMetric(false)} className="text-gray-500 hover:text-red-400 transition-colors"><X size={18} /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {([
                    { key: 'weight', label: 'Weight', unit: 'kg', placeholder: '80.5' },
                    { key: 'waist', label: 'Waist', unit: 'cm', placeholder: '82' },
                    { key: 'shoulders', label: 'Shoulders', unit: 'cm', placeholder: '120' },
                    { key: 'arms', label: 'Arms', unit: 'cm', placeholder: '36' },
                  ] as { key: keyof typeof metricForm; label: string; unit: string; placeholder: string }[]).map(({ key, label, unit, placeholder }) => (
                    <div key={key}>
                      <label className="text-xs text-gray-400 mb-1 block">{label} ({unit})</label>
                      <input type="number" step="0.1" placeholder={placeholder}
                        value={metricForm[key]}
                        onChange={e => setMetricForm(p => ({ ...p, [key]: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50" />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
                  <input type="text" placeholder="e.g. Morning, fasted"
                    value={metricForm.notes}
                    onChange={e => setMetricForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50" />
                </div>
                <button onClick={saveMetric}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-xl py-3 font-bold transition-all">
                  Save Measurements
                </button>
              </div>
            )}

            {sortedMetrics.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-400 text-sm px-1 mb-2">History</h3>
                <div className="space-y-2">
                  {sortedMetrics.slice(0, 8).map(m => (
                    <div key={m.id} className="bg-[#111] rounded-2xl border border-white/10 p-3 flex items-center justify-between">
                      <div>
                        <p className="text-gray-500 text-xs mb-1">{m.date}</p>
                        <p className="text-sm">
                          <span className="font-bold text-white">{m.weight}kg</span>
                          <span className="text-gray-500 mx-2">·</span>
                          <span className="text-red-400">{m.waist}cm waist</span>
                          <span className="text-gray-500 mx-2">·</span>
                          <span className="text-blue-400">{m.shoulders}cm sh.</span>
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">Arms {m.arms}cm · V-taper {(m.shoulders / m.waist).toFixed(2)}</p>
                      </div>
                      <button onClick={() => deleteMetric(m.id)} className="text-gray-600 hover:text-red-400 transition-colors ml-2">
                        <Trash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* ===== PHOTOS TAB ===== */}
        {tab === 'photos' && (
          <>
            <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
              <h2 className="font-bold text-base mb-3 flex items-center gap-2">
                <Camera size={16} className="text-orange-400" /> Add Progress Photo
              </h2>
              <div className="flex gap-2 mb-3">
                {(['front', 'side', 'back'] as const).map(a => (
                  <button key={a} onClick={() => setPhotoAngle(a)}
                    className={`flex-1 py-2 rounded-xl border text-xs font-bold capitalize transition-all ${
                      photoAngle === a ? 'bg-orange-500/20 border-orange-500/50 text-orange-400' : 'bg-white/5 border-white/10 text-gray-500'
                    }`}>
                    {a}
                  </button>
                ))}
              </div>
              <button onClick={() => fileRef.current?.click()}
                className="w-full border-2 border-dashed border-white/20 hover:border-orange-500/40 rounded-xl py-6 flex flex-col items-center gap-2 text-gray-400 hover:text-orange-400 transition-colors">
                <Upload size={24} />
                <span className="text-sm font-medium">Tap to upload {photoAngle} photo</span>
                <span className="text-xs text-gray-600">JPG or PNG · compressed automatically</span>
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleUpload} />
              {uploadError && <p className="text-red-400 text-xs mt-2">{uploadError}</p>}
            </div>

            {photos.length >= 2 && (
              <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
                <h2 className="font-bold text-base mb-3">Side-by-Side Comparison</h2>
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">Before</label>
                    <select value={compareA} onChange={e => setCompareA(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                      <option value="">Select photo</option>
                      {photos.map(p => <option key={p.id} value={p.id}>{p.date} — {p.angle}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-400 mb-1 block">After</label>
                    <select value={compareB} onChange={e => setCompareB(e.target.value)}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-white focus:outline-none">
                      <option value="">Select photo</option>
                      {photos.map(p => <option key={p.id} value={p.id}>{p.date} — {p.angle}</option>)}
                    </select>
                  </div>
                </div>
                {photoA && photoB && (
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <img src={photoA.dataUrl} alt="before" className="w-full rounded-xl object-cover" />
                      <p className="text-center text-xs text-gray-500 mt-1">{photoA.date} · {photoA.angle}</p>
                    </div>
                    <div>
                      <img src={photoB.dataUrl} alt="after" className="w-full rounded-xl object-cover" />
                      <p className="text-center text-xs text-gray-500 mt-1">{photoB.date} · {photoB.angle}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {photos.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-400 text-sm px-1 mb-2">Gallery</h3>
                <div className="grid grid-cols-3 gap-2">
                  {photos.map(p => (
                    <div key={p.id} className="relative">
                      <img src={p.dataUrl} alt={p.angle} className="w-full aspect-square object-cover rounded-xl" />
                      <div className="absolute top-1 left-1 bg-black/60 rounded px-1.5 py-0.5 text-[10px] text-white capitalize">{p.angle}</div>
                      <button onClick={() => deletePhoto(p.id)}
                        className="absolute top-1 right-1 bg-black/60 hover:bg-red-500/80 rounded p-1 text-white transition-colors">
                        <X size={10} />
                      </button>
                      <p className="text-center text-gray-600 text-[10px] mt-0.5">{p.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {photos.length === 0 && (
              <p className="text-center text-gray-600 text-sm py-4">No photos yet — upload your first progress photo above</p>
            )}
          </>
        )}

        {/* ===== SKINCARE TAB ===== */}
        {tab === 'skincare' && (
          <>
            <div className="bg-[#111] rounded-2xl border border-white/10 p-4">
              <h2 className="font-bold text-base mb-3">Active Status</h2>
              <div className="space-y-2">
                {([
                  { label: 'Retinol', entry: lastRetinol, warnDays: 3, note: 'Every 3rd night' },
                  { label: 'BHA (Salicylic)', entry: lastBha, warnDays: 3, note: 'Every 3rd night' },
                  { label: 'AHA (Glycolic)', entry: lastAha, warnDays: 5, note: 'Weekly or less' },
                  { label: 'SPF', entry: lastSpf, warnDays: 1, note: 'Every morning' },
                ] as { label: string; entry: SkinEntry | undefined; warnDays: number; note: string }[]).map(({ label, entry, warnDays, note }) => {
                  const days = entry ? daysSince(entry.date) : null;
                  return (
                    <div key={label} className="flex items-center justify-between bg-white/5 rounded-xl px-3 py-2.5">
                      <div>
                        <p className="font-semibold text-sm text-gray-200">{label}</p>
                        <p className="text-gray-600 text-xs">{note}</p>
                      </div>
                      {days !== null ? (
                        <span className={`text-sm font-bold ${
                          days === 0 ? 'text-green-400'
                          : days <= warnDays ? 'text-orange-400'
                          : 'text-red-400'
                        }`}>
                          {days === 0 ? 'Tonight ✓' : `${days}d ago`}
                        </span>
                      ) : (
                        <span className="text-gray-600 text-xs">Never logged</span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {!loggingSkin ? (
              <button onClick={() => setLoggingSkin(true)}
                className="w-full bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 rounded-2xl py-3 text-purple-400 font-bold flex items-center justify-center gap-2 transition-colors">
                <Plus size={16} /> Log Tonight's Routine
              </button>
            ) : (
              <div className="bg-[#111] rounded-2xl border border-purple-500/20 p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Tonight's Actives</h2>
                  <button onClick={() => setLoggingSkin(false)} className="text-gray-500 hover:text-red-400 transition-colors"><X size={18} /></button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {activeCheck(skinForm.retinol, 'Retinol', 'retinol')}
                  {activeCheck(skinForm.bha, 'BHA', 'bha')}
                  {activeCheck(skinForm.aha, 'AHA', 'aha')}
                  {activeCheck(skinForm.spf, 'SPF', 'spf')}
                </div>
                <div>
                  <label className="text-xs text-gray-400 mb-1 block">Notes (optional)</label>
                  <input type="text" placeholder="e.g. Felt some irritation, used less retinol"
                    value={skinForm.notes}
                    onChange={e => setSkinForm(p => ({ ...p, notes: e.target.value }))}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-purple-500/50" />
                </div>
                <button onClick={saveSkin}
                  className="w-full bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 rounded-xl py-3 font-bold transition-all">
                  Save Routine
                </button>
              </div>
            )}

            {sortedSkin.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-400 text-sm px-1 mb-2">Last 14 Nights</h3>
                <div className="bg-[#111] rounded-2xl border border-white/10 overflow-hidden">
                  {sortedSkin.slice(0, 14).map((e, i) => (
                    <div key={e.id} className={`flex items-center justify-between px-4 py-2.5 ${
                      i < sortedSkin.slice(0, 14).length - 1 ? 'border-b border-white/5' : ''
                    }`}>
                      <p className="text-gray-400 text-xs">{e.date}</p>
                      <div className="flex items-center gap-2">
                        {e.retinol && <span className="text-[10px] bg-purple-500/20 text-purple-400 px-1.5 py-0.5 rounded font-bold">RTN</span>}
                        {e.bha && <span className="text-[10px] bg-blue-500/20 text-blue-400 px-1.5 py-0.5 rounded font-bold">BHA</span>}
                        {e.aha && <span className="text-[10px] bg-green-500/20 text-green-400 px-1.5 py-0.5 rounded font-bold">AHA</span>}
                        {e.spf && <span className="text-[10px] bg-yellow-500/20 text-yellow-400 px-1.5 py-0.5 rounded font-bold">SPF</span>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
