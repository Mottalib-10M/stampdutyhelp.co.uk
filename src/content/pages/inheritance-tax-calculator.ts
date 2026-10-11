import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { iht } from '../../lib/engine/wealth';

const I = P.wealth.iht;
const ex1 = iht({ estate: 500000 });
const flatCase = iht({ estate: 1000000, homeToDescendants: 100000, exempt: 500000 });
const family = iht({ estate: 850000, homeToDescendants: 400000 });
const couple = iht({ estate: 850000, homeToDescendants: 400000, transferredNrb: 1, transferredRnrb: 1 });

export default definePage({
  id: 'inheritance-tax-calculator',
  group: 'inheritance',
  order: 10,
  slug: 'inheritance-tax-calculator',
  nav: 'Inheritance Tax calculator',
  card: `Estate, home left to children, gifts, a late spouse’s bands and the pension pot from April 2027: the bill at ${pct(I.rate)}.`,
  title: 'Inheritance Tax Calculator 2026: Estate, Home and Gifts',
  description: `Inheritance Tax calculator for 2026: ${gbp(I.nil_rate_band)} nil-rate band, ${gbp(I.residence_nil_rate_band)} residence band, the taper, gifts and pensions. A ${gbp(850000)} estate pays ${gbp(family.tax)} in tax.`,
  h1: 'Inheritance Tax calculator',
  intro: 'Enter what the estate is worth and who inherits the home, and see each tax-free band HMRC applies before the 40% rate.',
  resume: `Inheritance Tax is charged at ${pct(I.rate)} on the part of an estate above the tax-free bands. Everyone has a nil-rate band of ${gbp(I.nil_rate_band)}, and a residence nil-rate band of up to ${gbp(I.residence_nil_rate_band)} is added when a home, or a share of one, goes to children or grandchildren. A widow or widower can also use whatever share of those bands a late spouse left unused. So a single parent leaving an ${gbp(850000)} estate, including a ${gbp(400000)} house, to the children pays ${gbp(family.tax)}, while the same estate pays ${gbp(couple.tax)} if a late spouse’s bands are fully available. The residence band shrinks by ${gbp(1)} for every ${gbp(1 / I.taper_ratio)} the estate is worth above ${gbp(I.taper_threshold)}. Gifts made in the ${I.gift_years} years before death use the nil-rate band first. For deaths on or after 6 April 2027, unused pension funds join the estate. The calculator applies all of this with the thresholds HMRC publishes for 2026 to 2027.`,
  faqs: [
    { q: 'What value should I enter for the estate?', a: 'Everything the person owned at death at market value: the house, savings, investments, cars and possessions, plus their share of anything jointly owned, minus debts such as the mortgage, unpaid bills and reasonable funeral costs. Do not deduct what goes to a spouse or charity here; the calculator has a separate box for that, because the taper is worked out on the value before exemptions.' },
    { q: 'My mother left her house to me and my brother in equal shares. Does the residence band apply?', a: `Yes. The home, or a share of it, has to pass to direct descendants, and two children inheriting it together qualifies. The band applies up to the value of the home and never above ${gbp(I.residence_nil_rate_band)} on its own estate. If the house is worth less than the band, the unused part cannot be set against savings, though it can pass to a surviving spouse.` },
    { q: 'Why does the result change when I pick a date of death after April 2027?', a: `Because unused pension funds and most pension death benefits count as part of the estate for deaths on or after 6 April 2027. Before that date most discretionary pension schemes sit outside it. On a ${gbp(400000)} estate with a ${gbp(200000)} pension, the bill goes from ${gbp(iht({ estate: 400000, pension: 200000 }).tax)} to ${gbp(iht({ estate: 400000, pension: 200000, deathFromApril2027: true }).tax)}.` },
  ],
  tool: 'iht',
  related: ['inheritance-tax-threshold', 'residence-nil-rate-band', 'inheritance-tax-gifts', 'inheritance-tax-on-pensions', 'inheritance-tax', 'inherited-property-stamp-duty'],
  sources: ['govIht', 'govIhtThresholds', 'govRnrb', 'govIhtPensions', 'govIhtPay'],
  body: (h) => `
<h2>What the calculator asks</h2>
<p>Seven inputs cover most family estates. The <strong>estate</strong> is the net value after debts. The <strong>home left to children or grandchildren</strong> decides how much of the residence band applies. Anything left to a <strong>spouse, civil partner or charity</strong> is exempt and comes off before the bands. <strong>Gifts</strong> made in the last ${I.gift_years} years, after the annual and other exemptions, eat into the nil-rate band first. The <strong>late spouse</strong> question adds the unused share of their bands, which HMRC lets a survivor claim. The <strong>date of death</strong> and the <strong>pension pot</strong> handle the change of April 2027.</p>
<h2>Checked against HMRC’s own examples</h2>
<p>GOV.UK’s simplest case is an estate of ${h.gbp(500000)} with only the basic threshold: tax is ${h.pct(I.rate)} of ${h.gbp(ex1.chargeable)}, which is ${h.gbp(ex1.tax)}, and the calculator returns the same figure. HMRC’s residence band guidance gives a harder one: a woman leaves a flat worth ${h.gbp(100000)} and ${h.gbp(400000)} of other assets to her son, and ${h.gbp(500000)} to her husband. Only ${h.gbp(flatCase.rnrb)} of residence band applies, because that is what the flat is worth, so ${h.gbp(flatCase.chargeable)} is taxed and ${h.gbp(flatCase.unusedRnrb)} of residence band is left for the husband’s estate. The ${h.a('residence-nil-rate-band', 'residence band page')} replays every example in HMRC’s guidance, including the taper.</p>
${h.table(['Estate', 'Home to children', 'Late spouse’s bands', 'Inheritance Tax'], [
    [h.gbp(500000), h.gbp(0), 'none', h.gbp(iht({ estate: 500000 }).tax)],
    [h.gbp(650000), h.gbp(300000), 'none', h.gbp(iht({ estate: 650000, homeToDescendants: 300000 }).tax)],
    [h.gbp(850000), h.gbp(400000), 'none', h.gbp(family.tax)],
    [h.gbp(850000), h.gbp(400000), 'fully unused', h.gbp(couple.tax)],
    [h.gbp(1200000), h.gbp(500000), 'fully unused', h.gbp(iht({ estate: 1200000, homeToDescendants: 500000, transferredNrb: 1, transferredRnrb: 1 }).tax)],
    [h.gbp(2200000), h.gbp(900000), 'fully unused', h.gbp(iht({ estate: 2200000, homeToDescendants: 900000, transferredNrb: 1, transferredRnrb: 1 }).tax)],
  ], 'Inheritance Tax on typical estates, 2026 to 2027 thresholds', ['r', 'r', 'l', 'r'])}
<h2>What the result does not include</h2>
<p>Business Relief and Agricultural Relief can take farm land or shares in a trading company out of the estate, at 100% up to a combined ${h.gbp(I.apr_bpr_allowance)} for deaths from 6 April 2026 and at 50% above it; enter the estate after those reliefs. The ${h.pct(I.charity_rate)} rate for estates leaving at least ${h.pct(I.charity_share)} of their net value to charity is not applied. Gifts that themselves exceed the nil-rate band are taxed on the people who received them, with taper relief; the ${h.a('inheritance-tax-gifts', 'gifts calculator')} works out that part. Trusts follow their own rules.</p>
<h2>After the figure: paying it</h2>
<p>The executor pays from the estate, and the tax is due by the end of the sixth month after the death: a death in March means payment by the end of September. Tax on a house can be spread over ${I.instalment_years} yearly instalments. If the heirs later sell the house, any rise in value since the death falls under ${h.a('capital-gains-tax-on-property', 'Capital Gains Tax')}, and a child who keeps an inherited share and buys another home should check the ${h.a('inherited-property-stamp-duty', 'stamp duty rules on inherited property')}.</p>`,
});
