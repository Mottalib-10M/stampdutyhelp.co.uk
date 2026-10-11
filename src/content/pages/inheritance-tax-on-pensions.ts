import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { iht } from '../../lib/engine/wealth';

const I = P.wealth.iht;
const b = iht({ estate: 450000, pension: 250000 });
const a = iht({ estate: 450000, pension: 250000, deathFromApril2027: true });

export default definePage({
  id: 'inheritance-tax-on-pensions',
  group: 'inheritance',
  order: 60,
  slug: 'inheritance-tax-on-pensions',
  nav: 'Pensions and IHT from April 2027',
  card: `Unused pension pots join the estate for deaths from 6 April 2027: what is in, what stays out, who pays.`,
  title: 'Inheritance Tax on Pensions 2026: the April 2027 Change',
  description: `Inheritance Tax on pensions: from 6 April 2027 unused pots count in the estate at ${pct(I.rate)}. A ${gbp(450000)} estate with a ${gbp(250000)} pot pays ${gbp(a.tax - b.tax)} more. Who pays.`,
  h1: 'Inheritance Tax on pensions from 6 April 2027',
  intro: 'For deaths on or after 6 April 2027, most unused pension funds and death benefits will be valued as part of the estate.',
  resume: `Until 5 April 2027, money left in most UK pension schemes passes to beneficiaries outside the estate for Inheritance Tax, because the scheme administrator has discretion over who receives it. For deaths on or after 6 April 2027 that changes: unused pension funds and pension death benefits will be included in the value of the estate, whether or not the scheme has discretion, and taxed at ${pct(I.rate)} above the bands like any other asset. Death-in-service benefits paid by a registered scheme stay outside, as do dependants’ scheme pensions from defined benefit and collective money purchase arrangements. The personal representatives, not the pension scheme, will be liable for reporting and paying the tax. For a single person with a ${gbp(450000)} estate and a ${gbp(250000)} pension pot, the bill rises from ${gbp(b.tax)} to ${gbp(a.tax)}. A pot left to a spouse or civil partner remains exempt, as everything left to them does.`,
  faqs: [
    { q: 'Will my workplace death-in-service lump sum be taxed after April 2027?', a: 'No. HMRC’s policy paper keeps death-in-service benefits payable from a registered pension scheme out of scope of Inheritance Tax, whatever their size. The change targets money that has built up in a pension and was not spent, such as a defined contribution pot, not the life cover that many employers provide through the scheme.' },
    { q: 'Who pays the Inheritance Tax on my pension pot?', a: 'Your personal representatives, normally the executors of your will, will be liable for reporting the pension and paying the tax. The government is introducing a way for them to direct the pension scheme to withhold benefits and pay the tax due on them directly, in limited circumstances, so that executors are not forced to find the money from other assets first.' },
    { q: 'I am leaving my pension to my wife. Does the change affect us?', a: `Not on the first death. Assets left to a spouse or civil partner who lives permanently in the UK are exempt from Inheritance Tax, and the pension will be treated the same way. The effect comes on the second death, when the survivor’s estate may include the remaining pot. Any of your ${gbp(I.nil_rate_band)} band left unused can transfer to her.` },
  ],
  mini: 'ihtPension',
  miniHref: 'inheritance-tax-calculator',
  related: ['inheritance-tax-calculator', 'inheritance-tax', 'inheritance-tax-threshold', 'residence-nil-rate-band', 'inheritance-tax-gifts'],
  sources: ['govIhtPensions', 'govIht', 'govIhtThresholds'],
  body: (h) => {
    const rows = [[300000, 150000], [450000, 250000], [600000, 400000], [900000, 300000]].map(([e, p]) => {
      const before = iht({ estate: e, pension: p, homeToDescendants: Math.min(e, I.residence_nil_rate_band) });
      const after = iht({ estate: e, pension: p, homeToDescendants: Math.min(e, I.residence_nil_rate_band), deathFromApril2027: true });
      return [h.gbp(e), h.gbp(p), h.gbp(before.tax), h.gbp(after.tax), h.gbp(after.tax - before.tax)];
    });
    return `
<h2>What changes, and from when</h2>
<p>The measure applies to deaths on or after 6 April 2027, not to pensions drawn or contributions paid before then. Legislation was announced for the Finance Bill 2025-26, under the Inheritance Tax Act 1984 and the pension rules of the Finance Act 2004. From that date the value of unused pension funds and pension death benefits will form part of the member’s estate on death, regardless of whether the scheme administrators or trustees have discretion over who receives them.</p>
<p>The reason given by the government is that pensions had become a vehicle for passing on wealth rather than funding retirement, helped by the pension freedoms of 2015 and the end of the lifetime allowance in March 2023. Some schemes, such as non-discretionary ones in the public sector, were already counted in the estate; the reform removes the difference between them and the discretionary schemes used by most savers.</p>
<h2>In and out of scope</h2>
${h.table(['Pension benefit', 'For deaths from 6 April 2027'], [
      ['Unused defined contribution pot', 'included in the estate'],
      ['Lump sum death benefits from the unused fund', 'included in the estate'],
      ['Death-in-service benefit from a registered scheme', 'outside Inheritance Tax'],
      ['Dependant’s scheme pension from a defined benefit arrangement', 'outside Inheritance Tax'],
      ['Dependant’s pension from a collective money purchase arrangement', 'outside Inheritance Tax'],
      ['Anything left to a spouse or civil partner', 'exempt, as for every asset'],
    ], 'Scope of the reform, HMRC policy paper of 26 November 2025', ['l', 'l'])}
<h2>The effect on typical estates</h2>
${h.table(['Estate without pension', 'Unused pension', 'Tax, death before 6 April 2027', 'Tax, death from 6 April 2027', 'Increase'], rows, `Single person leaving a home to the children (residence band up to ${h.gbp(I.residence_nil_rate_band)}), 2026 to 2027 bands`, ['r', 'r', 'r', 'r', 'r'])}
<p>The pension also counts towards the ${h.gbp(I.taper_threshold)} taper threshold of the ${h.a('residence-nil-rate-band', 'residence nil-rate band')}. An estate of ${h.gbp(1800000)} with a ${h.gbp(500000)} pot moves above it, and part of the residence band starts to disappear: the tax goes from ${h.gbp(iht({ estate: 1800000, homeToDescendants: 600000, pension: 500000 }).tax)} to ${h.gbp(iht({ estate: 1800000, homeToDescendants: 600000, pension: 500000, deathFromApril2027: true }).tax)}.</p>
<h2>A family case, before and after</h2>
<p>Margaret is a widow in Harrogate. Her husband died in 2019 and left everything to her, so his nil-rate band and residence band are both available to her estate. She owns a house worth ${h.gbp(550000)}, has ${h.gbp(150000)} in savings and a defined contribution pot of ${h.gbp(400000)} she has barely touched, and her will leaves everything to her two sons. If she dies before 6 April 2027 her estate is ${h.gbp(700000)}, well within her combined bands, and the tax is ${h.gbp(iht({ estate: 700000, homeToDescendants: 550000, transferredNrb: 1, transferredRnrb: 1, pension: 400000 }).tax)}. If she dies after that date the pot joins the estate, which becomes ${h.gbp(1100000)}, and the bill is ${h.gbp(iht({ estate: 700000, homeToDescendants: 550000, transferredNrb: 1, transferredRnrb: 1, pension: 400000, deathFromApril2027: true }).tax)}. Nothing in her circumstances has changed; only the date.</p>
<p>The same arithmetic shows why couples are less exposed on the first death. Had her husband died after April 2027 leaving his own pot to her, it would have passed exempt, and the question would simply have moved to her estate. Where a member nominates children rather than the spouse to receive the pension, the exemption is lost on the first death, and the pot uses the member’s own bands.</p>
<h2>The order of the bands</h2>
<p>The pension does not get its own allowance. It is added to the rest of the estate, and the bands are applied once to the total: the residence band if a home goes to direct descendants, then the nil-rate band, less any gifts made in the last ${I.gift_years} years. In practice this means the pot is often taxed at the full ${h.pct(I.rate)}, because the house and savings have already used the bands. Executors will need to share the tax between the pension beneficiaries and the other heirs in the way the law sets out, which is one reason why the government is giving them the power to have the scheme pay the tax on its part.</p>
<h2>Who reports and who pays</h2>
<p>The government first proposed that pension scheme administrators would report and pay. After a consultation that ran from 30 October 2024 to 22 January 2025, its response of 21 July 2025 moved the duty to the personal representatives: the executors will include the pension in the Inheritance Tax account and pay any tax on it. To avoid leaving them short of money, they will be able, in limited circumstances, to direct the scheme to withhold benefits and pay the tax due on the pension directly to HMRC. Executors who have received clearance for the estate will be discharged from liability for a pension discovered later, if HMRC is satisfied they made every effort to find the deceased’s pensions.</p>
<h2>What families can do now</h2>
<p>Nothing changes for deaths before 6 April 2027, and a pot left to a spouse stays exempt. For a single person or the second of a couple, the reform makes the order of spending matter more. Drawing on the pension and keeping other savings, rather than the opposite, now affects the size of the estate in the same way. Lifetime gifts from pension income can fall under ${h.a('inheritance-tax-gifts', 'normal expenditure out of income')} if they are regular and affordable. A financial adviser can model the options; this page and the ${h.a('inheritance-tax-calculator', 'calculator')} show the Inheritance Tax side only, and do not include the Income Tax a beneficiary may pay when drawing an inherited pension.</p>
<h2>Keeping the paperwork in order</h2>
<p>Because executors will carry the reporting duty, a list of every pension, with the provider, the policy number and the latest statement, kept with the will, will save time. Expression of wish forms still guide the trustees on who receives the money; they do not take the pot out of the estate for deaths from 6 April 2027. Review them anyway: a form naming a spouse keeps the first-death exemption, while one naming children brings the pot into the estate at once. Note any old workplace schemes from earlier jobs, because a forgotten pot found after clearance is exactly the case the discharge rule covers, and tracing it late delays the estate.</p>`;
  },
});
