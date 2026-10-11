import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { rentalTax, incomeTax, S24_TEST_PARAMS } from '../../lib/engine/wealth';

const R = P.wealth.rental;
const IT = P.wealth.income_tax;
const cr = R.finance_cost_credit_rate;
const higher = (IT.ruk as Array<[number | null, number]>)[1][1];
const case1 = rentalTax({ rent: 21000, expenses: 3000, financeCosts: 10000, otherIncome: 48000 });
const case1Old = incomeTax(48000 + 21000 - 3000 - 10000).tax - incomeTax(48000).tax;

export default definePage({
  id: 'section-24-mortgage-interest',
  group: 'gains',
  order: 100,
  slug: 'section-24-mortgage-interest',
  nav: 'Section 24: mortgage interest relief',
  card: `Why landlords get a ${pct(cr)} credit instead of deducting mortgage interest, and who it costs most.`,
  title: `Section 24 Mortgage Interest 2026: the ${pct(cr)} Credit Explained`,
  description: `Section 24 in 2026: landlords cannot deduct mortgage interest and get a ${pct(cr)} credit instead. On ${gbp(10000)} of interest a higher-rate landlord pays ${gbp(case1.rentalTax - case1Old)} more.`,
  h1: 'Section 24: how mortgage interest relief works for landlords',
  intro: 'Individual landlords no longer deduct mortgage interest from rent; they receive a credit at the basic rate.',
  resume: `Section 24 is the rule, phased in from 6 April 2017 and complete since 6 April 2020, that stops individual landlords of residential property deducting mortgage interest and other finance costs from their rental income. Instead, HMRC gives a tax reduction of ${pct(cr)} of the lowest of three amounts: the finance costs, the property profit, and the income above the Personal Allowance excluding savings and dividends. A basic-rate landlord usually ends up paying the same as before, but a higher-rate landlord loses relief at ${pct(higher)} and gets it back at ${pct(cr)}. A landlord with a ${gbp(48000)} salary, ${gbp(21000)} of rent, ${gbp(3000)} of expenses and ${gbp(10000)} of interest now pays ${gbp(case1.rentalTax)} on the letting, against ${gbp(case1Old)} if the interest were still deductible. Adding the interest back can also push income over a threshold. Companies are outside the rule: they still deduct interest in full for Corporation Tax.`,
  faqs: [
    { q: 'Does Section 24 apply to commercial property?', a: 'No. The restriction covers finance costs on residential lettings. A landlord letting a shop, an office or a lock-up garage still deducts interest as an expense. Where a building is partly residential, such as a flat above a shop, the finance costs are apportioned and only the residential part is restricted, as HMRC’s Property Manual explains.' },
    { q: 'What happens to interest I cannot use because my profit is too low?', a: 'It is not lost. When the credit is limited by the property profit or by your income above the Personal Allowance, the finance costs left over are carried forward and added to next year’s finance costs, as in HMRC’s example of a landlord whose flat stood empty for two months during repairs. The credit can never create a refund on its own.' },
    { q: 'I am a basic-rate taxpayer. Does Section 24 cost me anything?', a: 'Often not, provided your income stays in the basic rate band after the interest is added back. HMRC estimated that most landlords would pay no extra tax for that reason. The danger is crossing a line: adding back the interest can make you a higher-rate taxpayer or take your income above the level where the High Income Child Benefit Charge begins.' },
    { q: 'Should I move my rental properties into a limited company?', a: 'A company deducts interest in full, but moving existing properties means selling them to the company, which can trigger Capital Gains Tax for you and stamp duty for the company at company rates, plus refinancing costs. Profits drawn out as dividends are taxed again. Run the figures with an accountant; this site covers the stamp duty and personal tax parts.' },
  ],
  mini: 's24Cost',
  miniHref: 'rental-income-tax-calculator',
  related: ['rental-income-tax-calculator', 'property-allowance-rent-a-room', 'making-tax-digital-landlords', 'buy-to-let-stamp-duty', 'stamp-duty-company-purchase', 'dividend-tax'],
  sources: ['govS24', 'govRentingTax', 'govIncomeTaxRates'],
  body: (h) => {
    const phase = (R.s24_phase as Array<[string, number]>).map(([y, d]) => [y, h.pct(d), h.pct(1 - d)]);
    const rows = [[30000, 15000, 6000], [45000, 15000, 6000], [48000, 21000, 10000], [70000, 24000, 12000], [110000, 30000, 15000]].map(([o, r, f]) => {
      const now = rentalTax({ rent: r, expenses: 0, financeCosts: f, otherIncome: o });
      const old = incomeTax(o + r - f).tax - incomeTax(o).tax;
      return [h.gbp(o), h.gbp(r), h.gbp(f), h.gbp(old), h.gbp(now.rentalTax), h.gbp(now.rentalTax - old)];
    });
    return `
<h2>The three amounts and the credit</h2>
<p>The rule replaces a deduction with a tax reduction. You work out your property profit without taking off finance costs: mortgage interest and the other costs of borrowing for the residential letting business. That profit is taxed with your other income at your normal rates. Then HMRC reduces the bill by ${h.pct(cr)} of the smallest of these:</p>
<ol>
<li>the finance costs of the year, plus any brought forward from earlier years;</li>
<li>the property business profits of the year, after any losses brought forward;</li>
<li>your adjusted total income above the Personal Allowance, leaving out savings and dividend income.</li>
</ol>
<p>The reduction cannot turn into a refund. If the second or third amount is the smallest, the difference between it and the finance costs carries forward to the next year.</p>
<h2>The carry-forward in practice</h2>
<p>HMRC follows one landlord, Brian, over two years. In the first, his flat stood empty for two months while he found a tenant and he spent ${h.gbp(7000)} on repairs, so his property profit fell to ${h.gbp(13000)} against ${h.gbp(15000)} of interest. His credit was capped at ${h.pct(cr)} of the profit, ${h.gbp(rentalTax({ rent: 20000, expenses: 7000, financeCosts: 15000, otherIncome: 36000 }, S24_TEST_PARAMS).credit)}, and ${h.gbp(rentalTax({ rent: 20000, expenses: 7000, financeCosts: 15000, otherIncome: 36000 }, S24_TEST_PARAMS).carriedForward)} of interest went forward. The next year the flat was let all year, profit rose to ${h.gbp(22000)}, and the brought-forward amount joined that year’s interest: the credit was ${h.pct(cr)} of ${h.gbp(17000)}, so ${h.gbp(rentalTax({ rent: 24000, expenses: 2000, financeCosts: 15000, otherIncome: 36000, broughtForward: 2000 }, S24_TEST_PARAMS).credit)}, and his final tax came to ${h.gbp(rentalTax({ rent: 24000, expenses: 2000, financeCosts: 15000, otherIncome: 36000, broughtForward: 2000 }, S24_TEST_PARAMS).totalTax)}, exactly HMRC’s figure. The engine behind the calculator reproduces both years with HMRC’s 2016 to 2017 bands. A void period therefore delays relief rather than cancelling it, but keep the figure from each return: it is your own record that carries the unused amount forward.</p>
<p>The third limit, income above the Personal Allowance, bites mostly on landlords with little other income and a large profit, for example a retired couple living on rent. It rarely matters for a landlord with a salary, because their income above the allowance is usually far larger than their interest.</p>
<h2>Residential, commercial and mixed buildings</h2>
<p>The restriction is about homes. Interest on a loan for a shop, an office or a lock-up garage is still deducted in full from the rent it earns. A building that mixes both, such as a flat above a shop let on separate tenancies, needs its finance costs split: the part that relates to the flat goes through the ${h.pct(cr)} credit, the part for the shop is deducted, and HMRC’s Property Manual sets out how to apportion. Partnerships and trusts have their own version of the rule, also described in the manual, and furnished holiday lets lost their separate treatment from 6 April 2025, so their interest now follows the residential rule too.</p>
<h2>Interest and the sale of the property</h2>
<p>Landlords sometimes hope that interest refused against rent can be used when the property is sold. It cannot: GOV.UK lists loan interest among the costs that may not be deducted when working out a gain. The gain is the sale price less the purchase price, the stamp duty and legal costs of buying and selling, and the cost of improvements. The ${h.a('capital-gains-tax-on-property', 'Capital Gains Tax on property page')} works through those deductions.</p>
<h2>How it was phased in</h2>
${h.table(['Tax year', 'Share of finance costs still deductible', 'Share given as the credit'], phase, 'Transition set by HMRC', ['l', 'r', 'r'])}
<p>Since 2020 to 2021 nothing is deductible and the whole of the finance costs goes through the credit. Anyone looking at old accounts from the transitional years will see the partial deductions; they do not apply any more.</p>
<h2>Who pays more</h2>
${h.table(['Other income', 'Rent less expenses', 'Interest', 'Tax if interest deducted', 'Tax with Section 24', 'Difference'], rows, 'Extra tax from the restriction, 2026 to 2027 rates, England, Wales and Northern Ireland', ['r', 'r', 'r', 'r', 'r', 'r'])}
<p>The pattern is the one HMRC described when it introduced the rule. Basic-rate landlords whose income stays in the band after adding back the interest pay what they paid before: HMRC’s Sophia, living on ${h.gbp(52000)} of rent with ${h.gbp(20000)} of interest, paid ${h.gbp(rentalTax({ rent: 52000, expenses: 9000, financeCosts: 20000, otherIncome: 0 }, S24_TEST_PARAMS).totalTax)} both before and after. Landlords with a salary near or above the higher rate threshold pay more, because the interest added back is taxed at ${h.pct(higher)} and only ${h.pct(cr)} returns. Above ${h.gbp(IT.pa_taper_threshold)} the effect grows again, because the extra income also erodes the Personal Allowance.</p>
<h2>Thresholds that move</h2>
<p>Section 24 changes your total income, not just your tax. HMRC’s own example of John, self-employed with a buy-to-let, shows him becoming a higher-rate taxpayer purely because his interest was added back, and notes that his household may then face the High Income Child Benefit Charge. The same income figure decides whether your Personal Allowance starts to taper. Landlords close to any of these lines should run both versions in the ${h.a('rental-income-tax-calculator', 'rental income calculator')} before taking on a larger mortgage.</p>
<h2>Companies, and why many landlords looked at them</h2>
<p>A company that lets residential property pays Corporation Tax and deducts interest on property loans as an ordinary expense; GOV.UK states that an individual landlord paying Income Tax cannot. That difference is why many landlords have bought new properties through a limited company since 2017. The trade-offs are real: a company never receives first-time buyer relief, pays the ${h.a('stamp-duty-company-purchase', 'company rate of stamp duty')} or the higher rates on every purchase, and its profits are taxed again as ${h.a('dividend-tax', 'dividends')} when you draw them. Transferring properties you already own counts as a sale at market value.</p>
<h2>What it means when you buy</h2>
<p>For a new buy-to-let, Section 24 changes the arithmetic of leverage. A larger mortgage still reduces the deposit, but the interest is relieved at only ${h.pct(cr)}, so a higher-rate buyer should test the rent against the interest at their own rate, not the basic rate. Add the ${h.a('buy-to-let-stamp-duty', 'buy-to-let stamp duty')} at completion and, from 6 April 2027, the separate property income rates of ${(R.property_rates_2027 as number[]).map((x) => h.pct(x)).join(', ')} in England, Wales and Northern Ireland, and the margin can shrink further.</p>`;
  },
});
