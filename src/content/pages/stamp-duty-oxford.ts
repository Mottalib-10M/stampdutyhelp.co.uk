import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place, sdltPrevious } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('oxford');
const M = monthLabel();
const S = P.sdlt;
const ftb = R.ftb as number, mover = R.mover as number;

export default definePage({
  id: 'stamp-duty-oxford',
  group: 'places',
  order: 490,
  slug: 'stamp-duty-oxford',
  place: 'oxford',
  nav: 'Oxford',
  card: `First-time buyers average ${gbp(ftb)}: ${gbp(t('england', ftb, 'first'))} of SDLT, up from ${gbp(sdltPrevious(ftb, 'first'))} before April 2025.`,
  title: `Stamp Duty Oxford 2026: First Homes at ${gbp(ftb)} Pay Tax`,
  description: `Stamp duty in Oxford in 2026: the average first-time buyer pays ${gbp(t('england', ftb, 'first'))} on ${gbp(ftb)}, a home mover ${gbp(t('england', mover))} on ${gbp(mover)} (UK HPI, ${M}), all computed.`,
  h1: 'Stamp duty in Oxford',
  intro: 'One of the dearest cities outside London, and one where the April 2025 change cost first-time buyers the most.',
  resume: `Oxford first-time buyers paid ${gbp(ftb)} on average in ${M}, on the UK House Price Index, which is ${gbp(ftb - top(S.first_time_buyer, 0))} above the nil band of first-time buyer relief. Their Stamp Duty Land Tax is therefore ${gbp(t('england', ftb, 'first'))}, at ${pct(S.first_time_buyer[1][1])} of the excess. Until 31 March 2025, when the relief ran to ${gbp(top(S.previous.first_time_buyer, 0))} tax-free, the same purchase cost ${gbp(sdltPrevious(ftb, 'first'))}. Home movers in the city paid ${gbp(mover)} on average, above the ${gbp(S.first_time_buyer_max_price)} line, and pay ${gbp(t('england', mover))}. The overall average of ${gbp(R.avg)} costs ${gbp(t('england', R.avg))} for a buyer with one home and ${gbp(t('england', R.avg, 'additional'))} with the additional-property surcharge. A first-time buyer whose purchase goes over ${gbp(S.first_time_buyer_max_price)} loses the relief outright, which in Oxford is a realistic risk for anyone buying a family house as a first home.`,
  faqs: [
    { q: 'How much more stamp duty does an Oxford first-time buyer pay since April 2025?', a: `At the city’s ${gbp(ftb)} first-time buyer average, ${gbp(t('england', ftb, 'first') - sdltPrevious(ftb, 'first'))} more: ${gbp(t('england', ftb, 'first'))} now against ${gbp(sdltPrevious(ftb, 'first'))} under the old ${gbp(top(S.previous.first_time_buyer, 0))} nil band. On a ${gbp(550000)} first home the change is larger, from ${gbp(sdltPrevious(550000, 'first'))} to ${gbp(t('england', 550000, 'first'))}, because the relief no longer reaches that price.` },
    { q: 'Is a terraced house in Oxford above the first-time buyer limit?', a: `On average it is close: Oxford terraces sold for ${gbp(R.terraced as number)} in ${M}, under the ${gbp(S.first_time_buyer_max_price)} limit, so a first-time buyer pays ${gbp(t('england', R.terraced as number, 'first'))} on it with the relief. Semis average ${gbp(R.semi as number)}, above the limit, where a first-time buyer pays the full ${gbp(t('england', R.semi as number, 'first'))}.` },
    { q: 'What stamp duty would a university employee relocating from abroad pay in Oxford?', a: `If they spent fewer than ${S.non_resident_days} days in the UK in the year before completion, the ${pct(S.non_resident_surcharge)} surcharge applies. On the ${gbp(R.avg)} average home, bought as their only home, that means ${gbp(t('england', R.avg, 'home', { nonResident: true }))} instead of ${gbp(t('england', R.avg))}. The surcharge can be reclaimed if they reach ${S.non_resident_days} days within a year of completion.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true, situation: 'first' },
  related: ['stamp-duty-changes-april-2025', 'stamp-duty-first-time-buyer', 'stamp-duty-on-500000', 'stamp-duty-london', 'stamp-duty-brighton', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'govSdltPrevious', 'sdltmNonResRefund'],
  body: (h) => {
    const types: Array<[string, number]> = [['Flat', R.flat as number], ['Terrace', R.terraced as number], ['First-time buyer average', ftb], ['Semi-detached', R.semi as number]];
    const rows = types.map(([l, p]) => [l, h.gbp(p), h.gbp(h.t('england', p, 'first')), h.gbp(sdltPrevious(p, 'first')), h.gbp(h.t('england', p, 'first') - sdltPrevious(p, 'first'))]);
    return `
<h2>What April 2025 changed for Oxford first homes</h2>
${h.table(['Home', 'Price', 'First-time buyer now', 'Before April 2025', 'Increase'], rows, `First-time buyer SDLT on Oxford averages, ${M}`, ['l', 'r', 'r', 'r', 'r'])}
<p>The increase grows with the price because two things happened at once. The tax-free part of the relief fell from ${h.gbp(top(S.previous.first_time_buyer, 0))} to ${h.gbp(top(S.first_time_buyer, 0))}, and the price above which the relief disappears fell from ${h.gbp(S.previous.first_time_buyer_max_price)} to ${h.gbp(S.first_time_buyer_max_price)}. An Oxford semi bought as a first home was inside the old relief and is outside the new one.</p>
<h2>Every home type</h2>
${typesTable(h, R)}
<p>Detached houses average ${h.gbp(R.detached as number)} in the city, reaching the ${h.pct(S.residential[3][1])} band above ${h.gbp(top(S.residential, 2))} only at the very top of the market. Prices moved ${h.num(R.change ?? 0, 1)}% over the year to ${M}.</p>
<h2>Arriving from abroad</h2>
<p>Buyers who move to Oxford for work or study and buy within their first year are often non-resident for SDLT. The test counts days in the UK in the twelve months before completion; reaching ${S.non_resident_days} days in any continuous year that ends up to a year after completion lets them amend the return within ${S.non_resident_refund_years} years and reclaim the ${h.pct(S.non_resident_surcharge)}. A spouse or civil partner living with a UK resident is treated as resident from the start (${h.a('non-resident-stamp-duty-surcharge', 'non-resident surcharge')}).</p>`;
  },
});
