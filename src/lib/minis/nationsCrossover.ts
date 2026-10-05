import { compute, TAX_SHORT, NATION_LABEL } from '../engine/tax';
import { gbp, NATIONS, situationOptions, SITUATIONS } from './_kit';
/** The same purchase in the three nations: which tax is lowest, and by how much. */
export default () => ({
  title: 'Which nation taxes your purchase least?',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Purchase price', def: 320000, unit: '£', max: 50_000_000 },
    { id: 's', label: 'Buyer', def: 1, options: situationOptions },
  ],
  run: ({ p, s }: Record<string, number>) => {
    const situation = SITUATIONS[s] ?? 'home';
    const r = NATIONS.map((n) => ({ n, total: compute({ nation: n, price: p, situation }).total }));
    const min = Math.min(...r.map((x) => x.total)), max = Math.max(...r.map((x) => x.total));
    const best = r.filter((x) => x.total === min).map((x) => NATION_LABEL[x.n]).join(' / ');
    return {
      head: [`Lowest: ${best}`, gbp(min)] as [string, string],
      rows: r.map((x) => [`${TAX_SHORT[x.n]}, ${NATION_LABEL[x.n]}`, gbp(x.total)]) as [string, string][],
      note: `Gap between the dearest and the cheapest nation: ${gbp(max - min)}.`,
    };
  },
});
