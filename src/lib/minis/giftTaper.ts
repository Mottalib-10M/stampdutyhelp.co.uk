import { giftTax } from '../engine/wealth';
import { gbp, pc, WP } from './_wkit';
export default () => ({
  title: `Tax on a gift if the giver dies within ${WP.iht.gift_years} years`,
  cta: 'Full Inheritance Tax calculator',
  inputs: [{ id: 'g', label: 'Value of the gift', def: 400000, unit: '£', max: 100_000_000 }, { id: 'y', label: 'Full years between gift and death', def: 4, max: 20, unit: 'years' }, { id: 'p', label: `Earlier gifts in the ${WP.iht.gift_years} years before it`, def: 0, unit: '£', max: 100_000_000 }],
  run: ({ g, y, p }: Record<string, number>) => {
    const r = giftTax(g, y, p);
    return {
      head: ['Inheritance Tax on the gift', gbp(r.tax)] as [string, string],
      rows: [['Rate after taper relief', pc(r.rate)], ['Part above the nil-rate band', gbp(r.taxable)], ['Nil-rate band used by this gift', gbp(r.nrbUsed)]] as [string, string][],
    };
  },
});
