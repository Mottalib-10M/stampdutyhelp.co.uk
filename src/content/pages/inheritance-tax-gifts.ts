import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { giftTax, iht } from '../../lib/engine/wealth';

const I = P.wealth.iht;
const taper = I.gift_taper as Array<[number, number]>;
const sallyFriend = giftTax(100000, 3, 325000);

export default definePage({
  id: 'inheritance-tax-gifts',
  group: 'inheritance',
  order: 50,
  slug: 'gift-tax-uk',
  nav: 'Gifts and the 7-year rule',
  card: `No gift tax as such, but gifts within ${I.gift_years} years of death can be taxed, from ${pct(I.rate)} down to ${pct(taper[taper.length - 1][1])}.`,
  title: `Gift Tax 2026: the ${I.gift_years}-Year Rule and Tax-Free Allowances`,
  description: `Gift tax in 2026: no tax when you give, but Inheritance Tax if you die within ${I.gift_years} years, tapered to ${pct(taper[1][1])} after ${taper[0][0]} years. ${gbp(I.annual_exemption)} a year is outside the count.`,
  h1: `Gifts and Inheritance Tax: the ${I.gift_years}-year rule`,
  intro: `Giving money or a house away costs nothing on the day; the question is what happens if the giver dies within ${I.gift_years} years.`,
  resume: `The United Kingdom has no separate gift tax. A gift of money, shares or property to a child or friend is a “potentially exempt transfer”: it costs nothing when it is made, and it falls out of the reckoning altogether if the giver lives for another ${I.gift_years} years. If the giver dies sooner, the gift is added back and uses the ${gbp(I.nil_rate_band)} nil-rate band first. Once gifts in those ${I.gift_years} years exceed the band, the recipient pays Inheritance Tax on the excess at ${pct(I.rate)} for gifts made within ${taper[0][0]} years of death, then ${taper.slice(1).map(([, r]) => pct(r)).join(', ')} as the years pass. Several gifts never count: ${gbp(I.annual_exemption)} a year in total, any number of ${gbp(I.small_gift)} gifts to different people, wedding gifts up to ${gbp(I.wedding_child)} for a child, regular gifts out of surplus income, and anything given to a spouse or charity. A gift of a home the giver keeps living in rent-free is not a gift at all for this purpose.`,
  faqs: [
    { q: 'I gave my son £20,000 for a house deposit. Does he need to tell HMRC?', a: `No. There is nothing to report when the gift is made, by either of you. Keep a note of the date and amount: if you die within ${I.gift_years} years, your executor must list gifts on the Inheritance Tax account. The first ${gbp(I.annual_exemption)} is covered by that year’s exemption, or ${gbp(2 * I.annual_exemption)} if last year’s was unused, and the rest uses your nil-rate band.` },
    { q: 'Does taper relief reduce the value of the gift?', a: `No, it reduces the tax rate, and only on the part of the gifts above the nil-rate band. A gift that fits within the ${gbp(I.nil_rate_band)} band pays nothing whenever it was made, so taper relief does nothing for it. It helps only when gifts in the last ${I.gift_years} years together go beyond the band and the excess was given ${taper[0][0]} or more years before the death.` },
    { q: 'Can my parents give me their house and keep living in it?', a: `They can, but for Inheritance Tax the house stays in their estate unless they pay you a market rent and their share of the bills. HMRC calls it a gift with reservation of benefit, and the clock never starts. There is an exception where only part of the property is given and the new owners live there too.` },
    { q: 'Is there Capital Gains Tax when I give away a flat?', a: `Often, yes. A gift to anyone except a spouse, civil partner or charity counts as a disposal at market value, so the giver may owe Capital Gains Tax on the rise in value as if the flat had been sold, with no sale proceeds to pay it from. For a UK residential property that tax must be reported and paid within ${P.wealth.cgt.report_days_residential} days.` },
  ],
  mini: 'giftTaper',
  miniHref: 'inheritance-tax-calculator',
  related: ['inheritance-tax-calculator', 'inheritance-tax-threshold', 'residence-nil-rate-band', 'capital-gains-tax-on-property', 'transfer-of-equity-stamp-duty', 'inheritance-tax'],
  sources: ['govIht', 'govCgt', 'govSdltTransfers'],
  body: (h) => {
    let from = 0;
    const rows = taper.map(([under, rate]) => { const r = [from === 0 ? `Less than ${under} years` : `${from} to ${under} years`, h.pct(rate), h.gbp(giftTax(500000, from, 0).tax)]; from = under; return r; });
    rows.push([`${I.gift_years} years or more`, h.pct(0), h.gbp(0)]);
    return `
<h2>The taper relief table</h2>
${h.table(['Time between gift and death', 'Rate on the part above the band', `Tax on a ${h.gbp(500000)} gift, no earlier gifts`], rows, 'Inheritance Tax on gifts, with taper relief', ['l', 'r', 'r'])}
<p>The third column shows why taper relief disappoints many families. On a ${h.gbp(500000)} gift, the first ${h.gbp(I.nil_rate_band)} is covered by the band whatever happens; only the remaining ${h.gbp(500000 - I.nil_rate_band)} is taxed, and the taper lowers the rate on that slice. Taper relief only matters at all when the gifts of the last ${I.gift_years} years together exceed the nil-rate band.</p>
<h2>Gifts that never count</h2>
<ul>
<li><strong>Annual exemption</strong>: ${h.gbp(I.annual_exemption)} of gifts in each tax year, to one person or split. An unused exemption can be carried forward one year only, so ${h.gbp(2 * I.annual_exemption)} at most in one year.</li>
<li><strong>Small gifts</strong>: any number of gifts up to ${h.gbp(I.small_gift)} per person per tax year, as long as no other allowance is used on the same person.</li>
<li><strong>Wedding or civil partnership gifts</strong>: up to ${h.gbp(I.wedding_child)} to a child, ${h.gbp(I.wedding_grandchild)} to a grandchild or great-grandchild, ${h.gbp(I.wedding_other)} to anyone else. They can be combined with the annual exemption.</li>
<li><strong>Normal expenditure out of income</strong>: regular payments from income, such as paying a child’s rent or into a savings account for a grandchild, with no upper limit, provided the giver can still meet their usual living costs.</li>
<li><strong>Spouse, civil partner, charities and political parties</strong>: exempt without limit, if the spouse lives permanently in the UK.</li>
</ul>
<p>GOV.UK gives the example of Mark, who gave ${h.gbp(2000)} to one daughter in one tax year and ${h.gbp(4000)} to the other the next. The second gift used that year’s ${h.gbp(I.annual_exemption)} and the ${h.gbp(I.annual_exemption - 2000)} left over from the year before, so neither gift could ever be taxed.</p>
<h2>Stacking allowances on one person</h2>
<p>Most allowances can be combined for the same recipient, which matters when a parent helps a child buy a first home. GOV.UK confirms that a child getting married can receive ${h.gbp(I.wedding_child)} as a wedding gift and ${h.gbp(I.annual_exemption)} under the annual exemption in the same tax year, and that a regular ${h.gbp(60)} a month from income, ${h.gbp(720)} over the year, can sit alongside the annual exemption too. The one exception is the small gifts allowance: a ${h.gbp(I.small_gift)} gift cannot be added to any other allowance used on the same person.</p>
<p>Take parents in Bristol who give their daughter ${h.gbp(40000)} towards a deposit in the year of her wedding, with last year’s annual exemptions unused. Each parent has ${h.gbp(2 * I.annual_exemption)} of annual exemption available and ${h.gbp(I.wedding_child)} of wedding allowance, so ${h.gbp(2 * (2 * I.annual_exemption + I.wedding_child))} of the gift falls outside Inheritance Tax for good. The remaining ${h.gbp(40000 - 2 * (2 * I.annual_exemption + I.wedding_child))}, split between them, uses part of each parent’s nil-rate band only if that parent dies within ${I.gift_years} years. The daughter then pays ${h.a('stamp-duty-first-time-buyer', 'stamp duty as a first-time buyer')} on her purchase in the usual way; the source of the deposit does not change it.</p>
<h2>Who pays, worked through</h2>
<p>The order of gifts decides who carries the tax. GOV.UK’s example is Sally, unmarried, who died having made three gifts: ${h.gbp(50000)} to her brother nine years earlier, ${h.gbp(325000)} to her sister four years and two months before her death, and ${h.gbp(100000)} to a friend three years before it. The brother’s gift is outside the ${I.gift_years} years and ignored. The sister’s gift fits exactly inside the nil-rate band, so it pays nothing even though it was made within the period. The friend’s gift comes after the band is used up and is taxed at the tapered rate of ${h.pct(sallyFriend.rate)}: the friend owes ${h.gbp(sallyFriend.tax)}. Sally’s remaining estate of ${h.gbp(400000)} has no band left and pays ${h.gbp(iht({ estate: 400000, gifts: 425000 }).tax)}.</p>
<p>Two lessons follow. Recipients can face a bill years after spending the money, so it is worth telling them that a gift above the band is not final until the period has run. And because the band is used in date order, an early gift to one child can leave a later one paying the tax.</p>
<h2>Giving away property</h2>
<p>Handing a house or a share of one to a child is a gift like any other for Inheritance Tax, with the same clock. Two more taxes come into it. Capital Gains Tax treats a gift to anyone other than a spouse or charity as a sale at market value, so a parent who gives away a buy-to-let flat may owe tax on the rise in value since purchase (${h.a('capital-gains-tax-on-property', 'CGT on property')}), and must report it within ${h.P.wealth.cgt.report_days_residential} days. Stamp duty is usually nil for the child: a gift with no money changing hands is not taxed, but if the child takes over part of a mortgage the debt counts as the price (${h.a('transfer-of-equity-stamp-duty', 'transfer of equity')}).</p>
<p>A parent who gives a home away and continues living there without paying a market rent keeps it in their estate as a gift with reservation; the ${I.gift_years}-year rule never begins. GOV.UK’s other examples of the trap include giving away a caravan while still using it for free holidays, or a painting that stays on the giver’s wall.</p>
<h2>Keeping records</h2>
<p>The executor has to reconstruct ${I.gift_years} years of giving, often from bank statements. A short list kept with the will, with the date, the recipient, the amount or value and the exemption used, saves weeks of work and avoids double counting. For gifts of property, add the valuation used, because it fixes both the Inheritance Tax figure and the recipient’s base cost for a later sale.</p>`;
  },
});
