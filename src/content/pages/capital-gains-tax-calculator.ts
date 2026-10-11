import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { cgt } from '../../lib/engine/wealth';

const C = P.wealth.cgt;
const PA = P.wealth.income_tax.personal_allowance;
const ex1 = cgt({ gains: 12600, taxableIncome: 20000 });
const ex2 = cgt({ gains: 52600, taxableIncome: 20000 });
const shares = cgt({ gains: 18000, taxableIncome: 55000 - PA });

export default definePage({
  id: 'capital-gains-tax-calculator',
  group: 'gains',
  order: 10,
  slug: 'capital-gains-tax-calculator',
  nav: 'Capital Gains Tax calculator',
  card: `Gain, allowance and the ${pct(C.rate_lower)} and ${pct(C.rate_higher)} slices for the 2026 to 2027 tax year, on property, shares or anything else.`,
  title: 'Capital Gains Tax Calculator 2026: Rates, Allowance, Slices',
  description: `Capital Gains Tax calculator for 2026/27 with the ${gbp(C.annual_exempt_amount)} allowance and the ${pct(C.rate_lower)} and ${pct(C.rate_higher)} rates: £12,600 of gains on £20,000 of taxable income costs ${gbp(ex1.tax)} in tax.`,
  h1: 'Capital Gains Tax calculator for 2026 to 2027',
  intro: 'Enter what you sold, what it cost and what you earn: the tool splits the gain between the two rates the way HMRC does.',
  resume: `Capital Gains Tax is charged on the profit when you sell or give away an asset that has risen in value, not on the sale price. For the 2026 to 2027 tax year, running from 6 April 2026 to 5 April 2027, the first ${gbp(C.annual_exempt_amount)} of net gains is free. What remains is added on top of your taxable income: the part that still fits inside the ${gbp(C.basic_rate_band)} basic rate band pays ${pct(C.rate_lower)}, and anything above it pays ${pct(C.rate_higher)}. HMRC’s own example uses taxable income of £20,000: gains of £12,600 cost ${gbp(ex1.tax)}, while gains of £52,600 cost ${gbp(ex2.tax)}, because ${gbp(ex2.atHigher)} of them spill over the band. The same rates apply to residential property, shares and other assets, so the calculator works for a buy-to-let flat, a share portfolio or a second home. Purchase costs, selling fees and improvements come off the gain first, and a sale of UK residential property with tax due must be reported and paid within ${C.report_days_residential} days of completion.`,
  faqs: [
    { q: 'Should I enter my salary before or after the Personal Allowance in this calculator?', a: `Before. Type your income for the tax year as it appears on your payslips or pension statements, and the tool takes off the standard ${gbp(PA)} Personal Allowance itself to find your taxable income. That figure decides how much of the ${gbp(C.basic_rate_band)} basic rate band is still free for gains at ${pct(C.rate_lower)}. If your allowance is reduced because you earn over the taper threshold, the result will be slightly low.` },
    { q: 'Can I use this Capital Gains Tax calculator for shares I sold outside an ISA?', a: `Yes. Enter the sale proceeds, the price you paid and the dealing costs, and leave the share at all of it. Shares held in an ISA are outside Capital Gains Tax and should not be entered at all. Shares bought in several lots follow pooling rules that this tool does not reproduce, so use the average cost your broker reports for the shares sold.` },
    { q: `I sold a painting and some shares in the same tax year. Do I get the ${gbp(C.annual_exempt_amount)} twice?`, a: `No. The annual exempt amount is one allowance per person per tax year, set against all your gains together after losses. Add the gains from every asset, take off any losses, and then deduct ${gbp(C.annual_exempt_amount)} once. If you already used it on an earlier sale, choose the option saying it is used elsewhere and the whole gain is taxed.` },
  ],
  tool: 'cgt',
  toolProps: { cgtMode: 'any' },
  related: ['capital-gains-tax-rates', 'capital-gains-tax-allowance', 'capital-gains-tax-on-property', 'private-residence-relief', 'capital-gains-tax-60-day-return', 'dividend-tax-calculator'],
  sources: ['govCgt', 'govCgtRates', 'cg10245', 'govCgtReport'],
  body: (h) => {
    const rows = [[h.gbp(12600), h.gbp(ex1.aea), h.gbp(ex1.atLower), h.gbp(ex1.atHigher), h.gbp(ex1.tax)], [h.gbp(52600), h.gbp(ex2.aea), h.gbp(ex2.atLower), h.gbp(ex2.atHigher), h.gbp(ex2.tax)]];
    return `
<h2>The two GOV.UK examples, run through the tool</h2>
<p>HMRC publishes two worked cases for gains made on or after 6 April 2026, both for someone whose taxable income, after the Personal Allowance, is £20,000. That leaves ${h.gbp(C.basic_rate_band - 20000)} of the basic rate band unused, and that unused space is what decides the rate.</p>
${h.table(['Taxable gain', 'Allowance', `At ${h.pct(C.rate_lower)}`, `At ${h.pct(C.rate_higher)}`, 'Tax'], rows, 'GOV.UK examples for 2026 to 2027, recomputed by our engine', ['r', 'r', 'r', 'r', 'r'])}
<p>In the first case the whole ${h.gbp(ex1.taxable)} left after the allowance fits inside the band, so everything pays the lower rate. In the second, only ${h.gbp(ex2.atLower)} fits and the remaining ${h.gbp(ex2.atHigher)} pays ${h.pct(C.rate_higher)}. Both figures match HMRC to the pound, and they are part of the automated tests that run before every update of this site.</p>
<h2>What the form needs from you</h2>
<p>The <strong>sale price</strong> is what you received, or the market value if you gave the asset away or sold it cheaply to someone connected to you. The <strong>price paid</strong> is your acquisition cost; for something inherited, use the probate value. <strong>Costs</strong> cover what it took to buy and sell: legal fees, agent’s commission, broker charges and, for property, the ${h.a('sdlt-calculator', 'stamp duty paid on the purchase')}. <strong>Improvements</strong> means capital work that is still reflected in the asset when you sell, such as an extension, not redecoration. Your <strong>income</strong> places the gain in the right band.</p>
<h2>A worked case for a shareholder</h2>
<p>A pharmacist in Bristol earning £55,000 sells a holding of shares bought years ago outside an ISA and makes £18,000 after dealing costs. Her taxable income already passes the top of the basic rate band, so nothing is left for the lower rate: after the ${h.gbp(C.annual_exempt_amount)} allowance, ${h.gbp(shares.taxable)} is taxed at ${h.pct(C.rate_higher)}, which gives ${h.gbp(shares.tax)}. Had she moved half the shares to her husband before the sale, each of them could have used an allowance, as explained on the ${h.a('capital-gains-tax-allowance', 'allowance page')}.</p>
<h2>What the calculator leaves out</h2>
<p>It treats one person and one tax year. It does not apply Business Asset Disposal Relief, rollover or holdover relief, share pooling, or the special rules for leases and part disposals of land. Losses carried forward from earlier years can be reflected by lowering the gain you enter. For a former home, the ${h.a('capital-gains-tax-on-property', 'property version of the calculator')} adds the months you lived there and works out ${h.a('private-residence-relief', 'Private Residence Relief')}. HMRC’s own calculators cover the same ground for simple sales, and its pages are listed under the sources below.</p>`;
  },
});
