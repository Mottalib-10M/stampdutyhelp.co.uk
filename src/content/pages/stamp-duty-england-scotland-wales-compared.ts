import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t } from '../../lib/kit';
import type { Nation, Situation } from '../../lib/engine/tax';
import { HPI, monthLabel } from '../../lib/hpi';

const N: Nation[] = ['england', 'scotland', 'wales'];
const LABEL: Record<Nation, string> = { england: 'England & NI', scotland: 'Scotland', wales: 'Wales' };
const STEP = 1000, TOP = 3000000;
interface Seg { from: number; to: number; winners: Nation[] }
/** Scan prices in £1,000 steps with the engine and group them by the nation(s) charging least. */
function segments(s: Situation, nonResident = false): Seg[] {
  const out: Seg[] = [];
  for (let p = STEP; p <= TOP; p += STEP) {
    const v = N.map((n) => t(n, p, s, { nonResident }));
    const m = Math.min(...v);
    const w = N.filter((_, i) => v[i] === m);
    const last = out[out.length - 1];
    if (last && last.winners.join() === w.join()) last.to = p; else out.push({ from: p, to: p, winners: w });
  }
  return out;
}
const SEG = { first: segments('first'), home: segments('home'), additional: segments('additional') };
const who = (w: Nation[]) => (w.length === 3 ? 'All three (nothing to pay)' : w.map((n) => LABEL[n]).join(' and ') + (w.length > 1 ? ' (equal)' : ''));
const finalSeg = (s: Situation) => SEG[s][SEG[s].length - 1];
/** The only price range in which Scotland alone is cheapest for a one-home buyer, if any. */
const scotOnly = SEG.home.filter((x) => x.winners.length === 1 && x.winners[0] === 'scotland');
const walesHomeEnd = (() => { const xs = SEG.home.filter((x) => x.winners.includes('wales')); return xs[xs.length - 1].to; })();
const PRICE = 450000;
/** Non-resident buyer of a single home: England carries the extra surcharge, so the crossover moves. */
const SEG_NR = segments('home', true);
const nrFinal = SEG_NR[SEG_NR.length - 1];
const nrEngNever = SEG_NR.every((x) => !x.winners.includes('england'));
/** Is Scotland the dearest nation for an additional property at every scanned price from the ADS floor? */
const scotDearest = (() => { for (let p = P.lbtt.ads_min_price; p <= TOP; p += STEP) { const sc = t('scotland', p, 'additional'); if (sc < t('england', p, 'additional') || sc < t('wales', p, 'additional')) return false; } return true; })();
const walesAddEnd = SEG.additional.filter((x) => x.winners.length === 1 && x.winners[0] === 'wales').pop()!.to;
const walesUnderNil = Object.values(HPI.regions).filter((r) => r.level === 'la' && r.nation === 'wales');
const walesUnderNilCount = walesUnderNil.filter((r) => r.avg <= (P.ltt.main[0][0] as number)).length;

export default definePage({
  id: 'stamp-duty-england-scotland-wales-compared',
  group: 'situations',
  order: 90,
  slug: 'stamp-duty-england-scotland-wales-compared',
  nav: 'England, Scotland and Wales compared',
  card: 'Three taxes, three sets of bands: who pays least at each price, for first-time buyers, movers and landlords.',
  title: 'Stamp Duty Compared 2026: England, Scotland and Wales',
  description: `Stamp duty compared in 2026: a ${gbp(PRICE)} home costs ${gbp(t('england', PRICE))} in England, ${gbp(t('scotland', PRICE))} in Scotland, ${gbp(t('wales', PRICE))} in Wales. Who pays least at each price, for each buyer.`,
  h1: 'England, Scotland and Wales compared',
  intro: 'Since devolution, a house on either side of the border can carry a very different tax bill. Here is where each regime is cheapest, scanned price by price.',
  resume: `The cheapest nation depends on the price and on the buyer. For a buyer of a single home, Wales charges least on almost every price up to about ${gbp(walesHomeEnd)}, thanks to its ${gbp(P.ltt.main[0][0] as number)} nil band, and England and Northern Ireland charge least from ${gbp(finalSeg('home').from)}; on a ${gbp(PRICE)} home the bills are ${gbp(t('england', PRICE))} of SDLT, ${gbp(t('scotland', PRICE))} of LBTT and ${gbp(t('wales', PRICE))} of LTT. First-time buyers are best off in England at every price from ${gbp(finalSeg('first').from)}, because its relief exempts the first ${gbp(P.sdlt.first_time_buyer[0][0] as number)}. For landlords and second homes, Wales wins below ${gbp(finalSeg('additional').from)} and England above, while Scotland is ${scotDearest ? 'the dearest at every price' : 'usually the dearest'} because the ${pct(P.lbtt.ads_rate)} ADS applies to the full amount: ${gbp(t('scotland', PRICE, 'additional'))} at ${gbp(PRICE)}, against ${gbp(t('england', PRICE, 'additional'))} in England. All three figures come from scanning prices in steps of ${gbp(STEP)} with the same engine as our calculators.`,
  faqs: [
    { q: 'Is stamp duty cheaper in Wales than in England in 2026?', a: `For buyers of a single home, up to about ${gbp(walesHomeEnd)}, yes: Wales charges nothing up to ${gbp(P.ltt.main[0][0] as number)}, so a ${gbp(250000)} house costs ${gbp(t('wales', 250000))} there against ${gbp(t('england', 250000))} in England. Above that price, the Welsh ${pct(P.ltt.main[1][1])} and ${pct(P.ltt.main[2][1])} bands make England cheaper. First-time buyers pay less in England, which has a relief Wales does not.` },
    { q: 'Is there any price where Scotland has the lowest stamp duty?', a: scotOnly.length ? `Only in a narrow range for a buyer of a single home: from ${gbp(scotOnly[0].from)} to ${gbp(scotOnly[scotOnly.length - 1].to)}, where Scotland’s ${pct(P.lbtt.residential[2][1])} band to ${gbp(P.lbtt.residential[2][0] as number)} keeps LBTT below both SDLT and LTT. On ${gbp(320000)} the bills are ${gbp(t('scotland', 320000))} in Scotland, ${gbp(t('england', 320000))} in England and ${gbp(t('wales', 320000))} in Wales. Outside it, another nation is cheaper or equal.` : `No. For every buyer and every price we scanned, England or Wales charges as little as Scotland or less.` },
    { q: 'Why does a buy-to-let cost so much more in Scotland?', a: `Because the Additional Dwelling Supplement is ${pct(P.lbtt.ads_rate)} of the whole price, added to LBTT, from ${gbp(P.lbtt.ads_min_price)} upwards. England adds ${pct(P.sdlt.higher_rates_surcharge)} to each band and Wales uses a separate higher table. On a ${gbp(200000)} rental the bills are ${gbp(t('scotland', 200000, 'additional'))} in Scotland, ${gbp(t('england', 200000, 'additional'))} in England and ${gbp(t('wales', 200000, 'additional'))} in Wales. The ADS alone is ${gbp(200000 * P.lbtt.ads_rate)} of that Scottish bill.` },
    { q: 'Does Northern Ireland have the same stamp duty as England?', a: `Yes. Stamp Duty Land Tax was never devolved to Northern Ireland, so a home in Belfast or Newry pays exactly what a home at the same price pays in England, including the first-time buyer relief, the ${pct(P.sdlt.higher_rates_surcharge)} higher rates and the ${pct(P.sdlt.non_resident_surcharge)} non-resident surcharge. A ${gbp(200000)} house costs ${gbp(t('england', 200000))} in both.` },
    { q: 'Which nation is cheapest for a house costing over a million pounds?', a: `England and Northern Ireland, for every type of buyer we compared. On ${gbp(1200000)} a buyer of a single home pays ${gbp(t('england', 1200000))} of SDLT, against ${gbp(t('scotland', 1200000))} of LBTT and ${gbp(t('wales', 1200000))} of LTT. Scotland’s ${pct(P.lbtt.residential[4][1])} band starts at ${gbp(P.lbtt.residential[3][0] as number)}, far lower than England’s, which explains most of the gap.` },
  ],
  mini: 'nationsCrossover',
  related: ['stamp-duty-rates', 'lbtt-rates', 'ltt-rates', 'stamp-duty-by-area', 'how-stamp-duty-is-calculated', 'stamp-duty-first-time-buyer'],
  sources: ['govSdltRates', 'rsResidential', 'rsAds', 'wraRates', 'wraHigher', 'lbttAct', 'lttAct'],
  body: (h) => {
    const prices = [150000, 200000, 250000, 300000, 350000, 400000, 500000, 750000, 1000000, 1500000];
    const grid = (s: Situation, cap: string) => h.table(['Price', 'England & NI', 'Scotland', 'Wales'], prices.map((p) => [h.gbp(p), h.gbp(h.t('england', p, s)), h.gbp(h.t('scotland', p, s)), h.gbp(h.t('wales', p, s))]), cap, ['l', 'r', 'r', 'r']);
    const segTable = (s: Situation, cap: string) => h.table(['Price range', 'Lowest tax'], SEG[s].map((x, i) => [i === SEG[s].length - 1 ? `${h.gbp(x.from)} and above` : `${h.gbp(x.from)} to ${h.gbp(x.to)}`, who(x.winners)]), cap, ['l', 'l']);
    return `
<h2>Three taxes since devolution</h2>
<p>Until 2015 a single Stamp Duty Land Tax applied across the United Kingdom. Scotland replaced it with Land and Buildings Transaction Tax on 1 April 2015, collected by Revenue Scotland under the LBTT (Scotland) Act 2013. Wales followed on 1 April 2018 with Land Transaction Tax, collected by the Welsh Revenue Authority under the Land Transaction Tax and Anti-avoidance of Devolved Taxes (Wales) Act 2017. Northern Ireland kept SDLT and still pays it to HMRC on exactly the English rules. Each government has since moved its own bands: Scotland’s residential table dates from 1 April 2021, the Welsh main rates from 10 October 2022, the Welsh higher rates from 11 December 2024, the ADS rate from 5 December 2024, and the current English bands from 1 April 2025.</p>
<p>The result is three different shapes. England starts charging early, at ${h.gbp(h.P.sdlt.residential[0][0] as number)}, but gently, with a long ${h.pct(h.P.sdlt.residential[2][1])} band to ${h.gbp(h.P.sdlt.residential[2][0] as number)}. Wales starts late, at ${h.gbp(h.P.ltt.main[0][0] as number)}, and then charges ${h.pct(h.P.ltt.main[1][1])} straight away. Scotland sits between the two at the bottom and climbs steeply, reaching ${h.pct(h.P.lbtt.residential[3][1])} at ${h.gbp((h.P.lbtt.residential[2][0] as number) + 1)}.</p>
<h2>Buyers of a single home</h2>
${grid('home', 'One home or moving home, 2026 rates')}
${segTable('home', `Lowest tax for a one-home buyer, scanned in ${h.gbp(STEP)} steps`)}
<p>Below ${h.gbp(h.P.sdlt.residential[0][0] as number + STEP)} nobody pays anything. Wales then leads, alone or level with Scotland, and its nil band covers the average home in ${walesUnderNilCount} of its ${walesUnderNil.length} councils (${h.a('stamp-duty-by-area', 'area table')}). ${scotOnly.length ? `Scotland has a short window of its own, from ${h.gbp(scotOnly[0].from)} to ${h.gbp(scotOnly[scotOnly.length - 1].to)}, where its ${h.pct(h.P.lbtt.residential[2][1])} band is still running while the Welsh ${h.pct(h.P.ltt.main[1][1])} band has already taken a bite. ` : ''}From ${h.gbp(finalSeg('home').from)} England and Northern Ireland are the cheapest and stay so at every higher price, the gap widening as Scotland’s ${h.pct(h.P.lbtt.residential[3][1])} band and the Welsh ${h.pct(h.P.ltt.main[2][1])} band take hold.</p>
<h2>First-time buyers</h2>
${grid('first', 'First-time buyers, with the relief where it exists')}
${segTable('first', 'Lowest tax for a first-time buyer')}
<p>England’s relief, with no tax up to ${h.gbp(h.P.sdlt.first_time_buyer[0][0] as number)}, beats everything else on offer. Scotland’s relief lifts the nil band to ${h.gbp(h.P.lbtt.first_time_buyer_nil_band)} and is worth at most ${h.gbp(h.P.lbtt.first_time_buyer_max_saving)}. Wales has no relief, but its ordinary nil band of ${h.gbp(h.P.ltt.main[0][0] as number)} is still wider than Scotland’s relieved one. The English advantage narrows above ${h.gbp(h.P.sdlt.first_time_buyer_max_price)}, where the relief disappears, yet England remains the cheapest even there, because its standard bands are lighter than the Welsh and Scottish ones at those prices. A first-time buyer at ${h.gbp(400000)} pays ${h.gbp(h.t('england', 400000, 'first'))} in England, ${h.gbp(h.t('scotland', 400000, 'first'))} in Scotland and ${h.gbp(h.t('wales', 400000, 'first'))} in Wales.</p>
<h2>Second homes and buy-to-let</h2>
${grid('additional', 'Additional property, 2026 rates')}
${segTable('additional', 'Lowest tax for an additional property')}
<p>The surcharges follow three different designs. England adds ${h.pct(h.P.sdlt.higher_rates_surcharge)} to each band, so the first ${h.gbp(h.P.sdlt.residential[0][0] as number)} is taxed too. Wales replaces the main table with its own higher table, starting at ${h.pct(h.P.ltt.higher[0][1])}. Scotland keeps LBTT unchanged and adds the ADS of ${h.pct(h.P.lbtt.ads_rate)} on the whole price, which is why it is ${scotDearest ? 'the most expensive nation for landlords at every price from' : 'usually the most expensive nation for landlords from'} ${h.gbp(h.P.lbtt.ads_min_price)}. Between the other two, Wales is cheaper up to ${h.gbp(walesAddEnd)} and England from ${h.gbp(finalSeg('additional').from)}, with a gap that widens as prices rise. The ${h.a('buy-to-let-stamp-duty', 'buy-to-let guide')} covers company purchases.</p>
<h2>The national averages, taxed at home and next door</h2>
<p>A fair test uses the prices each nation actually has. On the UK House Price Index for ${monthLabel()}, the average home costs ${h.gbp(h.place('england').avg)} in England, ${h.gbp(h.place('scotland').avg)} in Scotland and ${h.gbp(h.place('wales').avg)} in Wales. Taxed in its own nation, the English average costs ${h.gbp(h.t('england', h.place('england').avg))}, the Scottish one ${h.gbp(h.t('scotland', h.place('scotland').avg))} and the Welsh one ${h.gbp(h.t('wales', h.place('wales').avg))}. Moved across the border, the English average would cost ${h.gbp(h.t('scotland', h.place('england').avg))} in Scotland and ${h.gbp(h.t('wales', h.place('england').avg))} in Wales. The typical Scottish or Welsh buyer pays less than the typical English one mainly because their homes are cheaper, not only because their bands differ.</p>
<h2>Buyers who live abroad</h2>
<p>A buyer who spent fewer than ${h.P.sdlt.non_resident_days} days in the UK in the year before completion pays ${h.pct(h.P.sdlt.non_resident_surcharge)} more on every SDLT band, while Scotland and Wales have no such charge. That removes England’s advantage at the top of the market. For a non-resident buying a single home, ${nrEngNever ? 'England and Northern Ireland are never the cheapest at any price we scanned, and ' : ''}${who(nrFinal.winners)} ${nrFinal.winners.length > 1 ? 'are' : 'is'} the cheapest from ${h.gbp(nrFinal.from)} upwards, where a UK resident would find England cheapest from ${h.gbp(finalSeg('home').from)}. On ${h.gbp(PRICE)} the non-resident pays ${h.gbp(h.t('england', PRICE, 'home', { nonResident: true }))} in England, ${h.gbp(h.t('scotland', PRICE))} in Scotland and ${h.gbp(h.t('wales', PRICE))} in Wales.</p>
<h2>Shops, offices and mixed-use buildings</h2>
<p>The non-residential tables rank the nations differently again. A ${h.gbp(400000)} shop with a flat above costs ${h.gbp(h.t('england', 400000, 'home', { kind: 'nonresidential' }))} in England, ${h.gbp(h.t('scotland', 400000, 'home', { kind: 'nonresidential' }))} in Scotland and ${h.gbp(h.t('wales', 400000, 'home', { kind: 'nonresidential' }))} in Wales, where the commercial nil band runs to ${h.gbp(h.P.ltt.non_residential[0][0] as number)}. At ${h.gbp(2000000)} the order turns, because Wales charges ${h.pct(h.P.ltt.non_residential[3][1])} above ${h.gbp(h.P.ltt.non_residential[2][0] as number)}: ${h.gbp(h.t('wales', 2000000, 'home', { kind: 'nonresidential' }))} against ${h.gbp(h.t('england', 2000000, 'home', { kind: 'nonresidential' }))} in England and ${h.gbp(h.t('scotland', 2000000, 'home', { kind: 'nonresidential' }))} in Scotland. The ${h.a('commercial-property-stamp-duty', 'commercial property calculator')} gives the exact crossover.</p>
<h2>What does not change across the border</h2>
<p>Some features are the same, or nearly so. All three taxes are charged on the chargeable consideration, slice by slice through the bands (the ${h.a('how-stamp-duty-is-calculated', 'calculation guide')} works through it). All three tax a buyer who will own two homes more heavily and refund the extra when a main residence is replaced in time, though the windows differ: ${h.P.sdlt.replace_main_residence_years} years in England, ${h.P.lbtt.replace_main_residence_months} months in Scotland, ${h.P.ltt.replace_main_residence_years} years in Wales. The return deadline is ${h.P.sdlt.return_days} days in England and Northern Ireland and ${h.P.lbtt.return_days} days in Scotland and Wales. Only England and Northern Ireland charge a ${h.pct(h.P.sdlt.non_resident_surcharge)} surcharge to buyers who live abroad and the ${h.pct(h.P.sdlt.corporate_flat_rate)} rate on company purchases above ${h.gbp(h.P.sdlt.corporate_flat_threshold)}.</p>
<h2>Using the comparison</h2>
<p>Nobody chooses Cardiff over Bristol for the tax alone, but the comparison matters at the margin: for a family weighing a house on either side of the Severn, for a landlord comparing yields in Glasgow and Newcastle, or for a first-time buyer near the Scottish border. Enter your own price in the mini-simulator above, or open the ${h.a('lbtt-rates', 'LBTT rates')} and ${h.a('ltt-rates', 'LTT rates')} pages for each nation’s full tables.</p>`;
  },
});
