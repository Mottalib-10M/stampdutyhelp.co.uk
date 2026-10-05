import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute, sdltPrevious } from '../../lib/kit';
import type { Band } from '../../lib/engine/params';

const S = P.sdlt;
const R = S.residential;
const EX = 450000;
const ex = compute({ nation: 'england', price: EX, situation: 'home' });

const rowsOf = (b: Band[], add = 0) => {
  let from = 0;
  return b.map(([to, r]) => {
    const label = to === null ? `Above ${gbp(from)}` : from === 0 ? `Up to ${gbp(to)}` : `${gbp(from + 1)} to ${gbp(to)}`;
    from = to ?? from;
    return [label, pct(r + add)];
  });
};

export default definePage({
  id: 'stamp-duty-rates',
  group: 'england',
  order: 10,
  slug: 'stamp-duty-rates',
  nav: 'SDLT rates and bands',
  card: `Five residential bands from ${pct(R[0][1])} to ${pct(R[4][1])}, plus the first-time buyer, higher, non-resident, company and commercial tables.`,
  title: 'Stamp Duty Rates 2026: Every SDLT Band and Surcharge',
  description: `Stamp duty rates 2026 in England and NI: ${pct(R[0][1])} to ${gbp(top(R, 0))}, then up to ${pct(R[4][1])}. A ${gbp(EX)} home pays ${gbp(ex.total)}. Every SDLT table, each surcharge and the old rates.`,
  h1: 'Stamp Duty Land Tax rates and bands',
  intro: 'One standard scale, four variations on it, and the scale it replaced on 1 April 2025.',
  resume: `Stamp Duty Land Tax in England and Northern Ireland has used the same five residential bands since 1 April 2025: nothing on the first ${gbp(top(R, 0))}, ${pct(R[1][1])} on the slice up to ${gbp(top(R, 1))}, ${pct(R[2][1])} up to ${gbp(top(R, 2))}, ${pct(R[3][1])} up to ${gbp(top(R, 3))} and ${pct(R[4][1])} on anything above. Each rate touches only its own slice, so a ${gbp(EX)} house costs ${gbp(ex.total)}, an effective rate of ${pct(ex.effectiveRate)}. Four other tables sit beside that one. First-time buyers pay nothing up to ${gbp(top(S.first_time_buyer, 0))} and ${pct(S.first_time_buyer[1][1])} up to ${gbp(S.first_time_buyer_max_price)}. Anyone who ends completion day owning two dwellings pays ${pct(S.higher_rates_surcharge)} more on every band, which takes the same house to ${gbp(t('england', EX, 'additional'))}. Non-UK residents add ${pct(S.non_resident_surcharge)} on every residential band. A company buying a home above ${gbp(S.corporate_flat_threshold)} without a relief pays ${pct(S.corporate_flat_rate)} of the whole price. Shops, offices and mixed-use buildings follow their own scale with a nil band to ${gbp(top(S.non_residential, 0))}. The Budget of 26 November 2025 changed none of these figures.`,
  faqs: [
    { q: `Once my price passes ${gbp(top(R, 1))}, is the ${pct(R[2][1])} rate charged on the whole amount?`, a: `No. Only the pounds above ${gbp(top(R, 1))} are taxed at ${pct(R[2][1])}. The first ${gbp(top(R, 0))} stays tax-free and the next slice stays at ${pct(R[1][1])}. A ${gbp(260000)} purchase therefore costs ${gbp(t('england', 260000))}, of which only ${gbp(Math.floor((260000 - top(R, 1)) * R[2][1]))} comes from the ${pct(R[2][1])} band. Crossing a band line never makes the earlier slices dearer.` },
    { q: 'Did the November 2025 Budget change the SDLT bands for 2026?', a: `No. The overview of tax legislation and rates published with the Budget of 26 November 2025 lists the residential bands, the ${pct(S.higher_rates_surcharge)} higher rates surcharge, the ${pct(S.non_resident_surcharge)} non-resident surcharge and the ${pct(S.corporate_flat_rate)} company rate unchanged. The last change to the bands themselves took effect on 1 April 2025, when the temporary thresholds introduced in September 2022 ended.` },
    { q: 'Which SDLT table applies to a flat above a shop?', a: `A single purchase of a shop with a flat above it is mixed-use, so it is taxed on the non-residential scale: nothing up to ${gbp(top(S.non_residential, 0))}, ${pct(S.non_residential[1][1])} to ${gbp(top(S.non_residential, 1))} and ${pct(S.non_residential[2][1])} above. At ${gbp(275000)} that gives ${gbp(t('england', 275000, 'home', { kind: 'nonresidential' }))}. The ${pct(S.higher_rates_surcharge)} higher rates do not apply to mixed-use property, even if you own other homes.` },
    { q: `My top band is ${pct(R[3][1])}, so why does my bill come to far less than ${pct(R[3][1])} of the price?`, a: `Because the top band only covers the last slice. On a ${gbp(1000000)} house, ${pct(R[3][1])} applies to ${gbp(1000000 - top(R, 2))}, while the ${gbp(top(R, 2))} below it is taxed at ${pct(R[0][1])}, ${pct(R[1][1])} and ${pct(R[2][1])}. The total is ${gbp(t('england', 1000000))}, an effective rate of ${pct(compute({ nation: 'england', price: 1000000, situation: 'home' }).effectiveRate)}. Quoting the top band alone overstates the cost by a wide margin.` },
    { q: 'Is SDLT charged on the rent when I take a new residential lease?', a: `Yes, where the lease is newly granted and the net present value of the rent over its term exceeds ${gbp(S.lease_npv_residential_threshold)}. The excess is taxed at ${pct(S.lease_npv_residential_rate)}, on top of any SDLT on a premium, which follows the ordinary bands. The present value discounts each future year of rent, so a long lease at a high rent is the case to check with your conveyancer before signing.` },
  ],
  mini: 'sdltBands',
  related: ['sdlt-calculator', 'how-stamp-duty-is-calculated', 'stamp-duty-changes-april-2025', 'stamp-duty-second-home', 'stamp-duty-first-time-buyer', 'non-resident-stamp-duty-surcharge'],
  sources: ['govSdltRates', 'govSdltHigher', 'govSdltCorporate', 'govSdltNonRes', 'govSdltPrevious', 'ootlar2025'],
  body: (h) => {
    const s = h.P.sdlt;
    const r = s.residential;
    const nrRows = rowsOf(r).map((row, i) => [row[0], h.pct(r[i][1]), h.pct(r[i][1] + s.non_resident_surcharge), h.pct(r[i][1] + s.non_resident_surcharge + s.higher_rates_surcharge)]);
    const prevRows = rowsOf(s.previous.residential);
    const prices = [200000, 350000, 600000, 1200000, 2000000];
    const grid = prices.map((p) => [h.gbp(p), h.gbp(h.t('england', p)), h.gbp(h.t('england', p, 'first')), h.gbp(h.t('england', p, 'additional')), h.gbp(h.t('england', p, 'home', { nonResident: true })), h.gbp(h.t('england', p, 'home', { company: true }))]);
    const hist = [250000, 400000, 700000, 1000000].map((p) => [h.gbp(p), h.gbp(sdltPrevious(p, 'home')), h.gbp(h.t('england', p)), h.gbp(h.t('england', p) - sdltPrevious(p, 'home'))]);
    return `
<h2>The standard residential scale</h2>
<p>This is the table that applies to an individual buying a single home in England or Northern Ireland, or replacing a main residence sold on or before completion day. HMRC calls it the residential rate; conveyancers often call it the standard rate. It has applied to every purchase completing on or after 1 April 2025.</p>
${h.bands('sdlt')}
<p>The five bands are slices, not brackets. A price is cut into pieces at ${h.gbp(r[0][0] as number)}, ${h.gbp(r[1][0] as number)}, ${h.gbp(r[2][0] as number)} and ${h.gbp(r[3][0] as number)}, each piece is taxed at its own rate and the results are added. Northern Ireland never devolved the tax, so a terrace in Newry and a terrace in Norwich follow the same scale. Scotland and Wales left SDLT behind in 2015 and 2018 and now publish their own tables (${h.a('lbtt-rates', 'LBTT rates')} and ${h.a('ltt-rates', 'Land Transaction Tax rates')}).</p>
<h3>A ${h.gbp(EX)} purchase, band by band</h3>
<p>Take a semi-detached house bought for ${h.gbp(EX)} by a couple selling their flat on the same day. Their price reaches the third band and stops well short of the fourth.</p>
${h.breakdown({ nation: 'england', price: EX, situation: 'home' }, `SDLT on ${h.gbp(EX)} at standard residential rates`)}
<p>The bill is ${h.gbp(ex.total)}. Almost all of it comes from the ${h.pct(r[2][1])} slice: the first two bands together contribute only ${h.gbp(Math.floor((r[1][0] as number - (r[0][0] as number)) * r[1][1]))}. That pattern holds for most prices between ${h.gbp(r[1][0] as number)} and ${h.gbp(r[2][0] as number)}, where each extra ${h.gbp(1000)} on the offer adds ${h.gbp(1000 * r[2][1])} of tax.</p>
<h2>First-time buyer scale</h2>
<p>When every buyer has never owned a home anywhere in the world and will live in the property, the standard scale is swapped for a shorter one. It has only two lines and a ceiling.</p>
${h.bands('sdltFtb')}
<p>The ceiling is absolute. At ${h.gbp(s.first_time_buyer_max_price)} the relief scale gives ${h.gbp(h.t('england', s.first_time_buyer_max_price, 'first'))}; a pound more and the whole price falls back to the standard scale. The conditions, and the traps for couples and inherited shares, are on the ${h.a('stamp-duty-first-time-buyer', 'first-time buyer relief page')}.</p>
<h2>Higher rates for additional dwellings</h2>
<p>Since 31 October 2024 the surcharge for a buyer who will own more than one dwelling at the end of completion day has been ${h.pct(s.higher_rates_surcharge)} on every band, the nil band included. The resulting scale starts at ${h.pct(r[0][1] + s.higher_rates_surcharge)} on the first pound, which is why a modest buy-to-let carries a bill even when a home at the same price would pay little.</p>
${h.bands('sdltHigher')}
<p>The surcharge does not apply to a purchase below ${h.gbp(s.higher_rates_min_price)}, to mixed-use property, or where the buyer is replacing a main residence. Who counts as owning another home, spouses included, is covered on the ${h.a('stamp-duty-second-home', 'second home page')}.</p>
<h2>Non-resident rates</h2>
<p>A further ${h.pct(s.non_resident_surcharge)} applies on every residential band when at least one buyer spent fewer than ${s.non_resident_days} days in the UK during the year before completion. It stacks on whatever scale would otherwise apply: standard, first-time buyer, higher rates or the company rate.</p>
${h.table(['Portion of the price', 'UK resident', 'Non-resident, one home', 'Non-resident, additional home'], nrRows, 'SDLT residential rates with the non-resident surcharge', ['l', 'r', 'r', 'r'])}
<p>The surcharge has its own residence test and its own refund route, both explained on the ${h.a('non-resident-stamp-duty-surcharge', 'non-resident surcharge page')}.</p>
<h2>The company rate</h2>
<p>A company buying a dwelling for more than ${h.gbp(s.corporate_flat_threshold)} pays ${h.pct(s.corporate_flat_rate)} of the entire price, not of a slice, unless a relief applies. Rental businesses, developers and traders are the usual relief cases; when a relief applies, or the price is lower, the company pays the higher rates instead. On a ${h.gbp(800000)} flat the flat rate means ${h.gbp(h.t('england', 800000, 'home', { company: true }))}, against ${h.gbp(h.t('england', 800000, 'home', { company: true, companyRelief: true }))} at higher rates with a relief (${h.a('stamp-duty-company-purchase', 'companies buying homes')}).</p>
<h2>Non-residential and mixed-use scale</h2>
<p>Commercial property and any single purchase mixing homes with other use sit on a separate three-line scale. Since 1 June 2024, buying six or more dwellings in one transaction also lands here, because multiple dwellings relief was abolished for SDLT.</p>
${h.bands('sdltNonRes')}
<p>HMRC’s own example is a ${h.gbp(275000)} purchase, which comes to ${h.gbp(h.t('england', 275000, 'home', { kind: 'nonresidential' }))}. The ${h.a('commercial-property-stamp-duty', 'commercial property calculator')} runs the same scale for any price, with the Scottish and Welsh equivalents beside it.</p>
<h2>Every scale at five prices</h2>
${h.table(['Price', 'Standard', 'First-time buyer', 'Additional home', 'Non-resident', 'Company, no relief'], grid, 'SDLT on the same price under each residential scale', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>Read across a row and the size of each surcharge appears. At the lower prices the higher rates add the most in proportion, because they turn a free nil band into a taxed one. Above ${h.gbp(s.corporate_flat_threshold)}, the company column jumps to a single rate on the full price, and the gap with every other column widens with each extra pound.</p>
<p>The first-time buyer column tells its own story. Up to ${h.gbp(s.first_time_buyer_max_price)} it sits below the standard column; from ${h.gbp(600000)} upwards the two are identical, because the relief has gone entirely rather than tapering away. A buyer choosing between a ${h.gbp(480000)} flat and a ${h.gbp(520000)} one is comparing ${h.gbp(h.t('england', 480000, 'first'))} with ${h.gbp(h.t('england', 520000, 'first'))} of tax, a gap far larger than the difference in price would suggest.</p>
<h2>Rates before 1 April 2025</h2>
<p>Between 23 September 2022 and 31 March 2025 the standard scale had four bands instead of five, with a nil band to ${h.gbp(s.previous.residential[0][0] as number)}, and first-time buyers paid nothing up to ${h.gbp(s.previous.first_time_buyer[0][0] as number)} with relief available to ${h.gbp(s.previous.first_time_buyer_max_price)}. The temporary thresholds had a fixed end date and lapsed on schedule.</p>
${h.table(['Portion of the price', 'Rate'], prevRows, 'Standard residential rates, 23 September 2022 to 31 March 2025', ['l', 'r'])}
${h.table(['Price', 'Before April 2025', 'Since April 2025', 'Extra tax'], hist, 'Standard rates compared', ['l', 'r', 'r', 'r'])}
<p>The increase is capped: once a price passes ${h.gbp(r[1][0] as number)}, every buyer pays the same extra ${h.gbp(h.t('england', 300000) - sdltPrevious(300000, 'home'))}, because the only change in the standard scale sits below that point. Two other changes came earlier, on 31 October 2024: the higher rates surcharge rose from ${h.pct(s.previous.higher_rates_surcharge_before_31_october_2024)} to ${h.pct(s.higher_rates_surcharge)} and the company rate from ${h.pct(s.previous.corporate_flat_rate_before_31_october_2024)} to ${h.pct(s.corporate_flat_rate)}. The ${h.a('stamp-duty-changes-april-2025', 'April 2025 changes page')} compares both periods for movers and first-time buyers.</p>
<h2>Where the rates come from</h2>
<p>The bands are set in section 55 of the Finance Act 2003, the higher rates in Schedule 4ZA, the first-time buyer relief in Schedule 6ZA and the non-resident surcharge in Schedule 9A. HMRC publishes the current figures on ${h.src('govSdltRates', 'its residential rates page')}, and the official ${h.src('hmrcCalculator', 'SDLT calculator')} uses the same scales. Every figure on this page is calculated from those published values, so a change to the bands updates every table at once.</p>`;
  },
});
