import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const W = P.ltt;
const M = W.main, H = W.higher;

export default definePage({
  id: 'ltt-calculator',
  group: 'calculators',
  order: 30,
  slug: 'land-transaction-tax-calculator',
  nav: 'LTT calculator (Wales)',
  card: `Welsh Land Transaction Tax on main or higher rates, with the nil band to ${gbp(top(M, 0))} and the refund if you sell later.`,
  title: 'Land Transaction Tax Calculator 2026: Main and Higher Rates',
  description: `Land Transaction Tax calculator 2026 for Wales: ${gbp(t('wales', 300000))} on a ${gbp(300000)} home at main rates, ${gbp(t('wales', 300000, 'additional'))} at the higher rates for second homes and buy-to-let flats.`,
  h1: 'Land Transaction Tax calculator for Wales',
  intro: 'The two Welsh rate tables, main and higher, applied by the Welsh Revenue Authority’s rules.',
  resume: `Land Transaction Tax on a ${gbp(300000)} home in Wales is ${gbp(t('wales', 300000))} at the main rates and ${gbp(t('wales', 300000, 'additional'))} at the higher rates, which apply when a buyer will own more than one dwelling. The Welsh Revenue Authority has used the main bands since 10 October 2022: nothing up to ${gbp(top(M, 0))}, ${pct(M[1][1])} to ${gbp(top(M, 1))}, ${pct(M[2][1])} to ${gbp(top(M, 2))}, ${pct(M[3][1])} to ${gbp(top(M, 3))} and ${pct(M[4][1])} above. The higher rates are not a surcharge added to these bands but a separate table, in force since 11 December 2024, that starts at ${pct(H[0][1])} from the first pound and climbs to ${pct(H[5][1])}. Wales has no first-time buyer relief and no surcharge for buyers living abroad, so a first home and an overseas buyer’s home are taxed like any other single home. Companies pay the higher rates on any dwelling from ${gbp(W.higher_min_price)}. The return and payment are due within ${W.return_days} days of completion.`,
  faqs: [
    { q: 'Why is there no first-time buyer option in the Welsh calculator?', a: `Because Wales does not offer the relief. You can still choose “first-time buyer” and the result will equal the main-rate bill, with a note saying so. On a ${gbp(210000)} terrace in Newport a first-time buyer pays ${gbp(t('wales', 210000, 'first'))}, the same as any buyer of a single home, because the price sits inside the nil band of ${gbp(top(M, 0))}.` },
    { q: 'How do I calculate LTT higher rates on a holiday cottage in Pembrokeshire?', a: `Select “additional property”. The calculator then drops the main table and applies the higher one from the first pound, so a ${gbp(240000)} cottage costs ${gbp(t('wales', 240000, 'additional'))} instead of ${gbp(t('wales', 240000))}. The extra ${gbp(t('wales', 240000, 'additional') - t('wales', 240000))} is not refundable unless the cottage replaces a main home you sell within the time limit.` },
    { q: 'Does a house just over the Severn Bridge use this calculator or the SDLT one?', a: `It depends on which side of the border the land lies, not on the postcode town. A home in Chepstow or Monmouth is in Wales and pays LTT; one in the Forest of Dean pays SDLT. On ${gbp(350000)} the difference is ${gbp(t('wales', 350000))} against ${gbp(t('england', 350000))}, so check the title plan with your conveyancer before comparing offers.` },
  ],
  tool: 'calc',
  toolProps: { nation: 'wales', lockNation: true },
  related: ['ltt-rates', 'ltt-higher-rates', 'ltt-first-time-buyers', 'ltt-higher-rates-refund', 'stamp-duty-cardiff', 'lbtt-calculator'],
  sources: ['wraRates', 'wraHigher', 'wraGuide', 'wraCalculator', 'lttAct'],
  body: (h) => {
    const w = h.P.ltt;
    const ex = h.tax({ nation: 'wales', price: 260000, situation: 'additional' });
    const rows = [190000, 280000, 420000, 600000].map((p) => {
      const r = compute({ nation: 'wales', price: p, situation: 'additional' });
      return [h.gbp(p), h.gbp(r.mainTax), h.gbp(r.total), h.gbp(r.refundable)];
    });
    return `
<h2>Main rates or higher rates: the only real choice</h2>
<p>Welsh buyers face one question before any other: at the end of completion day, will any buyer own more than one dwelling worth ${h.gbp(w.higher_min_price)} or more? If not, the main table applies. If so, the whole price goes through the higher table, unless the purchase replaces a main residence already sold. There is no third path for first-time buyers and no extra line for non-residents.</p>
${h.bands('ltt')}
${h.bands('lttHigher')}
<p>The authority’s own example for the main table is a ${h.gbp(280000)} home, taxed ${h.gbp(h.t('wales', 280000))}. For the higher table, it uses a ${h.gbp(260000)} second home, taxed ${h.gbp(ex.total)}. Both figures come out of this calculator unchanged.</p>
<h2>When the higher rates come back</h2>
<p>Buying the new home before selling the old one puts you on the higher table for a while. If the old main residence is then sold within ${w.replace_main_residence_years} years, the difference between the two tables is refunded. The last column below is that amount, which the result panel also shows.</p>
${h.table(['Price', 'Main rates', 'Higher rates', 'Refundable if old home sold'], rows, 'LTT on a purchase before the sale of the previous home', ['l', 'r', 'r', 'r'])}
<p>The ${h.a('ltt-higher-rates-refund', 'refund guide')} covers the deadline and the evidence the authority asks for. For a check against the official tool, the ${h.src('wraCalculator', 'Welsh Revenue Authority calculator')} uses the same tables.</p>
<h2>Where the Welsh bill climbs fastest</h2>
<p>The main table has a long flat start and then a steep first step: nothing up to ${h.gbp(top(w.main, 0))}, then ${h.pct(w.main[1][1])} straight away, which is higher than the first taxed rate in England or Scotland. A buyer moving from ${h.gbp(225000)} to ${h.gbp(275000)} goes from ${h.gbp(h.t('wales', 225000))} to ${h.gbp(h.t('wales', 275000))}. Each further ${h.gbp(10000)} up to ${h.gbp(top(w.main, 1))} adds ${h.gbp(h.t('wales', 310000) - h.t('wales', 300000))}. Try the prices you might offer before you commit: the result updates as you type, and the link under the panel keeps your figures for your conveyancer, who files the return with the Welsh Revenue Authority and pays the tax from the funds you send before completion.</p>
<h2>Commercial and mixed-use property</h2>
<p>Shops, offices, farmland and buildings that combine a flat with business premises use the non-residential table, with a nil band to ${h.gbp(top(w.non_residential, 0))} and a top rate of ${h.pct(w.non_residential[3][1])}. Tick “non-residential” in the advanced options. Because a mixed-use purchase is taxed on that table, the higher residential rates do not arise on it.</p>`;
  },
});
