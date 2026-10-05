import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';
import type { Input } from '../../lib/engine/tax';

const PRICE = 1500000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const tot = (i: Omit<Input, 'price'>, p = PRICE) => compute({ ...i, price: p }).total;
/** Rate paid on the next £100,000 above the price. */
const next = (i: Omit<Input, 'price'>) => (tot(i, PRICE + 100000) - tot(i)) / 100000;

export default definePage({
  id: 'stamp-duty-on-1500000',
  group: 'prices',
  order: 240,
  slug: 'stamp-duty-on-1500000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `The top band starts above ${gbp(PRICE)} in England and Wales: ${gbp(eng)} of SDLT, ${gbp(wal)} of LTT, ${gbp(sco)} of LBTT.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: Into the Top Band`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eng)} in England, ${gbp(wal)} in Wales, ${gbp(sco)} in Scotland, and up to ${pct(next({ nation: 'england', situation: 'additional', nonResident: true }))} on each pound above for overseas landlords.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `Every pound above ${gbp(PRICE)} is taxed at the top rate in all three nations; the surcharges decide how high that rate goes.`,
  resume: `On a ${gbp(PRICE)} home bought as an only residence, Stamp Duty Land Tax in England and Northern Ireland is ${gbp(eng)}, Land Transaction Tax in Wales is ${gbp(wal)} and Land and Buildings Transaction Tax in Scotland is ${gbp(sco)}. ${gbp(PRICE)} is the last pound of the ${pct(S.residential[3][1])} band in England and in Wales; above it, both charge their top rate of ${pct(S.residential[4][1])}, the same rate Scotland has applied since ${gbp(top(L.residential, 3))}. From here, the three nations tax each extra pound of an only home identically, and what separates buyers is their situation. In England a second home pays ${pct(next({ nation: 'england', situation: 'additional' }))} on every pound above this price, a non-resident ${pct(next({ nation: 'england', situation: 'home', nonResident: true }))}, and a non-resident with another home ${pct(next({ nation: 'england', situation: 'additional', nonResident: true }))}. A Welsh second home pays ${pct(W.higher[5][1])} at the margin, and a Scottish one ${pct(next({ nation: 'scotland', situation: 'additional' }))}, the top LBTT rate plus the ${pct(L.ads_rate)} supplement. A second home at this price costs ${gbp(t('england', PRICE, 'additional'))} in England, ${gbp(t('wales', PRICE, 'additional'))} in Wales and ${gbp(t('scotland', PRICE, 'additional'))} in Scotland.`,
  faqs: [
    { q: `How much of a ${gbp(PRICE + 300000)} house is taxed at the top rate in England?`, a: `The ${gbp(300000)} above ${gbp(top(S.residential, 3))}, at ${pct(S.residential[4][1])}, which is ${gbp(t('england', PRICE + 300000) - eng)}. The rest of the price is taxed through the lower bands exactly as on a ${gbp(PRICE)} home, ${gbp(eng)}, for a total of ${gbp(t('england', PRICE + 300000))}. The top rate never applies to the whole price; only a company without a relief pays one flat rate on everything.` },
    { q: `Is the effective rate on a ${gbp(PRICE)} home higher in Wales or in England?`, a: `In Wales: ${pct(wal / PRICE)} against ${pct(eng / PRICE)} in England, a difference of ${gbp(wal - eng)}. Wales has no ${pct(S.residential[1][1])} slice, moves to ${pct(W.main[2][1])} from ${gbp(top(W.main, 1) + 1)} and to ${pct(W.main[3][1])} from ${gbp(top(W.main, 2) + 1)}, while England stays at ${pct(S.residential[2][1])} until ${gbp(top(S.residential, 2))}. Above ${gbp(PRICE)} both charge ${pct(S.residential[4][1])}, so the gap stays the same at any higher price.` },
    { q: `Our family company is buying a ${gbp(PRICE)} house that no business will use. What is the SDLT?`, a: `${gbp(tot({ nation: 'england', situation: 'home', company: true }))}, which is ${pct(S.corporate_flat_rate)} of the whole price. The reliefs from the flat rate cover businesses such as property letting, development and trading, homes opened to the public, homes for employees and farmhouses. A house held with none of these purposes pays the full rate. The company may also have to pay the Annual Tax on Enveloped Dwellings on the property.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-1000000', 'stamp-duty-on-925000', 'stamp-duty-rates', 'ltt-rates', 'stamp-duty-company-purchase', 'non-resident-stamp-duty-surcharge'],
  sources: ['govSdltRates', 'govSdltHigher', 'govSdltCorporate', 'wraRates', 'wraHigher', 'rsResidential'],
  body: (h) => {
    const buyers: Array<[string, Omit<Input, 'price'>]> = [
      ['England & NI, only home', { nation: 'england', situation: 'home' }],
      ['England & NI, non-resident', { nation: 'england', situation: 'home', nonResident: true }],
      ['England & NI, second home', { nation: 'england', situation: 'additional' }],
      ['England & NI, non-resident with another home', { nation: 'england', situation: 'additional', nonResident: true }],
      ['England & NI, company without relief', { nation: 'england', situation: 'home', company: true }],
      ['Wales, only home', { nation: 'wales', situation: 'home' }],
      ['Wales, second home', { nation: 'wales', situation: 'additional' }],
      ['Scotland, only home', { nation: 'scotland', situation: 'home' }],
      ['Scotland, second home', { nation: 'scotland', situation: 'additional' }],
    ];
    const rows = buyers.map(([l, i]) => [l, h.gbp(tot(i)), h.pct(next(i))]);
    return `
<h2>Where the top band begins</h2>
<p>England and Wales both end their ${h.pct(S.residential[3][1])} band at ${h.gbp(top(S.residential, 3))} and charge ${h.pct(S.residential[4][1])} beyond it (${h.src('govSdltRates', 'GOV.UK')}, ${h.src('wraRates', 'Welsh Revenue Authority')}). Scotland got there sooner: its ${h.pct(L.residential[4][1])} band starts at ${h.gbp(top(L.residential, 3) + 1)}, which is why its bill on ${h.gbp(PRICE)} is already ${h.gbp(sco - eng)} above England’s. Once a buyer of an only home crosses ${h.gbp(PRICE)}, each additional pound costs the same everywhere in Great Britain and in Northern Ireland, and the gaps between the nations stop growing.</p>
<p>That makes the headline bill less useful than the rate on the next pound. Two buyers at the same price can face very different marginal rates depending on whether they own another home, live abroad or buy through a company.</p>
<h2>The rate on each pound above ${h.gbp(PRICE)}, buyer by buyer</h2>
${h.table(['Buyer', `Tax on ${h.gbp(PRICE)}`, 'Rate on the next pound'], rows, `Bills at ${h.gbp(PRICE)} and the marginal rate above it`, ['l', 'r', 'r'])}
<p>In England the surcharges are added to the top rate: ${h.pct(S.higher_rates_surcharge)} for a second home, ${h.pct(S.non_resident_surcharge)} for a non-resident, both for a non-resident who keeps another home. Wales uses a separate higher-rates table whose top band, also from ${h.gbp(top(W.higher, 4) + 1)}, is ${h.pct(W.higher[5][1])}. In Scotland the supplement is charged on the whole price, so it adds ${h.pct(L.ads_rate)} to every pound, the next one included. A company in England without a relief pays a flat ${h.pct(S.corporate_flat_rate)}, so its marginal rate is the same as its average rate.</p>
<h2>The English bill at ${h.gbp(PRICE)}, band by band</h2>
${h.breakdown({ nation: 'england', price: PRICE, situation: 'home' }, `SDLT on ${h.gbp(PRICE)}, standard rates`)}
<p>More than half of the English bill comes from the ${h.pct(S.residential[3][1])} slice between ${h.gbp(top(S.residential, 2) + 1)} and ${h.gbp(top(S.residential, 3))}. The ${h.a('stamp-duty-rates', 'SDLT rates page')} and the ${h.a('ltt-rates', 'Welsh rates page')} show the full tables.</p>
<p>The Welsh bill of ${h.gbp(wal)} is built differently: nothing to ${h.gbp(top(W.main, 0))}, then ${h.pct(W.main[1][1])}, ${h.pct(W.main[2][1])} and ${h.pct(W.main[3][1])} slices, with a ${h.pct(W.main[3][1])} slice of ${h.gbp(top(W.main, 3) - top(W.main, 2))} against ${h.gbp(top(S.residential, 3) - top(S.residential, 2))} in England. The Scottish bill of ${h.gbp(sco)} already includes ${h.gbp(PRICE - top(L.residential, 3))} taxed at ${h.pct(L.residential[4][1])}.</p>
<h2>Homes that cross the line</h2>
<p>On the UK House Price Index for July 2026, the average detached house in Elmbridge, Surrey, sold for ${h.gbp(h.place('elmbridge').detached!)}, and the average terraced house in Kensington and Chelsea for ${h.gbp(h.place('kensington-and-chelsea').terraced!)}. On the first, an only home pays ${h.gbp(h.t('england', h.place('elmbridge').detached!))} of SDLT, of which ${h.gbp(h.t('england', h.place('elmbridge').detached!) - eng)} comes from the slice above ${h.gbp(PRICE)}. On the second, the bill is ${h.gbp(h.t('england', h.place('kensington-and-chelsea').terraced!))}, or ${h.gbp(h.t('england', h.place('kensington-and-chelsea').terraced!, 'additional', { nonResident: true }))} for an overseas buyer who owns another home.</p>`;
  },
});
