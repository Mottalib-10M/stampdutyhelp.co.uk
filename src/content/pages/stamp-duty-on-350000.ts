import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';
import type { Nation } from '../../lib/engine/tax';

const PRICE = 350000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const add = (n: Nation) => compute({ nation: n, price: PRICE, situation: 'additional' });

export default definePage({
  id: 'stamp-duty-on-350000',
  group: 'prices',
  order: 160,
  slug: 'stamp-duty-on-350000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `England and Wales charge the same ${gbp(eng)} here; buying before selling turns it into ${gbp(add('england').total)}.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: England and Wales Level`,
  description: `Stamp duty on a ${gbp(PRICE)} family home in 2026: ${gbp(eng)} in England, ${gbp(wal)} in Wales, ${gbp(sco)} in Scotland, and the refundable surcharge when you buy before you sell.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `The price where English and Welsh tax meet, and a common budget for a family moving up.`,
  resume: `A ${gbp(PRICE)} home bought by someone who will own only that property costs ${gbp(eng)} in Stamp Duty Land Tax in England and Northern Ireland and ${gbp(wal)} in Land Transaction Tax in Wales: the two bills are equal, although the bands behind them are not. England taxes ${gbp(top(S.residential, 1) - top(S.residential, 0))} at ${pct(S.residential[1][1])} and the rest above ${gbp(top(S.residential, 1))} at ${pct(S.residential[2][1])}; Wales taxes nothing up to ${gbp(top(W.main, 0))} and ${pct(W.main[1][1])} after that. Scotland charges ${gbp(sco)} of LBTT, a little more, because its ${pct(L.residential[3][1])} band starts at ${gbp(top(L.residential, 2) + 1)}. The equality breaks down for other buyers. A first-time buyer pays ${gbp(t('england', PRICE, 'first'))} in England but ${gbp(wal)} in Wales, which has no relief. A family that buys its next home before selling the current one pays the surcharge first: ${gbp(add('england').total)} in England, ${gbp(add('wales').total)} in Wales and ${gbp(add('scotland').total)} in Scotland, with ${gbp(add('england').refundable)}, ${gbp(add('wales').refundable)} and ${gbp(add('scotland').refundable)} recoverable after the sale.`,
  faqs: [
    { q: `We found a ${gbp(PRICE)} house but ours has not sold yet. How much of the extra tax comes back?`, a: `In England, ${gbp(add('england').refundable)} of the ${gbp(add('england').total)} paid, provided the old main home is sold within ${S.replace_main_residence_years} years of completion. You claim within ${S.refund_claim_months} months of the sale or of the filing date of the return, whichever is later. No refund is available if your spouse keeps a share of the old home. Selling on or before completion day avoids the higher rates altogether.` },
    { q: `Why do England and Wales charge the same on ${gbp(PRICE)} but not at other prices?`, a: `Because the Welsh table starts later and climbs faster. Wales has a wider nil band, to ${gbp(top(W.main, 0))}, then ${pct(W.main[1][1])}; England starts at ${pct(S.residential[1][1])} from ${gbp(top(S.residential, 0) + 1)} and moves to ${pct(S.residential[2][1])}. Below ${gbp(PRICE)} Wales is cheaper and above it England is: at ${gbp(PRICE + 50000)}, ${gbp(t('england', PRICE + 50000))} against ${gbp(t('wales', PRICE + 50000))}. Scotland sits above both at this price, with ${gbp(sco)}.` },
    { q: `Is the Additional Dwelling Supplement on a ${gbp(PRICE)} Edinburgh house refunded if we sell our flat later?`, a: `Yes, if the flat was your main residence within the ${L.replace_main_residence_months} months before the purchase, it is sold within ${L.replace_main_residence_months} months after, and you live in the new house as your main home. The supplement here is ${gbp(add('scotland').surcharge)}. Revenue Scotland accepts no exceptional circumstances for late sales, so the deadline is firm.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-300000', 'stamp-duty-on-400000', 'stamp-duty-moving-home', 'stamp-duty-surcharge-refund', 'ads-repayment', 'stamp-duty-cardiff'],
  sources: ['govSdltRates', 'govSdltHigher', 'wraRates', 'wraRefund', 'rsAdsRepayment'],
  body: (h) => {
    const cmp = [PRICE - 100000, PRICE - 50000, PRICE, PRICE + 50000, PRICE + 150000].map((p) => [h.gbp(p), h.gbp(h.t('england', p)), h.gbp(h.t('wales', p)), h.gbp(h.t('wales', p) - h.t('england', p))]);
    const nations: Array<[string, Nation, string]> = [
      ['England & NI', 'england', `${S.replace_main_residence_years} years`],
      ['Scotland', 'scotland', `${L.replace_main_residence_months} months`],
      ['Wales', 'wales', `${W.replace_main_residence_years} years`],
    ];
    const moveRows = nations.map(([l, n, win]) => { const r = add(n); return [l, h.gbp(r.mainTax), h.gbp(r.total), h.gbp(r.refundable), win]; });
    return `
<h2>The same bill on either side of the Severn</h2>
<p>A ${h.gbp(PRICE)} house in Chepstow and one a few miles away in Gloucestershire cost the same in tax: ${h.gbp(eng)}. That is a coincidence of two different shapes. The English bill is built from a small ${h.pct(S.residential[1][1])} slice and a larger ${h.pct(S.residential[2][1])} slice; the Welsh bill from a long free stretch to ${h.gbp(top(W.main, 0))} followed by ${h.pct(W.main[1][1])}. Lower down, Wales comes out ahead; higher up, England does, as the table shows.</p>
${h.table(['Price', 'England & NI', 'Wales', 'Wales minus England'], cmp, 'Only home: SDLT and LTT side by side', ['l', 'r', 'r', 'r'])}
<p>The levelling only holds for a buyer with no relief and no other home. A first-time buyer in England pays ${h.gbp(h.t('england', PRICE, 'first'))}, because the ${h.a('stamp-duty-first-time-buyer', 'relief')} taxes only the slice above ${h.gbp(top(S.first_time_buyer, 0))}. In Wales that buyer still pays ${h.gbp(wal)}.</p>
<h2>Moving up before the old house sells</h2>
<p>Take a family trading a smaller home for a bigger one at this price. If the old home is sold on or before completion day, the purchase is a replacement of the main residence and ordinary rates apply. If the sale lags behind, all three nations charge the surcharge first and refund it once the old home is gone, within each nation’s window.</p>
${h.table(['Nation', 'Tax if old home already sold', 'Tax if not yet sold', 'Refundable later', 'Window to sell'], moveRows, `Buying a ${h.gbp(PRICE)} home before selling`, ['l', 'r', 'r', 'r', 'l'])}
<p>Each nation adds its own conditions. In England, nothing is refunded if a spouse or civil partner keeps a share of the old home. In Scotland, for purchases since 1 April 2024, it is enough that one of the buyers sold the previous main residence, but every buyer must live in the new one. In Wales, adding a parent who owns a home as co-buyer brings in the higher rates, while a joint borrower, sole proprietor mortgage does not.</p>
<p>The deadlines to claim differ: in Wales, an amended return within ${W.amend_months} months of the filing date, or a claim within ${W.refund_claim_years} years after it (${h.src('wraRefund', 'Welsh Revenue Authority')}); in Scotland, an amendment within ${L.amend_months} months, otherwise an overpayment claim within ${L.overpayment_claim_years} years. The ${h.a('stamp-duty-moving-home', 'moving home guide')} and the ${h.a('stamp-duty-surcharge-refund', 'refund calculator')} set out the steps.</p>
<h2>Family homes near ${h.gbp(PRICE)}</h2>
<p>On the UK House Price Index for July 2026, the average semi-detached house in ${h.a('stamp-duty-cardiff', 'Cardiff')} sold for ${h.gbp(h.place('cardiff').semi!)}, and the average home in ${h.a('stamp-duty-bristol', 'Bristol')} for ${h.gbp(h.place('city-of-bristol').avg)}. In Edinburgh the average home cost ${h.gbp(h.place('city-of-edinburgh').avg)}, which carries ${h.gbp(h.t('scotland', h.place('city-of-edinburgh').avg))} of LBTT.</p>`;
  },
});
