import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top } from '../../lib/kit';

const L = P.lbtt;
const R = L.residential;
/** First price (in £1,000 steps) where LBTT overtakes SDLT for a buyer of one home. */
const CROSS = (() => { for (let p = top(R, 0); p < 2_000_000; p += 1000) if (t('scotland', p) > t('england', p)) return p; return 0; })();

export default definePage({
  id: 'lbtt-rates',
  group: 'scotland',
  order: 10,
  slug: 'lbtt-rates',
  nav: 'LBTT rates and bands',
  card: `Five residential bands, from nothing up to ${gbp(top(R, 0))} to ${pct(R[4][1])} above ${gbp(top(R, 3))}, unchanged since April 2021.`,
  title: `LBTT Rates 2026: Scottish Bands and Worked Examples`,
  description: `LBTT rates 2026: nothing up to ${gbp(top(R, 0))}, then ${pct(R[1][1])} to ${pct(R[4][1])}. A ${gbp(235000)} home pays ${gbp(t('scotland', 235000))}, with Revenue Scotland's examples, England compared and commercial bands.`,
  h1: 'LBTT rates and bands in Scotland',
  intro: `The residential table Revenue Scotland has applied since 1 April 2021, read slice by slice.`,
  resume: `Land and Buildings Transaction Tax on a home in Scotland is charged in five slices, unchanged since 1 April 2021: nothing on the first ${gbp(top(R, 0))}, ${pct(R[1][1])} on the part up to ${gbp(top(R, 1))}, ${pct(R[2][1])} up to ${gbp(top(R, 2))}, ${pct(R[3][1])} up to ${gbp(top(R, 3))} and ${pct(R[4][1])} on anything above. Each rate applies only to the portion of the price inside its band, so Revenue Scotland’s own examples work out at ${gbp(t('scotland', 235000))} on a ${gbp(235000)} home and ${gbp(t('scotland', 875000))} on ${gbp(875000)}. Compared with England and Northern Ireland, a Scottish buyer of a single home pays less up to about ${gbp(CROSS - 1000)} and more from ${gbp(CROSS)}, because the ${pct(R[3][1])} band starts so early. Second homes add the ${pct(L.ads_rate)} Additional Dwelling Supplement on the whole price, first-time buyers get a wider nil band, and commercial property follows a separate table. The return and the tax are due within ${L.return_days} days.`,
  faqs: [
    { q: 'Have LBTT residential bands changed in the Scottish Budget for 2026-27?', a: `The residential bands applied to purchases in 2026 are the ones introduced on 1 April 2021, with the nil band at ${gbp(top(R, 0))} and the top rate of ${pct(R[4][1])} above ${gbp(top(R, 3))}. What moved recently is the supplement on additional homes, raised to ${pct(L.ads_rate)} on 5 December 2024. We re-read Revenue Scotland’s rate page after every Scottish Budget and date the check.` },
    { q: 'Is LBTT worked out on the whole price at one rate?', a: `No, and this is the most common misreading of the table. A ${gbp(400000)} house does not pay ${pct(R[3][1])} of ${gbp(400000)}. It pays nothing on the first ${gbp(top(R, 0))}, then each slice at its own rate, for a total of ${gbp(t('scotland', 400000))}, about ${pct(Math.round(t('scotland', 400000) / 400000 * 1000) / 1000)} of the price. Only the Additional Dwelling Supplement is charged on the whole price.` },
    { q: 'Which LBTT band does a flat at £325,000 exactly fall into?', a: `The ${pct(R[2][1])} band, which runs up to and including ${gbp(top(R, 2))}. The bill is ${gbp(t('scotland', 325000))}. One pound more and the extra pound is taxed at ${pct(R[3][1])}, which adds only pennies: there is no cliff in the Scottish bands, each slice keeps its own rate whatever the price above it.` },
    { q: 'Do buyers from outside the UK pay higher LBTT rates?', a: `No. Scotland has no surcharge for non-resident buyers, unlike England and Northern Ireland. A buyer living in Hong Kong or Dubai pays the same bands as a buyer from Perth. If they already own a home anywhere in the world, though, the ${pct(L.ads_rate)} supplement applies, because dwellings abroad count when deciding whether a purchase is an additional one.` },
    { q: 'How long do I have to pay LBTT after the date of entry?', a: `The return and the payment are both due within ${L.return_days} days of the effective date, normally the date of entry. Your solicitor submits the return online through Revenue Scotland’s system and pays the tax from funds you provide, usually collected before settlement. Late payment brings penalties and interest, so check the timetable with your solicitor before settlement day.` },
  ],
  mini: 'lbttBands',
  miniHref: 'lbtt-calculator',
  related: ['lbtt-calculator', 'lbtt-first-time-buyer-relief', 'additional-dwelling-supplement', 'stamp-duty-edinburgh', 'stamp-duty-england-scotland-wales-compared', 'ltt-rates'],
  sources: ['rsResidential', 'rsNonResidential', 'rsCalculator', 'lbttAct'],
  body: (h) => {
    const l = h.P.lbtt, r = l.residential;
    const cmp = [150000, 200000, 250000, 300000, 340000, 400000, 500000, 750000, 1000000].map((p) => {
      const s = h.t('scotland', p), e = h.t('england', p);
      return [h.gbp(p), h.gbp(s), h.gbp(e), h.gbp(h.t('wales', p)), s < e ? `${h.gbp(e - s)} cheaper` : s > e ? `${h.gbp(s - e)} dearer` : 'same'];
    });
    const ed = h.place('city-of-edinburgh'), gl = h.place('city-of-glasgow');
    return `
<h2>The five bands since 1 April 2021</h2>
${h.bands('lbtt')}
<p>Scotland introduced LBTT on 1 April 2015, when it stopped using Stamp Duty Land Tax. The current residential table dates from 1 April 2021. The thresholds have not moved since, which makes Scotland the nation with the longest-standing bands in the United Kingdom: England changed its table on 1 April 2025 and Wales on 10 October 2022.</p>
<p>Reading the table means reading slices. The first ${h.gbp(top(r, 0))} of every price is untaxed. The next ${h.gbp(top(r, 1) - top(r, 0))} is taxed at ${h.pct(r[1][1])}, which can never cost more than ${h.gbp(h.t('scotland', top(r, 1)))}. The ${h.pct(r[2][1])} slice is short, only ${h.gbp(top(r, 2) - top(r, 1))} wide, and the ${h.pct(r[3][1])} slice that follows is long, stretching ${h.gbp(top(r, 3) - top(r, 2))}. That long ${h.pct(r[3][1])} band is what shapes Scottish bills for family houses.</p>
<h2>Revenue Scotland’s worked examples, line by line</h2>
<p>The authority illustrates its table with two prices. The first is a modest home at ${h.gbp(235000)}:</p>
${h.breakdown({ nation: 'scotland', price: 235000, situation: 'home' }, `LBTT on ${h.gbp(235000)}, standard residential bands`)}
<p>Only two slices are touched, and the bill of ${h.gbp(h.t('scotland', 235000))} is under one per cent of the price. The second example sits near the top of the market at ${h.gbp(875000)}:</p>
${h.breakdown({ nation: 'scotland', price: 875000, situation: 'home' }, `LBTT on ${h.gbp(875000)}, standard residential bands`)}
<p>Here every band is used, and the ${h.pct(r[3][1])} slice alone produces most of the ${h.gbp(h.t('scotland', 875000))}. The share of the price taken in tax rises from about ${h.pct(Math.round(h.t('scotland', 235000) / 235000 * 1000) / 1000)} to about ${h.pct(Math.round(h.t('scotland', 875000) / 875000 * 1000) / 1000)}, although no rate in the table changed in between. Both figures are reproduced exactly by our ${h.a('lbtt-calculator', 'LBTT calculator')}, which is how we test it against the authority’s guidance.</p>
<h2>Where Scotland is cheaper than England, and where it is dearer</h2>
<p>The two tables cross. Scotland starts later, with its nil band above England’s, and its first taxed rate is the same ${h.pct(r[1][1])}. But England then charges ${h.pct(h.P.sdlt.residential[2][1])} all the way to ${h.gbp(top(h.P.sdlt.residential, 2))}, while Scotland jumps to ${h.pct(r[3][1])} at ${h.gbp(top(r, 2))}. The result is a turning point a little above ${h.gbp(top(r, 2))}: by our calculation, from ${h.gbp(CROSS)} a buyer of a single home pays more in Scotland than in England, and the gap widens with every pound above it.</p>
${h.table(['Price', 'LBTT, Scotland', 'SDLT, England & NI', 'LTT, Wales', 'Scotland against England'], cmp, 'Tax on the same single home in the three nations, 2026 bands', ['l', 'r', 'r', 'r', 'l'])}
<p>Below that turning point the Scottish table is the gentler one. The average home sold in the ${h.a('stamp-duty-edinburgh', 'City of Edinburgh')} cost ${h.gbp(ed.avg)} in the latest UK House Price Index, which means ${h.gbp(h.t('scotland', ed.avg))} of LBTT, against ${h.gbp(h.t('england', ed.avg))} if the same price were paid in England. In Glasgow the average of ${h.gbp(gl.avg)} costs ${h.gbp(h.t('scotland', gl.avg))}. For a detached house in the New Town or a farmhouse in Perthshire above ${h.gbp(top(r, 3))}, the comparison runs the other way, and quickly.</p>
<h2>What another ${h.gbp(10000)} on the offer costs in tax</h2>
<p>Because every slice keeps its own rate, the useful question when bidding is not “what is my rate?” but “what does the next ${h.gbp(10000)} cost?”. Where a home is marketed at offers over a stated figure and the closing date approaches, that is the choice a buyer actually faces. The answer depends only on which band the extra money lands in:</p>
<ul>
<li>from ${h.gbp(140000)} to ${h.gbp(150000)}: ${h.gbp(h.t('scotland', 150000) - h.t('scotland', 140000))} more, because half of the extra stays in the nil band;</li>
<li>from ${h.gbp(220000)} to ${h.gbp(230000)}: ${h.gbp(h.t('scotland', 230000) - h.t('scotland', 220000))} more, all at ${h.pct(r[1][1])};</li>
<li>from ${h.gbp(300000)} to ${h.gbp(310000)}: ${h.gbp(h.t('scotland', 310000) - h.t('scotland', 300000))} more, at ${h.pct(r[2][1])};</li>
<li>from ${h.gbp(420000)} to ${h.gbp(430000)}: ${h.gbp(h.t('scotland', 430000) - h.t('scotland', 420000))} more, at ${h.pct(r[3][1])};</li>
<li>from ${h.gbp(800000)} to ${h.gbp(810000)}: ${h.gbp(h.t('scotland', 810000) - h.t('scotland', 800000))} more, at ${h.pct(r[4][1])}.</li>
</ul>
<p>The figures make one thing plain: the tax never jumps by more than the rate of the band you are in. A bid of a few thousand pounds over a band limit costs a few hundred pounds of extra LBTT at most, and there is no price at which offering more saves tax. That makes the Scottish table easier to plan around than the English first-time buyer rules, where crossing one threshold removes a relief altogether.</p>
<h2>The supplement and the relief sit on top of the bands</h2>
<p>Two adjustments change the table for particular buyers. A first-time buyer has the nil band widened to ${h.gbp(l.first_time_buyer_nil_band)}, which saves at most ${h.gbp(l.first_time_buyer_max_saving)}; the ${h.a('lbtt-first-time-buyer-relief', 'first-time buyer relief guide')} sets out who qualifies. A buyer who ends up owning two dwellings pays the bands as normal and then the ${h.a('additional-dwelling-supplement', 'Additional Dwelling Supplement')} of ${h.pct(l.ads_rate)} on the whole price, so a ${h.gbp(250000)} buy-to-let costs ${h.gbp(h.t('scotland', 250000, 'additional'))} instead of ${h.gbp(h.t('scotland', 250000))}. Neither changes the bands themselves. The supplement in particular follows its own logic: it has no slices, starts from the first pound once the price reaches ${h.gbp(l.ads_min_price)}, and can be repaid if it was only due because a previous main home had not yet sold. On a family house at ${h.gbp(450000)}, that refundable amount would be ${h.gbp(h.tax({ nation: 'scotland', price: 450000, situation: 'additional' }).refundable)}, more than the ${h.gbp(h.t('scotland', 450000))} of LBTT on the same house.</p>
<h2>Commercial and mixed-use purchases</h2>
<p>Shops, offices, farmland and properties that combine a home with business premises use a shorter table. The first taxed slice is lighter than the residential one, at ${h.pct(l.non_residential[1][1])}, but the top rate of ${h.pct(l.non_residential[2][1])} begins at ${h.gbp(top(l.non_residential, 1))}.</p>
${h.bands('lbttNonRes')}
<p>A ${h.gbp(400000)} shop with a flat above costs ${h.gbp(h.t('scotland', 400000, 'home', { kind: 'nonresidential' }))} on this table. Non-residential leases have their own rules on rent, which are outside the scope of this site; the ${h.src('rsNonResidential', 'Revenue Scotland page on non-residential property')} sets them out.</p>
<h2>Paying within ${l.return_days} days</h2>
<p>The LBTT return and the tax are due together within ${l.return_days} days of the effective date, more than twice the ${h.P.sdlt.return_days} days allowed for SDLT in England. In practice the solicitor acting for you submits the return online and settles the tax from your funds on or before the date of entry, so the deadline mostly matters when something about the purchase changes afterwards: a price adjustment, a missed relief, or a supplement that becomes repayable. Those corrections go through an amended return, and the ${h.a('ads-repayment', 'ADS repayment guide')} explains the time limits that apply to them.</p>`;
  },
});
