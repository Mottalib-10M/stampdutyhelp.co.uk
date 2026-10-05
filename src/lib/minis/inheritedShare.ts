import { compute } from '../engine/tax';
import { P } from '../engine/params';
import { gbp, pct } from './_kit';
/** Inherited share and the surcharge: the 50% / three-year rule of SDLT and LTT against Scotland's ADS. */
export default () => ({
  title: 'Does your inherited share trigger the surcharge?',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Price of the home you are buying', def: 320000, unit: '£', max: 50_000_000 },
    { id: 's', label: `Share inherited in the last ${P.sdlt.inherited_years} years`, def: 50, unit: '%', max: 100 },
  ],
  run: ({ p, s }: Record<string, number>) => {
    const ignored = s / 100 <= P.sdlt.inherited_share_max;
    const sit = ignored ? 'home' : 'additional';
    const eng = compute({ nation: 'england', price: p, situation: sit });
    const wal = compute({ nation: 'wales', price: p, situation: sit });
    const sco = compute({ nation: 'scotland', price: p, situation: 'additional' });
    return {
      head: ['SDLT on your purchase, England or NI', gbp(eng.total)] as [string, string],
      rows: [
        ['Inherited share ignored (SDLT and LTT)?', ignored ? `Yes, ${pct(P.sdlt.inherited_share_max)} or less` : `No, above ${pct(P.sdlt.inherited_share_max)}`],
        ['LTT in Wales', gbp(wal.total)],
        ['LBTT + ADS in Scotland if the share counts', gbp(sco.total)],
      ] as [string, string][],
      note: `Assumes the share is your only other dwelling. In Scotland the share does not count if it is worth less than ${gbp(P.lbtt.ads_min_price)}; then LBTT alone is ${gbp(compute({ nation: 'scotland', price: p, situation: 'home' }).total)}.`,
    };
  },
});
