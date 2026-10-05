import { compute, sdltPrevious } from '../engine/tax';
import { P } from '../engine/params';
import { gbp, situationOptions, SITUATIONS } from './_kit';
export default () => ({
  title: 'Your SDLT before and after 1 April 2025',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Purchase price', def: 400000, unit: '£', max: 50_000_000 },
    { id: 's', label: 'Your situation', def: 1, options: situationOptions },
  ],
  run: ({ p, s }: Record<string, number>) => {
    const situation = SITUATIONS[s] ?? 'home';
    const now = compute({ nation: 'england', price: p, situation }).total;
    const before = sdltPrevious(p, situation);
    const rows: [string, string][] = [
      ['SDLT since 1 April 2025', gbp(now)],
      ['SDLT from 31 October 2024 to 31 March 2025', gbp(before)],
    ];
    if (situation === 'additional') rows.push(['Before 31 October 2024', gbp(sdltPrevious(p, situation, P.sdlt.previous.higher_rates_surcharge_before_31_october_2024))]);
    return {
      head: ['Extra tax since the change', gbp(now - before)] as [string, string],
      rows,
      note: 'England and Northern Ireland; Scotland and Wales did not change their main rates on 1 April 2025.',
    };
  },
});
