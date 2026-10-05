import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top } from '../../lib/kit';
import type { Situation } from '../../lib/engine/tax';

const PRICE = 400000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const eFtb = t('england', PRICE, 'first');
const nrFtb = t('england', PRICE, 'first', { nonResident: true }), nrHome = t('england', PRICE, 'home', { nonResident: true });

export default definePage({
  id: 'stamp-duty-on-400000',
  group: 'prices',
  order: 170,
  slug: 'stamp-duty-on-400000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `${gbp(eFtb)} for an English first-time buyer, ${gbp(nrFtb)} if that buyer lives abroad, ${gbp(wal)} in Wales.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: Halfway Through Relief`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eng)} in England, ${gbp(eFtb)} for a first-time buyer, ${gbp(nrFtb)} for one living abroad, ${gbp(sco)} in Scotland and ${gbp(wal)} in Wales.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `Midway through the English first-time buyer band, at the top of the Welsh ${pct(W.main[1][1])} band, and costly for anyone buying from overseas.`,
  resume: `On ${gbp(PRICE)}, a buyer of an only home in England or Northern Ireland pays ${gbp(eng)} of Stamp Duty Land Tax, and a first-time buyer pays ${gbp(eFtb)}: nothing on the first ${gbp(top(S.first_time_buyer, 0))} and ${pct(S.first_time_buyer[1][1])} on the next ${gbp(PRICE - top(S.first_time_buyer, 0))}. The price sits exactly halfway between the start of that ${pct(S.first_time_buyer[1][1])} slice and the ${gbp(S.first_time_buyer_max_price)} limit beyond which the relief disappears. In Wales the bill is ${gbp(wal)} of Land Transaction Tax, and ${gbp(PRICE)} is the last pound of the Welsh ${pct(W.main[1][1])} band; anything above is taxed at ${pct(W.main[2][1])}. Scotland charges ${gbp(sco)} of LBTT, the most of the three, since everything from ${gbp(top(L.residential, 2) + 1)} pays ${pct(L.residential[3][1])}. A buyer who has spent fewer than ${S.non_resident_days} days in the UK in the year before completion pays the English non-resident surcharge on top of whichever table applies: ${gbp(nrFtb)} as a first-time buyer, ${gbp(nrHome)} otherwise. Scotland and Wales have no such surcharge.`,
  faqs: [
    { q: `I work abroad and am buying my first home in England for ${gbp(PRICE)}. Do I still get first-time buyer relief?`, a: `Yes, the relief and the non-resident surcharge apply together. The surcharge adds ${pct(S.non_resident_surcharge)} to each band of the relief table, so the bill is ${gbp(nrFtb)} instead of ${gbp(eFtb)}. If you then spend ${S.non_resident_days} days in the UK within a continuous year around the purchase, you can amend the return within ${S.non_resident_refund_years} years and recover ${gbp(nrFtb - eFtb)}.` },
    { q: `My wife lives in London and I still work in Dubai. Are we charged the overseas surcharge on a ${gbp(PRICE)} flat?`, a: `Not if you are married or in a civil partnership and living together as a couple. HMRC treats a non-resident spouse of a UK-resident buyer as resident for this surcharge (SDLTM09885), so the purchase is taxed as ${gbp(eng)}, or ${gbp(eFtb)} if you are both first-time buyers. Unmarried co-buyers do not get this treatment: one non-resident among them brings the surcharge in.` },
    { q: `Does a ${gbp(PRICE)} offer in Wales cost more if the seller pushes it to ${gbp(PRICE + 20000)}?`, a: `Yes, ${gbp(t('wales', PRICE + 20000) - wal)} more. The extra ${gbp(20000)} lies above the end of the Welsh ${pct(W.main[1][1])} band and is taxed at ${pct(W.main[2][1])}, so the total rises from ${gbp(wal)} to ${gbp(t('wales', PRICE + 20000))}. The pounds already below the line keep their lower rate. A second home sees the same step in the higher rates, from ${pct(W.higher[2][1])} to ${pct(W.higher[3][1])}.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-350000', 'stamp-duty-on-450000', 'non-resident-stamp-duty-surcharge', 'stamp-duty-first-time-buyer', 'ltt-rates', 'stamp-duty-london'],
  sources: ['govSdltRates', 'sdltmNonResident', 'sdltmNonResSpouse', 'sdltmNonResRefund', 'wraRates'],
  body: (h) => {
    const ladder = [PRICE - 150000, PRICE - 100000, PRICE, PRICE + 100000, S.first_time_buyer_max_price + 10000].map((p) => {
      const std = h.t('england', p), ftb = h.t('england', p, 'first');
      return [h.gbp(p), h.gbp(std), h.gbp(ftb), h.gbp(std - ftb)];
    });
    const sits: Array<[string, Situation]> = [['First-time buyer', 'first'], ['Only home or moving home', 'home'], ['Additional property', 'additional']];
    const nrRows = sits.map(([l, s]) => { const a = h.t('england', PRICE, s), b = h.t('england', PRICE, s, { nonResident: true }); return [l, h.gbp(a), h.gbp(b), h.gbp(b - a)]; });
    return `
<h2>Halfway up the English relief band</h2>
<p>First-time buyer relief in England is a table of two slices: ${h.pct(S.first_time_buyer[0][1])} to ${h.gbp(top(S.first_time_buyer, 0))}, then ${h.pct(S.first_time_buyer[1][1])} to ${h.gbp(top(S.first_time_buyer, 1))}. A ${h.gbp(PRICE)} purchase uses half of the second slice and pays ${h.gbp(eFtb)}. Comparing it with the standard bill shows something useful: between ${h.gbp(top(S.first_time_buyer, 0))} and ${h.gbp(S.first_time_buyer_max_price)}, the relief is worth the same amount at every price, ${h.gbp(eng - eFtb)}, because both tables charge ${h.pct(S.residential[2][1])} on each extra pound in that range.</p>
${h.table(['Price', 'Standard SDLT', 'First-time buyer', 'Value of the relief'], ladder, 'What the relief is worth across its range', ['l', 'r', 'r', 'r'])}
<p>The last row shows the other side: one pound past ${h.gbp(S.first_time_buyer_max_price)}, the relief is gone and the standard table applies to the whole price. At ${h.gbp(PRICE)} a first-time buyer is still ${h.gbp(S.first_time_buyer_max_price - PRICE)} away from that edge.</p>
<h2>The top of the Welsh ${h.pct(W.main[1][1])} band</h2>
<p>Welsh main rates have no slice at ${h.pct(S.residential[1][1])} or ${h.pct(S.residential[2][1])}. After the nil band comes a ${h.pct(W.main[1][1])} slice from ${h.gbp(top(W.main, 0) + 1)} to ${h.gbp(top(W.main, 1))}, so ${h.gbp(PRICE)} fills it exactly: ${h.gbp(top(W.main, 1) - top(W.main, 0))} at ${h.pct(W.main[1][1])} is ${h.gbp(wal)}. From the next pound the rate is ${h.pct(W.main[2][1])}, which is the reason a Welsh buyer pays more than an English one from here upwards. The higher rates for second homes turn at the same point, from ${h.pct(W.higher[2][1])} to ${h.pct(W.higher[3][1])} (${h.a('ltt-rates', 'Welsh rates')}).</p>
<p>Scotland is the dearest of the three at this price. Its ${h.pct(L.residential[3][1])} band begins at ${h.gbp(top(L.residential, 2) + 1)}, so ${h.gbp(PRICE - top(L.residential, 2))} of the price is taxed at that rate and the LBTT bill reaches ${h.gbp(sco)}, ${h.gbp(sco - eng)} more than in England. For a first-time buyer the gap widens to ${h.gbp(h.t('scotland', PRICE, 'first') - eFtb)}, because the Scottish relief stops growing at ${h.gbp(L.first_time_buyer_max_saving)}.</p>
<h2>Buying from overseas at ${h.gbp(PRICE)}</h2>
<p>England and Northern Ireland charge a ${h.a('non-resident-stamp-duty-surcharge', 'non-resident surcharge')} of ${h.pct(S.non_resident_surcharge)} on every band of whichever table the buyer uses. A buyer is non-resident if they spent fewer than ${S.non_resident_days} days in the UK in the year before completion, and one non-resident among several buyers is enough, except for a spouse or civil partner living with a UK-resident partner (${h.src('sdltmNonResSpouse', 'SDLTM09885')}). On ${h.gbp(PRICE)} the surcharge is ${h.gbp(PRICE * S.non_resident_surcharge)} whatever the situation:</p>
${h.table(['Buyer', 'UK resident', 'Non-resident', 'Surcharge'], nrRows, `SDLT on ${h.gbp(PRICE)} for UK and overseas buyers`, ['l', 'r', 'r', 'r'])}
<p>The surcharge can be recovered by a buyer who reaches ${S.non_resident_days} days in the UK in a continuous period of one year that starts no earlier than a year before the purchase and ends no later than a year after it (${h.src('sdltmNonResRefund', 'SDLTM09960')}). Neither LBTT in Scotland nor LTT in Wales has an equivalent.</p>`;
  },
});
