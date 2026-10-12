/**
 * Phone: while the result card is below the screen, a bar pinned to the bottom shows the key figure
 * (RECETTE §5, rule of 2026-10-11). Added in the browser only (first render: hidden), so the HTML holds
 * no second copy of the result; a tap scrolls to the full card. Hidden from lg up, where the result
 * sits beside the fields.
 */
import { useEffect, useRef, useState } from 'react';

export function useBelow<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [below, setBelow] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(([e]) => setBelow(!e.isIntersecting && e.boundingClientRect.top > 0));
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return { ref, below };
}

export function StickyBar({ show, label, value, target }: { show: boolean; label: string; value: string; target: { current: HTMLElement | null } }) {
  if (!show) return null;
  return (
    <button type="button" aria-hidden="true" tabIndex={-1} onClick={() => target.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
      className="fixed inset-x-0 bottom-0 z-40 flex items-baseline justify-between gap-3 border-t border-accent-200 bg-white px-4 py-3 text-left shadow-lg lg:hidden">
      <span className="text-sm font-medium text-navy-700">{label}</span>
      <span className="tabular-nums text-xl font-bold text-navy-900">{value}</span>
    </button>
  );
}
