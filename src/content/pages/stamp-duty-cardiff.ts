import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('cardiff');
const M = monthLabel();
const W = P.ltt;
const NIL = top(W.main, 0);
const ftb = R.ftb as number;

export default definePage({
  id: 'stamp-duty-cardiff',
  group: 'places',
  order: 540,
  slug: 'stamp-duty-cardiff',
  place: 'cardiff',
  nav: 'Cardiff',
  card: `Land Transaction Tax: ${gbp(t('wales', R.avg))} on the ${gbp(R.avg)} average, no first-time buyer relief.`,
  title: `Land Transaction Tax Cardiff 2026: ${gbp(t('wales', R.avg))} on the Average`,
  description: `Land Transaction Tax in Cardiff in 2026: ${gbp(t('wales', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), ${gbp(t('wales', ftb, 'first'))} for the typical first home, higher rates priced.`,
  h1: 'Stamp duty (Land Transaction Tax) in Cardiff',
  intro: `Wales has no first-time buyer relief, but its nil band runs to ${gbp(NIL)} for everyone: in Cardiff that line runs through the middle of the market.`,
  resume: `Homes in Cardiff are taxed under Land Transaction Tax, collected by the Welsh Revenue Authority, not under stamp duty. The average Cardiff home sold for ${gbp(R.avg)} in ${M}, on the UK House Price Index, and LTT at the main rates is ${gbp(t('wales', R.avg))}: nothing on the first ${gbp(NIL)} and ${pct(W.main[1][1])} on the rest. Wales has no first-time buyer relief, but first-time buyers in Cardiff paid ${gbp(ftb)} on average, which is ${ftb > NIL ? 'above' : 'below'} the nil band, so their typical bill is ${gbp(t('wales', ftb, 'first'))}; an English first-time buyer at the same price would pay ${gbp(t('england', ftb, 'first'))}. Home movers paid ${gbp(R.mover as number)} and pay ${gbp(t('wales', R.mover as number))}. A second home or rental pays the Welsh higher rates, a separate table starting at ${pct(W.higher[0][1])} on the first pound: ${gbp(t('wales', R.avg, 'additional'))} on the city average.`,
  faqs: [
    { q: 'Is there first-time buyer stamp duty relief in Cardiff?', a: `No. Land Transaction Tax has no relief for first-time buyers, so they pay the main rates like anyone with one home. In practice the Welsh nil band of ${gbp(NIL)} does much of the same job: the Cardiff first-time buyer average of ${gbp(ftb)} costs ${gbp(t('wales', ftb, 'first'))}, and any first home up to ${gbp(NIL)} costs nothing.` },
    { q: 'How much LTT on a Cardiff semi-detached house?', a: `On the ${gbp(R.semi as number)} average semi, ${gbp(t('wales', R.semi as number))} at the main rates: ${pct(W.main[1][1])} on the ${gbp((R.semi as number) - NIL)} above ${gbp(NIL)}. If the buyer has not sold a previous home by completion, the higher rates apply instead, ${gbp(t('wales', R.semi as number, 'additional'))}, and the difference is refundable after a sale within ${W.replace_main_residence_years} years.` },
    { q: 'Should I buy in Cardiff or across the bridge in Bristol for the tax?', a: `At the same price the answer depends on who you are. On ${gbp(300000)}, a home mover pays ${gbp(t('wales', 300000))} in Wales and ${gbp(t('england', 300000))} in England, while a first-time buyer pays ${gbp(t('wales', 300000, 'first'))} in Wales and ${gbp(t('england', 300000, 'first'))} in England. Bristol prices are also higher: see the Bristol page.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['ltt-rates', 'ltt-first-time-buyers', 'ltt-higher-rates', 'stamp-duty-swansea', 'stamp-duty-bristol', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'wraRates', 'wraGuide', 'wraHigher'],
  body: (h) => {
    const rows = [200000, NIL, ftb, 250000, R.avg, 300000, R.mover as number].sort((a, b) => a - b).map((p) => [h.gbp(p), h.gbp(h.t('wales', p)), h.gbp(h.t('england', p, 'first')), h.gbp(h.t('england', p))]);
    return `
<h2>The ${h.gbp(NIL)} line through Cardiff’s market</h2>
<p>Below ${h.gbp(NIL)} a Cardiff purchase pays no LTT at all, whoever buys it, as long as the buyer will own only that home. Above it, ${h.pct(W.main[1][1])} applies to each extra pound up to ${h.gbp(top(W.main, 1))}, a higher marginal rate than England’s ${h.pct(P.sdlt.residential[2][1])} band. That is why the Welsh tax is lower on modest homes and catches up quickly on larger ones.</p>
${h.table(['Price', 'LTT, any one-home buyer', 'SDLT, first-time buyer', 'SDLT, mover'], rows, 'Cardiff prices under Welsh and English rules', ['r', 'r', 'r', 'r'])}
<h2>Cardiff homes by type</h2>
${typesTable(h, R)}
<p>The first-time buyer column equals the one-home column throughout, because Wales applies no relief. Detached houses average ${h.gbp(R.detached as number)}, reaching the ${h.pct(W.main[2][1])} band above ${h.gbp(top(W.main, 1))}. Prices moved ${h.num(R.change ?? 0, 1)}% over the year to ${M}.</p>
<h2>The higher rates in Wales</h2>
<p>Welsh higher rates are a table of their own, not a flat surcharge: ${h.pct(W.higher[0][1])} up to ${h.gbp(top(W.higher, 0))}, then ${h.pct(W.higher[1][1])}, ${h.pct(W.higher[2][1])} and upwards. On the average Cardiff flat (${h.gbp(R.flat as number)}) a landlord pays ${h.gbp(h.t('wales', R.flat as number, 'additional'))} where an owner-occupier pays ${h.gbp(h.t('wales', R.flat as number))}. Companies pay the higher rates on every purchase from ${h.gbp(W.higher_min_price)} (${h.a('ltt-higher-rates', 'LTT higher rates')}).</p>`;
  },
});
