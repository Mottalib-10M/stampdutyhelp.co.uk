import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, compute } from '../../lib/kit';

const S = P.sdlt;
const NR = S.non_resident_surcharge, DAYS = S.non_resident_days;
const EX = 600000;
const exNr = compute({ nation: 'england', price: EX, situation: 'home', nonResident: true });

export default definePage({
  id: 'non-resident-stamp-duty-surcharge',
  group: 'england',
  order: 40,
  slug: 'non-resident-stamp-duty-surcharge',
  nav: 'Non-resident surcharge',
  card: `${pct(NR)} more on every residential SDLT band for buyers who spent under ${DAYS} days in the UK, and how to get it back.`,
  title: `Stamp Duty Non-Resident Surcharge 2026: ${pct(NR)} and Refunds`,
  description: `Non-resident stamp duty in 2026: ${pct(NR)} on top of every SDLT band if you spent under ${DAYS} days in the UK. ${gbp(EX)} costs ${gbp(exNr.nonResidentSurcharge)} more. How the refund works.`,
  h1: 'The non-resident stamp duty surcharge',
  intro: 'A day count, not a passport, decides whether an overseas buyer pays more SDLT.',
  resume: `Since 1 April 2021, buyers of residential property in England and Northern Ireland who are not UK resident pay an extra ${pct(NR)} on every band of Stamp Duty Land Tax. The test is simple: anyone who spent fewer than ${DAYS} days in the UK during the year before completion is non-resident for this purpose, whatever their nationality. The surcharge sits on top of every other scale, so a ${gbp(EX)} home bought as a sole residence costs ${gbp(exNr.total)} instead of ${gbp(t('england', EX))}, a second home ${gbp(t('england', EX, 'additional', { nonResident: true }))}, and even a first-time buyer pays ${gbp(compute({ nation: 'england', price: 400000, situation: 'first', nonResident: true }).nonResidentSurcharge)} more on a ${gbp(400000)} flat. One non-resident buyer is enough to surcharge a joint purchase, unless that buyer is the spouse or civil partner of a UK resident they live with. The money comes back if every buyer then spends ${DAYS} days in the UK within a continuous year around completion, by amending the return within ${S.non_resident_refund_years} years. Commercial property is outside the charge, and Scotland and Wales have no equivalent.`,
  faqs: [
    { q: 'I moved to London four months before completion. Do I pay the non-resident surcharge?', a: `Probably yes. Four months is fewer than ${DAYS} days, so on completion day you fail the test for the year behind you and the return must include the ${pct(NR)}. If you stay, you will reach ${DAYS} days within a continuous year that includes completion, and you can then amend the return to recover the surcharge, as long as you do so within ${S.non_resident_refund_years} years of the day after completion.` },
    { q: 'My wife is UK resident and I work abroad. Do we pay the surcharge if we buy together?', a: `Not if you are married or in a civil partnership and living together. HMRC’s manual (SDLTM09885) treats a non-resident spouse or civil partner of a UK resident as UK resident for the surcharge, so the purchase is taxed at UK rates. The rule does not extend to unmarried partners: an unmarried non-resident co-buyer brings the ${pct(NR)} on the whole price, ${gbp(compute({ nation: 'england', price: 450000, situation: 'home', nonResident: true }).nonResidentSurcharge)} on a ${gbp(450000)} house.` },
    { q: 'Does the 2% surcharge apply if an overseas investor buys a shop or an office?'.replace('2%', pct(NR)), a: `No. The surcharge only applies to residential property. A shop, an office, a warehouse or a mixed-use building such as a pub with a flat above is taxed on the non-residential scale at the same rates for every buyer, resident or not. At ${gbp(400000)} that is ${gbp(t('england', 400000, 'home', { kind: 'nonresidential' }))}, with nothing added for living abroad.` },
    { q: 'Can a British citizen living in Dubai be charged the non-resident surcharge?', a: `Yes. Nationality plays no part. The only question is how many days you spent in the UK during the year before completion: fewer than ${DAYS} and you are non-resident for SDLT, even with a British passport, a UK bank account and family here. A returning expat in that position pays at completion and can claim the money back once settled.` },
    { q: 'Is there a non-resident surcharge on a flat in Edinburgh or Cardiff?', a: `No. The surcharge belongs to Stamp Duty Land Tax, which only applies in England and Northern Ireland. Land and Buildings Transaction Tax in Scotland and Land Transaction Tax in Wales charge overseas buyers exactly what they charge residents. A ${gbp(EX)} home costs ${gbp(t('scotland', EX))} in Scotland and ${gbp(t('wales', EX))} in Wales for any buyer, against ${gbp(exNr.total)} for a non-resident in England.` },
  ],
  mini: 'nonResidentSdlt',
  related: ['stamp-duty-rates', 'stamp-duty-joint-purchase', 'stamp-duty-second-home', 'stamp-duty-company-purchase', 'stamp-duty-england-scotland-wales-compared', 'sdlt-calculator'],
  sources: ['sdltmNonResident', 'sdltmNonResSpouse', 'sdltmNonResRefund', 'govSdltRates', 'ootlar2025'],
  body: (h) => {
    const s = h.P.sdlt, nr = s.non_resident_surcharge;
    const sits: Array<[string, 'first' | 'home' | 'additional', boolean]> = [['First-time buyer', 'first', false], ['Sole home or moving home', 'home', false], ['Additional property', 'additional', false], ['Company, no relief', 'home', true]];
    const grid = [300000, 500000, 900000, 2000000].flatMap((p) => sits.map(([label, sit, co]) => {
      const uk = h.t('england', p, sit, co ? { company: true } : {});
      const ov = h.t('england', p, sit, co ? { company: true, nonResident: true } : { nonResident: true });
      return [h.gbp(p), label, h.gbp(uk), h.gbp(ov), h.gbp(ov - uk)];
    }));
    return `
<h2>${h.pct(nr)} on every band, on top of everything else</h2>
<p>Schedule 9A of the Finance Act 2003 does not create a new scale. It takes whichever residential scale would apply to the purchase and adds ${h.pct(nr)} to each of its bands, the nil band included. The first-time buyer scale becomes ${h.pct(s.first_time_buyer[0][1] + nr)} and ${h.pct(s.first_time_buyer[1][1] + nr)}. The higher rates for additional dwellings start at ${h.pct(s.residential[0][1] + s.higher_rates_surcharge + nr)}. The ${h.pct(s.corporate_flat_rate)} company rate becomes ${h.pct(s.corporate_flat_rate + nr)} of the whole price.</p>
${h.breakdown({ nation: 'england', price: EX, situation: 'home', nonResident: true }, `A non-resident buying a ${h.gbp(EX)} sole home`)}
<p>Because the extra ${h.pct(nr)} applies from the first pound, the surcharge is simply ${h.pct(nr)} of the price for most purchases: ${h.gbp(exNr.nonResidentSurcharge)} here. Compare it with the higher rates, which add ${h.pct(s.higher_rates_surcharge)} to each band; a non-resident landlord buying a flat to let pays both.</p>
${h.table(['Price', 'Buyer', 'UK resident', 'Non-resident', 'Surcharge'], grid, 'SDLT for UK-resident and non-resident buyers', ['l', 'l', 'r', 'r', 'r'])}
<h2>The ${s.non_resident_days}-day test</h2>
<p>An individual is non-resident for the surcharge if they were present in the UK on fewer than ${s.non_resident_days} days during the year ending with the day of completion. It is a plain count of days, with no other factor weighed against it. Someone who has lived in Singapore for a decade but spent the last seven months back in Bristol already passes it; someone who left Leeds for Toronto ten months ago may already fail it.</p>
<p>The count looks backwards from completion, not from exchange. A long gap between the two can help a returning buyer, because every day spent in the UK before completion adds to the tally. Keep travel records that show your arrival and departure dates: HMRC can open a check after the return has been filed.</p>
<h3>Joint buyers</h3>
<p>The surcharge applies to the whole price as soon as one buyer is non-resident. Two siblings buying a flat in Manchester, one living there and one in Melbourne, pay the surcharge on the full purchase, not on the Australian sibling’s half. The ${h.a('stamp-duty-joint-purchase', 'joint purchase calculator')} applies this rule buyer by buyer.</p>
<h3>Spouses and civil partners of UK residents</h3>
<p>There is one exception. A married person or civil partner who lives with a UK-resident spouse is treated as UK resident for the surcharge (${h.src('sdltmNonResSpouse', 'SDLTM09885')}). A couple where one partner commutes to a job in Zurich and the other lives in Oxford therefore pays UK rates. The relief is tied to marriage or civil partnership: cohabiting partners do not benefit from it.</p>
<h2>Getting the surcharge back</h2>
<p>A buyer who paid the surcharge can recover it by becoming UK resident in relation to the purchase. That means spending at least ${s.non_resident_days} days in the UK during a continuous period of a year that starts no earlier than a year before completion and ends no later than a year after it. Where several people bought, every one of them must meet the test, each in their own continuous year; only then is the refund available.</p>
<p>The claim is made by amending the original SDLT return, not by a separate form, and the amendment must reach HMRC within ${s.non_resident_refund_years} years starting with the day after completion (${h.src('sdltmNonResRefund', 'SDLTM09960')}). In practice that leaves about a year after the residence window closes. On the ${h.gbp(EX)} example the refund is ${h.gbp(exNr.nonResidentSurcharge)}, which is worth a diary note on the day you arrive.</p>
<h2>Three overseas buyers, three outcomes</h2>
<p><strong>A family relocating from Hong Kong.</strong> They arrive in Surrey three months before completing on a ${h.gbp(750000)} house, their only home anywhere. At completion they are non-resident and pay ${h.gbp(h.t('england', 750000, 'home', { nonResident: true }))} instead of ${h.gbp(h.t('england', 750000))}. Both spouses stay, both pass ${s.non_resident_days} days within the year after completion, and the amended return brings back ${h.gbp(h.tax({ nation: 'england', price: 750000, situation: 'home', nonResident: true }).nonResidentSurcharge)}.</p>
<p><strong>A landlord based in Dubai.</strong> He keeps his apartment there and buys a ${h.gbp(250000)} flat in Liverpool to let. The purchase carries the higher rates and the non-resident surcharge together, ${h.gbp(h.t('england', 250000, 'additional', { nonResident: true }))} in all, of which ${h.gbp(h.tax({ nation: 'england', price: 250000, situation: 'additional', nonResident: true }).nonResidentSurcharge)} is the residence part. Unless he moves to the UK, none of it comes back.</p>
<p><strong>A nurse recruited from abroad.</strong> She has never owned a home anywhere and buys a ${h.gbp(280000)} flat two months after starting work in Birmingham. First-time buyer relief still applies, so the only tax is the surcharge: ${h.gbp(h.t('england', 280000, 'first', { nonResident: true }))}. By the end of her first year in the UK she has passed the day count, and the whole amount is refundable.</p>
<h2>Paying first, reclaiming later</h2>
<p>The surcharge cannot be left off the return in the hope of passing the day count later. The position on completion day decides what is due, and the return and payment must reach HMRC within ${s.return_days} days of completion like any other SDLT return. A buyer expecting to settle in the UK should budget for the full amount and treat the refund as money returned within a year or two. Where the first-time buyer scale is involved, the surcharge also follows the relief over its cliff: at ${h.gbp(s.first_time_buyer_max_price)} a non-resident first-time buyer pays ${h.gbp(h.t('england', s.first_time_buyer_max_price, 'first', { nonResident: true }))}, and ${h.gbp(h.t('england', s.first_time_buyer_max_price + 1, 'first', { nonResident: true }))} a pound above it.</p>
<h2>What the surcharge does not touch</h2>
<ul>
<li><strong>Non-residential and mixed-use property.</strong> Shops, offices and mixed-use buildings follow the commercial scale for everyone (${h.a('commercial-property-stamp-duty', 'commercial property stamp duty')}).</li>
<li><strong>Scotland and Wales.</strong> LBTT and LTT have no residence test at all. An overseas buyer of a house in Glasgow pays the same LBTT as a local buyer, and the same applies in Swansea under LTT.</li>
<li><strong>The rest of the bill.</strong> The surcharge never cancels a relief. A first-time buyer living abroad keeps the relief scale and pays ${h.pct(nr)} on top, provided every buyer meets the first-time buyer conditions.</li>
</ul>
<p>Overseas buyers comparing locations should look at the full bill rather than the surcharge alone. At ${h.gbp(EX)}, a non-resident pays ${h.gbp(exNr.total)} in England, ${h.gbp(h.t('scotland', EX))} in Scotland and ${h.gbp(h.t('wales', EX))} in Wales for a sole home. The ${h.a('stamp-duty-england-scotland-wales-compared', 'comparison of the three nations')} runs the same exercise for second homes and first purchases.</p>`;
  },
});
