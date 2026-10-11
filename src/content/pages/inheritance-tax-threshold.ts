import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { iht } from '../../lib/engine/wealth';

const I = P.wealth.iht;
const single = I.nil_rate_band + I.residence_nil_rate_band;
const couple = 2 * single;
const coupleTax = iht({ estate: 1100000, homeToDescendants: 600000, transferredNrb: 1, transferredRnrb: 1 });

export default definePage({
  id: 'inheritance-tax-threshold',
  group: 'inheritance',
  order: 30,
  slug: 'inheritance-tax-threshold',
  nav: 'Inheritance Tax threshold',
  card: `${gbp(I.nil_rate_band)} for everyone, ${gbp(single)} with a home to children, ${gbp(couple)} for a couple: how the bands stack.`,
  title: `Inheritance Tax Threshold 2026: ${gbp(I.nil_rate_band)} Up to ${gbp(couple)}`,
  description: `Inheritance Tax threshold for 2026: ${gbp(I.nil_rate_band)} each, ${gbp(single)} with the home to children and ${gbp(couple)} for a married couple. It stays frozen until 5 April 2031.`,
  h1: `The Inheritance Tax threshold, from ${gbp(I.nil_rate_band)} to ${gbp(couple)}`,
  intro: 'Four bands can stack up: two nil-rate bands and two residence bands, if the family and the will line up.',
  resume: `The basic Inheritance Tax threshold, the nil-rate band, is ${gbp(I.nil_rate_band)} per person. It has not moved since 6 April 2009 and HMRC’s table now fixes it until 5 April 2031. On top of it sits the residence nil-rate band of up to ${gbp(I.residence_nil_rate_band)}, available when a home goes to children or grandchildren, which raises one person’s threshold to ${gbp(single)}. Married couples and civil partners can pass whatever share of both bands the first to die did not use, so the survivor’s estate can reach ${gbp(couple)} before any tax at ${pct(I.rate)}. That full figure needs three things: the first estate left everything to the spouse, a home worth at least ${gbp(2 * I.residence_nil_rate_band)} goes to direct descendants on the second death, and the combined estate stays at or below ${gbp(I.taper_threshold)}, where the residence bands start to taper away. A couple’s ${gbp(1100000)} estate with a ${gbp(600000)} house therefore pays ${gbp(coupleTax.tax)}.`,
  faqs: [
    { q: 'Has the Inheritance Tax threshold gone up with inflation?', a: `No. The nil-rate band has been ${gbp(I.nil_rate_band)} since 6 April 2009, and HMRC’s published table extends it unchanged to 5 April 2031. The residence band has stayed at ${gbp(I.residence_nil_rate_band)} since 6 April 2020. With house prices rising over the same period, more estates cross the line each year without anyone’s wealth changing in real terms.` },
    { q: 'Does leaving the house to my stepdaughter count for the residence band?', a: `Yes. For the residence band HMRC counts as direct descendants a stepchild whose parent is or was your spouse or civil partner, an adopted or fostered child, a child you were guardian of before 18, grandchildren, and the spouses of all of them. Nephews, nieces and siblings are excluded, so a house left to them uses only the ${gbp(I.nil_rate_band)} band.` },
    { q: 'We are not married but have lived together for twenty years. Do we get the couple’s threshold?', a: `No. The spouse exemption and the transfer of unused bands apply only to marriage and civil partnership. An unmarried partner who inherits the house is taxed like any other beneficiary above the survivor’s own ${gbp(I.nil_rate_band)}, and a partner is not a direct descendant, so the residence band does not apply either.` },
    { q: 'Does the threshold apply to each child who inherits?', a: 'No. The bands belong to the person who died and are applied once to the whole estate, however many people share it. Three children inheriting equally share the benefit of one set of bands; the tax is paid by the estate before the shares are divided, so each child receives a third of what is left.' },
  ],
  mini: 'ihtThreshold',
  miniHref: 'inheritance-tax-calculator',
  related: ['inheritance-tax-calculator', 'residence-nil-rate-band', 'inheritance-tax', 'inheritance-tax-gifts', 'inheritance-tax-on-pensions'],
  sources: ['govIhtThresholds', 'govIht', 'govRnrb'],
  body: (h) => {
    const sit = (label: string, i: Parameters<typeof iht>[0]) => { const r = iht(i); return [label, h.gbp(r.nrb + r.rnrb), h.gbp(r.tax)]; };
    return `
<h2>The four building blocks</h2>
${h.table(['Band', 'Amount', 'Condition'], [
      ['Nil-rate band', h.gbp(I.nil_rate_band), 'everyone, applied first to gifts of the last ' + I.gift_years + ' years'],
      ['Residence nil-rate band', h.gbp(I.residence_nil_rate_band), 'a home or share of one left to direct descendants'],
      ['Late spouse’s nil-rate band', `up to ${h.gbp(I.nil_rate_band)}`, 'the share they left unused'],
      ['Late spouse’s residence band', `up to ${h.gbp(I.residence_nil_rate_band)}`, 'the share they left unused, after their own taper'],
    ], 'Inheritance Tax bands for deaths in 2026 to 2027', ['l', 'r', 'l'])}
<p>The order matters only at the edges. The residence band is deducted from the estate first, then the remaining nil-rate band. Gifts in the last ${I.gift_years} years cannot use the residence band, so a large gift can swallow the nil-rate band while leaving the residence band intact for the house.</p>
<h2>Thresholds for common situations</h2>
${h.table(['Situation', 'Threshold', `Tax on a ${h.gbp(900000)} estate`], [
      sit('Single, no home to descendants', { estate: 900000 }),
      sit(`Single, home of ${h.gbp(400000)} to children`, { estate: 900000, homeToDescendants: 400000 }),
      sit('Widowed, everything left by the late spouse', { estate: 900000, homeToDescendants: 400000, transferredNrb: 1, transferredRnrb: 1 }),
      sit('Widowed, late spouse left half to children', { estate: 900000, homeToDescendants: 400000, transferredNrb: 0.5, transferredRnrb: 0.5 }),
      sit('Widowed, home left to a nephew', { estate: 900000, transferredNrb: 1, transferredRnrb: 1 }),
    ], 'Thresholds computed with the 2026 to 2027 bands', ['l', 'r', 'r'])}
<p>The last line is worth reading twice. A nephew is not a direct descendant, so neither the survivor’s residence band nor the transferred one applies, even though both exist on paper. Children include adopted, foster and stepchildren, grandchildren count too, and so does the spouse of any of them.</p>
<h2>How a transfer between spouses works</h2>
<p>What passes is a percentage, not an amount. If the first spouse’s will left ${h.gbp(65000)} to a brother and everything else to the survivor, ${h.pct(65000 / I.nil_rate_band)} of the nil-rate band was used and ${h.pct(1 - 65000 / I.nil_rate_band)} is left. On the second death that percentage is applied to the band in force then, which is ${h.gbp(I.nil_rate_band)} for deaths up to 5 April 2031. The executor claims it on the Inheritance Tax account; nothing is automatic, and the first spouse’s will and estate figures are needed, sometimes decades later. Keep them with the survivor’s papers.</p>
<p>The same percentage method applies to the residence band, with one twist: if the first estate was above ${h.gbp(I.taper_threshold)}, its own taper reduces what can be passed on, even if the house went to the surviving spouse and no residence band was used at all. HMRC works through that case in its guidance, and the ${h.a('residence-nil-rate-band', 'residence band page')} reproduces it.</p>
<h2>Where the ${h.gbp(couple)} figure comes from, and where it stops</h2>
<p>The couple’s maximum is ${h.gbp(I.nil_rate_band)} twice plus ${h.gbp(I.residence_nil_rate_band)} twice. In practice it is reached only when the home left to the children is worth at least ${h.gbp(2 * I.residence_nil_rate_band)} and the survivor’s estate is no larger than ${h.gbp(I.taper_threshold)}. Above that, the residence bands shrink by half of the excess, and at ${h.gbp(I.taper_threshold + 2 * 2 * I.residence_nil_rate_band)} they have gone entirely, leaving the two nil-rate bands of ${h.gbp(2 * I.nil_rate_band)}.</p>
${h.table(['Survivor’s estate', 'Threshold', 'Inheritance Tax'], [1000000, 1500000, 2000000, 2200000, 2400000, 2700000].map((e) => { const r = iht({ estate: e, homeToDescendants: 700000, transferredNrb: 1, transferredRnrb: 1 }); return [h.gbp(e), h.gbp(r.nrb + r.rnrb), h.gbp(r.tax)]; }), `Widowed parent leaving a ${h.gbp(700000)} home and the rest to the children`, ['r', 'r', 'r'])}
<h2>A couple’s two deaths, step by step</h2>
<p>Take a married couple in Norwich who own their house jointly, worth ${h.gbp(700000)}, and have ${h.gbp(300000)} of savings between them. HMRC looks at each person’s estate separately when each dies, including each one’s share of the jointly owned home. When the husband dies, his half of the house and his half of the savings, ${h.gbp(500000)} in all, pass to his wife under his will, except a legacy of ${h.gbp(65000)} to his brother. The legacy to the brother uses ${h.pct(65000 / I.nil_rate_band)} of his nil-rate band; everything else is exempt because it goes to his wife; no residence band is used because the house did not go to descendants. His estate pays nothing.</p>
<p>Years later the widow dies, leaving the whole house and the remaining ${h.gbp(235000)} of savings to their two children: an estate of ${h.gbp(935000)}. Her executor claims her own bands, ${h.pct(1 - 65000 / I.nil_rate_band)} of her husband’s nil-rate band and all of his residence band. The available threshold is ${h.gbp(iht({ estate: 935000, homeToDescendants: 700000, transferredNrb: 1 - 65000 / I.nil_rate_band, transferredRnrb: 1 }).nrb + iht({ estate: 935000, homeToDescendants: 700000, transferredNrb: 1 - 65000 / I.nil_rate_band, transferredRnrb: 1 }).rnrb)}, and the tax is ${h.gbp(iht({ estate: 935000, homeToDescendants: 700000, transferredNrb: 1 - 65000 / I.nil_rate_band, transferredRnrb: 1 }).tax)}. Without the claim for the husband’s unused bands, it would be ${h.gbp(iht({ estate: 935000, homeToDescendants: 700000 }).tax)}. That difference rests entirely on the executor finding the husband’s will and the value of the legacy.</p>
<h2>What does not raise the threshold</h2>
<p>Several things people expect to help do not. The number of children makes no difference: the bands belong to the person who died, not to each heir. Leaving the home to children in trust until they reach a certain age loses the residence band, because they must become entitled to it on the death. Living together without marrying or entering a civil partnership gives no transfer of bands. Selling the house before death and leaving cash does not automatically keep the residence band either: it survives only through the downsizing rules, which need the figures of the home that was sold. Finally, the residence band never covers lifetime gifts. Someone who gave away more than ${h.gbp(I.nil_rate_band)} in the ${I.gift_years} years before death has no nil-rate band left for the estate, and the residence band, though still available, cannot make up the gap on anything except the value of the home passing to descendants.</p>
<h2>Gifts and the threshold</h2>
<p>Gifts made within ${I.gift_years} years of death are measured against the nil-rate band first, in date order. A father who gave his daughter ${h.gbp(200000)} towards a flat four years before he died has only ${h.gbp(I.nil_rate_band - 200000)} of nil-rate band left for his estate. The gift itself pays nothing, because it fits within the band, but the estate pays more. The annual exemption of ${h.gbp(I.annual_exemption)}, the wedding allowances and regular gifts from income sit outside this count; the ${h.a('inheritance-tax-gifts', 'gifts page')} lists them.</p>
<h2>Thresholds and the family home</h2>
<p>A buyer who uses a parent’s gift for a deposit pays ${h.a('stamp-duty-first-time-buyer', 'stamp duty')} on the purchase as usual, and the gift starts its own ${I.gift_years}-year clock for the parent. When the parent dies, the residence band follows the home they owned at death, so the house left to the children carries ${h.gbp(I.residence_nil_rate_band)} of relief with it. Selling a family home to move into a smaller flat does not lose the band; HMRC’s calculator has a route for downsizing.</p>`;
  },
});
