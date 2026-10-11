import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { rentalTax, S24_TEST_PARAMS } from '../../lib/engine/wealth';

const R = P.wealth.rental;
const IT = P.wealth.income_tax;
const pr = R.property_rates_2027 as number[];
const flat = rentalTax({ rent: 14400, expenses: 2400, financeCosts: 6000, otherIncome: 42000 });
const sophia = rentalTax({ rent: 52000, expenses: 9000, financeCosts: 20000, otherIncome: 0 }, S24_TEST_PARAMS);
const john = rentalTax({ rent: 18000, expenses: 2000, financeCosts: 8000, otherIncome: 35000 }, S24_TEST_PARAMS);
const brian = rentalTax({ rent: 20000, expenses: 7000, financeCosts: 15000, otherIncome: 36000 }, S24_TEST_PARAMS);

export default definePage({
  id: 'rental-income-tax-calculator',
  group: 'gains',
  order: 90,
  slug: 'rental-income-tax-calculator',
  nav: 'Rental income tax calculator',
  card: `Tax on rent with the Section 24 credit of ${pct(R.finance_cost_credit_rate)}, the ${gbp(IT.property_allowance)} property allowance and Scottish rates.`,
  title: 'Rental Income Tax Calculator 2026: Landlords and Section 24',
  description: `Rental income tax calculator for 2026 to 2027: profit, Section 24 credit at ${pct(R.finance_cost_credit_rate)} and Scottish bands. A ${gbp(1200)} a month flat costs a higher-rate landlord ${gbp(flat.rentalTax)}.`,
  h1: 'Rental income tax calculator for landlords',
  intro: 'Rent, expenses, mortgage interest and your other income: the extra Income Tax the letting costs you this year.',
  resume: `Rental profit is added to your other income and taxed at your usual Income Tax rates: ${(IT.ruk as Array<[number | null, number]>).map(([, r]) => pct(r)).join(', ')} in England, Wales and Northern Ireland, or the ${IT.scotland.length} Scottish rates for Scottish taxpayers. Allowable expenses such as letting agent fees, repairs, insurance and ground rent come off the rent, but mortgage interest does not: since 6 April 2020 an individual landlord receives instead a tax credit of ${pct(R.finance_cost_credit_rate)} of the lowest of the finance costs, the property profit and the income above the Personal Allowance. That rule, known as Section 24, is why a higher-rate landlord renting a flat for ${gbp(1200)} a month, with ${gbp(2400)} of expenses and ${gbp(6000)} of mortgage interest on top of a ${gbp(42000)} salary, pays ${gbp(flat.rentalTax)} of extra tax. Small landlords can deduct the ${gbp(IT.property_allowance)} property allowance instead of expenses. From 6 April 2027, property income gets its own rates of ${pr.map(pct).join(', ')} in England, Wales and Northern Ireland.`,
  faqs: [
    { q: 'Can I deduct the capital part of my mortgage repayments?', a: 'No. Only the interest and other finance costs qualify, and for an individual landlord even those give a basic rate tax credit rather than a deduction. Repaying the loan itself is not an expense, and neither is buying the property or improving it beyond repairs. A limited company landlord deducts interest as an ordinary expense.' },
    { q: 'I own the flat jointly with my husband. How do we use the calculator?', a: `Run it once for each of you with your own share of the rent, expenses and interest, and your own other income. Each owner is taxed on their share of the profit at their own rates, and each can claim a separate ${gbp(IT.property_allowance)} property allowance against their share of the gross rent if that is better than expenses.` },
    { q: 'Does the calculator include the 2027 property rates?', a: `No. It applies the rates of the 2026 to 2027 tax year, which are the normal Income Tax rates. The separate property rates of ${pr.map(pct).join(', ')} start on 6 April 2027 for landlords in England, Wales and Northern Ireland, and the Scottish and Welsh governments are being given the power to set their own.` },
  ],
  tool: 'rental',
  related: ['section-24-mortgage-interest', 'property-allowance-rent-a-room', 'making-tax-digital-landlords', 'buy-to-let-stamp-duty', 'capital-gains-tax-on-property', 'dividend-tax-calculator'],
  sources: ['govRentingTax', 'govS24', 'govIncomeTaxRates', 'govScottishIncomeTax', 'govRatesChange2025', 'govPropertyAllowance'],
  body: (h) => `
<h2>What it calculates</h2>
<p>The calculator works out your Income Tax twice, with and without the rental profit, and shows the difference: the tax the letting adds to your bill. Property profit is rent minus allowable expenses, or minus the ${h.gbp(IT.property_allowance)} allowance if you choose it. The finance-cost credit is then taken off the tax, limited to the tax due. Any finance costs not used because profit or income was too low are carried forward to the next year, as HMRC allows.</p>
<h2>Tested on HMRC’s Section 24 case studies</h2>
<p>HMRC published four worked examples when the restriction was introduced. They use the 2016 to 2017 allowance of ${h.gbp(R.test_2016_17.personal_allowance)} and its bands, so the engine runs them with those figures; the method is the one still in force.</p>
${h.table(['Landlord', 'Rent', 'Interest', 'Other income', 'HMRC’s final tax', 'This engine'], [
    ['Sophia', h.gbp(52000), h.gbp(20000), h.gbp(0), h.gbp(2400), h.gbp(sophia.totalTax)],
    ['John', h.gbp(18000), h.gbp(8000), h.gbp(35000), h.gbp(8000), h.gbp(john.totalTax)],
    ['Brian', h.gbp(20000), h.gbp(15000), h.gbp(36000), h.gbp(6200), h.gbp(brian.totalTax)],
  ], 'HMRC case studies, 2016 to 2017 rates, recomputed', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>John shows the main effect of the rule: adding back his interest pushed ${h.gbp(8000)} of income into the higher rate band, and the ${h.pct(R.finance_cost_credit_rate)} credit only partly offsets the ${h.pct((IT.ruk as Array<[number | null, number]>)[1][1])} he pays on it. Brian shows the limit: his credit is capped at ${h.pct(R.finance_cost_credit_rate)} of his ${h.gbp(13000)} profit, and the unused ${h.gbp(brian.carriedForward)} of interest carries forward. The ${h.a('section-24-mortgage-interest', 'Section 24 guide')} goes through the rule step by step.</p>
<h2>Scottish landlords</h2>
<p>Rental profit is non-savings income, so a Scottish taxpayer pays the Scottish rates on it: ${(IT.scotland as Array<[number | null, number]>).map(([, r]) => h.pct(r)).join(', ')} across the ${IT.scotland.length} bands. Choose Scotland in the form and the calculator applies them. The finance-cost credit stays at ${h.pct(R.finance_cost_credit_rate)}, so a Scottish higher-rate landlord, paying ${h.pct((IT.scotland as Array<[number | null, number]>)[3][1])} on the profit, loses slightly more to Section 24 than one in England.</p>
<h2>Before and after the calculation</h2>
<p>Rental income must be reported through Self Assessment above ${h.gbp(IT.sa_property_income_after_expenses)} after expenses or ${h.gbp(IT.sa_property_income_before_expenses)} before them, and landlords whose gross rent and turnover pass the thresholds must keep digital records under ${h.a('making-tax-digital-landlords', 'Making Tax Digital')}. When the property is sold, the gain is a separate matter for ${h.a('capital-gains-tax-on-property', 'Capital Gains Tax')}, and the purchase itself carried the ${h.a('buy-to-let-stamp-duty', 'buy-to-let stamp duty surcharge')}.</p>`,
});
