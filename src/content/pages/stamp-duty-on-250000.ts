import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, sdltPrevious } from '../../lib/kit';
import type { Nation, Situation } from '../../lib/engine/tax';

const PRICE = 250000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const eAdd = t('england', PRICE, 'additional');
const before = sdltPrevious(PRICE, 'home');
/** Marginal rate on £1,000 just below or just above a price. */
const marg = (n: Nation, p: number, s: Situation, up: boolean) => (up ? t(n, p + 1000, s) - t(n, p, s) : t(n, p, s) - t(n, p - 1000, s)) / 1000;

export default definePage({
  id: 'stamp-duty-on-250000',
  group: 'prices',
  order: 140,
  slug: 'stamp-duty-on-250000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `The top of the ${pct(S.residential[1][1])} band in England and in Scotland: ${gbp(eng)} of SDLT, ${gbp(before)} before April 2025.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: Where the ${pct(S.residential[1][1])} Band Ends`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eng)} in England against ${gbp(before)} before April 2025, ${gbp(sco)} in Scotland, ${gbp(wal)} in Wales, and what each pound above it costs.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `${gbp(PRICE)} is the price where both the English and the Scottish tables step up from ${pct(S.residential[1][1])} to ${pct(S.residential[2][1])}.`,
  resume: `On a ${gbp(PRICE)} home, a buyer with no other property pays ${gbp(eng)} of Stamp Duty Land Tax in England and Northern Ireland: nothing on the first ${gbp(top(S.residential, 0))} and ${pct(S.residential[1][1])} on the remaining ${gbp(PRICE - top(S.residential, 0))}. Until 31 March 2025 the same purchase cost ${gbp(before)}, because the nil band then reached ${gbp(top(S.previous.residential, 0))}. In Scotland the bill is ${gbp(sco)} of LBTT, or ${gbp(t('scotland', PRICE, 'first'))} for a first-time buyer, and in Wales ${gbp(wal)} of Land Transaction Tax, the only part being the ${gbp(PRICE - top(W.main, 0))} above the Welsh nil band. The price is a corner in several tables at once. The English ${pct(S.residential[1][1])} band and the Scottish ${pct(L.residential[1][1])} band both end exactly here, so the next pound costs ${pct(S.residential[2][1])} in each, and the second band of the Welsh higher rates also stops at ${gbp(PRICE)}. A first-time buyer in England pays ${gbp(t('england', PRICE, 'first'))}; a landlord pays ${gbp(eAdd)}.`,
  faqs: [
    { q: `I am buying at ${gbp(PRICE)}. How much more tax would I pay if I agreed ${gbp(PRICE + 10000)} instead?`, a: `In England, ${gbp(t('england', PRICE + 10000) - eng)} more, since the extra ${gbp(10000)} is taxed at ${pct(S.residential[2][1])}. In Scotland the step is the same rate, adding ${gbp(t('scotland', PRICE + 10000) - sco)}. Wales charges ${pct(W.main[1][1])} on both sides of this price, so ${gbp(t('wales', PRICE + 10000) - wal)} more. Each nation taxes only the slice above the line at the higher rate, never the whole price.` },
    { q: `My ${gbp(PRICE)} purchase completed in April 2025. Why was my stamp duty higher than my friend’s a month earlier?`, a: `Because the temporary nil band of ${gbp(top(S.previous.residential, 0))} ended on 31 March 2025. A home buyer at ${gbp(PRICE)} paid ${gbp(before)} under the old table and pays ${gbp(eng)} from 1 April 2025, when the nil band went back to ${gbp(top(S.residential, 0))} and a ${pct(S.residential[1][1])} band returned. First-time buyers at this price pay nothing under either table.` },
    { q: `Does a ${gbp(PRICE)} buy-to-let in Wales cost more or less than in England?`, a: `Slightly less: ${gbp(t('wales', PRICE, 'additional'))} at the Welsh higher rates against ${gbp(eAdd)} in England, where the higher rates add ${pct(S.higher_rates_surcharge)} to each band. Scotland is the most expensive at ${gbp(t('scotland', PRICE, 'additional'))}, because the Additional Dwelling Supplement takes ${pct(L.ads_rate)} of the whole price on top of ordinary LBTT. In England, another dwelling worth under ${gbp(S.higher_rates_min_price)} does not count towards the higher rates.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-200000', 'stamp-duty-on-300000', 'stamp-duty-changes-april-2025', 'how-stamp-duty-is-calculated', 'lbtt-rates', 'stamp-duty-leeds'],
  sources: ['govSdltRates', 'govSdltPrevious', 'rsResidential', 'wraRates', 'wraHigher'],
  body: (h) => {
    const lines: Array<[string, Nation, Situation]> = [
      ['England & NI, only home', 'england', 'home'], ['England & NI, additional property', 'england', 'additional'],
      ['Scotland, only home', 'scotland', 'home'], ['Wales, only home', 'wales', 'home'], ['Wales, additional property', 'wales', 'additional'],
    ];
    const margRows = lines.map(([l, n, s]) => [l, h.pct(marg(n, PRICE, s, false)), h.pct(marg(n, PRICE, s, true))]);
    const sits: Array<[string, Situation]> = [['First-time buyer', 'first'], ['Only home or moving home', 'home'], ['Additional property', 'additional']];
    const histRows = sits.map(([l, s]) => [l, h.gbp(sdltPrevious(PRICE, s)), h.gbp(h.t('england', PRICE, s)), h.gbp(h.t('england', PRICE, s) - sdltPrevious(PRICE, s))]);
    return `
<h2>Several band tables turn at ${h.gbp(PRICE)}</h2>
<p>Property taxes in the UK work by slices: each rate applies only to the part of the price inside its band (${h.a('how-stamp-duty-is-calculated', 'how the slices work')}). That makes the points where bands meet worth knowing, and ${h.gbp(PRICE)} is one in three separate tables. In England the ${h.pct(S.residential[1][1])} slice that began at ${h.gbp(top(S.residential, 0) + 1)} ends here. Scotland’s ${h.pct(L.residential[1][1])} slice, which began at ${h.gbp(top(L.residential, 0) + 1)}, ends at the same pound. For a Welsh second home, the ${h.pct(W.higher[1][1])} slice of the higher rates stops here too.</p>
<p>Wales is the exception for a buyer of an only home: its ${h.pct(W.main[1][1])} band runs from ${h.gbp(top(W.main, 0) + 1)} to ${h.gbp(top(W.main, 1))}, so nothing changes at this price. The table gives the rate on the last ${h.gbp(1000)} below the line and on the first ${h.gbp(1000)} above it.</p>
${h.table(['Buyer', `Rate just below ${h.gbp(PRICE)}`, 'Rate just above'], margRows, `Marginal rate either side of ${h.gbp(PRICE)}`, ['l', 'r', 'r'])}
<p>In money, an offer of ${h.gbp(PRICE + 5000)} instead of ${h.gbp(PRICE)} adds ${h.gbp(h.t('england', PRICE + 5000) - eng)} in England, ${h.gbp(h.t('scotland', PRICE + 5000) - sco)} in Scotland and ${h.gbp(h.t('wales', PRICE + 5000) - wal)} in Wales. The higher rate never reaches back to the pounds below the line, and there is no cliff here like the one first-time buyers in England face at ${h.gbp(S.first_time_buyer_max_price)}. Pushing a seller down to exactly ${h.gbp(PRICE)} saves only the tax on the difference.</p>
<h2>What 1 April 2025 changed at this price</h2>
<p>From 23 September 2022 to 31 March 2025, England’s nil band was wider and ran to ${h.gbp(top(S.previous.residential, 0))}. A buyer at ${h.gbp(PRICE)} then paid ${h.gbp(before)} on an only home. The return to a ${h.gbp(top(S.residential, 0))} nil band created a ${h.pct(S.residential[1][1])} slice of ${h.gbp(PRICE - top(S.residential, 0))}, which is where today’s ${h.gbp(eng)} comes from. The first-time buyer nil band also shrank, from ${h.gbp(top(S.previous.first_time_buyer, 0))} to ${h.gbp(top(S.first_time_buyer, 0))}, but both versions cover this price in full.</p>
${h.table(['Buyer', 'Until 31 March 2025', 'From 1 April 2025', 'Change'], histRows, `SDLT on ${h.gbp(PRICE)} under the old and current tables (higher rates at ${h.pct(S.higher_rates_surcharge)} in both)`, ['l', 'r', 'r', 'r'])}
<p>The ${h.a('stamp-duty-changes-april-2025', 'April 2025 changes page')} runs the comparison at other prices, from the ${h.src('govSdltPrevious', 'HMRC table of the old rates')}.</p>
<h2>Homes around ${h.gbp(PRICE)}</h2>
<p>The UK House Price Index for July 2026 places the average home in ${h.a('stamp-duty-leeds', 'Leeds')} at ${h.gbp(h.place('leeds').avg)} and in ${h.a('stamp-duty-manchester', 'Manchester')} at ${h.gbp(h.place('manchester').avg)}, either side of this price. In Leeds, an only home at the average costs ${h.gbp(h.t('england', h.place('leeds').avg))}; in Manchester, ${h.gbp(h.t('england', h.place('manchester').avg))}, with the part above ${h.gbp(PRICE)} already taxed at ${h.pct(S.residential[2][1])}. North of the border, a first-time buyer at ${h.gbp(PRICE)} pays ${h.gbp(h.t('scotland', PRICE, 'first'))} of LBTT, the relief having taken its full ${h.gbp(L.first_time_buyer_max_saving)} off the standard bill.</p>`;
  },
});
