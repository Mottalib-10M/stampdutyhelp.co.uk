import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const L = P.lbtt;
const R = L.residential;
const NIL = L.first_time_buyer_nil_band, MAX = L.first_time_buyer_max_saving, STD = top(R, 0);

export default definePage({
  id: 'lbtt-first-time-buyer-relief',
  group: 'scotland',
  order: 20,
  slug: 'lbtt-first-time-buyer-relief',
  nav: 'LBTT first-time buyer relief',
  card: `The nil band rises to ${gbp(NIL)} for a first home in Scotland: at most ${gbp(MAX)} saved, at any price, never with the ADS.`,
  title: `LBTT First-Time Buyer Relief 2026: ${gbp(NIL)} Nil Band`,
  description: `LBTT first-time buyer relief 2026: the nil band rises to ${gbp(NIL)}, saving up to ${gbp(MAX)} at any price. A ${gbp(200000)} first flat pays ${gbp(t('scotland', 200000, 'first'))}. Rules for joint buyers.`,
  h1: 'LBTT first-time buyer relief',
  intro: `A wider nil band rather than a separate table, and a saving that is capped but never lost because of the price.`,
  resume: `First-time buyers in Scotland pay no Land and Buildings Transaction Tax on the first ${gbp(NIL)} of the price, instead of the standard ${gbp(STD)}, and the rest of the bands stay as they are. The relief is therefore worth at most ${gbp(MAX)}, reached at ${gbp(NIL)} and kept at every price above it: a ${gbp(200000)} first flat costs ${gbp(t('scotland', 200000, 'first'))} instead of ${gbp(t('scotland', 200000))}, and a ${gbp(400000)} first house ${gbp(t('scotland', 400000, 'first'))} instead of ${gbp(t('scotland', 400000))}. There is no price ceiling, so unlike England the relief never disappears. To claim it, every buyer must never have owned a dwelling anywhere in the world, including one inherited or received as a gift, and must intend to live in the property as their only or main residence. The relief cannot be combined with the ${pct(L.ads_rate)} Additional Dwelling Supplement: if any buyer still owns another home at the end of the day, the purchase is not a first-time purchase. Revenue Scotland sets the rules out in LBTT3048.`,
  faqs: [
    { q: `Is the ${gbp(MAX)} LBTT relief worth anything on a ${gbp(140000)} flat?`, a: `Nothing, because the flat already sits inside the standard nil band of ${gbp(STD)} and owes no LBTT at all. The relief only starts to bite once the price passes ${gbp(STD)}: at ${gbp(160000)} it saves ${gbp(compute({ nation: 'scotland', price: 160000, situation: 'first' }).ftbSaving)}, and from ${gbp(NIL)} upwards it saves the full ${gbp(MAX)}. Below the standard nil band, both bills are zero.` },
    { q: 'My fiancé owned a flat in Aberdeen before we met. Can I still claim the relief if we buy together?', a: `Not on a joint purchase. Revenue Scotland requires each buyer to be a first-time buyer, so a single past owner among you removes the relief for the whole transaction. On a ${gbp(250000)} home that costs the couple ${gbp(MAX)}. If you buy alone, your fiancé’s history does not stop the relief, provided he no longer owns the flat or anything else.` },
    { q: 'I owned a house in Spain years ago and sold it. Am I a first-time buyer in Scotland?', a: `No. The test covers dwellings anywhere in the world, owned at any time, so a home in Spain sold years ago counts just as a flat in Glasgow would. You pay the standard LBTT bands. If you no longer own any home on the day of entry, you at least avoid the ${pct(L.ads_rate)} supplement, which only bites when a buyer ends the day with two dwellings.` },
    { q: 'Can a first-time buyer get the relief on a buy-to-let in Scotland?', a: `No. The buyer must intend to occupy the property as their only or main residence, so a flat bought to let is outside the relief even if the buyer has never owned a home. The purchase pays the standard bands, ${gbp(t('scotland', 180000))} on a ${gbp(180000)} flat. The supplement does not apply in that case either, since the buyer owns only one dwelling.` },
    { q: 'What happens if the solicitor forgot to claim first-time buyer relief on my LBTT return?', a: `The return can be amended within ${L.amend_months} months of the filing date, and the overpaid tax comes back with the corrected figure. After that window, an overpayment claim is still possible within ${L.overpayment_claim_years} years. The amount is small, at most ${gbp(MAX)}, so ask your solicitor to make the correction rather than paying someone else to do it.` },
  ],
  mini: 'lbttFirstHome',
  miniHref: 'lbtt-calculator',
  related: ['lbtt-rates', 'lbtt-calculator', 'additional-dwelling-supplement', 'stamp-duty-first-time-buyer', 'ltt-first-time-buyers', 'stamp-duty-glasgow'],
  sources: ['rsFtb', 'rsResidential', 'rsAds', 'lbttAct'],
  body: (h) => {
    const l = h.P.lbtt, r = l.residential;
    const nil = l.first_time_buyer_nil_band, std = top(r, 0);
    const rows = [140000, 150000, 160000, 175000, 200000, 300000, 500000, 900000].map((p) => {
      const x = h.tax({ nation: 'scotland', price: p, situation: 'first' });
      return [h.gbp(p), h.gbp(h.t('scotland', p)), h.gbp(x.total), h.gbp(x.ftbSaving)];
    });
    const gl = h.place('city-of-glasgow'), ed = h.place('city-of-edinburgh'), ab = h.place('city-of-aberdeen');
    const cities = [['Glasgow', gl], ['Edinburgh', ed], ['Aberdeen', ab]].filter(([, c]) => (c as typeof gl).ftb).map(([n, c]) => {
      const f = (c as typeof gl).ftb as number;
      return [n as string, h.gbp(f), h.gbp(h.t('scotland', f, 'first')), h.gbp(h.t('scotland', f))];
    });
    return `
<h2>One band moved, nothing else touched</h2>
<p>The Scottish relief is a single adjustment to the ordinary table. The nil band, normally ${h.gbp(std)}, is extended to ${h.gbp(nil)} for a qualifying buyer. The ${h.pct(r[1][1])} band then starts at ${h.gbp(nil + 1)} instead of ${h.gbp(std + 1)}, and every band above is identical to the standard one.</p>
${h.bands('lbttFtb')}
<p>The effect is easy to measure. The ${h.gbp(nil - std)} that moves from the ${h.pct(r[1][1])} band into the nil band would have cost ${h.gbp(h.t('scotland', nil))} of tax, and that is the whole value of the relief: ${h.gbp(l.first_time_buyer_max_saving)}. It is the same for a studio at ${h.gbp(nil)} as for a townhouse at ${h.gbp(900000)}.</p>
<h2>Why the saving stops growing at ${h.gbp(nil)}</h2>
${h.table(['Price', 'Standard LBTT', 'First-time buyer', 'Saving'], rows, 'LBTT first-time buyer relief at different prices, 2026 bands', ['l', 'r', 'r', 'r'])}
<p>Under ${h.gbp(std)} there is nothing to save, because nobody pays LBTT there. Between ${h.gbp(std)} and ${h.gbp(nil)} the saving equals the whole standard bill, so a first-time buyer at ${h.gbp(160000)} pays nothing at all. From ${h.gbp(nil)} upwards the saving is frozen at its maximum while the bill keeps growing, which means that the relief matters most, in proportion, at the bottom of the market and very little on an expensive home.</p>
<p>That design is the opposite of the English one. In England, a first-time buyer pays nothing up to ${h.gbp(top(h.P.sdlt.first_time_buyer, 0))} but loses the relief entirely above ${h.gbp(h.P.sdlt.first_time_buyer_max_price)}. The Scottish relief is smaller everywhere it overlaps, but there is no cliff to fall off, no price at which a higher offer costs the relief, and no reason to negotiate around a threshold.</p>
<h2>What first-time buyers actually pay in Scottish cities</h2>
<p>The UK House Price Index publishes the average price paid by first-time buyers in each council area. Applied to three Scottish cities, it shows how much depends on whether the typical first purchase sits under or over the ${h.gbp(nil)} line:</p>
${h.table(['City', 'Average first-time buyer price', 'LBTT with relief', 'LBTT without'], cities, 'First-time buyer averages, UK HPI, and the LBTT due', ['l', 'r', 'r', 'r'])}
<h2>Who counts as a first-time buyer in Scotland</h2>
<p>Revenue Scotland’s test, in LBTT3048, has two limbs. Looking back, the buyer must never have owned a dwelling, anywhere in the world. A share of a home counts. A home received as a gift counts, and so does one inherited from a relative, even if it was sold immediately and the buyer never lived in it. Looking forward, the buyer must intend to occupy the property as their only or main residence. A flat bought for a student child, or for letting, does not qualify even when the buyer has never owned anything.</p>
<p>The test is about ownership, not about where the buyer lived. Someone who rented for twenty years is a first-time buyer; someone who owned a flat in Lisbon for six months in their twenties is not. Expect your solicitor to ask about property abroad and inheritances, because the declaration on the LBTT return is yours, and Revenue Scotland can check it after the date of entry.</p>
<h3>Joint buyers</h3>
<p>Every buyer must pass both limbs. Two friends buying a tenement flat together keep the relief only if neither has owned a home before. A couple where one partner sold a house before the relationship began loses it on a joint purchase, although the cost of that is never more than ${h.gbp(l.first_time_buyer_max_saving)}. A parent added to the title to help with the purchase removes the relief and, because the parent still owns their own home, usually brings in the supplement as well. A parent who gives a deposit as a gift, without becoming an owner, changes nothing to the buyer’s position.</p>
<h2>The supplement wins over the relief</h2>
<p>The relief cannot be claimed on a transaction that attracts the ${h.a('additional-dwelling-supplement', 'Additional Dwelling Supplement')}. In practice the two rarely meet, because someone who already owns a dwelling is not a first-time buyer anyway. The case that does arise is the joint purchase described above, and the gap is large: on a ${h.gbp(220000)} flat a first-time buyer pays ${h.gbp(h.t('scotland', 220000, 'first'))}, while the same flat bought with a co-owner who keeps another home costs ${h.gbp(h.t('scotland', 220000, 'additional'))}.</p>
<h2>Three questions to settle before the missives</h2>
<ol>
<li><strong>Has anyone who will be on the title ever owned part of a home?</strong> Ask about inherited shares, homes abroad and flats bought with a former partner. One yes removes the relief for everyone, and the answer has to be given on the return.</li>
<li><strong>Will every buyer live there?</strong> A couple buying their first home together qualifies; a sibling who helps with the price but lives elsewhere and goes on the title does not count as an occupier, and the relief is lost.</li>
<li><strong>Does any buyer still own something on the date of entry?</strong> If so, the question is no longer the relief at all but the supplement, and the bill changes by thousands of pounds rather than hundreds. The ${h.a('lbtt-calculator', 'LBTT calculator')} shows both figures side by side.</li>
</ol>
<p>None of these questions depends on the price. That is the practical difference with England: a Scottish first-time buyer can spend their energy on the offer itself, knowing that the relief will be the same ${h.gbp(l.first_time_buyer_max_saving)} whether the closing bid lands at ${h.gbp(240000)} or ${h.gbp(260000)}. What changes between those two bids is the ordinary LBTT, ${h.gbp(h.t('scotland', 240000, 'first'))} against ${h.gbp(h.t('scotland', 260000, 'first'))}.</p>
<h2>Claiming the relief on the return</h2>
<p>There is no separate application. The solicitor selects the relief on the LBTT return, which is due with the tax within ${l.return_days} days of the effective date, and pays the reduced amount. If the relief is missed, the return can be amended within ${l.amend_months} months of the filing date. Wales has no equivalent relief at all, and the ${h.a('ltt-first-time-buyers', 'Welsh page for first-time buyers')} shows what that means at the border; the ${h.a('stamp-duty-first-time-buyer', 'English relief')} works on a different principle again.</p>`;
  },
});
