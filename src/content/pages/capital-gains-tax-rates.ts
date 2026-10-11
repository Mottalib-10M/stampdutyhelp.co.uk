import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { cgt } from '../../lib/engine/wealth';

const C = P.wealth.cgt;
const PA = P.wealth.income_tax.personal_allowance;
const BAND = C.basic_rate_band;
const [oldLow, oldHigh] = C.previous_rates_other_assets;
const [resLow, resHigh] = C.previous_rates_residential_before_6_april_2024;
const nurse = cgt({ gains: 30000, taxableIncome: 26000 - PA });
const nurseHigh = cgt({ gains: 30000, taxableIncome: 70000 - PA });
const badr = cgt({ gains: 400000, taxableIncome: 50000 - PA, badr: true });
const badrNo = cgt({ gains: 400000, taxableIncome: 50000 - PA });

export default definePage({
  id: 'capital-gains-tax-rates',
  group: 'gains',
  order: 30,
  slug: 'capital-gains-tax-rates',
  nav: 'Capital Gains Tax rates',
  card: `${pct(C.rate_lower)} and ${pct(C.rate_higher)} on every kind of asset since 30 October 2024, ${pct(C.badr_rate)} with Business Asset Disposal Relief from April 2026.`,
  title: 'Capital Gains Tax Rates 2026/27: 18%, 24% and BADR at 18%',
  description: `Capital Gains Tax rates for 2026/27: ${pct(C.rate_lower)} inside the basic rate band, ${pct(C.rate_higher)} above it. A £30,000 gain on a £26,000 salary costs ${gbp(nurse.tax)}; on £70,000 it costs ${gbp(nurseHigh.tax)}.`,
  h1: 'Capital Gains Tax rates for the 2026 to 2027 tax year',
  intro: 'Two rates for individuals, one for trustees, one for qualifying business sales, and a single test that decides which applies to your gain.',
  resume: `For gains made between 6 April 2026 and 5 April 2027, individuals pay Capital Gains Tax at ${pct(C.rate_lower)} on the part of their taxable gains that fits inside the unused basic rate band of ${gbp(BAND)}, and ${pct(C.rate_higher)} on the rest. The same two rates apply to residential property, shares, cryptoassets and other chargeable assets: the separate, higher property rates ended on 30 October 2024, when the general rates rose from ${pct(oldLow)} and ${pct(oldHigh)} to match them. Trustees and the personal representatives of someone who has died pay a flat ${pct(C.rate_trustees)}. Gains qualifying for Business Asset Disposal Relief or Investors’ Relief pay ${pct(C.badr_rate)} from 6 April 2026, up from ${pct(C.badr_rate_2025_26)} in 2025 to 2026 and ${pct(C.badr_rate_before_6_april_2025)} before that. Carried interest left Capital Gains Tax on 6 April 2026 and is now taxed as income. To find your rate, add your taxable gains, after the ${gbp(C.annual_exempt_amount)} allowance, to your taxable income: a nurse earning £26,000 pays ${gbp(nurse.tax)} on a £30,000 gain.`,
  faqs: [
    { q: 'Is there still a higher Capital Gains Tax rate for residential property?', a: `Not since 30 October 2024. Before that date, gains on residential property paid ${pct(resLow)} and ${pct(resHigh)} until 5 April 2024 and ${pct(C.previous_rates_residential[0])} and ${pct(C.previous_rates_residential[1])} afterwards, while other assets paid ${pct(oldLow)} and ${pct(oldHigh)}. The Autumn Budget 2024 raised the general rates instead, so a buy-to-let and a share portfolio now pay the same ${pct(C.rate_lower)} or ${pct(C.rate_higher)}.` },
    { q: 'I live in Scotland and pay Scottish income tax. Which band decides my CGT rate?', a: `The test uses the UK basic rate band of ${gbp(BAND)}, the figure HMRC applies in its own worked examples for 2026 to 2027, and the Capital Gains Tax rates themselves are set for the whole United Kingdom. Scotland’s six income tax bands change the tax on your salary, not the ${pct(C.rate_lower)} and ${pct(C.rate_higher)} on your gains. Check your exact position with HMRC if your income sits near the band limit.` },
    { q: 'Does a big gain push my salary into the higher rate of income tax?', a: 'No. Gains are stacked on top of your income only to decide which Capital Gains Tax rate applies to them. Your income tax, your Personal Allowance and your tax code are worked out on income alone, so a large gain does not change the tax on your wages. It only changes how much of the gain itself is charged at the lower rate, and the tax on it is paid separately from PAYE.' },
    { q: `Why does my accountant say I pay ${pct(C.rate_higher)} when I am a basic rate taxpayer?`, a: `Because the band is shared. If your taxable income already uses most of the ${gbp(BAND)} basic rate band, only the gap left over is taxed at ${pct(C.rate_lower)}, and the rest of the gain pays ${pct(C.rate_higher)}. A basic rate taxpayer with taxable income of £30,000 has ${gbp(BAND - 30000)} of room, so a gain of £40,000 after the allowance is mostly charged at the higher rate.` },
    { q: 'What rate do executors pay when they sell a house from the estate?', a: `Personal representatives pay a flat ${pct(C.rate_trustees)} on the estate’s gains above the allowance, whatever the beneficiaries earn. The estate gets the full ${gbp(C.annual_exempt_amount)} annual exempt amount in the tax year of death and the two following years. Only the rise in value after the date of death is taxed, since the base cost is the probate value.` },
  ],
  mini: 'cgtRates',
  miniHref: 'capital-gains-tax-calculator',
  related: ['capital-gains-tax-calculator', 'capital-gains-tax-allowance', 'capital-gains-tax-on-property', 'dividend-tax', 'capital-gains-tax-60-day-return'],
  sources: ['govCgt', 'govCgtRates', 'cg10245'],
  body: (h) => {
    const hist = [
      ['From 6 April 2026', `${h.pct(C.rate_lower)} / ${h.pct(C.rate_higher)}`, `${h.pct(C.rate_lower)} / ${h.pct(C.rate_higher)}`, h.pct(C.badr_rate), h.pct(C.rate_trustees)],
      ['6 April 2025 to 5 April 2026', `${h.pct(C.rate_lower)} / ${h.pct(C.rate_higher)}`, `${h.pct(C.rate_lower)} / ${h.pct(C.rate_higher)}`, h.pct(C.badr_rate_2025_26), h.pct(C.rate_trustees)],
      ['30 October 2024 to 5 April 2025', `${h.pct(C.rate_lower)} / ${h.pct(C.rate_higher)}`, `${h.pct(C.rate_lower)} / ${h.pct(C.rate_higher)}`, h.pct(C.badr_rate_before_6_april_2025), h.pct(C.rate_trustees)],
      ['6 April 2024 to 29 October 2024', `${h.pct(oldLow)} / ${h.pct(oldHigh)}`, `${h.pct(C.previous_rates_residential[0])} / ${h.pct(C.previous_rates_residential[1])}`, h.pct(C.badr_rate_before_6_april_2025), 'varied'],
      ['6 April 2019 to 5 April 2024', `${h.pct(oldLow)} / ${h.pct(oldHigh)}`, `${h.pct(resLow)} / ${h.pct(resHigh)}`, h.pct(C.badr_rate_before_6_april_2025), 'varied'],
    ];
    const ladder = [10000, 20000, 30000, 37700, 50000].map((inc) => { const r = cgt({ gains: 25000, taxableIncome: inc }); return [h.gbp(inc), h.gbp(r.atLower), h.gbp(r.atHigher), h.gbp(r.tax)]; });
    return `
<h2>One test, two rates</h2>
<p>An individual does not have a single Capital Gains Tax rate. Each slice of the gain takes the rate of the income tax band it would land in if it were income. HMRC’s method has four steps: work out taxable income, meaning income minus the Personal Allowance and any reliefs; total the taxable gains for the year; take off the annual exempt amount; and place what is left on top of the income. Whatever sits inside the ${h.gbp(BAND)} basic rate band pays ${h.pct(C.rate_lower)}. Whatever sits above it pays ${h.pct(C.rate_higher)}.</p>
<p>Two consequences follow. Higher and additional rate taxpayers pay ${h.pct(C.rate_higher)} on everything, because their band is already full. And a basic rate taxpayer with a large gain pays both rates, sometimes mostly the higher one. The table shows a gain of ${h.gbp(25000)} at different levels of taxable income.</p>
${h.table(['Taxable income', `Gain at ${h.pct(C.rate_lower)}`, `Gain at ${h.pct(C.rate_higher)}`, 'Tax'], ladder, `A ${h.gbp(25000)} gain, 2026 to 2027, after the ${h.gbp(C.annual_exempt_amount)} allowance`, ['r', 'r', 'r', 'r'])}
<h2>A nurse and a consultant selling the same flat</h2>
<p>Take a hospital nurse in Sheffield earning £26,000 who sells a flat she used to let and makes a gain of ${h.gbp(30000)} after costs. Her taxable income is ${h.gbp(26000 - PA)}, which leaves ${h.gbp(BAND - (26000 - PA))} of the band. After the allowance, ${h.gbp(nurse.atLower)} of the gain pays ${h.pct(C.rate_lower)} and ${h.gbp(nurse.atHigher)} pays ${h.pct(C.rate_higher)}: ${h.gbp(nurse.tax)} in all. A colleague earning £70,000 who sells an identical flat pays ${h.gbp(nurseHigh.tax)}, because his band has nothing left. The difference comes entirely from income, not from the property.</p>
<h2>Business Asset Disposal Relief at ${h.pct(C.badr_rate)}</h2>
<p>Sole traders, partners and shareholders who sell all or part of a qualifying business can claim Business Asset Disposal Relief, formerly Entrepreneurs’ Relief, and Investors’ Relief works in a similar way for some outside investors. The relief does not exempt anything; it sets a flat rate. That rate was ${h.pct(C.badr_rate_before_6_april_2025)} until 5 April 2025, rose to ${h.pct(C.badr_rate_2025_26)} for 2025 to 2026, and is ${h.pct(C.badr_rate)} for disposals from 6 April 2026, the same as the lower main rate. For a basic rate taxpayer whose gain fits in the band, the relief now saves nothing. For someone above the band it still matters: a café owner earning £50,000 who sells her business for a gain of ${h.gbp(400000)} pays ${h.gbp(badr.tax)} with the relief and ${h.gbp(badrNo.tax)} without it. A property let to tenants is an investment, not a trading business, and does not qualify.</p>
<h2>Trustees, executors and carried interest</h2>
<p>Trustees and personal representatives have no income bands to fill, so they pay a flat ${h.pct(C.rate_trustees)} on gains above their own allowance, which is ${h.gbp(C.annual_exempt_amount_trusts)} for most trusts and ${h.gbp(C.annual_exempt_amount)} for an estate in the first years after a death. Carried interest, the share of profits paid to fund managers, used to have its own Capital Gains Tax rates. From 6 April 2026 it is outside the tax altogether and is charged to Income Tax and National Insurance instead.</p>
<h2>How the rates have moved</h2>
${h.table(['Period', 'Other assets', 'Residential property', 'BADR', 'Trustees and executors'], hist, 'Capital Gains Tax rates for individuals (lower / higher), HMRC', ['l', 'l', 'l', 'r', 'r'])}
<p>The single biggest change was 30 October 2024. Until then a landlord paid more on a flat than an investor paid on shares; since then the two are taxed alike at the higher level. Anyone reading older guidance, or comparing a sale in early 2024 with one now, should check which side of that date the completion fell.</p>
<h2>Using the allowance and losses where they save most</h2>
<p>When gains fall partly in each rate, HMRC lets you set the allowance against the slice that would pay ${h.pct(C.rate_higher)} first, which is the most valuable order. Losses work the same way: a loss on one asset can be set against the gain taxed at the higher rate. In practice the effect is small for most sellers, but it is the reason the calculators on this site always relieve the top slice first. The ${h.a('capital-gains-tax-allowance', 'allowance page')} covers losses in detail, and the ${h.a('capital-gains-tax-calculator', 'calculator')} applies both rules.</p>
<h2>Checking your rate before you agree a sale</h2>
<p>Because the rate depends on income in the tax year of the disposal, the same sale can cost different amounts depending on when it happens. Four questions settle it before you sign anything.</p>
<ol>
<li>What will my taxable income be for the tax year in which the sale falls? A year of parental leave, a career break or retirement leaves more of the band free.</li>
<li>How much of the ${h.gbp(BAND)} band does that income already use, and how much of my gain will fit in the remainder?</li>
<li>Do I own the asset alone, or could a spouse or civil partner with a lower income own part of it before the sale?</li>
<li>Are there losses, from this year or reported in earlier years, that can come off the gain first?</li>
</ol>
<p>A gift is a disposal too. If you give a flat or a block of shares to a son or daughter, the gain is measured from what you paid to the market value on the date of the gift, and you pay ${h.pct(C.rate_lower)} or ${h.pct(C.rate_higher)} on it exactly as if you had sold, even though no money changed hands. Only gifts to a spouse, a civil partner or a charity escape the charge, and a spouse who later sells takes over your original cost.</p>
<h2>Where the rate is not the whole story</h2>
<p>The rate applies to the gain after reliefs. For a former home, ${h.a('private-residence-relief', 'Private Residence Relief')} can remove most or all of the gain before any rate is applied. For property, the timing of payment differs too: tax on a UK residential sale is paid within ${C.report_days_residential} days of completion, not at the end of January after the tax year. Dividends, by contrast, have their own rates, set out on the ${h.a('dividend-tax', 'dividend tax page')}.</p>`;
  },
});
