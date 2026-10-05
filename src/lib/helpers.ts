/** Writing tools (`Helpers`) passed to the body of every page. */
import { route, ROUTES } from '../i18n/routes';
import { P, SOURCES, type SourceKey, type Band } from './engine/params';
import { compute, type Input } from './engine/tax';
import type { Helpers } from './page-types';
import { formatMoney, formatNumber, displayDate } from './format';
import { place } from './hpi';

const esc = (s: string | number) => String(s).replace(/&(?!(?:[a-z]+|#\d+);)/g, '&amp;').replace(/</g, '&lt;');
import { gbp, pct } from './fmt';
export { gbp, pct };

export function table(headers: string[], rows: Array<Array<string | number>>, caption?: string, align: Array<'l' | 'r'> = []) {
  const al = (i: number) => (align[i] === 'r' ? 'text-right' : 'text-left');
  return `<div class="not-prose my-6 overflow-x-auto"><table class="w-full text-sm">${caption ? `<caption class="mb-2 text-left text-sm text-navy-600">${caption}</caption>` : ''}<thead><tr>${headers.map((h, i) => `<th scope="col" class="border-b border-navy-300 bg-navy-50 px-3 py-2 font-semibold text-navy-900 ${al(i)}">${h}</th>`).join('')}</tr></thead><tbody>${rows.map((r, ri) => `<tr class="${ri % 2 ? 'bg-navy-50/40' : ''}">${r.map((c, i) => `<td class="tabular-nums border-b border-navy-100 px-3 py-2 text-navy-800 ${al(i)}">${typeof c === 'number' ? esc(formatNumber(c, 0)) : c}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
}

function bandRows(bands: Band[], add = 0) {
  let from = 0;
  return bands.map(([to, r]) => {
    const row = [to === null ? `Above ${gbp(from)}` : from === 0 ? `Up to ${gbp(to)}` : `${gbp(from + 1)} to ${gbp(to)}`, pct(r + add)];
    from = to ?? from;
    return row;
  });
}

export function bands(which: Parameters<Helpers['bands']>[0], caption?: string) {
  const s = P.sdlt, l = P.lbtt, w = P.ltt;
  const def: Record<string, [Band[], number, string]> = {
    sdlt: [s.residential, 0, 'Stamp Duty Land Tax, residential rates from 1 April 2025'],
    sdltFtb: [s.first_time_buyer, 0, `First-time buyer rates (price of ${gbp(s.first_time_buyer_max_price)} or less)`],
    sdltHigher: [s.residential, s.higher_rates_surcharge, 'Higher rates for additional dwellings'],
    sdltNonRes: [s.non_residential, 0, 'SDLT non-residential and mixed-use rates'],
    lbtt: [l.residential, 0, 'LBTT residential rates and bands'],
    lbttFtb: [[[l.first_time_buyer_nil_band, 0], ...l.residential.slice(1)] as Band[], 0, 'LBTT with first-time buyer relief'],
    lbttNonRes: [l.non_residential, 0, 'LBTT non-residential rates'],
    ltt: [w.main, 0, 'Land Transaction Tax, main residential rates'],
    lttHigher: [w.higher, 0, 'Land Transaction Tax, higher residential rates'],
    lttNonRes: [w.non_residential, 0, 'Land Transaction Tax, non-residential rates'],
  };
  const [b, add, cap] = def[which];
  return table(['Portion of the price', 'Rate'], bandRows(b, add), caption ?? cap, ['l', 'r']);
}

export function breakdown(i: Input, caption?: string) {
  const r = compute(i);
  const rows = r.bands.filter((b) => b.taxable > 0 || b.from === 0).map((b) => [
    b.to === null && b.from === 0 && r.bands.length > 1 ? 'Whole price (supplement)' : b.to === null ? `Above ${gbp(b.from)}` : `${gbp(b.from === 0 ? 0 : b.from + 1)} to ${gbp(b.to)}`,
    gbp(b.taxable), pct(b.rate), gbp(b.tax, Number.isInteger(b.tax) ? 0 : 2)]);
  rows.push(['<strong>Total</strong>', gbp(i.price), pct(r.effectiveRate), `<strong>${gbp(r.total)}</strong>`]);
  return table(['Band', 'Amount in band', 'Rate', 'Tax'], rows, caption, ['l', 'r', 'r', 'r']);
}

export function helpers(): Helpers {
  return {
    P,
    a: (id, text) => {
      // An unknown id fails tests/pages.test.ts; the build keeps the text so that pages can be written in any order.
      if (!ROUTES.some((r) => r.id === id)) { if (process.env.VITEST) throw new Error(`Unknown page id in link: ${id}`); return text; }
      return `<a href="${route(id, 'en')}">${text}</a>`;
    },
    gbp, num: (n, d = 0) => formatNumber(n, d), pct,
    date: (iso) => displayDate(iso, 'en-GB'),
    src: (key: SourceKey, text?: string) => { const s = SOURCES[key]; if (!s) throw new Error(`Unknown source ${key}`); return `<a href="${s.url}" target="_blank" rel="nofollow noopener noreferrer">${text ?? s.label}</a>`; },
    table, bands, breakdown,
    tax: compute,
    t: (nation, price, situation = 'home', extra = {}) => compute({ nation, price, situation, ...extra }).total,
    place,
  };
}
