import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { cgt, propertyGain, prrShare } from '../../lib/engine/wealth';

const C = P.wealth.cgt;
const R = P.wealth.prr;
const PA = P.wealth.income_tax.personal_allowance;
const gov = propertyGain({ sale: 420000, purchase: 300000, monthsOwned: 180, monthsLived: 90 });
const govTax = cgt({ gains: gov.chargeable, taxableIncome: 60000 - PA });
const bristol = propertyGain({ sale: 390000, purchase: 240000, sellingCosts: 6000, monthsOwned: 96, monthsLived: 60 });
const bristolTax = cgt({ gains: bristol.chargeable, taxableIncome: 45000 - PA });
const lodgerGain = 75000, lodgerShare = 0.1;

export default definePage({
  id: 'private-residence-relief',
  group: 'gains',
  order: 50,
  slug: 'private-residence-relief',
  nav: 'Private Residence Relief',
  card: `Why selling your own home is usually tax-free, the final ${R.final_period_months} months that always count, and what letting it out does to the gain.`,
  title: 'Private Residence Relief 2026: Selling a Home You Once Let',
  description: `Private Residence Relief in 2026: no CGT on your main home, last ${R.final_period_months} months always relieved. A £120,000 gain, 7.5 of 15 years lived in, leaves ${gbp(gov.chargeable)} taxable.`,
  h1: 'Private Residence Relief when you sell a home',
  intro: 'The relief that keeps most home sales out of Capital Gains Tax, and how it shrinks once the house has been let or left empty.',
  resume: `Private Residence Relief removes Capital Gains Tax from the sale of your home when it has been your only or main residence for the whole time you owned it, you have not let it out beyond a lodger, no part has been used exclusively for business, the grounds are under ${R.grounds_square_metres.toLocaleString('en-GB')} square metres and you did not buy it just to make a gain. When those conditions are not met for the whole period, the relief becomes a fraction: the months you lived there, plus the final ${R.final_period_months} months of ownership, over the months you owned it. GOV.UK’s example is a £120,000 gain on a house owned for 15 years and lived in for 7.5: relief covers ${pct(gov.prrShare)} of the gain, leaving ${gbp(gov.chargeable)} to tax, which costs ${gbp(govTax.tax)} for a higher-rate taxpayer after the ${gbp(C.annual_exempt_amount)} allowance. Letting Relief, worth up to ${gbp(R.letting_relief_max)}, now applies only if you shared the home with your tenant.`,
  faqs: [
    { q: 'I moved in with my partner and let my old flat. How long before I owe CGT on it?', a: `From the day it stops being your main home, part of any future gain becomes taxable, but the final ${R.final_period_months} months of ownership are always relieved, provided the flat was your main residence at some point. Sell within ${R.final_period_months} months of moving out and the whole gain is normally covered. After that, each month of letting adds a slice of taxable gain.` },
    { q: 'Does taking in a lodger reduce my Private Residence Relief?', a: 'No. A lodger who shares your living space, eating with you or using the same kitchen, is not treated as letting out part of your home, and neither are your children or parents paying you rent or housekeeping. The relief is only cut when part of the property becomes a separate let, such as a self-contained flat or the whole house while you live elsewhere.' },
    { q: 'We own a flat in town and a cottage in the country. Which one is tax-free?', a: `Only one home per married couple or civil partnership qualifies at a time. You can choose by writing to HMRC within ${R.nomination_years} years of the combination of homes changing, signed by every owner; otherwise the question is decided on the facts of where you really live. The final ${R.final_period_months} months of the nominated or actual main home are always relieved.` },
    { q: 'I was posted abroad by my employer for four years. Do I lose relief for that time?', a: `Not if you lived in the home before and after the posting, unless your work prevented the return. Any period of employment outside the UK counts as occupation. Absences for any reason can add up to ${R.absence_any_reason_years} years, and absences to work elsewhere in the UK up to ${R.absence_uk_work_years} years, under the same condition of living there before and afterwards.` },
    { q: 'Is the whole garden covered when I sell a house with land?', a: `The relief covers the house and grounds of up to ${R.grounds_square_metres.toLocaleString('en-GB')} square metres in total, just over an acre, including outbuildings. Above that size, full relief is no longer automatic and part of the gain may be taxable. HMRC’s helpsheet HS283 sets out how the permitted area is judged, and a large garden is worth a professional opinion before you agree a sale.` },
  ],
  mini: 'prrShare',
  miniHref: 'capital-gains-tax-on-property',
  related: ['capital-gains-tax-on-property', 'capital-gains-tax-calculator', 'stamp-duty-moving-home', 'capital-gains-tax-60-day-return', 'property-allowance-rent-a-room'],
  sources: ['govTaxSellHome', 'hs283', 'govCgt'],
  body: (h) => {
    const rows = [[90, 180], [120, 180], [60, 96], [24, 120], [180, 186]].map(([lived, owned]) => {
      const s = prrShare({ monthsOwned: owned, monthsLived: lived });
      return [`${lived} of ${owned}`, h.pct(Math.round(s * 1000) / 1000), h.gbp(Math.round(100000 * (1 - s)))];
    });
    return `
<h2>The five conditions for full relief</h2>
<p>HMRC gives the relief automatically, with nothing to claim and nothing to report, when every condition holds for the whole time you owned the property. It must have been your only home, or your main home, throughout. You must not have let any part of it to a tenant, a lodger excepted. No room may have been used exclusively for business, although an occasional home office does not count. The grounds, buildings included, must stay under ${h.num(R.grounds_square_metres)} square metres. And you must not have bought it just to make a gain.</p>
<p>If one condition fails for part of the time, the relief is not lost; it is apportioned. That is the situation of most accidental landlords: people who lived in a flat, moved for work or a relationship, and let it out rather than sell.</p>
<h2>The time-based fraction</h2>
<p>The relieved share is the number of months the property counted as your main residence divided by the number of months you owned it. Some months count even when you were not there. The final ${R.final_period_months} months before the sale always qualify, provided the home was your main residence at some point, and this applies whatever other homes you have. The final period is ${R.final_period_months_disabled_or_care} months for owners who are disabled or in long-term residential care and own only one home. Up to the first ${R.first_years_build_or_sell} years also count if the house was being built or renovated, or you could not sell your old home, and you moved in within that time.</p>
${h.table(['Months lived in / owned', 'Share relieved', `Taxable part of a ${h.gbp(100000)} gain`], rows, `Fraction with the final ${R.final_period_months} months added, owner living there first`, ['l', 'r', 'r'])}
<h2>The GOV.UK example worked through</h2>
<p>HMRC’s guidance describes a seller with a ${h.gbp(120000)} gain on a home owned for 15 years, lived in for the first 7.5 and let for the remaining 7.5. Relief covers the 7.5 years of occupation plus the last ${R.final_period_months} months: 8.25 years out of 15, or ${h.pct(gov.prrShare)}. So ${h.gbp(gov.prr)} of the gain is exempt and ${h.gbp(gov.chargeable)} is chargeable. For someone earning £60,000, whose basic rate band is full, that is ${h.gbp(govTax.taxable)} after the allowance at ${h.pct(C.rate_higher)}, or ${h.gbp(govTax.tax)}. Our engine reproduces those numbers in its tests.</p>
<h2>A former home in Bristol, let for three years</h2>
<p>A software tester bought a terraced house in Bristol for ${h.gbp(240000)}, lived in it for five years, then moved to Manchester for a new job and let it for three years before selling for ${h.gbp(390000)} with ${h.gbp(6000)} of fees. The gain is ${h.gbp(bristol.gain)}. She owned it for 96 months and lived there for 60; with the final ${R.final_period_months} months, ${h.pct(Math.round(bristol.prrShare * 1000) / 1000)} is relieved and ${h.gbp(bristol.chargeable)} is chargeable. On a £45,000 salary, she pays ${h.gbp(bristolTax.tax)}. Because tax is due on a UK home, she must report and pay within ${C.report_days_residential} days of completion; the ${h.a('capital-gains-tax-60-day-return', '60-day return page')} explains how.</p>
<h2>Absences that still count as living there</h2>
<p>If the property is your only home, or the one you have nominated, some absences are treated as occupation, provided you lived there before and after them, unless your job prevented the return. Absences for any reason can total ${R.absence_any_reason_years} years. Periods when your work required you to live elsewhere in the UK can total ${R.absence_uk_work_years} years. Periods working outside the UK are covered without limit. These rules sit on top of the final ${R.final_period_months} months, so a well-documented career move can leave the whole gain relieved.</p>
<h2>Two homes and the nomination letter</h2>
<p>A married couple or civil partners can have only one main residence between them at a time. When you have two homes, you can nominate which one counts by writing to HMRC within ${R.nomination_years} years of the combination changing, with the address and the signatures of all owners. Without a nomination, the main residence is a question of fact. Since 6 April 2015, an overseas property can only be nominated if you spent at least ${R.overseas_nomination_days} days in it during the tax year.</p>
<h2>Letting Relief, now only for shared homes</h2>
<p>Letting Relief is no longer a reward for letting a former home. It applies only when you lived in the property at the same time as your tenant. It is the lowest of three figures: the Private Residence Relief you get, ${h.gbp(R.letting_relief_max)}, or the gain made on the let part. GOV.UK’s example is a bedroom making up ${h.pct(lodgerShare)} of a home sold with a chargeable gain of ${h.gbp(lodgerGain)}: relief covers ${h.gbp(lodgerGain * (1 - lodgerShare))}, Letting Relief covers the remaining ${h.gbp(lodgerGain * lodgerShare)}, and nothing is taxed. Someone renting out a room while living in the house may prefer the ${h.a('property-allowance-rent-a-room', 'Rent a Room Scheme')} for the income side.</p>
<h2>Homes bought in joint names</h2>
<p>Each owner’s relief depends on their own occupation. If an unmarried couple buy a house together and one of them moves out years before the sale, the one who stayed keeps full relief on their half, while the one who left is relieved only for the months they lived there plus the final ${R.final_period_months} months. Married couples living together share a single main residence, so they are treated as one household for this purpose.</p>
<h2>Before you sell a home you have let</h2>
<p>Gather the completion statements for the purchase and the sale, invoices for any extension or conversion, and evidence of the dates you lived there: council tax bills, electoral roll, utility accounts. They decide both the gain and the fraction. The ${h.a('capital-gains-tax-on-property', 'property calculator')} takes the months owned and lived in and shows the result before you accept an offer.</p>`;
  },
});
