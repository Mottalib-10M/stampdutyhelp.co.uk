import { iht } from '../engine/wealth';
import { gbp } from './_wkit';
export default () => ({
  title: 'Residence nil-rate band after the taper',
  cta: 'Full Inheritance Tax calculator',
  inputs: [{ id: 'e', label: 'Estate before exemptions', def: 2150000, unit: '£', max: 500_000_000 }, { id: 'h', label: 'Home left to direct descendants', def: 700000, unit: '£', max: 100_000_000 }, { id: 'w', label: 'Late spouse’s band unused?', def: 0, options: [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }] }],
  run: ({ e, h, w }: Record<string, number>) => {
    const r = iht({ estate: e, homeToDescendants: h, transferredRnrb: w, transferredNrb: w });
    return {
      head: ['Residence band applied', gbp(r.rnrb)] as [string, string],
      rows: [['Maximum before taper', gbp(r.rnrbMax)], ['Taper deduction', gbp(r.taper)], ['Inheritance Tax on the estate', gbp(r.tax)]] as [string, string][],
    };
  },
});
