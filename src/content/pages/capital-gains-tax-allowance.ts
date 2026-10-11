import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { cgt } from '../../lib/engine/wealth';

const C = P.wealth.cgt;
const PA = P.wealth.income_tax.personal_allowance;
const AEA = C.annual_exempt_amount;
const HIST = C.aea_history as Array<[string, number]>;
const OLD = HIST[0];
const saving = AEA * C.rate_higher;
const lost = (OLD[1] - AEA) * C.rate_higher;
const solo = cgt({ gains: 16000, taxableIncome: 62000 - PA });
const half = cgt({ gains: 8000, taxableIncome: 62000 - PA });
const halfLow = cgt({ gains: 8000, taxableIncome: 0 });

export default definePage({
  id: 'capital-gains-tax-allowance',
  group: 'gains',
  order: 40,
  slug: 'capital-gains-tax-allowance',
  nav: 'CGT allowance (annual exempt amount)',
  card: `${gbp(AEA)} of gains free each tax year, ${gbp(C.annual_exempt_amount_trusts)} for trusts: how losses, spouses and the reporting limit fit around it.`,
  title: `Capital Gains Tax Allowance 2026/27: ${gbp(AEA)} and How It Works`,
  description: `Capital Gains Tax allowance for 2026/27: ${gbp(AEA)} each, ${gbp(C.annual_exempt_amount_trusts)} for trusts, down from ${gbp(OLD[1])} in ${OLD[0]}. Worth up to ${gbp(saving)} a year to a higher-rate payer.`,
  h1: 'The Capital Gains Tax allowance: the annual exempt amount',
  intro: `${gbp(AEA)} of gains each year that no one taxes, provided you use it before 5 April: it cannot be saved for later.`,
  resume: `Every individual has a Capital Gains Tax allowance, officially the annual exempt amount, of ${gbp(AEA)} for the 2026 to 2027 tax year, unchanged since 2024 to 2025. Most trusts get ${gbp(C.annual_exempt_amount_trusts)}. Only net gains above it are taxed: you add the gains from everything you sold or gave away between 6 April and 5 April, deduct losses of the same year, and then deduct the allowance. It is worth ${gbp(AEA * C.rate_lower)} to someone whose gains would pay ${pct(C.rate_lower)} and ${gbp(saving)} to someone paying ${pct(C.rate_higher)}. The allowance was ${gbp(OLD[1])} in ${OLD[0]}, so the cut costs a higher-rate seller up to ${gbp(lost)} a year. It cannot be carried forward or given to anyone, but spouses and civil partners each have their own, and assets pass between them without tax, which lets a couple use two allowances on one sale. Even with no tax to pay, gains must be reported if total sale proceeds pass ${gbp(C.sa_proceeds_threshold)} and you are in Self Assessment.`,
  faqs: [
    { q: 'If I make no gains this year, can I carry my unused CGT allowance into next year?', a: `No. The annual exempt amount belongs to one tax year and disappears on 5 April if you do not use it, unlike reported losses, which can be carried forward to later years. Investors sitting on large unrealised gains therefore often sell a slice each tax year, enough to use the ${gbp(AEA)}, and so raise the base cost of what they still hold over time.` },
    { q: `I sold shares for ${gbp(60000)} but my gain was only ${gbp(2000)}. Do I have to tell HMRC?`, a: `If you are registered for Self Assessment, yes. From 2023 to 2024 onwards, gains below the allowance still go on the return when the total amount you sold assets for in the year is more than ${gbp(C.sa_proceeds_threshold)}. There is nothing to pay, but leaving the disposal off is an error. Someone outside Self Assessment with no tax due generally does not need to register.` },
    { q: 'Can I give half of my buy-to-let to my wife before selling, so we both use an allowance?', a: `Yes, a gift between spouses or civil partners living together is not taxed, and she takes over your original cost. Each of you then has a ${gbp(AEA)} allowance and your own basic rate band. The transfer must be real: she becomes a legal owner and receives half the sale money. Moving a share of a mortgaged property can itself have stamp duty consequences, so ask your conveyancer first.` },
    { q: 'Does the allowance apply before or after deducting losses from earlier years?', a: `Losses from the same tax year come off first, in full, even if that wastes part of the allowance. Losses brought forward from earlier years are different: you only use as much of them as needed to bring the gain down to ${gbp(AEA)}, and the rest stays available for later years. Losses must be claimed within ${C.loss_claim_years} years of the end of the tax year of the disposal.` },
  ],
  mini: 'cgtAllowance',
  miniHref: 'capital-gains-tax-calculator',
  related: ['capital-gains-tax-rates', 'capital-gains-tax-calculator', 'capital-gains-tax-on-property', 'transfer-of-equity-stamp-duty', 'dividend-tax'],
  sources: ['govCgt', 'govCgtRates'],
  body: (h) => {
    const rows = HIST.slice().reverse().map(([y, v]) => [y, h.gbp(v), h.gbp(v * C.rate_higher)]);
    return `
<h2>How much the allowance is, year by year</h2>
<p>The allowance stood at ${h.gbp(OLD[1])} in ${OLD[0]}. It was then halved twice: to ${h.gbp(HIST[1][1])} for ${HIST[1][0]} and to ${h.gbp(AEA)} from ${HIST[2][0]}. HMRC’s published table shows it at the same level for ${HIST[4][0]}, the current year.</p>
${h.table(['Tax year', 'Allowance for individuals', `Worth at ${h.pct(C.rate_higher)}`], rows, 'Annual exempt amount for individuals, personal representatives and trustees for disabled people', ['l', 'r', 'r'])}
<p>The lower figure for most other trusts is ${h.gbp(C.annual_exempt_amount_trusts)}. Executors dealing with an estate get the individual amount for the tax year of the death and the two years after it, then nothing. Trustees of a trust for a disabled person use the individual figure. People who claim the foreign income and gains regime, or Overseas Workday Relief, lose the allowance for that year.</p>
<h2>The order of the calculation</h2>
<p>The allowance is the last thing deducted, not the first. HMRC’s sequence is: work out the gain on each asset, add them together, take off allowable losses of the same year, then take off losses brought forward only as far as needed, and finally deduct the ${h.gbp(AEA)}. What remains is the figure that goes into the ${h.pct(C.rate_lower)} and ${h.pct(C.rate_higher)} rates.</p>
<p>Because the allowance is a single sum for the year, timing matters. A landlord planning to sell a flat in March and some shares in May can put the two disposals in different tax years and use two allowances instead of one. Ask your conveyancer which tax year the disposal falls in before agreeing dates, because the ${C.report_days_residential}-day reporting clock for UK homes runs from completion.</p>
<h2>A couple with one property and two allowances</h2>
<p>A married couple in Cardiff own a small flat, bought as an investment in the husband’s name, which will show a gain of ${h.gbp(16000)} after costs. He earns £62,000. Selling alone, he loses ${h.gbp(AEA)} to the allowance and pays ${h.pct(C.rate_higher)} on the rest: ${h.gbp(solo.tax)}. If he transfers half to his wife first, which is free of Capital Gains Tax between spouses, each has a gain of ${h.gbp(8000)}. At his income he pays ${h.gbp(half.tax)}. His wife, who has no taxable income, pays ${h.gbp(halfLow.tax)} at ${h.pct(C.rate_lower)}, so the couple’s bill falls to ${h.gbp(half.tax + halfLow.tax)}. A ${h.a('transfer-of-equity-stamp-duty', 'transfer of equity')} with a mortgage attached can trigger stamp duty, so the order and the paperwork need care.</p>
<h2>Losses and the allowance</h2>
<p>A loss is the mirror of a gain: you sold for less than the asset cost you, after allowable costs. Losses on assets sold to a spouse cannot be claimed, and a loss on a disposal to a family member or other connected person can only be set against gains on disposals to that same person. Ordinary losses must be reported to HMRC within ${C.loss_claim_years} years of the end of the tax year in which you made them; until they are claimed, they cannot be used.</p>
<p>Same-year losses always come off in full, even if the result falls below the allowance and part of the ${h.gbp(AEA)} is wasted. Brought-forward losses are kinder: only the amount needed to bring the gains down to the allowance is used, and the balance carries on. An investor who made a large loss on shares in 2023 and now sells a property at a gain can therefore keep the allowance and save the loss for future years.</p>
<h2>Jointly owned assets and the allowance</h2>
<p>Where an asset is owned with someone else, each owner works out the gain on their own share and sets their own allowance against it. Two siblings who inherit their mother’s house in equal shares and sell it after probate therefore each deduct ${h.gbp(AEA)}, and each place their half of the gain on top of their own income. The same applies to friends who bought together or to an unmarried couple: the split shown on the title deeds decides who is taxed on what. Unmarried partners cannot pass a share to each other free of tax the way spouses can, because a gift between them is a disposal at market value.</p>
<h2>Records that make the allowance count</h2>
<p>The allowance only protects a gain you can measure. Keep the purchase contract, the completion statement showing stamp duty and legal fees, receipts for improvements and the sale paperwork, for at least a year after the Self Assessment deadline, and longer if HMRC opens a check. Without them, HMRC can question costs you deduct, and a gain that should have fitted inside the ${h.gbp(AEA)} may end up taxed. Where records were lost, they must be recreated as far as possible and marked as estimated or provisional on the return.</p>
<h2>When you must report gains under the allowance</h2>
<p>No tax does not always mean no paperwork. If you are in Self Assessment, gains below the allowance still need to be entered when the total proceeds of everything you disposed of in the year exceed ${h.gbp(C.sa_proceeds_threshold)}. Non-residents must report every sale of UK land or property, whatever the gain. And personal possessions are only chargeable at all if worth ${h.gbp(C.chattels_threshold)} or more, cars excepted.</p>
<h2>What the allowance does not cover</h2>
<p>It is a Capital Gains Tax allowance only. Dividends have their own, smaller allowance, explained on the ${h.a('dividend-tax', 'dividend tax page')}, and rental profits have the property allowance. Assets held in an ISA, gilts and Premium Bonds are outside the tax and do not use any of the ${h.gbp(AEA)}. Your main home is usually covered by its own relief rather than the allowance, as the ${h.a('capital-gains-tax-on-property', 'property page')} explains.</p>`;
  },
});
