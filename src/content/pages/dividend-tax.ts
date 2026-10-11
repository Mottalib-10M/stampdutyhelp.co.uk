import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { dividendTax } from '../../lib/engine/wealth';

const D = P.wealth.dividends;
const IT = P.wealth.income_tax;
const prev = D.previous_rates as number[];
const nurse = dividendTax({ otherIncome: 42000, dividends: 6000 });
const nurseOld = dividendTax({ otherIncome: 42000, dividends: 6000, rates: prev });

export default definePage({
  id: 'dividend-tax',
  group: 'gains',
  order: 80,
  slug: 'dividend-tax',
  nav: 'Dividend tax rates and allowance',
  card: `${pct(D.ordinary_rate)}, ${pct(D.upper_rate)} and ${pct(D.additional_rate)} from 6 April 2026, the ${gbp(D.allowance)} allowance and when to tell HMRC.`,
  title: `Dividend Tax 2026: ${pct(D.ordinary_rate)} and ${pct(D.upper_rate)} Rates, ${gbp(D.allowance)} Allowance`,
  description: `Dividend tax in 2026 to 2027: ${gbp(D.allowance)} tax-free, then ${pct(D.ordinary_rate)}, ${pct(D.upper_rate)} or ${pct(D.additional_rate)}. ${gbp(6000)} of dividends on ${gbp(42000)} of pay costs ${gbp(nurse.dividendTax, 2)} in tax, up from ${gbp(nurseOld.dividendTax, 2)}.`,
  h1: 'Dividend tax: rates, allowance and reporting',
  intro: 'Two of the three dividend rates went up on 6 April 2026, and the allowance has stayed at its lowest level.',
  resume: `For the 2026 to 2027 tax year, the first ${gbp(D.allowance)} of dividends is tax-free and the rest is taxed at ${pct(D.ordinary_rate)} in the basic rate band, ${pct(D.upper_rate)} in the higher rate band and ${pct(D.additional_rate)} in the additional rate band. The basic and higher rates rose by two percentage points from 6 April 2026, from ${pct(prev[0])} and ${pct(prev[1])}; the additional rate did not change. Dividends are added on top of salary, pension and rental profit to find the band, and the allowance still uses band space even though it is taxed at nothing. A nurse earning ${gbp(42000)} with ${gbp(6000)} of dividends from shares held outside an ISA now pays ${gbp(nurse.dividendTax, 2)}, against ${gbp(nurseOld.dividendTax, 2)} at last year’s rates. Dividends inside an ISA are not taxed at all. More than ${gbp(D.self_assessment_above)} of dividends in a year means a Self Assessment return.`,
  faqs: [
    { q: 'Why did dividend tax go up in April 2026?', a: 'The government announced at the Budget in November 2025 that it was raising tax on income from assets, to narrow the gap with earnings, which also carry National Insurance. Dividend rates rose first, from 6 April 2026. Savings income and property income follow from 6 April 2027 with their own higher rates in England, Wales and Northern Ireland.' },
    { q: 'If my only income is dividends, how much can I receive tax-free?', a: `The Personal Allowance of ${gbp(IT.personal_allowance)} covers dividends as well as other income, and the ${gbp(D.allowance)} dividend allowance comes on top, so ${gbp(IT.personal_allowance + D.allowance)} of dividends can be received with no tax in 2026 to 2027 if you have nothing else. Above that the ${pct(D.ordinary_rate)} rate applies.` },
    { q: 'My dividends are £2,000 and I am employed. What do I have to do?', a: `Tell HMRC after the end of the tax year on 5 April and before 5 October, either by asking for your tax code to be updated so the tax comes out of your wages, or through the helpline. If you already file a Self Assessment return, put the dividends on it instead. Below ${gbp(D.self_assessment_above)} a return is not compulsory for dividends alone.` },
    { q: 'Do dividends affect my Personal Allowance?', a: `They can. The allowance is reduced by ${gbp(1)} for every ${gbp(1 / IT.pa_taper_ratio)} of adjusted net income above ${gbp(IT.pa_taper_threshold)}, and dividends count in that income. A director with a modest salary and large dividends can lose part of the allowance, which raises the tax on the salary as well as on the dividends.` },
  ],
  mini: 'dividendRates',
  miniHref: 'dividend-tax-calculator',
  related: ['dividend-tax-calculator', 'capital-gains-tax-rates', 'rental-income-tax-calculator', 'capital-gains-tax-allowance', 'stamp-duty-company-purchase'],
  sources: ['govDividends', 'govRatesChange2025', 'govIncomeTaxRates'],
  body: (h) => {
    const bands = IT.ruk as Array<[number | null, number]>;
    const rateRows = [
      ['Dividend allowance', `first ${h.gbp(D.allowance)}`, '0%', '0%'],
      ['Basic rate band', `taxable income up to ${h.gbp(bands[0][0] as number)}`, h.pct(prev[0]), h.pct(D.ordinary_rate)],
      ['Higher rate band', `up to ${h.gbp(bands[1][0] as number)}`, h.pct(prev[1]), h.pct(D.upper_rate)],
      ['Additional rate band', `above ${h.gbp(bands[1][0] as number)}`, h.pct(prev[2]), h.pct(D.additional_rate)],
    ];
    const cmp = [2000, 5000, 10000, 25000, 50000].map((d) => {
      const n = dividendTax({ otherIncome: 40000, dividends: d });
      const o = dividendTax({ otherIncome: 40000, dividends: d, rates: prev });
      return [h.gbp(d), h.gbp(o.dividendTax, 2), h.gbp(n.dividendTax, 2), h.gbp(n.dividendTax - o.dividendTax, 2)];
    });
    return `
<h2>The rates, before and after 6 April 2026</h2>
${h.table(['Band', 'Where it starts', '2025 to 2026', 'From 6 April 2026'], rateRows, 'Dividend tax rates (taxable income is income after the Personal Allowance)', ['l', 'l', 'r', 'r'])}
<p>The change applies to dividends paid on or after 6 April 2026, and also to loans and benefits that close companies give their participators, which are taxed in line with the upper rate.</p>
<h2>How dividends are stacked on other income</h2>
<p>HMRC taxes income in a fixed order: earnings, pensions and rental profit first, then savings interest, then dividends at the top. The Personal Allowance is used against the first kinds before it reaches dividends. That is why the same ${h.gbp(5000)} of dividends can cost nothing to a retired person living on a small pension and ${h.gbp(dividendTax({ otherIncome: 60000, dividends: 5000 }).dividendTax, 2)} to someone earning ${h.gbp(60000)}.</p>
<p>The ${h.gbp(D.allowance)} allowance is not a deduction. It is a band taxed at 0% that still uses part of your basic or higher rate band. Someone with taxable income just below the higher rate threshold who receives ${h.gbp(3000)} of dividends will have the allowance absorb the first slice and the remainder taxed at ${h.pct(D.upper_rate)} once it crosses the line.</p>
<h2>What the rise costs, at a salary of ${h.gbp(40000)}</h2>
${h.table(['Dividends', 'At 2025 to 2026 rates', 'At 2026 to 2027 rates', 'Increase'], cmp, `Employee earning ${h.gbp(40000)}, England, Wales or Northern Ireland`, ['r', 'r', 'r', 'r'])}
<p>The pattern is simple: each pound above the allowance costs two pence more in either band, and the jump is steepest for those whose dividends straddle the higher rate threshold, because more of them sit in the band taxed at ${h.pct(D.upper_rate)}.</p>
<h2>A company director’s year</h2>
<p>A consultant who runs a one-person company in Reading pays herself a salary equal to the Personal Allowance, ${h.gbp(IT.personal_allowance)}, and takes the rest of what she needs as dividends. With ${h.gbp(30000)} of dividends, none of the salary is taxed, the first ${h.gbp(D.allowance)} of dividends is covered by the allowance, and the remaining ${h.gbp(30000 - D.allowance)} all falls in the basic rate band: ${h.gbp(dividendTax({ otherIncome: IT.personal_allowance, dividends: 30000 }).dividendTax, 2)} of dividend tax. If she takes ${h.gbp(50000)} instead, the top of her dividends crosses into the higher rate band and the bill becomes ${h.gbp(dividendTax({ otherIncome: IT.personal_allowance, dividends: 50000 }).dividendTax, 2)}. The extra ${h.gbp(20000)} of dividends costs ${h.gbp(dividendTax({ otherIncome: IT.personal_allowance, dividends: 50000 }).dividendTax - dividendTax({ otherIncome: IT.personal_allowance, dividends: 30000 }).dividendTax, 2)}, an average of ${h.pct(Math.round((dividendTax({ otherIncome: IT.personal_allowance, dividends: 50000 }).dividendTax - dividendTax({ otherIncome: IT.personal_allowance, dividends: 30000 }).dividendTax) / 20000 * 10000) / 10000)} on that slice. Corporation Tax on the company’s profits comes before any of this and is a matter for the company’s accounts.</p>
<p>The point where the higher rate starts is worth knowing precisely. With a salary at the Personal Allowance, dividends reach the higher rate band once they exceed the ${h.gbp((IT.ruk as Array<[number | null, number]>)[0][0] as number)} basic rate band, so total income of ${h.gbp(IT.personal_allowance + ((IT.ruk as Array<[number | null, number]>)[0][0] as number))}. Above that total, each further pound of dividends pays the upper rate until the additional rate band begins.</p>
<h2>Large dividends and the Personal Allowance</h2>
<p>Dividends count in adjusted net income, so they can take away the Personal Allowance. Between ${h.gbp(IT.pa_taper_threshold)} and ${h.gbp(IT.pa_taper_threshold + 2 * IT.personal_allowance)} of total income, every ${h.gbp(2)} above the threshold removes ${h.gbp(1)} of allowance. For someone whose income is all dividends, that pushes more dividends into the higher band: ${h.gbp(110000)} of dividends with no salary costs ${h.gbp(dividendTax({ otherIncome: 0, dividends: 110000 }).dividendTax, 2)}, while ${h.gbp(100000)} costs ${h.gbp(dividendTax({ otherIncome: 0, dividends: 100000 }).dividendTax, 2)}. The extra ${h.gbp(10000)} is taxed at an effective ${h.pct(Math.round((dividendTax({ otherIncome: 0, dividends: 110000 }).dividendTax - dividendTax({ otherIncome: 0, dividends: 100000 }).dividendTax) / 10000 * 10000) / 10000)}, far above the headline upper rate.</p>
<h2>Scotland and Wales</h2>
<p>Scottish taxpayers pay the Scottish rates on earnings and pensions, but dividends and savings interest follow the UK rates and bands. A Glasgow teacher with ${h.gbp(42000)} of salary and ${h.gbp(6000)} of dividends pays ${h.gbp(dividendTax({ otherIncome: 42000, dividends: 6000, region: 'scotland' }).dividendTax, 2)} on the dividends, exactly what a teacher in Leeds pays, while the tax on the salary differs. Welsh rates of income tax are currently identical to the English ones and also leave dividends to the UK rates.</p>
<h2>Reporting dividends to HMRC</h2>
<p>Dividends within the allowance need no action. Above it, but not more than ${h.gbp(D.self_assessment_above)}, employees and pensioners who do not file a return tell HMRC between the end of the tax year on 5 April and 5 October, and the tax is usually taken from their wages or pension through the PAYE code. Above ${h.gbp(D.self_assessment_above)}, a Self Assessment return is required; anyone not already registered must register by 5 October after the end of the tax year. Investors who already file because of rental income or self-employment simply add dividends to the return they make anyway.</p>
<h2>Shares in a company that owns property</h2>
<p>Some landlords hold their buy-to-let homes through a limited company and draw the rent out as dividends. The company pays ${h.a('stamp-duty-company-purchase', 'stamp duty at company rates')} when it buys, and Corporation Tax on its profits, and the shareholder pays dividend tax when profits are distributed. The higher dividend rates from April 2026 and the separate property income rates from April 2027 for individuals change the comparison between owning in a company and owning personally; the ${h.a('rental-income-tax-calculator', 'rental income calculator')} shows the personal side of that comparison.</p>
<h2>Before 5 April: four checks</h2>
<ol>
<li>Add up dividends received since 6 April from every holding outside an ISA, including funds that pay distributions, and note which tax year each payment falls in.</li>
<li>Place them on top of your salary, pension and rental profit to see whether any part crosses into the higher rate band; the ${h.a('dividend-tax-calculator', 'dividend tax calculator')} does this in one step.</li>
<li>If your total income approaches ${h.gbp(IT.pa_taper_threshold)}, check how much of the Personal Allowance you would lose.</li>
<li>Decide how the tax will be paid: through your tax code if the dividends are modest and you are employed or retired, or through Self Assessment above ${h.gbp(D.self_assessment_above)} or if you already file a return.</li>
</ol>
<p>Keep the dividend vouchers or the platform’s annual tax summary. They show the date and amount of each payment, which is what HMRC asks for, and they make the next year’s comparison easy.</p>
<h2>Dividends, gains and the ISA</h2>
<p>Selling shares is a different event from receiving dividends: any profit on the sale falls under ${h.a('capital-gains-tax-rates', 'Capital Gains Tax')}, with its own ${h.gbp(h.P.wealth.cgt.annual_exempt_amount)} allowance. Shares inside an ISA escape both taxes, so dividends received there are left out of every calculation on this page.</p>`;
  },
});
