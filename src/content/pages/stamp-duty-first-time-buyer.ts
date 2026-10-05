import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, sdltPrevious, compute } from '../../lib/kit';

const S = P.sdlt;
const NIL = top(S.first_time_buyer, 0), CAP = S.first_time_buyer_max_price, R5 = S.first_time_buyer[1][1];
const PREV_NIL = top(S.previous.first_time_buyer, 0), PREV_CAP = S.previous.first_time_buyer_max_price;
const maxLoss = Math.max(...[350000, 400000, 425000, 450000, 500000, 550000, 600000, 625000].map((p) => t('england', p, 'first') - sdltPrevious(p, 'first')));

export default definePage({
  id: 'stamp-duty-first-time-buyer',
  group: 'england',
  order: 20,
  slug: 'stamp-duty-first-time-buyer',
  nav: 'First-time buyer relief (SDLT)',
  card: `No SDLT up to ${gbp(NIL)}, ${pct(R5)} to ${gbp(CAP)}, no relief at all above: who qualifies and the traps.`,
  title: `Stamp Duty First-Time Buyer Relief 2026: ${gbp(NIL)} Rule`,
  description: `Stamp duty first-time buyer relief in 2026: no SDLT up to ${gbp(NIL)}, ${pct(R5)} up to ${gbp(CAP)}, lost entirely above. Who counts as a first-time buyer, with examples.`,
  h1: 'Stamp duty for first-time buyers in England and Northern Ireland',
  intro: `A nil band to ${gbp(NIL)}, a cliff at ${gbp(CAP)}, and a definition of “first-time” stricter than most buyers expect.`,
  resume: `Since 1 April 2025, a first-time buyer in England or Northern Ireland pays no Stamp Duty Land Tax on the first ${gbp(NIL)} of the price and ${pct(R5)} on the slice between ${gbp(NIL + 1)} and ${gbp(CAP)}, so a ${gbp(400000)} flat costs ${gbp(t('england', 400000, 'first'))} instead of ${gbp(t('england', 400000))} at standard rates. The relief is all or nothing: at ${gbp(CAP + 1)} it disappears and the whole price is taxed at standard rates, which adds ${gbp(t('england', CAP + 1, 'first') - t('england', CAP, 'first'))} for one extra pound. Every buyer named on the purchase must never have owned a home, or a share of one, anywhere in the world, including one inherited or received as a gift, and must intend to live in the property as their main home. Before April 2025 the same relief ran to ${gbp(PREV_NIL)} and ${gbp(PREV_CAP)}, so the change costs some first-time buyers up to ${gbp(maxLoss)}.`,
  faqs: [
    { q: 'My partner owned a flat years ago but I never have. Can we still claim first-time buyer relief together?', a: 'No. HMRC requires every purchaser to be a first-time buyer, and your partner’s past ownership of any dwelling, anywhere and however long ago, disqualifies the joint purchase. If you buy in your name alone, your partner’s history is not tested for this relief, even if you are married (SDLTM29845), although a spouse’s current property still counts for the separate additional-property surcharge.' },
    { q: 'Does inheriting a share of my grandparents’ house stop me being a first-time buyer?', a: `Yes. Acquiring a major interest in a dwelling by inheritance or gift counts as having owned a home, whatever the size of the share or how quickly it was sold. The rule is narrower for the ${pct(S.higher_rates_surcharge)} surcharge, where an inherited share of ${pct(S.inherited_share_max)} or less can be ignored for ${S.inherited_years} years, so it is possible to pay standard rates without being able to claim the first-time buyer relief.` },
    { q: `The asking price is ${gbp(CAP + 5000)}. Is it worth negotiating down to ${gbp(CAP)}?`, a: `Usually, yes. At ${gbp(CAP + 5000)} a first-time buyer pays standard rates on the whole price, ${gbp(t('england', CAP + 5000, 'first'))}, while at ${gbp(CAP)} the relief brings the bill to ${gbp(t('england', CAP, 'first'))}. The ${gbp(5000)} reduction in price saves ${gbp(t('england', CAP + 5000, 'first') - t('england', CAP, 'first'))} of tax as well. Paying separately for fixtures or chattels is legitimate only at their real value.` },
    { q: 'Can I claim the relief on a shared ownership flat?', a: `Yes, whether you elect to pay on the full market value or pay in stages, provided the market value in the lease is ${gbp(CAP)} or less and you will live there. With the market value election on a ${gbp(450000)} home you pay ${gbp(t('england', 450000, 'first'))} once; paying in stages on a ${gbp(180000)} first share costs ${gbp(t('england', 180000, 'first'))} now.` },
    { q: `I lived abroad for years and own nothing in the UK. Do I pay the ${pct(S.non_resident_surcharge)} surcharge as a first-time buyer?`, a: `If you spent fewer than ${S.non_resident_days} days in the UK in the 12 months before completion, yes: the ${pct(S.non_resident_surcharge)} non-resident surcharge is added to the first-time buyer rates. On a ${gbp(400000)} home that means ${gbp(compute({ nation: 'england', price: 400000, situation: 'first', nonResident: true }).nonResidentSurcharge)} of surcharge on top of the ${gbp(t('england', 400000, 'first'))} relief bill. If you then spend ${S.non_resident_days} days in the UK within a year of completion, the surcharge can be reclaimed.` },
  ],
  mini: 'ftbEngland',
  related: ['stamp-duty-rates', 'lbtt-first-time-buyer-relief', 'ltt-first-time-buyers', 'shared-ownership-stamp-duty', 'stamp-duty-on-500000', 'stamp-duty-joint-purchase'],
  sources: ['govSdltRates', 'sdltmFtb', 'sdltmFtbShared', 'govSdltPrevious', 'ootlar2025'],
  body: (h) => {
    const s = h.P.sdlt;
    const nil = s.first_time_buyer[0][0] as number, cap = s.first_time_buyer_max_price;
    const rows = [250000, 300000, 350000, 400000, 450000, 500000, 500001, 550000].map((p) => [h.gbp(p), h.gbp(h.t('england', p, 'first')), h.gbp(h.t('england', p, 'home')), h.gbp(h.t('scotland', p, 'first')), h.gbp(h.t('wales', p, 'first'))]);
    return `
<h2>The two bands, and the cliff after them</h2>
<p>First-time buyer relief does not reduce the rate on the whole price. It replaces the standard table with a shorter one: nothing up to ${h.gbp(nil)}, then ${h.pct(s.first_time_buyer[1][1])} on the portion up to ${h.gbp(cap)}. Above ${h.gbp(cap)} there is no third band. The buyer simply falls back to the ordinary rates, applied from the first pound.</p>
${h.bands('sdltFtb')}
<p>The cliff is the part that catches people. At ${h.gbp(cap)} a first-time buyer pays ${h.gbp(h.t('england', cap, 'first'))}; one pound more and the bill becomes ${h.gbp(h.t('england', cap + 1, 'first'))}. In London, where the ${h.a('stamp-duty-london', 'average first-time buyer price')} sits close to that line, a few thousand pounds on the offer can mean several thousand more in tax.</p>
${h.table(['Price', 'First-time buyer', 'Standard rates', 'Scotland, first-time', 'Wales'], rows, 'First-time buyer bill compared, computed with the 2026 bands', ['l', 'r', 'r', 'r', 'r'])}
<h2>Who counts as a first-time buyer</h2>
<p>The test in Schedule 6ZA of the Finance Act 2003 looks backwards over your whole life. You fail it if you have ever acquired a major interest in a dwelling, alone or with others, in the UK or abroad. A share counts. A home received as a gift counts. A flat inherited from a parent counts, even if you sold it the following month. A lease with less than 21 years to run when you acquired it does not count, and neither does commercial property that never contained a home.</p>
<p>The second condition looks forward: you must intend to occupy the property as your only or main residence. A buy-to-let bought by someone who has never owned a home gets no relief, and in practice it is usually hit by the ${h.a('stamp-duty-second-home', `${h.pct(s.higher_rates_surcharge)} higher rates`)} later, when the buyer acquires a home of their own.</p>
<h3>Buying with someone else</h3>
<p>Every purchaser must pass both tests. Two friends buying together lose the relief if one of them owned a studio at university. A parent added to the title deeds to help with the mortgage turns the purchase into a standard-rate one, and usually into an additional-property purchase too, because the parent still owns their own house. A “joint borrower, sole proprietor” mortgage avoids this, because the parent borrows without becoming an owner. The ${h.a('stamp-duty-joint-purchase', 'joint purchase calculator')} shows which buyer decides the rate.</p>
<h3>Spouses who are not on the deeds</h3>
<p>Here the relief is more generous than the surcharge. If only one spouse buys, HMRC does not ask whether the other spouse owned a home before. The surcharge works the other way round: a spouse’s current property counts as yours. A couple where one partner still owns a flat should therefore expect standard or higher rates, not the relief, whoever signs.</p>
<h2>What changed on 1 April 2025</h2>
<p>From 23 September 2022 to 31 March 2025 the relief ran to ${h.gbp(s.previous.first_time_buyer[0][0] as number)} with the ${h.pct(s.previous.first_time_buyer[1][1])} band up to ${h.gbp(s.previous.first_time_buyer_max_price)}. The temporary thresholds lapsed as planned and were not renewed in the Budget of November 2025. A first-time buyer at ${h.gbp(425000)} now pays ${h.gbp(h.t('england', 425000, 'first'))} instead of nothing, and one at ${h.gbp(600000)} pays the full standard bill of ${h.gbp(h.t('england', 600000, 'first'))} instead of ${h.gbp(sdltPrevious(600000, 'first'))}. Our ${h.a('stamp-duty-changes-april-2025', 'page on the April 2025 changes')} has the full comparison.</p>
<h2>Scotland and Wales do it differently</h2>
<p>Scotland’s relief is smaller but has no cliff: the nil band of Land and Buildings Transaction Tax rises from ${h.gbp(h.P.lbtt.residential[0][0] as number)} to ${h.gbp(h.P.lbtt.first_time_buyer_nil_band)}, worth at most ${h.gbp(h.P.lbtt.first_time_buyer_max_saving)}, at any price (${h.a('lbtt-first-time-buyer-relief', 'LBTT first-time buyer relief')}). Wales has no relief at all, but its main nil band already reaches ${h.gbp(h.P.ltt.main[0][0] as number)} for everyone (${h.a('ltt-first-time-buyers', 'first-time buyers in Wales')}). On a ${h.gbp(250000)} first home the three nations charge ${h.gbp(h.t('england', 250000, 'first'))}, ${h.gbp(h.t('scotland', 250000, 'first'))} and ${h.gbp(h.t('wales', 250000, 'first'))}.</p>
<h2>A first purchase worked through</h2>
<p>Take a couple who have rented for years and agree to buy a two-bedroom flat for ${h.gbp(400000)}. Neither has ever owned anything, so both pass the test, and they will live in the flat. The relief replaces the standard table: the first ${h.gbp(nil)} is free and the remaining ${h.gbp(400000 - nil)} pays ${h.pct(s.first_time_buyer[1][1])}.</p>
${h.breakdown({ nation: 'england', price: 400000, situation: 'first' }, `First-time buyers at ${h.gbp(400000)}`)}
<p>Without the relief the same flat would cost ${h.gbp(h.t('england', 400000))}, so the relief is worth ${h.gbp(h.tax({ nation: 'england', price: 400000, situation: 'first' }).ftbSaving)} to them. Had one of them inherited a share of a parent’s house more than ${s.inherited_years} years ago, they would pay the full amount, and if that share were still owned at completion the purchase would become an additional one at ${h.gbp(h.t('england', 400000, 'additional'))}. The facts about every buyer, not the price, decide which of these three bills arrives.</p>
<h2>Claiming it</h2>
<p>There is no form to send separately. Your conveyancer ticks the relief on the SDLT return, which must reach HMRC within ${s.return_days} days of completion, and pays the reduced amount. If the relief was missed, the return can be amended within ${s.amend_months} months of the filing date. HMRC can open a check after completion, so keep evidence that no buyer owned a home before, especially abroad.</p>
<h2>Three checks before you offer</h2>
<ol>
<li>Ask every person who will be on the title whether they have ever owned, inherited or been given a share of a home, in any country.</li>
<li>If the price is near ${h.gbp(cap)}, work out the cost of the last few thousand pounds: on this side of the line they are cheap, on the other side they cost the relief.</li>
<li>If you are not resident in the UK yet, count your days: the ${h.a('non-resident-stamp-duty-surcharge', 'non-resident surcharge')} is added to the first-time buyer rates and can be refunded later.</li>
</ol>`;
  },
});
