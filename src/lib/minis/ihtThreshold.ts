import { iht } from '../engine/wealth';
import { gbp, WP } from './_wkit';
const SIT = [{ value: '0', label: 'Single, no home to children' }, { value: '1', label: 'Single, home to children' }, { value: '2', label: 'Widowed, home to children' }];
export default () => ({
  title: 'Your tax-free threshold',
  cta: 'Full Inheritance Tax calculator',
  inputs: [{ id: 'e', label: 'Estate after debts', def: 900000, unit: '£', max: 500_000_000 }, { id: 's', label: 'Situation', def: 2, options: SIT }],
  run: ({ e, s }: Record<string, number>) => {
    const t = s === 2 ? 1 : 0;
    const r = iht({ estate: e, homeToDescendants: s >= 1 ? e : 0, transferredNrb: t, transferredRnrb: t });
    return {
      head: ['Threshold available', gbp(r.nrb + r.rnrb)] as [string, string],
      rows: [['Nil-rate band', gbp(r.nrb)], ['Residence nil-rate band', gbp(r.rnrb)], ['Lost to the taper', gbp(r.taper)], ['Inheritance Tax', gbp(r.tax)]] as [string, string][],
      note: e > WP.iht.taper_threshold ? `Above ${gbp(WP.iht.taper_threshold)} the residence band shrinks by half of the excess.` : undefined,
    };
  },
});
