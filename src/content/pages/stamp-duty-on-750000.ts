import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';
import type { Nation, Situation } from '../../lib/engine/tax';

const PRICE = 750000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const sAdd = compute({ nation: 'scotland', price: PRICE, situation: 'additional' });

export default definePage({
  id: 'stamp-duty-on-750000',
  group: 'prices',
  order: 210,
  slug: 'stamp-duty-on-750000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `The last pound of the Scottish ${pct(L.residential[3][1])} band: ${gbp(sco)} of LBTT against ${gbp(eng)} of SDLT.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: LBTT and LTT Bands Turn`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eng)} in England, ${gbp(sco)} of LBTT in Scotland, ${gbp(wal)} in Wales, and ${gbp(sAdd.total)} for a Scottish second home with the ADS.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `The Scottish and Welsh tables both change rate at this price, while the English one carries on unchanged.`,
  resume: `On a ${gbp(PRICE)} home bought as an only residence, Land and Buildings Transaction Tax in Scotland comes to ${gbp(sco)}, Land Transaction Tax in Wales to ${gbp(wal)} and Stamp Duty Land Tax in England and Northern Ireland to ${gbp(eng)}. The Scottish bill is ${gbp(sco - eng)} higher than the English one because LBTT charges ${pct(L.residential[3][1])} on everything from ${gbp(top(L.residential, 2) + 1)} to ${gbp(top(L.residential, 3))}, while SDLT stays at ${pct(S.residential[2][1])} up to ${gbp(top(S.residential, 2))}. ${gbp(PRICE)} is the exact top of that Scottish ${pct(L.residential[3][1])} band, and also of the Welsh ${pct(W.main[2][1])} band and the Welsh higher-rate ${pct(W.higher[3][1])} band, so the next pound costs ${pct(L.residential[4][1])} in Scotland and ${pct(W.main[3][1])} in Wales. A second home costs ${gbp(t('england', PRICE, 'additional'))} in England, ${gbp(t('wales', PRICE, 'additional'))} in Wales and ${gbp(sAdd.total)} in Scotland, where the Additional Dwelling Supplement alone is ${gbp(sAdd.surcharge)}. A buyer living abroad pays ${gbp(t('england', PRICE, 'home', { nonResident: true }))} in England and the same as a resident in the other two nations.`,
  faqs: [
    { q: `We are moving from Surrey to Edinburgh and buying at ${gbp(PRICE)}. Why is the tax almost double?`, a: `Because Scotland taxes the slice above ${gbp(top(L.residential, 2))} at ${pct(L.residential[3][1])}, while England charges ${pct(S.residential[2][1])} up to ${gbp(top(S.residential, 2))}. On your purchase that gives ${gbp(sco)} of LBTT against ${gbp(eng)} of SDLT. If your Surrey home is sold before completion, no supplement applies; if not, the ${gbp(sAdd.surcharge)} supplement is due and can be reclaimed after the sale within ${L.replace_main_residence_months} months.` },
    { q: `How much of a ${gbp(PRICE + 50000)} price in Wales is taxed at ${pct(W.main[3][1])}?`, a: `Only the ${gbp(50000)} above ${gbp(top(W.main, 2))}. Up to that point the Welsh main rates charge nothing, then ${pct(W.main[1][1])} and ${pct(W.main[2][1])}, adding up to ${gbp(wal)}. The extra ${gbp(50000)} costs ${gbp(t('wales', PRICE + 50000) - wal)} more, for a total of ${gbp(t('wales', PRICE + 50000))}. In England the same extra slice costs ${gbp(t('england', PRICE + 50000) - eng)}. A Welsh second home pays ${pct(W.higher[4][1])} on that slice instead.` },
    { q: `What is the effective rate of LBTT on a ${gbp(PRICE)} house?`, a: `${pct(sco / PRICE)} of the price, compared with ${pct(eng / PRICE)} for SDLT in England and ${pct(wal / PRICE)} for LTT in Wales. The effective rate is the total tax divided by the price; it is always lower than the top band rate, because the lower slices are taxed at lower rates or not at all.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-600000', 'stamp-duty-on-925000', 'lbtt-rates', 'ltt-rates', 'stamp-duty-england-scotland-wales-compared', 'stamp-duty-edinburgh'],
  sources: ['rsResidential', 'rsAds', 'wraRates', 'wraHigher', 'govSdltRates'],
  body: (h) => {
    const lines: Array<[string, Nation, Situation]> = [
      ['England & NI, only home', 'england', 'home'], ['England & NI, second home', 'england', 'additional'],
      ['Scotland, only home', 'scotland', 'home'], ['Scotland, second home', 'scotland', 'additional'],
      ['Wales, only home', 'wales', 'home'], ['Wales, second home', 'wales', 'additional'],
    ];
    const rows = lines.map(([l, n, s]) => { const a = h.t(n, PRICE, s), b = h.t(n, PRICE + 50000, s); return [l, h.gbp(a), h.gbp(b), h.pct((b - a) / 50000)]; });
    return `
<h2>Two tables change rate at ${h.gbp(PRICE)}</h2>
<p>In Scotland the ${h.pct(L.residential[3][1])} band of LBTT ends here and the top rate of ${h.pct(L.residential[4][1])} begins. In Wales the ${h.pct(W.main[2][1])} band of the main rates ends and ${h.pct(W.main[3][1])} begins, and for a second home the higher rates step from ${h.pct(W.higher[3][1])} to ${h.pct(W.higher[4][1])}. England keeps going at ${h.pct(S.residential[2][1])} until ${h.gbp(top(S.residential, 2))}. The table compares a ${h.gbp(PRICE)} purchase with one ${h.gbp(50000)} higher, and the rate paid on that extra slice.</p>
${h.table(['Buyer', h.gbp(PRICE), h.gbp(PRICE + 50000), 'Rate on the extra'], rows, `What the next ${h.gbp(50000)} costs above ${h.gbp(PRICE)}`, ['l', 'r', 'r', 'r'])}
<p>For a Scottish second home the extra slice costs ${h.pct(L.residential[4][1] + L.ads_rate)}: the top LBTT rate plus the ${h.pct(L.ads_rate)} supplement, which is charged on the whole price, the extra included. A Welsh second home pays ${h.pct(W.higher[4][1])} on the same slice, and an English one ${h.pct(S.residential[2][1] + S.higher_rates_surcharge)}.</p>
<h2>Why LBTT runs so far ahead of SDLT here</h2>
<p>The two tables start close together. Scotland’s nil band is wider (${h.gbp(top(L.residential, 0))} against ${h.gbp(top(S.residential, 0))}), and up to ${h.gbp(top(L.residential, 2))} the bills are within a few hundred pounds of each other. The difference opens in the next slice: Scotland charges ${h.pct(L.residential[3][1])} from ${h.gbp(top(L.residential, 2) + 1)}, England ${h.pct(S.residential[2][1])}. On a ${h.gbp(PRICE)} home that slice is ${h.gbp(PRICE - top(L.residential, 2))} long, and the ${h.pct(L.residential[3][1] - S.residential[2][1])} gap on it, ${h.gbp((PRICE - top(L.residential, 2)) * (L.residential[3][1] - S.residential[2][1]))}, more than covers the ${h.gbp(sco - eng)} difference; the wider Scottish nil band gives a little back lower down.</p>
${h.breakdown({ nation: 'scotland', price: PRICE, situation: 'home' }, `LBTT on ${h.gbp(PRICE)}, slice by slice`)}
<p>Buyers of large family homes in ${h.a('stamp-duty-edinburgh', 'Edinburgh')} meet this directly: the average detached house there sold for ${h.gbp(h.place('city-of-edinburgh').detached!)} in July 2026, which carries ${h.gbp(h.t('scotland', h.place('city-of-edinburgh').detached!))} of LBTT. The same price in England would carry ${h.gbp(h.t('england', h.place('city-of-edinburgh').detached!))} of SDLT. The ${h.a('lbtt-rates', 'LBTT rates page')} has the full Scottish table.</p>
<h2>The Scottish second home at ${h.gbp(PRICE)}</h2>
<p>The Additional Dwelling Supplement is ${h.pct(L.ads_rate)} of the full price, ${h.gbp(sAdd.surcharge)} here, on top of the ${h.gbp(sco)} of LBTT. It applies to a buyer who will own more than one dwelling and to any company buying a home (${h.src('rsAds', 'Revenue Scotland')}). For a family buying before selling, it is reclaimable once the previous main home is sold within ${L.replace_main_residence_months} months. The old home must have been the main residence at some point in the ${L.replace_main_residence_months} months before the purchase, and the buyers must live in the new one. Revenue Scotland does not extend the deadline for exceptional circumstances, so a slow sale can cost the full ${h.gbp(sAdd.surcharge)}.</p>`;
  },
});
