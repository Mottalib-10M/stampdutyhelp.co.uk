import { iht } from '../engine/wealth';
import { gbp, pc, WP } from './_wkit';
export default () => ({
  title: 'Inheritance Tax on an estate',
  cta: 'Full Inheritance Tax calculator',
  inputs: [{ id: 'e', label: 'Estate after debts', def: 600000, unit: '£', max: 500_000_000 }, { id: 'h', label: 'Home left to children', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] }],
  run: ({ e, h }: Record<string, number>) => {
    const r = iht({ estate: e, homeToDescendants: h === 1 ? WP.iht.residence_nil_rate_band : 0 });
    return {
      head: ['Inheritance Tax', gbp(r.tax)] as [string, string],
      rows: [['Tax-free bands used', gbp(r.nrb + r.rnrb)], ['Taxed at ' + pc(WP.iht.rate), gbp(r.chargeable)], ['Share of the estate', pc(r.effectiveRate)]] as [string, string][],
    };
  },
});
