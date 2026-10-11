import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { dividendTax } from '../../lib/engine/wealth';

const D = P.wealth.dividends;
const gov = dividendTax({ otherIncome: 29570, dividends: 3000 });
const director = dividendTax({ otherIncome: P.wealth.income_tax.personal_allowance, dividends: 40000 });

export default definePage({
  id: 'dividend-tax-calculator',
  group: 'gains',
  order: 70,
  slug: 'dividend-tax-calculator',
  nav: 'Dividend tax calculator',
  card: `Dividends above the ${gbp(D.allowance)} allowance at ${pct(D.ordinary_rate)}, ${pct(D.upper_rate)} or ${pct(D.additional_rate)}, stacked on your other income.`,
  title: 'Dividend Tax Calculator 2026: Rates From 6 April 2026',
  description: `Dividend tax calculator for 2026 to 2027: ${gbp(D.allowance)} allowance, then ${pct(D.ordinary_rate)}, ${pct(D.upper_rate)} and ${pct(D.additional_rate)}. ${gbp(3000)} of dividends on a ${gbp(29570)} salary costs ${gbp(gov.dividendTax, 2)} in tax.`,
  h1: 'Dividend tax calculator',
  intro: 'Enter your salary and your dividends: the calculator places the dividends on top of your other income and taxes each slice at its own rate.',
  resume: `Dividends received from 6 April 2026 are taxed at ${pct(D.ordinary_rate)} in the basic rate band, ${pct(D.upper_rate)} in the higher rate band and ${pct(D.additional_rate)} above it, after a tax-free dividend allowance of ${gbp(D.allowance)}. The ordinary and upper rates each rose by two points from ${pct(D.previous_rates[0])} and ${pct(D.previous_rates[1])}, announced at the Budget of November 2025. Dividends are treated as the top slice of income, so the rate depends on how much of the band your salary, pension or rental profit has already used. GOV.UK’s example is someone earning ${gbp(29570)} with ${gbp(3000)} of dividends: the first ${gbp(D.allowance)} is free, and the other ${gbp(3000 - D.allowance)} pays ${pct(D.ordinary_rate)}, which is ${gbp(gov.dividendTax, 2)}. Dividends from shares held in an ISA are tax-free and should be left out. Scottish income tax bands do not apply to dividends: they use the UK bands wherever you live.`,
  faqs: [
    { q: 'I live in Edinburgh. Why does Scotland only change the tax on my salary?', a: 'Because the Scottish Parliament sets the rates on earnings, pensions and most other income, but not on dividends or savings interest. Those are taxed at the same rates and with the same bands everywhere in the UK. The calculator applies Scottish rates to your other income and UK rates to the dividends, which is how HMRC works it out.' },
    { q: 'Do I need to fill in a tax return for my dividends?', a: `If you receive more than ${gbp(D.self_assessment_above)} of dividends in a tax year, yes: you must complete a Self Assessment return, registering by 5 October after the year ends if you do not normally file one. Below that, HMRC can collect the tax through your PAYE tax code instead, or you can report through the helpline. Within the allowance, there is nothing to tell HMRC.` },
    { q: 'Does the dividend allowance stop dividends pushing me into the higher rate band?', a: `No. The first ${gbp(D.allowance)} of dividends is taxed at 0%, but it still counts as income and takes up space in the band. A salary just below the higher rate threshold plus dividends can therefore leave part of the dividends taxed at ${pct(D.upper_rate)}, even though the allowance itself is free.` },
  ],
  tool: 'dividend',
  related: ['dividend-tax', 'capital-gains-tax-calculator', 'rental-income-tax-calculator', 'capital-gains-tax-rates', 'stamp-duty-company-purchase'],
  sources: ['govDividends', 'govRatesChange2025', 'govIncomeTaxRates', 'govScottishIncomeTax'],
  body: (h) => {
    const rows = [[30000, 2000], [30000, 10000], [45000, 10000], [60000, 20000], [h.P.wealth.income_tax.personal_allowance, 40000], [120000, 30000]].map(([o, d]) => {
      const r = dividendTax({ otherIncome: o, dividends: d });
      return [h.gbp(o), h.gbp(d), h.gbp(r.dividendTax, 2), r.band];
    });
    return `
<h2>How the calculator works</h2>
<p>It follows the order HMRC uses. Your Personal Allowance of ${h.gbp(h.P.wealth.income_tax.personal_allowance)} is set against your salary or pension first, and only what is left of it against dividends. Above ${h.gbp(h.P.wealth.income_tax.pa_taper_threshold)} of total income the allowance shrinks by ${h.gbp(1)} for every ${h.gbp(1 / h.P.wealth.income_tax.pa_taper_ratio)}, and dividends count in that total. The dividends then sit on top of your taxable income: the first ${h.gbp(D.allowance)} at 0%, the rest at ${h.pct(D.ordinary_rate)} while they stay inside the basic rate band, ${h.pct(D.upper_rate)} in the higher rate band and ${h.pct(D.additional_rate)} above ${h.gbp(h.P.wealth.income_tax.ruk[1][0] as number)} of taxable income.</p>
<p>The GOV.UK example comes out exactly: on ${h.gbp(29570)} of wages and ${h.gbp(3000)} of dividends, ${h.gbp(gov.otherTax, 2)} on the wages and ${h.gbp(gov.dividendTax, 2)} on the dividends.</p>
${h.table(['Salary or pension', 'Dividends', 'Dividend tax', 'Top band reached'], rows, 'Dividend tax in 2026 to 2027, England, Wales and Northern Ireland', ['r', 'r', 'r', 'l'])}
<h2>A director paying themselves in dividends</h2>
<p>Owner-managers of small companies often take a salary at the level of the Personal Allowance and the rest as dividends. With ${h.gbp(h.P.wealth.income_tax.personal_allowance)} of salary and ${h.gbp(40000)} of dividends, the dividend tax is ${h.gbp(director.dividendTax, 2)} for 2026 to 2027. Dividends are paid out of profits that have already borne Corporation Tax, which this calculator does not include, and the company’s own position is a matter for its accountant.</p>
<h2>What it leaves out</h2>
<p>Savings interest is not modelled, nor are tax reliefs such as charity donations or private pension contributions, which can change how much of each band is left. Capital gains on selling the shares are a separate tax: use the ${h.a('capital-gains-tax-calculator', 'Capital Gains Tax calculator')}. Landlords who hold property personally and receive rent rather than dividends should use the ${h.a('rental-income-tax-calculator', 'rental income calculator')}, and those weighing a company purchase can compare the ${h.a('stamp-duty-company-purchase', 'stamp duty for companies')}.</p>`;
  },
});
