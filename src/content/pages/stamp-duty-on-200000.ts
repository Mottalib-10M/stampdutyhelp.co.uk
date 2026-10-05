import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top } from '../../lib/kit';

const PRICE = 200000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const eFtb = t('england', PRICE, 'first'), sFtb = t('scotland', PRICE, 'first');

export default definePage({
  id: 'stamp-duty-on-200000',
  group: 'prices',
  order: 130,
  slug: 'stamp-duty-on-200000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `A first home at ${gbp(PRICE)}: ${gbp(eFtb)} in England, ${gbp(sFtb)} in Scotland, ${gbp(wal)} in Wales.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: First Homes Compared`,
  description: `Stamp duty on a ${gbp(PRICE)} first home in 2026: ${gbp(eFtb)} in England, ${gbp(sFtb)} in Scotland and ${gbp(wal)} in Wales, rising to ${gbp(eng)} in England if one of the buyers owned before.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `A starter home price in much of the north, Scotland and Wales, and a good test of how each nation treats first-time buyers.`,
  resume: `A first-time buyer paying ${gbp(PRICE)} owes ${gbp(eFtb)} of Stamp Duty Land Tax in England and Northern Ireland, ${gbp(sFtb)} of Land and Buildings Transaction Tax in Scotland and ${gbp(wal)} of Land Transaction Tax in Wales. The three results come from three different designs. England’s first-time buyer relief has a nil band to ${gbp(top(S.first_time_buyer, 0))}, so the whole price is covered. Scotland’s relief only lifts its nil band to ${gbp(L.first_time_buyer_nil_band)}, leaving ${gbp(PRICE - L.first_time_buyer_nil_band)} taxed at ${pct(L.residential[1][1])}. Wales has no relief at all, but its nil band for every buyer runs to ${gbp(top(W.main, 0))}. The order changes as soon as one buyer has owned a home before, even a share of one: the relief is lost for the whole purchase, and the bill becomes ${gbp(eng)} in England and ${gbp(sco)} in Scotland, while Wales stays at ${gbp(wal)}. Buying it as a second home costs ${gbp(t('england', PRICE, 'additional'))}, ${gbp(t('scotland', PRICE, 'additional'))} and ${gbp(t('wales', PRICE, 'additional'))} respectively.`,
  faqs: [
    { q: `My partner owned a flat years ago and I never have. Do we lose relief on a ${gbp(PRICE)} house together?`, a: `Yes, if you buy together. Every buyer must be a first-time buyer, so the past flat removes the relief for both of you: ${gbp(eng)} in England instead of ${gbp(eFtb)}, ${gbp(sco)} in Scotland instead of ${gbp(sFtb)}. In England, if you buy alone, HMRC does not look at your spouse’s history for this relief (SDLTM29845), although you must still live in the home.` },
    { q: `Why does a Scottish first-time buyer pay tax on ${gbp(PRICE)} when an English one pays nothing?`, a: `Because the Scottish relief only moves the nil band up to ${gbp(L.first_time_buyer_nil_band)}, worth at most ${gbp(L.first_time_buyer_max_saving)}. The remaining ${gbp(PRICE - L.first_time_buyer_nil_band)} is taxed at ${pct(L.residential[1][1])}, giving ${gbp(sFtb)}. England’s relief uses its own table with a nil band to ${gbp(top(S.first_time_buyer, 0))}, so a ${gbp(PRICE)} first home stays entirely free. The Scottish saving is still the full ${gbp(sco - sFtb)}.` },
    { q: `Is it worth buying a ${gbp(PRICE)} home in Wales rather than England if we have owned before?`, a: `On tax alone the gap is ${gbp(eng - wal)}: ${gbp(eng)} in England and ${gbp(wal)} in Wales, whose main rates charge nothing up to ${gbp(top(W.main, 0))}. For first-time buyers the gap disappears, since both nations then charge ${gbp(eFtb)}. Land Transaction Tax is filed within ${W.return_days} days of completion, Stamp Duty Land Tax within ${S.return_days}.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-175000', 'stamp-duty-on-250000', 'stamp-duty-joint-purchase', 'stamp-duty-first-time-buyer', 'ltt-first-time-buyers', 'stamp-duty-newcastle'],
  sources: ['govSdltRates', 'sdltmFtb', 'rsFtb', 'wraGuide'],
  body: (h) => {
    const rows = [
      ['Every buyer a first-time buyer', h.gbp(eFtb), h.gbp(sFtb), h.gbp(h.t('wales', PRICE, 'first'))],
      ['Two buyers, one has owned before', h.gbp(eng), h.gbp(sco), h.gbp(wal)],
      ['Moving home, old one sold the same day', h.gbp(eng), h.gbp(sco), h.gbp(wal)],
      ['One buyer keeps another home', h.gbp(h.t('england', PRICE, 'additional')), h.gbp(h.t('scotland', PRICE, 'additional')), h.gbp(h.t('wales', PRICE, 'additional'))],
    ];
    const towns: Array<[string, string]> = [['newcastle-upon-tyne', 'Newcastle upon Tyne'], ['sheffield', 'Sheffield'], ['city-of-glasgow', 'Glasgow'], ['swansea', 'Swansea']];
    const townRows = towns.map(([k, n]) => { const r = h.place(k); const nat = r.nation === 'scotland' ? 'scotland' : r.nation === 'wales' ? 'wales' : 'england'; return [n, h.gbp(r.ftb!), h.gbp(h.t(nat, r.ftb!, 'first'))]; });
    return `
<h2>One first home, three tax designs</h2>
<p>At ${h.gbp(PRICE)} the three systems give three different answers to the same buyer. England and Northern Ireland apply a separate first-time buyer table whose nil band reaches ${h.gbp(top(S.first_time_buyer, 0))}, so nothing is due. Scotland keeps its normal table and only widens the zero slice to ${h.gbp(L.first_time_buyer_nil_band)}; the next ${h.gbp(PRICE - L.first_time_buyer_nil_band)} pays ${h.pct(L.residential[1][1])}, which is ${h.gbp(sFtb)}. Wales has ${h.a('ltt-first-time-buyers', 'no first-time buyer relief')} but needs none at this level, because nobody pays Land Transaction Tax on the first ${h.gbp(top(W.main, 0))}.</p>
${h.table(['Situation', 'England & NI', 'Scotland', 'Wales'], rows, `Tax on ${h.gbp(PRICE)} for different buyers`, ['l', 'r', 'r', 'r'])}
<p>The second row is the one that surprises buyers. Losing the relief costs ${h.gbp(eng - eFtb)} in England but only ${h.gbp(sco - sFtb)} in Scotland, because the Scottish relief was small to begin with.</p>
<h2>When one of two buyers has owned before</h2>
<p>Relief in England and in Scotland is all or nothing across the buyers. A couple where one partner once held a flat, even a share of one, or inherited a house, buys at the ordinary rates: ${h.gbp(eng)} in England, ${h.gbp(sco)} in Scotland. Only Wales is indifferent, since its answer was ${h.gbp(wal)} either way. Some short leases held in the past do not count as owning in England (${h.src('sdltmFtb', 'SDLTM29845')}).</p>
<p>There is one English nuance for married couples and civil partners. When only one spouse is named as buyer, HMRC examines that buyer’s history alone for the relief, not the partner’s. The higher rates work differently and treat spouses as one unit, so this does not help if the partner still owns a home. The ${h.a('stamp-duty-joint-purchase', 'joint purchase calculator')} applies these rules buyer by buyer.</p>
<h2>Towns where ${h.gbp(PRICE)} is close to a first-time buyer’s price</h2>
<p>The UK House Price Index for July 2026 puts the average price paid by first-time buyers near this figure in several cities. The table shows what each average costs a first-time buyer under its own nation’s rules. In the English cities the result is nil. In Glasgow the average sits ${h.place('city-of-glasgow').ftb! <= L.first_time_buyer_nil_band ? 'just under' : 'just over'} the ${h.gbp(L.first_time_buyer_nil_band)} line of the Scottish relief, and Swansea is far below the Welsh nil band.</p>
${h.table(['City', 'First-time buyer average', 'Tax for a first-time buyer'], townRows, 'First-time buyer averages, UK HPI July 2026', ['l', 'r', 'r'])}
<p>For a buyer who has owned before, the averages for all homes are higher: ${h.gbp(h.place('newcastle-upon-tyne').avg)} in ${h.a('stamp-duty-newcastle', 'Newcastle')} and ${h.gbp(h.place('wales').avg)} for Wales as a whole, still under the Welsh nil band.</p>`;
  },
});
