import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { cgt, cgtDeadline, propertyGain } from '../../lib/engine/wealth';

const C = P.wealth.cgt;
const PA = P.wealth.income_tax.personal_allowance;
const D = C.report_days_residential;
const sale = propertyGain({ sale: 310000, purchase: 225000, buyingCosts: 7500, sellingCosts: 5500 });
const est = cgt({ gains: sale.chargeable, taxableIncome: 34000 - PA });
const real = cgt({ gains: sale.chargeable, taxableIncome: 52000 - PA });
const fmt = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }); };
const COMPLETION = '2026-11-20';

export default definePage({
  id: 'capital-gains-tax-60-day-return',
  group: 'gains',
  order: 60,
  slug: 'capital-gains-tax-60-day-return',
  nav: 'CGT 60-day property return',
  card: `Sold a UK home at a taxable gain? Report and pay within ${D} days of completion through the Capital Gains Tax on UK property account.`,
  title: `CGT 60-Day Return 2026: Reporting a UK Property Sale to HMRC`,
  description: `CGT 60-day return in 2026: report and pay tax on a UK home sale within ${D} days of completion. A sale completing on ${fmt(COMPLETION)} is due by ${fmt(cgtDeadline(COMPLETION))}.`,
  h1: `The ${D}-day Capital Gains Tax return for UK property`,
  intro: 'No bill arrives: the seller works out the tax, files the return and pays it, all within two months of completion.',
  resume: `Anyone who sells a UK residential property with a completion date on or after 27 October 2021 and has Capital Gains Tax to pay must report the sale to HMRC and pay the tax within ${D} days of completion. The window was ${C.report_days_before_27_october_2021} days for sales completed between 6 April 2020 and 26 October 2021. A UK resident whose total gains stay below the ${gbp(C.annual_exempt_amount)} allowance, or whose home is fully covered by Private Residence Relief, has nothing to file. Non-residents are stricter: every sale or disposal of UK property or land must be reported within the ${D} days, even at a loss. The return is made through a Capital Gains Tax on UK property account, with the dates, prices, costs and reliefs, and HMRC issues a payment reference starting with X. The tax is worked out with an estimate of your income for the year, and anyone in Self Assessment also enters the sale on their tax return, where the final figure is settled. Late filing or payment can bring interest and penalties.`,
  faqs: [
    { q: 'Does the 60-day clock start at exchange of contracts or at completion?', a: `At completion, the date you stopped owning the property. The return still asks for the exchange date as well, so keep both from your solicitor’s file. A sale that completes on ${fmt(COMPLETION)} must be reported and paid by ${fmt(cgtDeadline(COMPLETION))}. Ask your solicitor for the completion statement on the day, because every later step depends on that date and on the figures it shows.` },
    { q: 'I sold my rental flat at a small loss. Do I still need to file the UK property return?', a: `Only if you are not resident in the UK. A UK resident with no Capital Gains Tax to pay does not file the ${D}-day return, although a loss is worth claiming on a Self Assessment return so it can reduce later gains. A non-resident must report every disposal of UK property or land within ${D} days, whether the result is a gain, nil or a loss.` },
    { q: 'My income for the year is not known yet. Which rate do I use on the return?', a: `Use a reasonable estimate of your taxable income for the tax year of the sale. It decides how much of the gain falls inside the ${gbp(C.basic_rate_band)} basic rate band at ${pct(C.rate_lower)}. If your real income turns out higher, the extra tax is collected through Self Assessment; if lower, the overpayment comes back the same way. Higher rate taxpayers can simply use ${pct(C.rate_higher)} throughout.` },
    { q: 'Can my conveyancer file the Capital Gains Tax return for me?', a: 'Conveyancers usually file the stamp duty return on a purchase, but the Capital Gains Tax return on a sale is the seller’s own responsibility, so ask before assuming it is done. An accountant or tax agent can file it through HMRC’s separate agent route, or you can use your own account. Someone holding a lasting power of attorney can report on behalf of another person.' },
  ],
  mini: 'cgt60',
  miniHref: 'capital-gains-tax-on-property',
  related: ['capital-gains-tax-on-property', 'private-residence-relief', 'capital-gains-tax-calculator', 'stamp-duty-return-and-payment', 'capital-gains-tax-rates'],
  sources: ['govCgtReport', 'govCgt', 'govCgtNonRes', 'govTaxSellProperty'],
  body: (h) => {
    const dates = ['2026-04-10', '2026-07-31', COMPLETION, '2027-02-26'].map((d) => [h.date(d), h.date(cgtDeadline(d))]);
    return `
<h2>Who has to file, and who does not</h2>
<p>The ${D}-day return applies to residential property in the UK: houses, flats, a buy-to-let, a holiday home, an inherited house. It does not apply to shares, a business, a commercial unit sold by a UK resident or overseas property, which go on the annual Self Assessment return or the real time service. For a UK resident the trigger is tax: if the gain after costs, Private Residence Relief, losses and the ${h.gbp(C.annual_exempt_amount)} allowance is nil, there is no return to make. For a non-resident the trigger is the sale itself. Every disposal of UK property or land, residential or not, is reported within ${D} days, with or without tax.</p>
<p>Joint owners each report their own share of the gain. A gift of a UK property to a spouse, civil partner or charity follows special rules and is usually not taxed.</p>
<h2>The deadline, counted in calendar days</h2>
<p>The clock starts on the completion date and runs for ${D} days. Our dates add ${D} days to completion; leave a margin rather than file on the last one.</p>
${h.table(['Completion', `Report and pay by`], dates, `${D} days after completion`, ['l', 'l'])}
<p>The deadline is short compared with the end of January after the tax year that applies to other gains, and it is long compared with the ${h.a('stamp-duty-return-and-payment', `stamp duty return due ${h.P.sdlt.return_days} days after a purchase`)}. Unlike stamp duty, nobody files it for you as part of the conveyancing.</p>
<h2>A seller in Nottingham works through the return</h2>
<p>A teacher sells a two-bedroom flat in Nottingham, bought as a rental, for ${h.gbp(310000)}. It cost ${h.gbp(225000)}, with ${h.gbp(7500)} of stamp duty and legal fees, and the sale costs ${h.gbp(5500)}. His gain is ${h.gbp(sale.chargeable)}. When he files in December he expects £34,000 of income for the year, which leaves room in the basic rate band: the return shows ${h.gbp(est.atLower)} at ${h.pct(C.rate_lower)} and ${h.gbp(est.atHigher)} at ${h.pct(C.rate_higher)} after the allowance, ${h.gbp(est.tax)} to pay. In February he is promoted and finishes the year at £52,000. The correct figure becomes ${h.gbp(real.tax)}, and the difference of ${h.gbp(real.tax - est.tax)} is settled on his Self Assessment return for the year.</p>
<h2>What the return asks for</h2>
<p>You will need the address and postcode, the date you acquired the property, the exchange and completion dates of the sale, the value when you got it and when you sold it, the costs of buying, selling and improving it, and the reliefs you claim, such as ${h.a('private-residence-relief', 'Private Residence Relief')}. Non-residents also give the property type. Keep a copy: you can view and change your own returns in the account, except for 2023 to 2024 or earlier, or once you have filed a Self Assessment return for the same year.</p>
<h2>Filing and paying</h2>
<p>The return is made online through a Capital Gains Tax on UK property account, which you create with HMRC sign-in details the first time. You can pay straight away or afterwards by bank transfer, card or cheque, using the payment reference starting with X that HMRC issues. If the online service is unavailable to you, a paper version is completed online, printed and posted, and HMRC sends the 14-character reference by return. Executors reporting for an estate cannot pay through the account; HMRC tells them how to pay after the report. A trust needs its Unique Taxpayer Reference or Unique Reference Number, and corporate trustees report by post.</p>
<h2>The link with Self Assessment</h2>
<p>The ${D}-day return does not replace the annual return for people already in Self Assessment. They enter the same sale there, with the amount already paid, and HMRC works out any balance after the end of the tax year. If you are a UK resident with gains on other assets, such as shares, the real time Capital Gains Tax service accepts reports for 2025 to 2026 and 2026 to 2027 by ${C.real_time_report_deadline}, but it cannot be used for UK homes.</p>
<h2>Mistakes that make the return wrong</h2>
<p>Most errors on these returns come from the cost side, not the price. Sellers forget the stamp duty and legal fees of the original purchase, which are deductible, or they include mortgage interest and redecorating, which are not. Others deduct the whole ${h.gbp(C.annual_exempt_amount)} allowance on the property after already using it on shares sold earlier in the same tax year. Former homes cause a third type of error: the months lived in are counted, but the final ${h.P.wealth.prr.final_period_months} months that always qualify are left out, so the relief is understated. Joint owners sometimes file one return for the whole gain, when each should report their own share. A return can be changed in the account later, but getting the cost base right first avoids paying too much in the ${D}-day window and waiting months for the difference. Keep the calculation you used, because the online return asks you to support each figure and HMRC may ask to see the working behind it.</p>
<h2>Late returns and late payment</h2>
<p>HMRC warns that interest and a penalty may be charged when the return or the payment is late, and waiting for the Self Assessment deadline instead is precisely what triggers them. If you are close to the ${D}th day, file with your best estimates and amend later rather than miss the date. The ${h.a('capital-gains-tax-on-property', 'property calculator')} gives the figure to put on the return in a minute.</p>`;
  },
});
