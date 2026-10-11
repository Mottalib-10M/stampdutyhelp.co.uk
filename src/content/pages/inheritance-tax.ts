import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { iht } from '../../lib/engine/wealth';

const I = P.wealth.iht;
const terrace = iht({ estate: 620000 });
const terraceKids = iht({ estate: 620000, homeToDescendants: 380000 });

export default definePage({
  id: 'inheritance-tax',
  group: 'inheritance',
  order: 20,
  slug: 'inheritance-tax',
  nav: 'How Inheritance Tax works',
  card: `Who pays, when, at ${pct(I.rate)} or ${pct(I.charity_rate)}, and what Business and Agricultural Relief still remove.`,
  title: 'Inheritance Tax 2026: Rates, Who Pays and the Deadline',
  description: `Inheritance Tax in 2026: ${pct(I.rate)} above the bands, ${pct(I.charity_rate)} with a charity gift, due within ${I.pay_months} months. A ${gbp(620000)} estate pays ${gbp(terrace.tax)} without the residence band.`,
  h1: 'How Inheritance Tax works in 2026',
  intro: 'A tax on what someone leaves, paid by the executor out of the estate, at one rate above the tax-free bands.',
  resume: `Inheritance Tax is charged on the estate of someone who has died: their property, money and possessions, less debts. Nothing is due on the first ${gbp(I.nil_rate_band)}, the nil-rate band, or on anything left to a spouse, civil partner or charity; above that the rate is ${pct(I.rate)}, reduced to ${pct(I.charity_rate)} on some assets when at least ${pct(I.charity_share)} of the net estate goes to charity. Leaving a home to children or grandchildren adds up to ${gbp(I.residence_nil_rate_band)} of residence band, so a widower’s ${gbp(620000)} estate including a ${gbp(380000)} terraced house costs ${gbp(terraceKids.tax)} when the children inherit it, against ${gbp(terrace.tax)} if it went to a nephew. The executor pays from the estate before sharing it out, by the end of the sixth month after the death. Beneficiaries do not pay tax on what they inherit, except on large gifts received in the giver’s last ${I.gift_years} years.`,
  faqs: [
    { q: 'Do I have to pay Inheritance Tax on money my father left me?', a: 'Not personally, in the usual case. The executor works out the bill on the whole estate and pays HMRC before handing anything over, so what reaches you is already net of the tax. You may owe other taxes later on what you do with the inheritance: Income Tax on rent from an inherited flat, or Capital Gains Tax if you sell it for more than its value at the date of death.' },
    { q: 'Can the house be sold to pay the Inheritance Tax?', a: `Yes, and that is common, but the first payment falls due before most sales complete. For land and buildings the executor can choose to pay in equal yearly instalments over ${I.instalment_years} years, usually with interest on the later ones, as long as the property is not sold. Some banks also release money from the deceased’s accounts directly to HMRC.` },
    { q: 'Is there Inheritance Tax between husband and wife?', a: 'No. Everything left to a spouse or civil partner who lives permanently in the UK passes free of Inheritance Tax, whatever the amount, and lifetime gifts between them are exempt too. The nil-rate band the first spouse did not use is not lost: the survivor’s executor can claim it, together with any unused residence band, when the second death happens.' },
    { q: 'I have lived in Dubai for twelve years. Is my estate still within UK Inheritance Tax?', a: `From 6 April 2025 the test is long-term residence. HMRC treats someone as based abroad if they lived in the UK for less than ${I.non_uk_long_term_years[0]} of the last ${I.non_uk_long_term_years[1]} years; then only UK assets, such as a London flat or a UK bank account, are taxed. Excluded assets such as foreign currency accounts and overseas pensions stay outside.` },
  ],
  mini: 'ihtSimple',
  miniHref: 'inheritance-tax-calculator',
  related: ['inheritance-tax-calculator', 'inheritance-tax-threshold', 'residence-nil-rate-band', 'inheritance-tax-gifts', 'inheritance-tax-on-pensions', 'inherited-property-stamp-duty'],
  sources: ['govIht', 'govIhtPay', 'govIhtThresholds', 'govApr', 'govBpr'],
  body: (h) => {
    const rows = [300000, 500000, 750000, 1000000, 1500000, 2500000].map((e) => [h.gbp(e), h.gbp(iht({ estate: e }).tax), h.gbp(iht({ estate: e, homeToDescendants: e }).tax), h.gbp(iht({ estate: e, homeToDescendants: e, transferredNrb: 1, transferredRnrb: 1 }).tax)]);
    return `
<h2>One rate, applied to the slice above the bands</h2>
<p>Unlike stamp duty, Inheritance Tax has no ladder of rates. The estate is valued, exempt legacies come off, the tax-free bands are deducted, and whatever is left pays ${h.pct(I.rate)}. GOV.UK’s own illustration is an estate of ${h.gbp(500000)} with a threshold of ${h.gbp(I.nil_rate_band)}: the tax is ${h.pct(I.rate)} of ${h.gbp(500000 - I.nil_rate_band)}, so ${h.gbp(iht({ estate: 500000 }).tax)}. The effective rate on the whole estate is lower than the headline: here ${h.pct(Math.round(iht({ estate: 500000 }).effectiveRate * 1000) / 1000)}.</p>
${h.table(['Estate after debts', 'Single, home not to children', 'Single, home to children', 'Widowed, both bands transferred'], rows, 'Inheritance Tax by estate size, 2026 to 2027 bands (whole estate counted as the home where it goes to children)', ['r', 'r', 'r', 'r'])}
<p>The table shows how much the family situation weighs. The ${h.a('inheritance-tax-threshold', 'threshold page')} explains where each band comes from, and the ${h.a('residence-nil-rate-band', 'residence band page')} why the right-hand columns rise again above ${h.gbp(I.taper_threshold)}.</p>
<h2>What goes into the estate</h2>
<p>The estate is everything the person owned at death at market value: the house or their share of it, bank and building society accounts, shares and investment funds, cars, jewellery, furniture, and money owed to them. Debts come off, including the mortgage, unpaid bills and reasonable funeral costs. Gifts made in the last ${I.gift_years} years are added back for the purpose of using up the nil-rate band, and a gift the person kept benefiting from, such as a house given to a son while the parent stayed on rent-free, counts as still owned. From 6 April 2027, unused pension funds also join the estate (${h.a('inheritance-tax-on-pensions', 'pensions and Inheritance Tax')}).</p>
<h2>The ${h.pct(I.charity_rate)} rate</h2>
<p>An estate that leaves ${h.pct(I.charity_share)} or more of its net value to charity in the will can pay ${h.pct(I.charity_rate)} instead of ${h.pct(I.rate)} on some assets. GOV.UK defines the net value as the estate’s total value minus any debts; the detailed test measures it after other exemptions and reliefs, so the executor needs the full account to know whether a legacy reaches the line. This site’s calculator does not apply the reduced rate, because the baseline needs the executor’s full figures.</p>
<h2>Who pays, and by when</h2>
<p>The executor named in the will, or the administrator if there is no will, values the estate, files the account with HMRC and pays from the estate’s money. Payment is due by the end of the sixth month after the death: someone who died in January has an estate that must pay by 31 July, and HMRC charges interest after that date. A payment towards the tax is usually needed before the grant of representation, called probate in England, Wales and Northern Ireland and confirmation in Scotland, which creates a well-known catch: the house cannot be sold until probate, but tax is due first. HMRC accepts payment from the deceased’s own bank, savings or investment accounts, an executor who pays from their own account can claim it back from the estate once probate is granted, and tax on land and buildings can be paid in ${I.instalment_years} equal yearly instalments, with interest on the later ones, for as long as the property is kept.</p>
<p>Beneficiaries do not normally pay. The exception is a lifetime gift: once someone has given away more than ${h.gbp(I.nil_rate_band)} in the ${I.gift_years} years before death, the people who received the later gifts pay the tax on them, reduced by taper relief if the gift was made ${I.gift_taper[0][0]} years or more before the death (${h.a('inheritance-tax-gifts', `gifts and the ${I.gift_years}-year rule`)}).</p>
<h2>Business and Agricultural Relief from April 2026</h2>
<p>A family company or a working farm can still pass on with little or no tax, but less freely than before. For deaths on or after 6 April 2026, 100% relief on qualifying business and agricultural property is limited to a combined ${h.gbp(I.apr_bpr_allowance)} per person; value above that receives ${h.pct(I.apr_bpr_excess_relief)} relief. A widow or widower can add the unused allowance of a spouse who died first, and if that spouse died before 6 April 2026 the full allowance is assumed to pass. Instalments on assets that qualify for these reliefs are interest-free for assets inherited from 6 April 2026.</p>
<h2>If the person lived abroad</h2>
<p>For deaths from 6 April 2025, the old domicile test has gone. HMRC treats someone as based abroad if they lived in the UK for fewer than ${I.non_uk_long_term_years[0]} of the previous ${I.non_uk_long_term_years[1]} years; their estate then pays UK Inheritance Tax only on UK assets, such as a flat in Manchester or an account with a British bank. A double taxation treaty can let the executor reclaim tax charged twice on the same asset.</p>
<h2>A family example</h2>
<p>Consider a widower in Nottingham whose wife died ten years earlier leaving everything to him. He owns a house worth ${h.gbp(420000)} and savings of ${h.gbp(380000)}, and leaves it all to his two daughters. His estate is ${h.gbp(800000)}. Because his wife’s estate used none of her bands, his executor claims both nil-rate bands and both residence bands: ${h.gbp(2 * I.nil_rate_band)} plus ${h.gbp(Math.min(420000, 2 * I.residence_nil_rate_band))}. The tax is ${h.gbp(iht({ estate: 800000, homeToDescendants: 420000, transferredNrb: 1, transferredRnrb: 1 }).tax)}. Had he left the house to his nephew, who is not a direct descendant, the residence band would be lost and the bill would be ${h.gbp(iht({ estate: 800000, transferredNrb: 1 }).tax)}.</p>
<h2>Taxes that follow the inheritance</h2>
<p>Inheritance Tax closes the estate, but the heirs’ own taxes start there. An inherited flat that is later sold triggers ${h.a('capital-gains-tax-on-property', 'Capital Gains Tax')} on the rise in value since the death, measured from the probate value. If it is let, the rent is taxed as ${h.a('rental-income-tax-calculator', 'rental income')}. And an heir who keeps an inherited share of a home and then buys another one may pay the ${h.a('inherited-property-stamp-duty', 'stamp duty surcharge')}, subject to the three-year rule for small inherited shares.</p>`;
  },
});
