import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const PRICE = 300000;
const S = P.sdlt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);

export default definePage({
  id: 'stamp-duty-on-300000',
  group: 'prices',
  order: 150,
  slug: 'stamp-duty-on-300000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `The last price a first-time buyer in England pays nothing on: ${gbp(eng)} for everyone else.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: England, Scotland, Wales`,
  description: `Stamp duty on a ${gbp(PRICE)} home in 2026: ${gbp(eng)} in England and Northern Ireland, ${gbp(0)} for a first-time buyer, ${gbp(sco)} in Scotland and ${gbp(wal)} in Wales, band by band.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `${gbp(PRICE)} is exactly where first-time buyer relief in England stops being free.`,
  resume: `On a ${gbp(PRICE)} purchase in England or Northern Ireland, a buyer who will own just this home pays ${gbp(eng)} of Stamp Duty Land Tax: nothing on the first ${gbp(top(S.residential, 0))}, ${pct(S.residential[1][1])} on the next ${gbp(top(S.residential, 1) - top(S.residential, 0))} and ${pct(S.residential[2][1])} on the last ${gbp(PRICE - top(S.residential, 1))}. A first-time buyer pays ${gbp(t('england', PRICE, 'first'))}, because ${gbp(top(S.first_time_buyer, 0))} is the top of the relief’s nil band, and the first pound above it is taxed at ${pct(S.first_time_buyer[1][1])}. Someone buying a second home pays ${gbp(t('england', PRICE, 'additional'))}, the figure HMRC itself uses as its example. The same house costs ${gbp(sco)} in Land and Buildings Transaction Tax in Scotland, or ${gbp(t('scotland', PRICE, 'additional'))} with the Additional Dwelling Supplement, and ${gbp(wal)} in Land Transaction Tax in Wales, or ${gbp(t('wales', PRICE, 'additional'))} at the Welsh higher rates. A buyer living abroad pays ${gbp(t('england', PRICE, 'home', { nonResident: true }))} in England, and nothing extra in Scotland or Wales.`,
  faqs: [
    { q: `We are first-time buyers and the flat is ${gbp(PRICE + 5000)}. How much does the extra ${gbp(5000)} cost in tax?`, a: `${gbp(t('england', PRICE + 5000, 'first'))}. Above ${gbp(top(S.first_time_buyer, 0))} the relief charges ${pct(S.first_time_buyer[1][1])} on each extra pound, so ${gbp(5000)} over the line adds ${gbp(t('england', PRICE + 5000, 'first'))}, far less than the ${gbp(t('england', PRICE + 5000))} a buyer without the relief would pay on the whole price. The relief only disappears altogether above ${gbp(S.first_time_buyer_max_price)}.` },
    { q: `Is ${gbp(PRICE)} cheaper to buy in Wales than in England?`, a: `In tax, yes, for anyone who is not a first-time buyer: ${gbp(wal)} in Wales against ${gbp(eng)} in England, because the Welsh nil band runs to ${gbp(top(P.ltt.main, 0))}. A first-time buyer is better off in England, where the relief brings the bill to nothing, since Wales has no first-time buyer relief.` },
    { q: `I am buying a ${gbp(PRICE)} buy-to-let in Scotland. Why is the tax so much higher than in England?`, a: `Because the Additional Dwelling Supplement is ${pct(P.lbtt.ads_rate)} of the whole price, ${gbp(compute({ nation: 'scotland', price: PRICE, situation: 'additional' }).surcharge)} here, added to the ${gbp(sco)} of ordinary LBTT, for ${gbp(t('scotland', PRICE, 'additional'))} in total. England adds ${pct(S.higher_rates_surcharge)} to each band instead, which comes to ${gbp(t('england', PRICE, 'additional'))} at this price, and Wales charges ${gbp(t('wales', PRICE, 'additional'))} at its higher rates.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-250000', 'stamp-duty-on-350000', 'stamp-duty-first-time-buyer', 'stamp-duty-second-home', 'stamp-duty-rates', 'stamp-duty-by-area'],
  sources: ['govSdltRates', 'govSdltHigher', 'rsResidential', 'rsAds', 'wraRates'],
  body: (h) => {
    const sits: Array<[string, 'first' | 'home' | 'additional', boolean]> = [['First-time buyer', 'first', false], ['One home or moving home', 'home', false], ['Additional property', 'additional', false], ['Non-UK resident, one home', 'home', true]];
    const rows = sits.map(([l, s, nr]) => [l, h.gbp(h.t('england', PRICE, s, { nonResident: nr })), h.gbp(h.t('scotland', PRICE, s)), h.gbp(h.t('wales', PRICE, s))]);
    return `
<h2>Why ${h.gbp(PRICE)} matters for first-time buyers</h2>
<p>The first-time buyer table in England has only two bands, and ${h.gbp(PRICE)} is the border between them. Below it, a first home costs no tax at all. Above it, the bill grows by ${h.pct(h.P.sdlt.first_time_buyer[1][1])} of every pound, which is gentle: ${h.gbp(25000)} over the line costs ${h.gbp(h.t('england', PRICE + 25000, 'first'))}. The real cliff is further up, at ${h.gbp(h.P.sdlt.first_time_buyer_max_price)}, and it is explained on the ${h.a('stamp-duty-first-time-buyer', 'first-time buyer relief page')}.</p>
<p>For anyone else, ${h.gbp(PRICE)} sits well inside the ${h.pct(h.P.sdlt.residential[2][1])} band that runs from ${h.gbp(h.P.sdlt.residential[1][0] as number + 1)} to ${h.gbp(h.P.sdlt.residential[2][0] as number)}. Each extra ${h.gbp(10000)} on the offer adds ${h.gbp(500)} of tax, whatever happens to the next bid.</p>
${h.table(['Buyer', 'England & NI', 'Scotland', 'Wales'], rows, `Tax on ${h.gbp(PRICE)}, by buyer and nation`, ['l', 'r', 'r', 'r'])}
<h2>The bill band by band</h2>
${h.breakdown({ nation: 'england', price: PRICE, situation: 'home' }, `SDLT on ${h.gbp(PRICE)}, standard rates`)}
<p>In Scotland the same price crosses three LBTT bands, because Scotland’s ${h.pct(h.P.lbtt.residential[2][1])} band stops at ${h.gbp(h.P.lbtt.residential[2][0] as number)}; ${h.gbp(PRICE)} still sits under that line, which keeps the bill at ${h.gbp(sco)}. In Wales, everything below ${h.gbp(h.P.ltt.main[0][0] as number)} is free and the remaining ${h.gbp(PRICE - (h.P.ltt.main[0][0] as number))} is taxed at ${h.pct(h.P.ltt.main[1][1])}.</p>
${h.breakdown({ nation: 'scotland', price: PRICE, situation: 'home' }, `LBTT on ${h.gbp(PRICE)}`)}
<h2>Where ${h.gbp(PRICE)} buys an average home</h2>
<p>At the UK House Price Index for July 2026, ${h.gbp(PRICE)} is close to the average price in ${h.a('stamp-duty-edinburgh', 'Edinburgh')} (${h.gbp(h.place('city-of-edinburgh').avg)}) and in York (${h.gbp(h.place('york').avg)}), above the average for England as a whole (${h.gbp(h.place('england').avg)}), and below the average in ${h.a('stamp-duty-bristol', 'Bristol')} (${h.gbp(h.place('city-of-bristol').avg)}). The ${h.a('stamp-duty-by-area', 'area table')} lists every council.</p>`;
  },
});
