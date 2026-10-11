/** Home page text (pillar, RECETTE §5). Every figure is computed from the parameters or the engine. */
import type { FAQ, Helpers } from '../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../lib/kit';
import { HPI, monthLabel, taxNation } from '../lib/hpi';
import { cgt, propertyGain, rentalTax, iht, dividendTax } from '../lib/engine/wealth';

const S = P.sdlt, L = P.lbtt, W = P.ltt;
const M = monthLabel();
const CITIES: Array<[string, string, string]> = [
  ['london', 'London', 'stamp-duty-london'], ['manchester', 'Manchester', 'stamp-duty-manchester'], ['birmingham', 'Birmingham', 'stamp-duty-birmingham'],
  ['leeds', 'Leeds', 'stamp-duty-leeds'], ['city-of-bristol', 'Bristol', 'stamp-duty-bristol'], ['liverpool', 'Liverpool', 'stamp-duty-liverpool'],
  ['sheffield', 'Sheffield', 'stamp-duty-sheffield'], ['newcastle-upon-tyne', 'Newcastle', 'stamp-duty-newcastle'], ['brighton-and-hove', 'Brighton', 'stamp-duty-brighton'],
  ['oxford', 'Oxford', 'stamp-duty-oxford'], ['belfast', 'Belfast', 'stamp-duty-belfast'], ['city-of-edinburgh', 'Edinburgh', 'stamp-duty-edinburgh'],
  ['city-of-glasgow', 'Glasgow', 'stamp-duty-glasgow'], ['city-of-aberdeen', 'Aberdeen', 'stamp-duty-aberdeen'], ['cardiff', 'Cardiff', 'stamp-duty-cardiff'], ['swansea', 'Swansea', 'stamp-duty-swansea'],
];

export const HOME = {
  title: 'Stamp Duty Calculator 2026: England, Scotland and Wales',
  description: `Stamp duty calculator for 2026: SDLT in England and NI, LBTT and ADS in Scotland, LTT in Wales. First-time buyers, second homes, non-residents, companies.`,
  h1: 'Stamp duty calculator for the whole UK',
  intro: 'Three nations, three taxes, one form: enter the price and your situation, and see the bill band by band.',
  resume: `Buying a home in the United Kingdom means paying one of three different taxes. In England and Northern Ireland it is Stamp Duty Land Tax, collected by HMRC: a ${gbp(300000)} home costs ${gbp(t('england', 300000))}, or nothing for a first-time buyer. In Scotland it is Land and Buildings Transaction Tax, collected by Revenue Scotland, with an Additional Dwelling Supplement of ${pct(L.ads_rate)} of the whole price on a second home: the same ${gbp(300000)} costs ${gbp(t('scotland', 300000))}, or ${gbp(t('scotland', 300000, 'additional'))} for a landlord. In Wales it is Land Transaction Tax, collected by the Welsh Revenue Authority, with no first-time buyer relief and its own higher rates: ${gbp(t('wales', 300000))}, or ${gbp(t('wales', 300000, 'additional'))} at the higher rates. This calculator applies all three with the rates in force for completions in 2026, including the ${pct(S.non_resident_surcharge)} non-resident surcharge and the ${pct(S.corporate_flat_rate)} company rate that only exist in England and Northern Ireland, and tells you how much of a surcharge comes back if your old home sells later.`,
  faqs: [
    { q: 'Which stamp duty applies if the house is right on the border between England and Wales?', a: `The tax follows the land, not your address or your postcode’s post town. Where a property straddles the border, the price is split on a just and reasonable basis and each part pays its own tax: SDLT for the English land, LTT for the Welsh land. The Welsh Revenue Authority publishes a postcode checker for this, and your conveyancer files two returns.` },
    { q: 'Is stamp duty paid on completion or when contracts are exchanged?', a: `On completion, which is the “effective date” in all three nations. The return and the payment are due within ${S.return_days} days of completion in England and Northern Ireland and within ${L.return_days} days in Scotland and Wales. In practice your conveyancer asks you for the money before completion and pays it the same day.` },
    { q: 'Can stamp duty be added to my mortgage?', a: 'Not directly: the tax is due within days of completion and lenders do not pay it to HMRC for you. Some buyers borrow a larger amount and use part of their savings for the tax instead of the deposit, which raises the loan-to-value and can change the interest rate offered. A mortgage adviser can tell you whether that makes sense.' },
    { q: 'Do I pay stamp duty on a property under £40,000?', a: `Not at standard rates, because every nation’s nil band is higher than that. The ${gbp(S.higher_rates_min_price)} figure matters for surcharges: the SDLT higher rates, the Scottish ADS and the Welsh higher rates do not apply to a purchase under it, and a freehold bought for less than ${gbp(S.higher_rates_min_price)} usually needs no return at all.` },
    { q: 'I already own a flat abroad. Is buying my first UK home an additional property?', a: 'Yes, in all three nations. Homes owned anywhere in the world count when deciding whether you will own more than one dwelling at the end of completion day. Unless you are replacing that flat as your main residence, you pay the SDLT higher rates, the ADS in Scotland or the Welsh higher rates, and you are not a first-time buyer.' },
    { q: 'How often do stamp duty rates change?', a: `Whenever a Budget says so, and each nation decides alone. England’s nil bands fell on 1 April 2025 when temporary thresholds ended, Scotland raised the ADS to ${pct(L.ads_rate)} on 5 December 2024 and Wales raised its higher rates on 11 December 2024. We re-read every rate after each UK, Scottish and Welsh Budget and date the check on each page.` },
  ] as FAQ[],
  body: (h: Helpers) => {
    const cmpRows: Array<Array<string | number>> = [
      ['Collected by', 'HMRC', 'Revenue Scotland', 'Welsh Revenue Authority'],
      ['Nil band, one home', h.gbp(top(S.residential, 0)), h.gbp(top(L.residential, 0)), h.gbp(top(W.main, 0))],
      ['Top rate', `${h.pct(S.residential[4][1])} above ${h.gbp(top(S.residential, 3))}`, `${h.pct(L.residential[4][1])} above ${h.gbp(top(L.residential, 3))}`, `${h.pct(W.main[4][1])} above ${h.gbp(top(W.main, 3))}`],
      ['First-time buyers', `nil to ${h.gbp(top(S.first_time_buyer, 0))}, lost above ${h.gbp(S.first_time_buyer_max_price)}`, `nil band raised to ${h.gbp(L.first_time_buyer_nil_band)}`, 'no relief'],
      ['Second home or buy-to-let', `+${h.pct(S.higher_rates_surcharge)} on every band`, `ADS: ${h.pct(L.ads_rate)} of the whole price`, `separate higher table, from ${h.pct(W.higher[0][1])}`],
      ['Non-UK resident buyer', `+${h.pct(S.non_resident_surcharge)} on every band`, 'no surcharge', 'no surcharge'],
      ['Company buying a home', `${h.pct(S.corporate_flat_rate)} of the price above ${h.gbp(S.corporate_flat_threshold)}, or higher rates`, 'ADS on every dwelling', 'higher rates'],
      ['Old home sold later: surcharge back if sold within', `${S.replace_main_residence_years} years`, `${L.replace_main_residence_months} months`, `${W.replace_main_residence_years} years`],
      ['Return and payment due', `${S.return_days} days`, `${L.return_days} days`, `${W.return_days} days`],
    ];
    const sit = (label: string, id: string, price: number, s: 'first' | 'home' | 'additional', extra = {}) =>
      `<li>${h.a(id, label)}: at ${h.gbp(price)}, ${h.gbp(h.t('england', price, s, extra))} in England, ${h.gbp(h.t('scotland', price, s, extra))} in Scotland, ${h.gbp(h.t('wales', price, s, extra))} in Wales.</li>`;
    const cityRows = CITIES.map(([k, name, id]) => {
      const r = HPI.regions[k];
      const n = taxNation(r);
      return [h.a(id, name), h.gbp(r.avg), n === 'england' ? 'SDLT' : n === 'scotland' ? 'LBTT' : 'LTT', h.gbp(h.t(n, r.avg)), r.ftb ? h.gbp(h.t(n, r.ftb, 'first')) : 'n/a'];
    });
    const p = 450000;
    return `
<h2>The three taxes side by side</h2>
<p>Most calculators online were built for England and bolt Scotland and Wales on afterwards, if at all. The rules differ more than the names suggest, and the differences are largest exactly where buyers are most exposed: second homes, first purchases, buyers who live abroad, companies.</p>
${h.table(['', 'England & NI (SDLT)', 'Scotland (LBTT)', 'Wales (LTT)'], cmpRows, 'Rules in force for completions in 2026', ['l', 'l', 'l', 'l'])}
<h2>Find your situation</h2>
<p>Each page below has its own calculator and the traps that go with the situation.</p>
<ul>
${sit('First-time buyer', 'stamp-duty-first-time-buyer', 350000, 'first')}
${sit('Moving home, one home at the end', 'stamp-duty-moving-home', 450000, 'home')}
${sit('Second home or buy-to-let', 'stamp-duty-second-home', 250000, 'additional')}
${sit('Buying before selling the old home', 'stamp-duty-surcharge-refund', 400000, 'additional')}
<li>${h.a('non-resident-stamp-duty-surcharge', 'Buyer living abroad')}: at ${h.gbp(500000)}, ${h.gbp(h.t('england', 500000, 'home', { nonResident: true }))} in England instead of ${h.gbp(h.t('england', 500000))}; Scotland and Wales charge no surcharge.</li>
<li>${h.a('stamp-duty-company-purchase', 'Limited company')}: at ${h.gbp(600000)}, ${h.gbp(h.t('england', 600000, 'home', { company: true }))} in England at the flat rate, ${h.gbp(h.t('england', 600000, 'home', { company: true, companyRelief: true }))} if the company lets the home.</li>
<li>${h.a('stamp-duty-joint-purchase', 'Buying with a partner, friend or parent')}, ${h.a('shared-ownership-stamp-duty', 'shared ownership')}, ${h.a('transfer-of-equity-stamp-duty', 'transfer of equity')} and ${h.a('inherited-property-stamp-duty', 'inherited property')} each have their own page.</li>
</ul>
<h2>Tax on the average home, city by city</h2>
<p>Averages from the UK House Price Index for ${M}, published by HM Land Registry. The first-time buyer column applies the relief of each nation to the average price first-time buyers actually paid; Northern Ireland does not publish that split.</p>
${h.table(['City', 'Average price', 'Tax', 'One home', 'Average first-time buyer'], cityRows, `Tax on average prices, ${M}`, ['l', 'r', 'l', 'r', 'r'])}
<p>The ${h.a('stamp-duty-by-area', 'table of every local authority')} does the same for all ${Object.values(HPI.regions).filter((r) => r.level === 'la').length} councils and districts.</p>
<h2>How a slice tax works</h2>
<p>None of the three taxes charges one rate on the whole price. Each rate applies only to the portion of the price inside its band, and the portions are added, so crossing a threshold never makes the whole bill jump. On a ${h.gbp(p)} home in England, the first ${h.gbp(top(S.residential, 0))} is free, the next ${h.gbp(top(S.residential, 1) - top(S.residential, 0))} pays ${h.pct(S.residential[1][1])} and the remaining ${h.gbp(p - top(S.residential, 1))} pays ${h.pct(S.residential[2][1])}, for ${h.gbp(h.t('england', p))}. The only real cliffs in the system are created by reliefs and surcharges: English first-time buyer relief disappears entirely above ${h.gbp(S.first_time_buyer_max_price)}, and the ${h.pct(S.corporate_flat_rate)} company rate applies to the whole price once it passes ${h.gbp(S.corporate_flat_threshold)}.</p>
${h.breakdown({ nation: 'england', price: p, situation: 'home' }, `SDLT on ${h.gbp(p)}, standard rates`)}
<p>The ${h.a('how-stamp-duty-is-calculated', 'step-by-step guide')} works through the same price in Scotland and Wales, where the bands fall in different places.</p>
<h2>Why the nation changes everything</h2>
<p>Scotland replaced SDLT with LBTT on 1 April 2015 and Wales replaced it with LTT on 1 April 2018. Since then each government has set its own bands, and they rarely move together. The result is that the same buyer can face very different bills a few miles apart.</p>
<p>For a family buying a modest home, Wales is often the cheapest of the three because its nil band runs to ${h.gbp(top(W.main, 0))}: on ${h.gbp(250000)}, Wales charges ${h.gbp(h.t('wales', 250000))}, Scotland ${h.gbp(h.t('scotland', 250000))} and England ${h.gbp(h.t('england', 250000))}. Higher up, Scotland becomes the most expensive: its ${h.pct(L.residential[3][1])} band starts at ${h.gbp(top(L.residential, 2))} and its ${h.pct(L.residential[4][1])} band at ${h.gbp(top(L.residential, 3))}, so a ${h.gbp(800000)} house costs ${h.gbp(h.t('scotland', 800000))} there against ${h.gbp(h.t('england', 800000))} in England and ${h.gbp(h.t('wales', 800000))} in Wales.</p>
<p>For second homes the order changes again. The Scottish supplement is a flat ${h.pct(L.ads_rate)} of the whole price, so even a cheap flat pays it from the first pound: a ${h.gbp(150000)} flat to let costs ${h.gbp(h.t('scotland', 150000, 'additional'))} in Scotland, ${h.gbp(h.t('england', 150000, 'additional'))} in England and ${h.gbp(h.t('wales', 150000, 'additional'))} in Wales. First-time buyers are best off in England below ${h.gbp(top(S.first_time_buyer, 0))}, where they pay nothing, and they gain the least in Wales, which has no relief at all. The ${h.a('stamp-duty-england-scotland-wales-compared', 'full comparison')} sets out where each nation wins.</p>
<h2>Surcharges that come back</h2>
<p>Buyers who complete on a new home before their old one has sold pay the surcharge, because at the end of completion day they own two homes. All three nations give it back if the old main home is sold in time: within ${S.replace_main_residence_years} years in England and Northern Ireland, ${L.replace_main_residence_months} months in Scotland and ${W.replace_main_residence_years} years in Wales. On a ${h.gbp(400000)} purchase, that is ${h.gbp(compute({ nation: 'england', price: 400000, situation: 'additional' }).refundable)} in England, ${h.gbp(compute({ nation: 'scotland', price: 400000, situation: 'additional' }).refundable)} in Scotland and ${h.gbp(compute({ nation: 'wales', price: 400000, situation: 'additional' }).refundable)} in Wales. The claim is not automatic and each authority has its own deadline; the ${h.a('stamp-duty-surcharge-refund', 'refund calculator')} gives yours.</p>
<h2>Rates in force for 2026</h2>
<p>England and Northern Ireland apply the bands in force since 1 April 2025, when the temporary thresholds of September 2022 ended. Scotland’s residential bands have not changed since 1 April 2021, and its supplement rose to ${h.pct(L.ads_rate)} on 5 December 2024. Wales has used its main bands since 10 October 2022 and raised its higher rates on 11 December 2024.</p>
<details class="fold"><summary>England and Northern Ireland, SDLT bands</summary>${h.bands('sdlt')}${h.bands('sdltFtb')}</details>
<details class="fold"><summary>Scotland, LBTT bands</summary>${h.bands('lbtt')}<p>First-time buyer relief raises the nil band to ${h.gbp(L.first_time_buyer_nil_band)}; the ADS adds ${h.pct(L.ads_rate)} of the whole price on additional dwellings.</p></details>
<details class="fold"><summary>Wales, LTT main and higher bands</summary>${h.bands('ltt')}${h.bands('lttHigher')}</details>
<h2>After completion: the taxes of owning, letting, selling and passing on</h2>
<p>Stamp duty is paid once. The property then meets other taxes, each with its own calculator on this site, set to the 2026 to 2027 tax year and tested on HMRC’s examples.</p>
${h.table(['Situation', 'Example', 'Tax'], [
  [h.a('rental-income-tax-calculator', 'Letting a flat'), `${h.gbp(1200)} a month, ${h.gbp(6000)} of interest, on a ${h.gbp(42000)} salary`, h.gbp(rentalTax({ rent: 14400, expenses: 2400, financeCosts: 6000, otherIncome: 42000 }).rentalTax)],
  [h.a('capital-gains-tax-on-property', 'Selling a buy-to-let'), `bought ${h.gbp(210000)}, sold ${h.gbp(325000)}, ${h.gbp(9000)} of costs, higher-rate seller`, h.gbp(cgt({ gains: propertyGain({ sale: 325000, purchase: 210000, buyingCosts: 9000 }).chargeable, taxableIncome: 60000 - h.P.wealth.income_tax.personal_allowance }).tax)],
  [h.a('private-residence-relief', 'Selling a former home you let'), `${h.gbp(120000)} gain, lived in for half of 15 years`, h.gbp(cgt({ gains: propertyGain({ sale: 420000, purchase: 300000, monthsOwned: 180, monthsLived: 90 }).chargeable, taxableIncome: 60000 - h.P.wealth.income_tax.personal_allowance }).tax)],
  [h.a('dividend-tax-calculator', 'Dividends from a property company'), `${h.gbp(10000)} on top of a ${h.gbp(30000)} salary`, h.gbp(dividendTax({ otherIncome: 30000, dividends: 10000 }).dividendTax, 2)],
  [h.a('inheritance-tax-calculator', 'Leaving the home to your children'), `${h.gbp(850000)} estate, ${h.gbp(400000)} house, single parent`, h.gbp(iht({ estate: 850000, homeToDescendants: 400000 }).tax)],
], 'Taxes after the purchase, 2026 to 2027', ['l', 'l', 'r'])}
<p>The guides behind them cover the ${h.a('capital-gains-tax-rates', 'Capital Gains Tax rates')} and ${h.a('capital-gains-tax-allowance', 'allowance')}, the ${h.a('capital-gains-tax-60-day-return', '60-day return')} after selling a home, ${h.a('section-24-mortgage-interest', 'Section 24')}, ${h.a('making-tax-digital-landlords', 'Making Tax Digital')} for landlords, the ${h.a('property-allowance-rent-a-room', 'property allowance and Rent a Room')}, ${h.a('dividend-tax', 'dividend tax')}, and for Inheritance Tax the ${h.a('inheritance-tax-threshold', 'threshold')}, the ${h.a('residence-nil-rate-band', 'residence nil-rate band')}, ${h.a('inheritance-tax-gifts', `gifts and the ${h.P.wealth.iht.gift_years}-year rule`)}, ${h.a('inheritance-tax-on-pensions', 'pensions from April 2027')} and ${h.a('inheritance-tax', 'how the tax works')}.</p>
<h2>Before you make an offer</h2>
<ol>
<li>Check which nation the land is in, and whether anyone on the title owns, part-owns or has inherited a home anywhere in the world.</li>
<li>Look at the thresholds around your price: ${h.gbp(top(S.first_time_buyer, 0))} and ${h.gbp(S.first_time_buyer_max_price)} for English first-time buyers, ${h.gbp(top(L.residential, 2))} in Scotland, ${h.gbp(top(W.main, 0))} and ${h.gbp(top(W.main, 1))} in Wales.</li>
<li>If you are buying before selling, budget for the surcharge and diarise the refund deadline the day you complete.</li>
<li>If you live abroad, count your days in the UK over the past year: ${S.non_resident_days} days or more and the English surcharge does not apply.</li>
<li>Ask your conveyancer for the figure they will put on the return, and compare it with this calculator using the share link.</li>
</ol>
<p>Every rate on this site is read on the official pages of HMRC, Revenue Scotland and the Welsh Revenue Authority, tested against their worked examples and dated. The ${h.a('method', 'method page')} lists the tests and what the calculator does not model; the ${h.a('about', 'about page')} says who builds it and why.</p>`;
  },
};
