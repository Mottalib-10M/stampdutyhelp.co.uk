import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place, sdltPrevious } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('city-of-bristol');
const M = monthLabel();
const S = P.sdlt;
const NIL = top(S.first_time_buyer, 0);
const ftb = R.ftb as number;

export default definePage({
  id: 'stamp-duty-bristol',
  group: 'places',
  order: 440,
  slug: 'stamp-duty-bristol',
  place: 'city-of-bristol',
  nav: 'Bristol',
  card: `First-time buyers average ${gbp(ftb)}, above the ${gbp(NIL)} nil band: ${gbp(t('england', ftb, 'first'))} of SDLT.`,
  title: `Stamp Duty Bristol 2026: First-Time Buyers Over ${gbp(NIL)}`,
  description: `Stamp duty in Bristol in 2026: the average first-time buyer pays ${gbp(t('england', ftb, 'first'))} on ${gbp(ftb)}, a buyer with one home ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average (UK HPI, ${M}).`,
  h1: 'Stamp duty in Bristol',
  intro: `Bristol is one of the cities where the average first home now costs more than the ${gbp(NIL)} the relief leaves untaxed.`,
  resume: `First-time buyers in the City of Bristol paid ${gbp(ftb)} on average in ${M}, according to the UK House Price Index. That is ${gbp(ftb - NIL)} above the ${gbp(NIL)} nil band of first-time buyer relief, so the typical first purchase in Bristol carries ${gbp(t('england', ftb, 'first'))} of Stamp Duty Land Tax, charged at ${pct(S.first_time_buyer[1][1])} on the excess. Under the thresholds that applied until 31 March 2025 the same buyer would have paid ${gbp(sdltPrevious(ftb, 'first'))}. Across all sales the average Bristol home cost ${gbp(R.avg)}, which means ${gbp(t('england', R.avg))} for a buyer who will own only that home, and home movers paid ${gbp(R.mover as number)} on average, taxed at ${gbp(t('england', R.mover as number))}. Anyone buying an additional property at the average price pays ${gbp(t('england', R.avg, 'additional'))} with the surcharge, and Wales, a few miles away, has no first-time buyer relief at all.`,
  faqs: [
    { q: 'Why do Bristol first-time buyers pay stamp duty when friends elsewhere paid none?', a: `Because the relief only exempts the first ${gbp(NIL)}. The Bristol first-time buyer average of ${gbp(ftb)} pays ${pct(S.first_time_buyer[1][1])} on the remaining ${gbp(ftb - NIL)}, which is ${gbp(t('england', ftb, 'first'))}. In cities where first homes average less, such as Liverpool or Sheffield, the typical first purchase still pays nothing.` },
    { q: 'How much would a first-time buyer save by buying a Bristol flat instead of a terrace?', a: `On UK HPI averages, the flat at ${gbp(R.flat as number)} costs ${gbp(t('england', R.flat as number, 'first'))} and the terrace at ${gbp(R.terraced as number)} costs ${gbp(t('england', R.terraced as number, 'first'))}, so ${gbp(t('england', R.terraced as number, 'first') - t('england', R.flat as number, 'first'))} of tax separates them, on top of the difference in price between the two homes. Both stay under the ${gbp(S.first_time_buyer_max_price)} limit of the relief.` },
    { q: 'Did the April 2025 change hit Bristol buyers harder than average?', a: `For first-time buyers, yes. At the city’s ${gbp(ftb)} first-time buyer average the bill went from ${gbp(sdltPrevious(ftb, 'first'))} to ${gbp(t('england', ftb, 'first'))}. For home movers at ${gbp(R.mover as number)} it rose from ${gbp(sdltPrevious(R.mover as number, 'home'))} to ${gbp(t('england', R.mover as number))}, because the nil band for everyone fell from ${gbp(top(S.previous.residential, 0))} to ${gbp(top(S.residential, 0))}.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true, situation: 'first' },
  related: ['stamp-duty-first-time-buyer', 'stamp-duty-changes-april-2025', 'stamp-duty-on-350000', 'stamp-duty-cardiff', 'stamp-duty-oxford', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'govSdltPrevious'],
  body: (h) => {
    const rows = [275000, NIL, ftb, 325000, 350000, 400000].sort((a, b) => a - b).map((p) => [h.gbp(p), h.gbp(h.t('england', p, 'first')), h.gbp(sdltPrevious(p, 'first')), h.gbp(h.t('england', p))]);
    return `
<h2>First homes above the nil band</h2>
<p>The calculator above opens on the first-time buyer setting for that reason. Between ${h.gbp(NIL)} and ${h.gbp(S.first_time_buyer_max_price)} the relief still helps, but it no longer makes the purchase tax-free: each ${h.gbp(10000)} above the nil band adds ${h.gbp(10000 * S.first_time_buyer[1][1])}.</p>
${h.table(['Price', 'First-time buyer now', 'Before 1 April 2025', 'Without relief'], rows, 'First-time buyer SDLT around the Bristol average', ['l', 'r', 'r', 'r'])}
<h2>Homes by type</h2>
${typesTable(h, R)}
<p>Bristol’s semis average ${h.gbp(R.semi as number)} and its detached houses ${h.gbp(R.detached as number)}, prices more typical of the South East than of other large English cities outside London. Prices moved ${h.num(R.change ?? 0, 1)}% over the year to ${M}.</p>
<h2>Crossing the Severn</h2>
<p>Buyers who work in Bristol sometimes look at Newport or Monmouthshire. Wales charges Land Transaction Tax, with no first-time buyer relief but a nil band of ${h.gbp(top(h.P.ltt.main, 0))} for everyone. On a ${h.gbp(ftb)} first home that means ${h.gbp(h.t('wales', ftb, 'first'))} in Wales against ${h.gbp(h.t('england', ftb, 'first'))} in Bristol; for a home mover at the same price, ${h.gbp(h.t('wales', ftb))} against ${h.gbp(h.t('england', ftb))}. The comparison is computed for every price on the ${h.a('stamp-duty-england-scotland-wales-compared', 'nations comparison page')}, and ${h.a('stamp-duty-cardiff', 'Cardiff')} has its own figures.</p>`;
  },
});
