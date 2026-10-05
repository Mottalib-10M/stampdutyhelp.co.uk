import { compute, RETURN_DAYS, TAX_SHORT } from '../engine/tax';
import { P } from '../engine/params';
import { gbp, nationOptions, NATIONS, SITUATIONS, situationOptions } from './_kit';
export default () => ({
  title: 'What to pay, and by when',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Purchase price', def: 325000, unit: '£', max: 50_000_000 },
    { id: 'n', label: 'Nation', def: 0, options: nationOptions },
  ],
  run: ({ p, n }: Record<string, number>) => {
    const nation = NATIONS[n] ?? 'england';
    const r = compute({ nation, price: p, situation: SITUATIONS[1] });
    const rows: [string, string][] = [
      ['Return and payment due', `within ${RETURN_DAYS[nation]} days of completion`],
      ['Filed by', 'usually your solicitor or conveyancer'],
    ];
    if (nation === 'england') rows.push(['Fixed penalty if the return is late', `${gbp(P.sdlt.penalty_fixed_first)}, then ${gbp(P.sdlt.penalty_fixed_after_3_months)}`]);
    else rows.push(['Penalties', nation === 'scotland' ? 'set by Revenue Scotland' : 'set by the Welsh Revenue Authority']);
    return {
      head: [`${TAX_SHORT[nation]} to pay with the return (${situationOptions[1].label.toLowerCase()})`, gbp(r.total)] as [string, string],
      rows,
      note: nation === 'england' ? 'HMRC also charges interest on late tax from the day after the deadline.' : 'Ask your solicitor to confirm the filing date before completion.',
    };
  },
});
