import { prrShare, cgt } from '../engine/wealth';
import { gbp, pc, PA } from './_wkit';
export default () => ({
  title: 'Private Residence Relief on a former home',
  cta: 'Capital Gains Tax on property calculator',
  inputs: [{ id: 'g', label: 'Gain on the sale', def: 120000, unit: '£', max: 100_000_000 }, { id: 'o', label: 'Months owned', def: 180, unit: 'months', max: 1200 }, { id: 'l', label: 'Months lived in as main home', def: 90, unit: 'months', max: 1200 }],
  run: ({ g, o, l }: Record<string, number>) => {
    const s = prrShare({ monthsOwned: o, monthsLived: l });
    const chargeable = g - Math.round(g * s);
    return {
      head: ['Gain left to tax', gbp(chargeable)] as [string, string],
      rows: [['Share of the gain relieved', pc(s)], ['Relief', gbp(Math.round(g * s))], ['CGT for a higher-rate taxpayer', gbp(cgt({ gains: chargeable, taxableIncome: 60000 - PA }).tax)]] as [string, string][],
    };
  },
});
