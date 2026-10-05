import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, compute } from '../../lib/kit';

const S = P.sdlt, L = P.lbtt, W = P.ltt;
const NEXT = 320000;
const SHARE_MAX = S.inherited_share_max, YEARS = S.inherited_years;
/** Scotland: a share held worth less than this does not count for the ADS since 1 April 2024 (same figure as the ADS floor). */
const SCOT_SMALL = L.ads_share_ignored_below;

export default definePage({
  id: 'inherited-property-stamp-duty',
  group: 'situations',
  order: 70,
  slug: 'inherited-property-stamp-duty',
  nav: 'Inherited property',
  card: `No tax on what you inherit, but the inherited home can cost you the surcharge, or your first-time buyer relief, on your next purchase.`,
  title: 'Inherited Property Stamp Duty 2026: Shares and Surcharge',
  description: `Inherited property and stamp duty in 2026: nothing to pay on the inheritance, but a ${gbp(NEXT)} purchase can jump from ${gbp(t('england', NEXT))} to ${gbp(t('england', NEXT, 'additional'))} of SDLT in England.`,
  h1: 'Stamp duty and inherited property',
  intro: 'Receiving a home under a will is free of purchase tax. The cost appears later, when you buy a home of your own while still holding the inherited one.',
  resume: `Inheriting a house or a share of one carries no SDLT, LBTT or LTT, because nothing is paid for it, and HMRC requires no SDLT return. The inheritance matters on your next purchase. If you still own the inherited property at the end of completion day, you may own two dwellings, and a ${gbp(NEXT)} home then costs ${gbp(t('england', NEXT, 'additional'))} in England instead of ${gbp(t('england', NEXT))}. England, Northern Ireland and Wales soften this: a share of ${pct(SHARE_MAX)} or less, counting a spouse’s share with yours, is ignored for ${YEARS} years after you inherit it. Scotland is stricter, since an inherited dwelling counts for the ${pct(L.ads_rate)} ADS, ${gbp(compute({ nation: 'scotland', price: NEXT, situation: 'additional' }).surcharge)} at that price; since 1 April 2024 it is ignored if received between contract and completion, or if your share is worth less than ${gbp(SCOT_SMALL)}. Inheriting a home also ends first-time buyer status for good, which costs a ${gbp(400000)} buyer in England ${gbp(t('england', 400000) - t('england', 400000, 'first'))} of relief.`,
  faqs: [
    { q: 'Do I have to pay stamp duty when a house is left to me in a will?', a: `No. Property passing to you under a will is not bought, so there is no chargeable consideration and nothing to pay. HMRC lists inheritance among the transfers that need no SDLT return. Inheritance tax is a separate matter dealt with by the executors and is not covered by this site.` },
    { q: 'I inherited a third of my aunt’s house last year. Will I pay the higher rates on my first flat?', a: `In England, Northern Ireland and Wales, not because of that share: a share of ${pct(SHARE_MAX)} or less inherited within the last ${YEARS} years is ignored. You do, however, lose first-time buyer relief, so a ${gbp(NEXT)} flat in England costs ${gbp(t('england', NEXT))} instead of ${gbp(t('england', NEXT, 'first'))}. In Scotland, the share counts for the ADS unless it is worth less than ${gbp(SCOT_SMALL)}.` },
    { q: 'My father died after we had signed missives for our new house in Glasgow. Does his house count for ADS?', a: `Not since 1 April 2024. Revenue Scotland relieves a buyer who becomes owner of an inherited dwelling between the date of the contract and the effective date of the purchase (paragraph 9B of Schedule 2A). Had you inherited before the missives were concluded, the house would count, and the ${pct(L.ads_rate)} supplement would apply unless your share were worth less than ${gbp(SCOT_SMALL)}.` },
    { q: 'My wife and I each inherited 30% of her parents’ house. Is that over the limit?', a: `Yes, for SDLT. Shares held by spouses and civil partners are added together for this test, so a combined ${pct(0.6)} exceeds the ${pct(SHARE_MAX)} limit and the inherited house counts as another dwelling. Your next purchase would be on the higher rates: ${gbp(t('england', NEXT, 'additional'))} on ${gbp(NEXT)}. Selling the inherited house before you complete keeps you on standard rates.` },
    { q: 'Can I avoid the surcharge by selling the inherited house after I buy?', a: `Not through the refund. The repayment of the surcharge is reserved for a buyer who replaces a main residence; an inherited house you never lived in is not one. Selling it after completion leaves the surcharge paid. To avoid it, the inherited property has to be sold before, or on the same day as, the completion of your new home, so that you own a single dwelling at the end of that day.` },
  ],
  mini: 'inheritedShare',
  related: ['stamp-duty-second-home', 'stamp-duty-first-time-buyer', 'additional-dwelling-supplement', 'ltt-higher-rates', 'stamp-duty-exemptions', 'stamp-duty-joint-purchase'],
  sources: ['sdltmInherited', 'govSdltHigher', 'rsAds', 'wraHigher', 'sdltmFtb'],
  body: (h) => {
    const shares = [0.25, SHARE_MAX, 0.75, 1];
    const rows = shares.map((sh) => {
      const ign = sh <= SHARE_MAX;
      return [h.pct(sh), ign ? 'Ignored' : 'Counts', h.gbp(h.t('england', NEXT, ign ? 'home' : 'additional')), h.gbp(h.t('wales', NEXT, ign ? 'home' : 'additional')), h.gbp(h.t('scotland', NEXT, 'additional'))];
    });
    return `
<h2>The inheritance itself is tax-free</h2>
<p>Purchase taxes are charged on what a buyer gives in exchange for land. A beneficiary under a will gives nothing, so when the executors transfer a house or a share of one to you, there is no consideration and no tax, in any of the three nations. HMRC lists property received under a will among the transfers that need no SDLT return at all. Executors who sell the house to a third party are a different case: the buyer of the house pays the tax in the ordinary way.</p>
<p>The cost of inheriting appears in two other places. It can make your next purchase an additional-property purchase, because you own the inherited home, and it ends your status as a first-time buyer, because you have now owned a dwelling. Both effects are permanent features of the rules rather than of the inheritance, and both can be managed with timing.</p>
<h2>England and Northern Ireland: the ${h.pct(SHARE_MAX)} and ${YEARS}-year rule</h2>
<p>The higher rates of SDLT apply when a buyer will own more than one dwelling at the end of completion day. A share of an inherited dwelling would normally count. HMRC makes an exception, set out in its manual at SDLTM09795: a share of ${h.pct(SHARE_MAX)} or less, inherited in the ${YEARS} years before the purchase, is ignored. The share is measured together with any share held by your spouse or civil partner, because the couple is one unit for these rules. After the ${YEARS} years, the share counts like any other property you own.</p>
${h.table(['Share inherited', 'SDLT / LTT test', 'England & NI', 'Wales', 'Scotland if it counts'], rows, `Tax on a ${h.gbp(NEXT)} purchase by a buyer whose only other property is the inherited share, inherited within ${YEARS} years`, ['l', 'l', 'r', 'r', 'r'])}
<p>The table assumes the buyer otherwise owns nothing, or is replacing a main residence. A buyer who keeps a home of their own and buys another is on the higher rates whatever the inherited share, because the home they keep triggers them anyway.</p>
<h3>Siblings sharing a parent’s house</h3>
<p>Three siblings inheriting a house in equal shares each hold a third, which is under the limit. Each of them can buy a home within ${YEARS} years without the inherited house pushing them onto the higher rates. Two siblings sharing equally are each exactly on the line at ${h.pct(SHARE_MAX)}, which is still ignored. A sole heir with the whole house is over the limit from the start and needs to sell before completing on a home of their own to stay on standard rates.</p>
<h3>Buying out a co-heir</h3>
<p>The inheritance is free, but a later deal between heirs is not. A sister who pays her brother ${h.gbp(150000)} for his half of their mother’s house is buying a share of a dwelling, and that price is chargeable like any ${h.a('transfer-of-equity-stamp-duty', 'transfer of equity')}: ${h.gbp(h.t('england', 150000))} of SDLT at standard rates in England, ${h.gbp(h.t('scotland', 150000))} of LBTT in Scotland and ${h.gbp(h.t('wales', 150000))} of LTT in Wales. Any mortgage she takes over is added to the price, and her other property may bring the surcharge into play, which her conveyancer checks on the facts.</p>
<h2>Wales follows the same rule</h2>
<p>The Welsh Revenue Authority applies the same treatment to Land Transaction Tax: an inherited share of ${h.pct(SHARE_MAX)} or less is ignored for the higher rates for ${YEARS} years. Because Wales has its own higher-rates table, the price of failing the test is different: on a ${h.gbp(NEXT)} purchase the higher rates cost ${h.gbp(h.t('wales', NEXT, 'additional'))} against ${h.gbp(h.t('wales', NEXT))} at the main rates. Wales has no first-time buyer relief, so the second effect of inheriting does not arise there (${h.a('ltt-higher-rates', 'LTT higher rates')}).</p>
<h2>Scotland: inherited homes count for the ADS</h2>
<p>Scotland has no ${h.pct(SHARE_MAX)} rule. An inherited dwelling counts as one you own when you buy another, and the ${h.a('additional-dwelling-supplement', 'Additional Dwelling Supplement')} of ${h.pct(L.ads_rate)} of the whole price applies unless the purchase replaces your main residence. Two changes from 1 April 2024 have softened this:</p>
<ul>
<li>A buyer who inherits between the conclusion of missives and the date of entry is relieved from the ADS on that purchase, so a death during a transaction no longer changes its tax.</li>
<li>A share of a dwelling worth less than ${h.gbp(SCOT_SMALL)} is disregarded when counting what you own, which takes small inherited fractions out of the calculation.</li>
</ul>
<p>Outside those cases, the supplement on a ${h.gbp(NEXT)} purchase is ${h.gbp(h.tax({ nation: 'scotland', price: NEXT, situation: 'additional' }).surcharge)}. It is refundable only if the purchase replaced your main residence and that residence is sold within ${L.replace_main_residence_months} months; selling the inherited property later does not bring it back.</p>
<h2>The first-time buyer relief you lose</h2>
<p>England’s relief, and Scotland’s smaller one, require every buyer never to have owned a dwelling anywhere. Inheriting a share, however small, counts as owning one, and so does a home received as a gift. Selling the inherited share quickly does not restore the status. For a buyer at ${h.gbp(400000)} in England, the loss is ${h.gbp(h.t('england', 400000) - h.t('england', 400000, 'first'))}; in Scotland it is at most ${h.gbp(L.first_time_buyer_max_saving)}. The ${h.a('stamp-duty-first-time-buyer', 'first-time buyer guide')} has the full definition.</p>
<h2>Timing your purchase after an inheritance</h2>
<ol>
<li>Find out your exact share and, in Scotland, its value. The figures decide whether the inherited home counts.</li>
<li>If the share counts, compare the surcharge with the cost of selling the inherited property first. In England a sale completed on or before the day you complete keeps you on standard rates.</li>
<li>In England and Wales, note the date you inherited: the ${YEARS}-year protection for small shares runs from it, and a purchase after the period ends is tested on the full rules.</li>
<li>Do not count on a refund later. Selling inherited property after completion does not unlock a repayment, because the refund is tied to replacing a main residence.</li>
</ol>
<p>Gifts and transfers inside the family follow different rules again; the ${h.a('stamp-duty-exemptions', 'exemptions guide')} lists the transactions that carry no tax at all.</p>`;
  },
});
