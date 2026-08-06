import { useRef, useState } from 'react';
import type { Candle } from '../lib/backtestData';

export type Tool = 'cursor' | 'hline' | 'box';
export type Annotation =
  | { id: string; type: 'hline'; price: number }
  | { id: string; type: 'box'; i1: number; i2: number; p1: number; p2: number };

export interface Overlay { price: number; color: string; label: string }

interface Props {
  candles: Candle[];
  viewStart: number;
  viewSize: number;
  tool: Tool;
  annotations: Annotation[];
  onAdd: (a: Annotation) => void;
  overlays?: Overlay[];
  width?: number;
  height?: number;
}

const PAD = { top: 10, right: 54, bottom: 20, left: 6 };

export default function CandlestickChart({ candles, viewStart, viewSize, tool, annotations, onAdd, overlays = [], width = 800, height = 380 }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const [draft, setDraft] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);

  const visible = candles.slice(viewStart, viewStart + viewSize);
  const highs = visible.map(c => c.high), lows = visible.map(c => c.low);
  const overlayPrices = overlays.map(o => o.price);
  const rawMax = Math.max(...highs, ...overlayPrices), rawMin = Math.min(...lows, ...overlayPrices);
  const range = (rawMax - rawMin) || 1;
  const maxPrice = rawMax + range * 0.06;
  const minPrice = rawMin - range * 0.06;
  const priceRange = maxPrice - minPrice;

  const plotW = width - PAD.left - PAD.right;
  const plotH = height - PAD.top - PAD.bottom;

  const indexToX = (i: number) => PAD.left + ((i - viewStart + 0.5) / viewSize) * plotW;
  const priceToY = (p: number) => PAD.top + (1 - (p - minPrice) / priceRange) * plotH;
  const yToPrice = (y: number) => minPrice + (1 - (y - PAD.top) / plotH) * priceRange;
  const xToIndex = (x: number) => Math.round(viewStart + ((x - PAD.left) / plotW) * viewSize - 0.5);

  function svgPoint(e: React.PointerEvent) {
    const svg = svgRef.current;
    if (!svg) return { x: 0, y: 0 };
    const rect = svg.getBoundingClientRect();
    const scaleX = width / rect.width;
    const scaleY = height / rect.height;
    return { x: (e.clientX - rect.left) * scaleX, y: (e.clientY - rect.top) * scaleY };
  }

  function handleDown(e: React.PointerEvent) {
    if (tool === 'cursor') return;
    const { x, y } = svgPoint(e);
    if (tool === 'hline') {
      onAdd({ id: crypto.randomUUID(), type: 'hline', price: yToPrice(y) });
      return;
    }
    (e.target as Element).setPointerCapture?.(e.pointerId);
    dragStart.current = { x, y };
    setDraft({ x1: x, y1: y, x2: x, y2: y });
  }

  function handleMove(e: React.PointerEvent) {
    if (!dragStart.current) return;
    const { x, y } = svgPoint(e);
    setDraft({ x1: dragStart.current.x, y1: dragStart.current.y, x2: x, y2: y });
  }

  function handleUp() {
    if (tool === 'box' && draft && dragStart.current) {
      const iA = xToIndex(draft.x1), iB = xToIndex(draft.x2);
      const pA = yToPrice(draft.y1), pB = yToPrice(draft.y2);
      if (Math.abs(iA - iB) >= 1 && Math.abs(pA - pB) > 0) {
        onAdd({ id: crypto.randomUUID(), type: 'box', i1: Math.min(iA, iB), i2: Math.max(iA, iB), p1: Math.min(pA, pB), p2: Math.max(pA, pB) });
      }
    }
    dragStart.current = null;
    setDraft(null);
  }

  const candleW = Math.max((plotW / viewSize) * 0.62, 1.2);
  const gridPrices = Array.from({ length: 5 }, (_, i) => minPrice + (priceRange * i) / 4);

  return (
    <svg ref={svgRef} viewBox={`0 0 ${width} ${height}`} className="w-full h-auto touch-none select-none"
      style={{ cursor: tool === 'cursor' ? 'default' : 'crosshair' }}
      onPointerDown={handleDown} onPointerMove={handleMove} onPointerUp={handleUp} onPointerLeave={handleUp}>
      {gridPrices.map((p, i) => (
        <g key={i}>
          <line x1={PAD.left} y1={priceToY(p)} x2={width - PAD.right} y2={priceToY(p)} stroke="rgba(255,255,255,0.06)" strokeWidth={1} />
          <text x={width - PAD.right + 6} y={priceToY(p) + 3} fontSize={9} fill="#6b7280">{p.toFixed(0)}</text>
        </g>
      ))}

      {visible.map((c, idx) => {
        const i = viewStart + idx;
        const x = indexToX(i);
        const up = c.close >= c.open;
        const color = up ? '#34d399' : '#f87171';
        const bodyTop = priceToY(Math.max(c.open, c.close));
        const bodyBottom = priceToY(Math.min(c.open, c.close));
        return (
          <g key={i}>
            <line x1={x} y1={priceToY(c.high)} x2={x} y2={priceToY(c.low)} stroke={color} strokeWidth={1} />
            <rect x={x - candleW / 2} y={bodyTop} width={candleW} height={Math.max(bodyBottom - bodyTop, 0.8)} fill={color} />
          </g>
        );
      })}

      {overlays.map((o, i) => {
        const y = priceToY(o.price);
        return (
          <g key={`ov-${i}`}>
            <line x1={PAD.left} y1={y} x2={width - PAD.right} y2={y} stroke={o.color} strokeWidth={1.3} strokeDasharray="2 2" />
            <text x={PAD.left + 4} y={y - 4} fontSize={9} fill={o.color} fontWeight="bold">{o.label} {o.price.toFixed(1)}</text>
          </g>
        );
      })}

      {annotations.map(a => {
        if (a.type === 'hline') {
          const y = priceToY(a.price);
          if (y < PAD.top - 5 || y > height - PAD.bottom + 5) return null;
          return (
            <g key={a.id}>
              <line x1={PAD.left} y1={y} x2={width - PAD.right} y2={y} stroke="#fbbf24" strokeWidth={1.5} strokeDasharray="5 3" />
              <text x={PAD.left + 4} y={y - 4} fontSize={9} fill="#fbbf24">{a.price.toFixed(1)}</text>
            </g>
          );
        }
        const x1 = indexToX(a.i1), x2 = indexToX(a.i2);
        const y1 = priceToY(a.p2), y2 = priceToY(a.p1);
        return <rect key={a.id} x={Math.min(x1, x2)} y={y1} width={Math.abs(x2 - x1)} height={Math.abs(y2 - y1)} fill="rgba(251,191,36,0.12)" stroke="#fbbf24" strokeWidth={1.2} />;
      })}

      {draft && tool === 'box' && (
        <rect x={Math.min(draft.x1, draft.x2)} y={Math.min(draft.y1, draft.y2)} width={Math.abs(draft.x2 - draft.x1)} height={Math.abs(draft.y2 - draft.y1)}
          fill="rgba(251,191,36,0.08)" stroke="#fbbf24" strokeWidth={1} strokeDasharray="3 2" />
      )}
    </svg>
  );
}
