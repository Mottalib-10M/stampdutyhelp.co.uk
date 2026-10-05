import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('swansea');
const M = monthLabel();
const W = P.ltt;
const NIL = top(W.main, 0);

export default definePage({
  id: 'stamp-duty-swansea',
  group: 'places',
  order: 550,
  slug: 'stamp-duty-swansea',
  place: 'swansea',
  nav: 'Swansea',
  card: `Average ${gbp(R.avg)}, under the ${gbp(NIL)} Welsh nil band: ${gbp(t('wales', R.avg))} of LTT for one home.`,
  title: `Land Transaction Tax Swansea 2026: Average Home Pays ${gbp(t('wales', R.avg))}`,
  description: `Land Transaction Tax in Swansea in 2026: the ${gbp(R.avg)} average home (UK HPI, ${M}) pays nothing for a one-home buyer, but ${gbp(t('wales', R.avg, 'additional'))} at the higher rates.`,
  h1: 'Stamp duty (Land Transaction Tax) in Swansea',
  intro: `Every Swansea average except two sits below the ${gbp(NIL)} Welsh nil band, so the higher rates are the tax that matters here.`,
  resume: `The average home in Swansea sold for ${gbp(R.avg)} in ${M}, according to the UK House Price Index, below the ${gbp(NIL)} nil band of the Welsh main rates, so a buyer who will own only that home pays ${gbp(t('wales', R.avg))} of Land Transaction Tax. The same is true of the city’s average flat (${gbp(R.flat as number)}), terrace (${gbp(R.terraced as number)}) and semi-detached house (${gbp(R.semi as number)}), and of the ${gbp(R.ftb as number)} paid on average by first-time buyers, who need no relief to pay nothing. Home movers paid ${gbp(R.mover as number)} and pay ${gbp(t('wales', R.mover as number))}. A buyer who keeps another home is in a different position: the Welsh higher rates start at ${pct(W.higher[0][1])} on the first pound, so the city average costs ${gbp(t('wales', R.avg, 'additional'))} as a second home or rental, and the average flat ${gbp(t('wales', R.flat as number, 'additional'))}.`,
  faqs: [
    { q: 'Will I pay any Land Transaction Tax on a Swansea terrace?', a: `Not if it will be your only home: the ${gbp(R.terraced as number)} average terrace is under the ${gbp(NIL)} nil band, so the tax is ${gbp(t('wales', R.terraced as number))}, whether or not you are a first-time buyer. If you keep another property, the higher rates apply and the bill is ${gbp(t('wales', R.terraced as number, 'additional'))}.` },
    { q: 'I am buying a holiday let on the Gower. Which rates apply?', a: `If you already own your home, the purchase leaves you with two dwellings, so the Welsh higher rates apply from ${gbp(W.higher_min_price)}: ${pct(W.higher[0][1])} up to ${gbp(top(W.higher, 0))}, ${pct(W.higher[1][1])} to ${gbp(top(W.higher, 1))} and ${pct(W.higher[2][1])} to ${gbp(top(W.higher, 2))}. A ${gbp(300000)} cottage costs ${gbp(t('wales', 300000, 'additional'))}, against ${gbp(t('wales', 300000))} as a main home.` },
    { q: 'Does a Swansea house bought before selling my old home cost more?', a: `Yes, until the old home sells. On the ${gbp(R.mover as number)} average mover purchase you pay ${gbp(t('wales', R.mover as number, 'additional'))} at the higher rates instead of ${gbp(t('wales', R.mover as number))}, then reclaim ${gbp(t('wales', R.mover as number, 'additional') - t('wales', R.mover as number))} from the Welsh Revenue Authority once the old home is sold within ${W.replace_main_residence_years} years of completion.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-cardiff', 'ltt-higher-rates', 'ltt-higher-rates-refund', 'ltt-rates', 'stamp-duty-aberdeen', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'wraRates', 'wraHigher', 'wraRefund'],
  body: (h) => {
    const rows = [R.flat as number, R.terraced as number, R.ftb as number, R.avg, R.semi as number, R.mover as number, R.detached as number].sort((a, b) => a - b).map((p) => [h.gbp(p), h.gbp(h.t('wales', p)), h.gbp(h.t('wales', p, 'additional')), h.gbp(h.t('wales', p, 'additional') - h.t('wales', p))]);
    return `
<h2>A city under the nil band</h2>
<p>The table runs through every Swansea average from the cheapest to the dearest. Up to ${h.gbp(NIL)} the main-rate column stays at zero; only the detached average and the movers’ average cross the line.</p>
${h.table(['Swansea average', 'LTT, one home', 'LTT, higher rates', 'Cost of owning another home'], rows, `Swansea averages, ${M}`, ['r', 'r', 'r', 'r'])}
<h2>By type of home</h2>
${typesTable(h, R)}
<p>Prices in the city moved ${h.num(R.change ?? 0, 1)}% over the year to ${M}. Because the main-rate bill is zero across most of the market, a change in price affects only buyers above ${h.gbp(NIL)} and those paying the higher rates, whose bill moves by ${h.pct(W.higher[0][1])} to ${h.pct(W.higher[2][1])} of every pound.</p>
<h2>Holiday lets and second homes</h2>
<p>A holiday cottage on the Gower or a flat by the marina bought by someone who keeps their main home pays the higher rates on the whole price, from a separate band table. Companies pay them on every purchase. Since 11 December 2024 the table starts at ${h.pct(W.higher[0][1])}, up from ${h.pct(W.higher_previous[0][1] as number)} before; the ${h.a('ltt-higher-rates', 'higher rates page')} sets out both tables, and ${h.a('ltt-higher-rates-refund', 'the refund page')} explains when they come back.</p>`;
  },
});
