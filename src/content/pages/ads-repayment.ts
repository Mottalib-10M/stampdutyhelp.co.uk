import { definePage } from '../../lib/page-types';
import { P, gbp, pct, compute } from '../../lib/kit';
import { refundWindowEnd, addDays } from '../../lib/engine/tax';

const L = P.lbtt;
const MONTHS = L.replace_main_residence_months, AMEND = L.amend_months, YEARS = L.overpayment_claim_years, DAYS = L.repayment_target_working_days;
const back = (p: number) => compute({ nation: 'scotland', price: p, situation: 'additional' }).refundable;

export default definePage({
  id: 'ads-repayment',
  group: 'scotland',
  order: 40,
  slug: 'ads-repayment',
  nav: 'ADS repayment',
  card: `Sell your former main home within ${MONTHS} months and the ${pct(L.ads_rate)} supplement comes back: conditions, deadlines, evidence.`,
  title: `ADS Repayment 2026: Reclaim the Supplement in ${MONTHS} Months`,
  description: `ADS repayment in 2026: sell your old main home within ${MONTHS} months and reclaim the ${pct(L.ads_rate)} supplement, ${gbp(back(300000))} on a ${gbp(300000)} home. Deadlines and joint buyers explained.`,
  h1: 'Reclaiming the Additional Dwelling Supplement',
  intro: `Buying before selling is allowed in Scotland. It just means lending Revenue Scotland ${pct(L.ads_rate)} of the price until the old home sells.`,
  resume: `If you bought a new main home in Scotland before selling the old one, you paid the Additional Dwelling Supplement of ${pct(L.ads_rate)} of the price, and you can claim it back once the former main residence is sold within ${MONTHS} months of the new purchase. On a ${gbp(300000)} home that is ${gbp(back(300000))}. Conditions: the home sold must have been your only or main residence at some point in the ${MONTHS} months before the purchase, the new home must be occupied as your main residence. For purchases from 1 April 2024, only one of several joint buyers needs to have sold, but all must live in the new home. Revenue Scotland accepts no exceptions for a sale that misses the deadline. The claim is made by amending the LBTT return within ${AMEND} months of the filing date, or after that by an overpayment claim within ${YEARS} years of the date the return was due. The authority aims to repay within ${DAYS} working days, with interest.`,
  faqs: [
    { q: `Our flat in Leith sold ${MONTHS} months and two weeks after we moved. Is there any discretion on the ADS repayment?`, a: `No. Revenue Scotland applies the ${MONTHS}-month limit strictly, and MacQuarrie v Revenue Scotland confirmed that Scottish law makes no allowance for exceptional circumstances, however reasonable the reason for the delay. A sale completed outside the window gives no repayment at all, so if a sale is dragging on, lowering the price can be cheaper than losing ${gbp(back(280000))} on a ${gbp(280000)} purchase.` },
    { q: 'I bought with my new partner, who never owned a home. Can we reclaim the ADS when I sell my old house?', a: `Yes, for a purchase from 1 April 2024. The sale by one buyer is enough, provided that buyer’s old house was their main residence within the ${MONTHS} months before the purchase and both of you occupy the new home as your main residence. If your partner lives elsewhere, the repayment fails, even if you yourself moved in.` },
    { q: 'Does exchanging missives on my old home count as selling it for the ADS repayment?', a: `No. What counts is the disposal of the property, which in practice is the date of entry for your buyer, not the conclusion of missives. If missives are concluded in month ${MONTHS - 1} but entry falls after month ${MONTHS}, the repayment is lost. Agree the date of entry with the timetable in mind, not just the date the deal is struck.` },
    { q: 'How quickly will Revenue Scotland pay back my ADS?', a: `Revenue Scotland aims to process a repayment within ${DAYS} working days of receiving a complete claim, and adds interest for the period the money was held. Delays usually come from missing details: the sale date, the address of the former home, or an unclear answer about who lives in the new one. A claim made by your solicitor through the online system tends to be the fastest route.` },
    { q: 'I sold a buy-to-let flat after buying my new home. Can I reclaim the ADS?', a: `Only if that flat was your only or main residence at some point in the ${MONTHS} months before the new purchase. A flat that was let throughout that period is not a former main residence, so its sale does not trigger a repayment, even if you lived there years earlier. The ${gbp(back(260000))} paid on a ${gbp(260000)} home then stays with Revenue Scotland.` },
  ],
  mini: 'adsRepay',
  miniHref: 'lbtt-calculator',
  related: ['additional-dwelling-supplement', 'lbtt-calculator', 'stamp-duty-moving-home', 'stamp-duty-surcharge-refund', 'ltt-higher-rates-refund', 'lbtt-rates'],
  sources: ['rsAdsRepayment', 'rsAds', 'lbttAct'],
  body: (h) => {
    const l = h.P.lbtt;
    const rows = [180000, 250000, 320000, 400000, 550000, 800000].map((p) => {
      const r = h.tax({ nation: 'scotland', price: p, situation: 'additional' });
      return [h.gbp(p), h.gbp(r.total), h.gbp(r.mainTax), h.gbp(r.refundable)];
    });
    return `
<h2>Why movers pay a supplement meant for second homes</h2>
<p>The supplement is decided at the end of the day of entry. A buyer who takes entry to a new home while the old one is still theirs owns two dwellings that evening, and the LBTT return has to include the ${h.pct(l.ads_rate)} charge. Bridging finance, a chain that broke, a new-build that completed early: the reason does not matter. What matters is whether the old home was a main residence, and the law then lets the buyer recover the supplement once it is sold.</p>
${h.table(['Price of the new home', 'Paid at entry', 'Plain LBTT', 'Repayment after the sale'], rows, 'ADS paid and repaid when the old home sells within the window', ['l', 'r', 'r', 'r'])}
<p>The repayment is the supplement alone. The LBTT on the bands stays due, since it is the tax any buyer of a single home pays.</p>
<h2>The three conditions</h2>
<ol>
<li><strong>The former home was a main residence.</strong> It must have been the buyer’s only or main residence at some time during the ${l.replace_main_residence_months} months before the effective date of the new purchase. A flat you let out for five years and sell now does not qualify, even if you once lived there long ago.</li>
<li><strong>The new home becomes the main residence.</strong> The buyer must intend to live there, and must actually do so. A buyer who keeps living in the old home while letting the new one has bought an additional dwelling, not a replacement.</li>
<li><strong>The sale happens within ${l.replace_main_residence_months} months.</strong> The disposal of the former home must take place within ${l.replace_main_residence_months} months after the effective date of the new purchase.</li>
</ol>
<h3>Joint buyers since 1 April 2024</h3>
<p>For purchases with an effective date from 1 April 2024, the rules were relaxed for couples and other joint buyers. Only one of them needs to have sold a former main residence, but every buyer must occupy the new home as their main residence. A couple where one partner sells a flat in Stirling and the other has never owned anything can therefore recover the supplement, provided they live together in the new house. Purchases with an earlier effective date stay under the rules in force at the time, and a solicitor should check those cases individually.</p>
<h2>No exceptional circumstances</h2>
<p>England’s rules make room for exceptional circumstances, such as a sale prevented by a public authority. Scotland’s do not. The point was tested in MacQuarrie v Revenue Scotland, and the outcome confirmed that the ${l.replace_main_residence_months}-month limit is set by the legislation and cannot be stretched for exceptional circumstances. A sale completed a day late gives nothing back.</p>
<p>Two practical consequences follow. First, a buyer who starts the clock with an unsold home should treat the deadline as the real cost of the purchase: on a ${h.gbp(350000)} house, the difference between selling in time and selling late is ${h.gbp(back(350000))}. Second, the date that counts is the date of entry on the sale, not the date missives are concluded. Building a margin into the timetable is the only protection.</p>
<h2>Two routes to make the claim</h2>
<p>The route depends on how much time has passed since the LBTT return for the new home was filed.</p>
<ul>
<li><strong>Within ${l.amend_months} months of the filing date</strong>, the buyer, usually through the solicitor, amends the original return to remove the supplement. This is the simplest route and the natural one for a sale in the first year.</li>
<li><strong>After that</strong>, the return can no longer be amended and the buyer makes a claim for repayment of overpaid tax, within ${l.overpayment_claim_years} years of the date the original return was due.</li>
</ul>
<p>Because the window to sell is ${l.replace_main_residence_months} months, a buyer who sells in year two or three will always use the second route. Nothing is lost by it, but the claim must be made: Revenue Scotland does not repay the supplement automatically when the Registers of Scotland record the sale.</p>
<h2>Putting the deadlines on a calendar</h2>
<p>Take a family who get entry to a house in Bearsden on ${h.date('2026-06-15')}, while their flat in the West End of Glasgow is still on the market. Their solicitor files the LBTT return with the supplement within ${l.return_days} days, by ${h.date(addDays('2026-06-15', l.return_days))} at the latest. From then on, three dates frame the repayment:</p>
<ul>
<li>the flat must be sold, with entry given to its buyer, by ${h.date(refundWindowEnd('2026-06-15', 'scotland'))};</li>
<li>a sale within ${l.amend_months} months of the filing date can be handled by amending the return;</li>
<li>any later sale goes through an overpayment claim, which has ${l.overpayment_claim_years} years from the date the return was due.</li>
</ul>
<p>The family should not wait for the end of the claim period once the flat has sold. Interest runs in their favour, but a claim made in the weeks after the sale, with the sale documents fresh, is the one least likely to be queried.</p>
<h2>What to have ready</h2>
<p>The claim identifies the purchase (the LBTT return reference), the former main residence (its address) and the sale (the date of entry and the price). Keep evidence that the old home was your main residence within the ${l.replace_main_residence_months} months before the purchase, such as council tax bills, and that you now live in the new one. Joint buyers should be ready to show that each of them occupies the new home. Revenue Scotland aims to make the repayment within ${l.repayment_target_working_days} working days of a complete claim, and pays interest on the amount for the time it held it.</p>
<p>The rules in Wales and in England work on the same idea with different clocks, ${h.P.ltt.replace_main_residence_years} years in both, and a different calculation in Wales, where the ${h.a('ltt-higher-rates-refund', 'higher rates refund')} is the gap between two tables. For a purchase in Scotland, the ${h.a('lbtt-calculator', 'LBTT calculator')} shows the repayable amount on the result line.</p>`;
  },
});
