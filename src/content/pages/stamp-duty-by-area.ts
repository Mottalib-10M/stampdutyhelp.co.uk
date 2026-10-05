import { definePage } from '../../lib/page-types';
import { P, gbp, pct, compute } from '../../lib/kit';
import { HPI, taxNation, monthLabel, type Region } from '../../lib/hpi';
import { TAX_SHORT } from '../../lib/engine/tax';

const M = monthLabel();
/** Every local authority of the UK HPI, with the tax a one-home buyer pays on its average price. */
const LA = Object.entries(HPI.regions).filter(([, r]) => r.level === 'la').map(([key, r]) => {
  const n = taxNation(r);
  return { key, r, n, tax: compute({ nation: n, price: r.avg, situation: 'home' }).total, add: compute({ nation: n, price: r.avg, situation: 'additional' }).total };
});
const byTax = [...LA].sort((a, b) => b.tax - a.tax || b.r.avg - a.r.avg);
const dearest = byTax[0], second = byTax[1];
const cheapest = [...LA].sort((a, b) => a.r.avg - b.r.avg)[0];
const zero = LA.filter((x) => x.tax === 0);
const inNation = (nat: Region['nation']) => LA.filter((x) => x.r.nation === nat).sort((a, b) => b.r.avg - a.r.avg);
const ni = inNation('ni'), sco = inNation('scotland'), wal = inNation('wales'), eng = inNation('england');
const ftbNil = P.sdlt.first_time_buyer[0][0] as number;
const engFtbFree = eng.filter((x) => (x.r.ftb ?? x.r.avg) <= ftbNil).length;
const engFtbCliff = eng.filter((x) => (x.r.ftb ?? 0) > P.sdlt.first_time_buyer_max_price);
const london = eng.filter((x) => x.r.gss.startsWith('E09'));
const londonLow = london[london.length - 1];
const top10London = byTax.slice(0, 10).filter((x) => x.r.gss.startsWith('E09')).length;
const median = (xs: number[]) => { const s = [...xs].sort((a, b) => a - b); return s[Math.floor(s.length / 2)]; };
const medTax = median(LA.map((x) => x.tax));
const name = (x: { r: Region }) => x.r.name;

export default definePage({
  id: 'stamp-duty-by-area',
  group: 'calculators',
  order: 40,
  slug: 'stamp-duty-by-area',
  nav: 'Stamp duty by area',
  card: `All ${LA.length} councils of the UK House Price Index, from ${gbp(dearest.tax)} in ${name(dearest)} to nothing in ${zero.length} areas.`,
  title: `Stamp Duty by Area 2026: Tax in All ${LA.length} UK Councils`,
  description: `Stamp duty by area in 2026: ${gbp(dearest.tax)} on the average home in ${name(dearest)}, nothing in ${zero.length} councils. UK HPI ${M} prices, sortable by buyer type.`,
  h1: 'Stamp duty by local authority',
  intro: `The tax due on the average home of every council in England, Northern Ireland, Scotland and Wales, from the UK House Price Index for ${M}.`,
  resume: `On the average price of each local authority in the UK House Price Index for ${M}, a buyer who will own only that home pays the most in ${name(dearest)}: ${gbp(dearest.tax)} of Stamp Duty Land Tax on ${gbp(dearest.r.avg)}, followed by ${name(second)} at ${gbp(second.tax)}. At the other end, ${zero.length} of the ${LA.length} councils have an average below the nil band of their nation, so the typical home there carries no tax at all; the lowest average is ${gbp(cheapest.r.avg)} in ${name(cheapest)}. Half the councils sit at or below ${gbp(medTax)}. The table applies the right tax to each area: SDLT in England and Northern Ireland, LBTT in Scotland and LTT in Wales, so the same average price can cost different amounts on each side of a border. Switch to first-time buyer prices and in ${engFtbFree} of ${eng.length} English councils the typical first purchase falls inside the ${gbp(ftbNil)} nil band of the relief.`,
  faqs: [
    { q: 'Which council has the highest stamp duty on an average home?', a: `${name(dearest)}, where the average price of ${gbp(dearest.r.avg)} in ${M} produces ${gbp(dearest.tax)} of SDLT for a buyer with no other property, and ${gbp(dearest.add)} for someone adding a second home. SDLT bands are the same in every English council, so the gap comes entirely from prices: the same rates applied to ${name(eng[eng.length - 1])}’s ${gbp(eng[eng.length - 1].r.avg)} average give ${gbp(eng[eng.length - 1].tax)}.` },
    { q: 'Why does the table show no first-time buyer price for Northern Ireland districts?', a: `The UK House Price Index publishes only an all-buyer average for each of the ${ni.length} Northern Ireland districts, without the first-time buyer and former owner-occupier series available elsewhere. The table falls back on that single average and flags it with an asterisk. The tax is still SDLT, so a first-time buyer in ${name(ni[0])} at the ${gbp(ni[0].r.avg)} average would pay ${gbp(compute({ nation: 'england', price: ni[0].r.avg, situation: 'first' }).total)}.` },
    { q: 'Can I use a council average to estimate the stamp duty on the house I am buying?', a: `Only as a starting point. The average mixes flats, terraces and detached houses, and the index is revised as late sales reach the Land Registry. Your tax depends on your agreed price and your own situation, so type that price into the main calculator. The area table is best for comparing places before you choose where to search.` },
  ],
  tool: 'area',
  related: ['stamp-duty-london', 'stamp-duty-manchester', 'stamp-duty-edinburgh', 'stamp-duty-cardiff', 'stamp-duty-belfast', 'stamp-duty-england-scotland-wales-compared'],
  sources: ['ukhpi', 'govSdltRates', 'rsResidential', 'wraRates'],
  body: (h) => {
    const top10 = byTax.slice(0, 10).map((x) => [x.r.name, TAX_SHORT[x.n], h.gbp(x.r.avg), h.gbp(x.tax), h.gbp(x.add)]);
    const heads = [['England', eng], ['Northern Ireland', ni], ['Scotland', sco], ['Wales', wal]] as const;
    const nat = heads.map(([l, xs]) => [l, String(xs.length), `${xs[0].r.name} (${h.gbp(xs[0].tax)})`, `${xs[xs.length - 1].r.name} (${h.gbp(xs[xs.length - 1].tax)})`, String(xs.filter((x) => x.tax === 0).length)]);
    return `
<h2>Where the bill is highest</h2>
<p>Ten councils carry the heaviest tax on their average home, and ${top10London} of them are London boroughs. ${h.a('stamp-duty-london', 'London')} as a region averages ${h.gbp(h.place('london').avg)}, but inside it the range runs from ${name(dearest)} down to ${name(londonLow)} at ${h.gbp(londonLow.r.avg)}, where a one-home buyer pays ${h.gbp(londonLow.tax)}. The last column shows the same purchase for a buyer who will own a second home: in England the ${h.pct(h.P.sdlt.higher_rates_surcharge)} surcharge lands on every band, in Scotland the ${h.pct(h.P.lbtt.ads_rate)} Additional Dwelling Supplement lands on the whole price.</p>
${h.table(['Council', 'Tax', 'Average price', 'One home', 'Additional property'], top10, `Ten highest bills on the average price, UK HPI ${M}`, ['l', 'l', 'r', 'r', 'r'])}
<h2>Each nation’s range</h2>
${h.table(['Nation', 'Councils', 'Highest bill', 'Lowest bill', 'Councils at zero'], nat, 'Tax on the average price, one-home buyer', ['l', 'r', 'l', 'l', 'r'])}
<p>The column of zeros says more about the nil bands than about prices. Wales exempts the first ${h.gbp(h.P.ltt.main[0][0] as number)} for every buyer, Scotland the first ${h.gbp(h.P.lbtt.residential[0][0] as number)}, England and Northern Ireland the first ${h.gbp(h.P.sdlt.residential[0][0] as number)}. That is why ${name(wal[wal.length - 1])}, with an average of ${h.gbp(wal[wal.length - 1].r.avg)}, pays nothing, while the same price in an English council would cost ${h.gbp(h.t('england', wal[wal.length - 1].r.avg))} of SDLT.</p>
<h2>How the figures are built</h2>
<p>Prices come from the ${h.src('ukhpi', 'UK House Price Index')} published by HM Land Registry, for ${M}, the latest month available when these pages were checked. Recent months of the index are revised as late registrations arrive, so a council’s average, and the tax on it, can move slightly when the next edition appears. Each row is then run through the same engine as our ${h.a('sdlt-calculator', 'SDLT calculator')}, with the rates in force in 2026.</p>
<h3>The three price bases</h3>
<p>“All buyers” uses the headline average. “First-time buyers” uses the average paid by buyers on their first purchase and applies the relief where the nation has one: England and Northern Ireland, and Scotland’s smaller nil band uplift. Wales has no relief, so its rows use the lower first-time buyer price at main rates. “Home movers” uses the price paid by former owner-occupiers. ${engFtbCliff.length ? `In ${engFtbCliff.length} English councils the average first-time buyer price is above ${h.gbp(h.P.sdlt.first_time_buyer_max_price)}, so the relief is lost and standard rates apply in full.` : `No English council has an average first-time buyer price above ${h.gbp(h.P.sdlt.first_time_buyer_max_price)}, the ceiling of the relief.`}</p>
<h3>The limits for Northern Ireland</h3>
<p>Northern Ireland pays SDLT exactly as England does, but its ${ni.length} districts publish only the all-buyer average in the index. Choosing the first-time buyer or mover basis therefore shows the same price there, marked with an asterisk. ${name(ni[0])} has the highest average of the province at ${h.gbp(ni[0].r.avg)}; ${h.a('stamp-duty-belfast', 'Belfast')} sits at ${h.gbp(h.place('belfast').avg)}.</p>
<p>To compare the three regimes on a price of your own rather than an average, the ${h.a('stamp-duty-england-scotland-wales-compared', 'nation comparison')} runs every situation side by side.</p>`;
  },
});
