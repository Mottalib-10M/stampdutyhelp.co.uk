import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { cgt, propertyGain } from '../../lib/engine/wealth';

const C = P.wealth.cgt;
const PA = P.wealth.income_tax.personal_allowance;
const leeds = propertyGain({ sale: 265000, purchase: 180000, buyingCosts: 8500, sellingCosts: 4500, share: 0.5 });
const aisha = cgt({ gains: leeds.chargeable, taxableIncome: 32000 - PA });
const tom = cgt({ gains: leeds.chargeable, taxableIncome: 58000 - PA });
const inherited = propertyGain({ sale: 255000, purchase: 240000, sellingCosts: 6000 });
const inhTax = cgt({ gains: inherited.chargeable, taxableIncome: 40000 - PA });
const whole = cgt({ gains: leeds.gain * 2, taxableIncome: 58000 - PA });

export default definePage({
  id: 'capital-gains-tax-on-property',
  group: 'gains',
  order: 20,
  slug: 'capital-gains-tax-on-property',
  nav: 'CGT on a buy-to-let or second home',
  card: 'Selling a let flat, a holiday home or an inherited house: what comes off the gain, how joint owners split it and when to pay.',
  title: 'Capital Gains Tax on Property 2026: Buy-to-Let, Second Homes',
  description: `Capital Gains Tax on property sold in 2026/27: ${pct(C.rate_lower)} or ${pct(C.rate_higher)} on the gain after costs and the ${gbp(C.annual_exempt_amount)} allowance, reported and paid within ${C.report_days_residential} days of completion.`,
  h1: 'Capital Gains Tax when you sell a property that is not your home',
  intro: 'Buy-to-let, second home, inherited house: the gain is taxed, but far less of the price than most sellers fear.',
  resume: `When you sell a UK property that has not been your main home for the whole time you owned it, such as a buy-to-let flat, a holiday cottage or a house inherited from a parent, Capital Gains Tax is due on the gain. The gain is the sale price minus what you paid and minus allowable costs: the stamp duty and legal fees of the purchase, the agent’s and solicitor’s fees of the sale, and improvement work such as an extension. Joint owners are each taxed on their own share, and each has a ${gbp(C.annual_exempt_amount)} allowance for the 2026 to 2027 tax year. After that, the gain pays ${pct(C.rate_lower)} inside whatever is left of the basic rate band and ${pct(C.rate_higher)} above it. A Leeds couple splitting a ${gbp(leeds.gain * 2)} gain on a let flat pay ${gbp(aisha.tax)} and ${gbp(tom.tax)}. A UK resident with tax to pay must report and pay within ${C.report_days_residential} days of completion; a non-resident must report every UK property sale in that window, even with no tax due.`,
  faqs: [
    { q: 'Can I deduct the stamp duty I paid when I bought the buy-to-let from the gain?', a: `Yes. Stamp Duty Land Tax, Land and Buildings Transaction Tax or Land Transaction Tax paid on the purchase is a cost of acquisition, deducted along with the conveyancing fees and searches of the time. On a buy-to-let bought at the higher rates the surcharge was often large, so dig out the completion statement: every pound of it reduces the gain taxed at ${pct(C.rate_lower)} or ${pct(C.rate_higher)}.` },
    { q: 'Is the mortgage I repay on sale deducted when working out the gain?', a: 'No. The gain compares what you sold for with what the property cost you, whoever lent the money. Repaying the mortgage changes how much cash you keep, not the gain, and mortgage interest paid over the years is not an acquisition cost either. That is why a landlord with little equity can face a tax bill larger than the cash left after redemption.' },
    { q: 'We inherited Mum’s house and sold it a year later. What is our base cost?', a: `The value used for probate, normally the market value at the date of death. Only the rise between that value and the sale price is taxed, after selling costs and each heir’s ${gbp(C.annual_exempt_amount)} allowance. If the house was sold for less than the probate value, the estate may be able to claim a loss. Any Inheritance Tax paid on the house is a separate tax and is not deducted.` },
    { q: 'I live in Dubai and am selling my London flat. Is all of the gain taxable?', a: `Only the part since ${h_date(C.non_resident_gains_since)} for most non-residents selling UK residential property, because the gain is normally measured from the value on that date. You must file a UK property return within ${C.report_days_residential} days of completion even if the result is a loss or the gain is below the allowance, and pay any tax in the same window.` },
  ],
  tool: 'cgt',
  toolProps: { cgtMode: 'property' },
  related: ['capital-gains-tax-calculator', 'private-residence-relief', 'capital-gains-tax-60-day-return', 'buy-to-let-stamp-duty', 'stamp-duty-second-home', 'rental-income-tax-calculator'],
  sources: ['govTaxSellProperty', 'govCgt', 'govCgtReport', 'govCgtNonRes'],
  body: (h) => {
    const rows = [
      ['Sale price', h.gbp(265000)], ['Purchase price', `− ${h.gbp(180000)}`], ['Stamp duty and legal fees on purchase', `− ${h.gbp(8500)}`], ['Agent and solicitor on sale', `− ${h.gbp(4500)}`],
      ['Gain on the whole flat', h.gbp(leeds.gain * 2)], ['Each owner’s half', h.gbp(leeds.gain)],
    ];
    return `
<h2>What counts as a cost</h2>
<p>Three kinds of spending come off the sale price. Acquisition costs are the price itself plus what you paid to buy: the ${h.a('buy-to-let-stamp-duty', 'stamp duty on a buy-to-let')}, conveyancing, survey fees. Disposal costs are the estate agent’s commission, the solicitor on the sale and any valuation needed for the return. Enhancement costs are capital works that are still there when you sell: a loft conversion, a new kitchen extension, a garage. Routine repairs, redecoration, letting agent fees and mortgage interest do not count, although many of them were deductible against the rent each year instead.</p>
<h2>A let flat in Leeds, owned half and half</h2>
<p>Aisha and Tom bought a two-bedroom flat near Leeds city centre as an investment, let it throughout and sell it in the 2026 to 2027 tax year. Neither ever lived there, so there is no Private Residence Relief.</p>
${h.table(['', 'Amount'], rows, 'Gain on a let flat, owned jointly', ['l', 'r'])}
<p>Each of them is taxed on ${h.gbp(leeds.gain)}. Aisha earns £32,000, so most of her basic rate band is still free: ${h.gbp(aisha.atLower)} of her gain pays ${h.pct(C.rate_lower)} and ${h.gbp(aisha.atHigher)} pays ${h.pct(C.rate_higher)}, for ${h.gbp(aisha.tax)}. Tom earns £58,000 and has no band left, so his ${h.gbp(tom.taxable)} after the allowance all pays the higher rate: ${h.gbp(tom.tax)}. Had Tom owned the flat alone, the bill would have been ${h.gbp(whole.tax)}, against ${h.gbp(aisha.tax + tom.tax)} for the couple together. The split on the title deeds matters, and a transfer between spouses before a sale is free of Capital Gains Tax.</p>
<h2>Second homes and holiday cottages</h2>
<p>A second home is taxed like a buy-to-let unless it has been your main residence for part of the time. Married couples and civil partners can have only one main residence between them at any time, and a nomination letter to HMRC within ${P.wealth.prr.nomination_years} years of the combination of homes changing can choose which one. The months the cottage was your main home, plus the final months of ownership, are then relieved, which the calculator above handles with the two month fields. The rules are on the ${h.a('private-residence-relief', 'Private Residence Relief page')}; the purchase side is on the ${h.a('stamp-duty-second-home', 'second home stamp duty page')}.</p>
<h2>An inherited house sold after probate</h2>
<p>A daughter in Norwich inherits her father’s bungalow at a probate value of ${h.gbp(240000)}, lets it sit empty while the estate is wound up and sells it for ${h.gbp(255000)}, paying ${h.gbp(6000)} in fees. Her gain is ${h.gbp(inherited.chargeable)}; after the allowance, ${h.gbp(inhTax.taxable)} is taxed, costing ${h.gbp(inhTax.tax)} on a £40,000 salary. Inheritance itself is not a disposal, so nothing was due when she received the house, and the ${h.a('inherited-property-stamp-duty', 'stamp duty rules for inherited property')} do not reach this sale.</p>
<h2>Sellers who live abroad</h2>
<p>Non-residents pay Capital Gains Tax on UK land and property. Most of them measure the gain on residential property from its value on ${h.date(C.non_resident_gains_since)}, not from the original price, and they keep the annual exempt amount. The reporting duty is stricter: every disposal of UK property or land goes on a return within ${C.report_days_residential} days of completion, including sales at a loss.</p>
<h2>Report and pay within ${C.report_days_residential} days</h2>
<p>A UK resident selling residential property with tax to pay files a Capital Gains Tax on UK property return and pays within ${C.report_days_residential} days of completion, using an estimate of their income for the year. The ${h.a('capital-gains-tax-60-day-return', '60-day return page')} explains the account, the estimate and what happens at the year-end Self Assessment.</p>`;
  },
});

function h_date(iso: string) { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); }
