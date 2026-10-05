import { compute } from '../engine/tax';
import { gbp, pct } from './_kit';
/** Welsh main rates on a price, and how the bill compares with England and Scotland. */
export default () => ({
  title: 'Land Transaction Tax at main rates',
  cta: 'Full LTT calculator',
  inputs: [{ id: 'p', label: 'Purchase price', def: 280000, unit: '£', max: 50_000_000 }],
  run: ({ p }: Record<string, number>) => {
    const w = compute({ nation: 'wales', price: p, situation: 'home' });
    const e = compute({ nation: 'england', price: p, situation: 'home' }).total;
    const s = compute({ nation: 'scotland', price: p, situation: 'home' }).total;
    const last = [...w.bands].reverse().find((b) => b.taxable > 0);
    const diff = (x: number) => (w.total === x ? 'the same' : w.total < x ? `${gbp(x - w.total)} more there` : `${gbp(w.total - x)} less there`);
    return {
      head: ['LTT, main residential rates', gbp(w.total)] as [string, string],
      rows: [
        ['Rate on your last pound', last ? pct(last.rate) : pct(0)],
        ['England or NI, same price', `${gbp(e)} (${diff(e)})`],
        ['Scotland, same price', `${gbp(s)} (${diff(s)})`],
      ] as [string, string][],
      note: 'Main rates: a buyer who will own no other dwelling at the end of the day, first-time buyers included.',
    };
  },
});
