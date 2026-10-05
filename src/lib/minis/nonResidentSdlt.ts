import { compute } from '../engine/tax';
import { gbp, situationOptions, SITUATIONS } from './_kit';
export default () => ({
  title: 'Non-resident surcharge on your purchase',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Purchase price in England or NI', def: 600000, unit: '£', max: 50_000_000 },
    { id: 's', label: 'Your situation', def: 1, options: situationOptions },
  ],
  run: ({ p, s }: Record<string, number>) => {
    const situation = SITUATIONS[s] ?? 'home';
    const nr = compute({ nation: 'england', price: p, situation, nonResident: true });
    const uk = compute({ nation: 'england', price: p, situation });
    return {
      head: ['Non-resident surcharge', gbp(nr.nonResidentSurcharge)] as [string, string],
      rows: [
        ['SDLT as a non-UK resident', gbp(nr.total)],
        ['SDLT as a UK resident', gbp(uk.total)],
        ['Reclaimable if you reach the residence test later', gbp(nr.total - uk.total)],
      ] as [string, string][],
      note: nr.rule,
    };
  },
});
