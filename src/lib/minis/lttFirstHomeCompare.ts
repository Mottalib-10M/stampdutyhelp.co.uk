import { compute } from '../engine/tax';
import { gbp } from './_kit';
/** A first home in Wales (no relief) against the same first home in England and Scotland, reliefs applied. */
export default () => ({
  title: 'Your first home: Wales against its neighbours',
  cta: 'Full LTT calculator',
  inputs: [{ id: 'p', label: 'Price of the first home', def: 240000, unit: '£', max: 50_000_000 }],
  run: ({ p }: Record<string, number>) => {
    const w = compute({ nation: 'wales', price: p, situation: 'first' }).total;
    const e = compute({ nation: 'england', price: p, situation: 'first' }).total;
    const s = compute({ nation: 'scotland', price: p, situation: 'first' }).total;
    const best = Math.min(w, e, s);
    const names = [['Wales', w], ['England or NI', e], ['Scotland', s]].filter(([, v]) => v === best).map(([n]) => n).join(' and ');
    return {
      head: ['LTT on a first home in Wales', gbp(w)] as [string, string],
      rows: [
        ['England or NI, with first-time buyer relief', gbp(e)],
        ['Scotland, with first-time buyer relief', gbp(s)],
        ['Lowest bill at this price', names],
      ] as [string, string][],
      note: 'Wales has no first-time buyer relief: its main rates apply, with a nil band open to every buyer.',
    };
  },
});
