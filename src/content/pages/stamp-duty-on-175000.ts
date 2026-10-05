import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top } from '../../lib/kit';

const PRICE = 175000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const sFtb = t('scotland', PRICE, 'first');
const wAdd = t('wales', PRICE, 'additional');
const wTop = top(W.higher, 0);

export default definePage({
  id: 'stamp-duty-on-175000',
  group: 'prices',
  order: 120,
  slug: 'stamp-duty-on-175000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `The top of the Scottish first-time buyer nil band, where the relief is worth its full ${gbp(L.first_time_buyer_max_saving)}.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: Where LBTT Relief Peaks`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eng)} in England, ${gbp(sco)} of LBTT in Scotland or ${gbp(sFtb)} for a first-time buyer, ${gbp(wal)} in Wales and ${gbp(wAdd)} on a Welsh second home.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `At ${gbp(PRICE)} a Scottish first-time buyer collects every pound the relief can give.`,
  resume: `A ${gbp(PRICE)} home costs ${gbp(sco)} in Land and Buildings Transaction Tax in Scotland, and ${gbp(sFtb)} for a first-time buyer, because Scottish first-time buyer relief stretches the nil band from ${gbp(top(L.residential, 0))} to exactly ${gbp(L.first_time_buyer_nil_band)}. That makes this the price where the relief reaches its ceiling of ${gbp(L.first_time_buyer_max_saving)}; above it, the saving stays the same however much the home costs. In England and Northern Ireland the same purchase costs ${gbp(eng)} of Stamp Duty Land Tax, or ${gbp(t('england', PRICE, 'first'))} for a first-time buyer, whose nil band runs to ${gbp(top(S.first_time_buyer, 0))}. Wales charges ${gbp(wal)}, since its main rates start only above ${gbp(top(W.main, 0))}. A second home is another matter: ${gbp(wAdd)} in Wales, where the whole price still sits in the first ${pct(W.higher[0][1])} band of the higher rates, ${gbp(t('england', PRICE, 'additional'))} in England and ${gbp(t('scotland', PRICE, 'additional'))} in Scotland with the Additional Dwelling Supplement.`,
  faqs: [
    { q: `We are first-time buyers paying ${gbp(PRICE)} for a flat in Glasgow. How much does the relief save us?`, a: `${gbp(sco - sFtb)}, the most it can ever save. The relief raises the nil band to ${gbp(L.first_time_buyer_nil_band)}, so your LBTT falls from ${gbp(sco)} to ${gbp(sFtb)}. Every buyer must be a first-time buyer who has never owned a home anywhere, inherited ones included, and you must live in the flat as your main residence.` },
    { q: `Will a ${gbp(PRICE)} holiday cottage in Wales push me into a higher band of the Welsh higher rates?`, a: `No. The higher rates charge ${pct(W.higher[0][1])} on everything up to ${gbp(wTop)}, so the cottage costs ${gbp(wAdd)} and stays in the first band. Go above that line and each extra pound is taxed at ${pct(W.higher[1][1])}: a ${gbp(wTop + 10000)} cottage would cost ${gbp(t('wales', wTop + 10000, 'additional'))}. Bought as your only home, the same cottage would be taxed at the main rates: ${gbp(wal)}.` },
    { q: `Which nation is cheapest for a ${gbp(PRICE)} first home?`, a: `For a first-time buyer, none of them charges anything: ${gbp(t('england', PRICE, 'first'))} in England, ${gbp(sFtb)} in Scotland and ${gbp(wal)} in Wales. The difference appears for a buyer who has owned before and is moving: ${gbp(eng)} in England, ${gbp(sco)} in Scotland and still ${gbp(wal)} in Wales, whose nil band is the widest of the three for everyone.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-125000', 'stamp-duty-on-200000', 'lbtt-first-time-buyer-relief', 'ltt-higher-rates', 'lbtt-rates', 'stamp-duty-glasgow'],
  sources: ['rsFtb', 'rsResidential', 'wraHigher', 'govSdltRates'],
  body: (h) => {
    const ladder = [top(L.residential, 0), PRICE - 20000, PRICE - 10000, PRICE, PRICE + 20000, PRICE + 75000].map((p) => {
      const std = h.t('scotland', p), ftb = h.t('scotland', p, 'first');
      return [h.gbp(p), h.gbp(std), h.gbp(ftb), h.gbp(std - ftb)];
    });
    const welsh = [PRICE, wTop, wTop + 10000, wTop + 30000].map((p) => [h.gbp(p), h.gbp(h.t('wales', p, 'additional')), h.gbp(h.t('wales', p)), h.gbp(h.t('england', p, 'additional'))]);
    return `
<h2>Scottish first-time buyer relief at full strength</h2>
<p>Scotland does not give first-time buyers a separate table. It moves one line: the LBTT nil band, normally ${h.gbp(top(L.residential, 0))}, is raised to ${h.gbp(L.first_time_buyer_nil_band)} (${h.src('rsFtb', 'Revenue Scotland, LBTT3048')}). The slice between the two would otherwise be taxed at ${h.pct(L.residential[1][1])}, so the value of the relief grows with the price until the price reaches ${h.gbp(PRICE)}, then freezes at ${h.gbp(L.first_time_buyer_max_saving)}.</p>
<p>That shape matters when comparing offers. Between ${h.gbp(top(L.residential, 0))} and ${h.gbp(PRICE)} a first-time buyer pays no LBTT at all, whatever is agreed. Above ${h.gbp(PRICE)} the relief is still claimed, but it no longer grows, and the buyer pays the ordinary ${h.pct(L.residential[1][1])} on each extra pound. The ${h.a('lbtt-first-time-buyer-relief', 'relief guide')} covers who qualifies.</p>
${h.table(['Price', 'LBTT, standard', 'LBTT, first-time buyer', 'Relief'], ladder, 'Scottish first-time buyer relief around its ceiling', ['l', 'r', 'r', 'r'])}
<h2>The ${h.gbp(wTop)} edge of the Welsh higher rates</h2>
<p>Wales taxes a second home with its own table, and the first band ends at ${h.gbp(wTop)}, only ${h.gbp(wTop - PRICE)} above this price. A holiday cottage or a buy-to-let at ${h.gbp(PRICE)} is therefore taxed at a single rate, ${h.pct(W.higher[0][1])} of the whole price, which gives ${h.gbp(wAdd)}. A buyer who has no other home pays ${h.gbp(wal)} on the same property, so the whole bill is the cost of owning two dwellings.</p>
<p>Past ${h.gbp(wTop)} the rate on the next slice jumps to ${h.pct(W.higher[1][1])}, which is why landlords comparing Welsh listings near this price look closely at the ${h.a('ltt-higher-rates', 'higher rates table')}. In England the same purchase would be taxed through the ordinary bands plus ${h.pct(S.higher_rates_surcharge)} each, as the last column shows.</p>
${h.table(['Price', 'Wales, higher rates', 'Wales, main rates', 'England, higher rates'], welsh, 'Second home around the first Welsh higher-rate band', ['l', 'r', 'r', 'r'])}
<h2>England: ${h.gbp(eng)} or nothing</h2>
<p>In England and Northern Ireland the result depends on a single question: has every buyer never owned a home? If so, the ${h.a('stamp-duty-first-time-buyer', 'first-time buyer relief')} covers the whole ${h.gbp(PRICE)} and the bill is ${h.gbp(t('england', PRICE, 'first'))}. If one buyer has owned before, the ordinary rates apply and the ${h.gbp(PRICE - top(S.residential, 0))} above the nil band is taxed at ${h.pct(S.residential[1][1])}, giving ${h.gbp(eng)}. A buyer who spent fewer than ${S.non_resident_days} days in the UK in the year before completion adds the ${h.pct(S.non_resident_surcharge)} non-resident surcharge to every band, relief or not: ${h.gbp(h.t('england', PRICE, 'first', { nonResident: true }))} as a first-time buyer, ${h.gbp(h.t('england', PRICE, 'home', { nonResident: true }))} otherwise. Scotland and Wales have no such surcharge.</p>
<p>At July 2026 prices, ${h.gbp(PRICE)} is close to what first-time buyers paid on average in ${h.a('stamp-duty-liverpool', 'Liverpool')} (${h.gbp(h.place('liverpool').ftb!)}) and in ${h.a('stamp-duty-glasgow', 'Glasgow')} (${h.gbp(h.place('city-of-glasgow').ftb!)}), according to the UK House Price Index.</p>`;
  },
});
