import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('liverpool');
const M = monthLabel();
const S = P.sdlt;
const chg = R.change ?? 0;
const before = Math.round(R.avg / (1 + chg / 100));

export default definePage({
  id: 'stamp-duty-liverpool',
  group: 'places',
  order: 450,
  slug: 'stamp-duty-liverpool',
  place: 'liverpool',
  nav: 'Liverpool',
  card: `Prices up ${chg}% in a year: ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average home.`,
  title: `Stamp Duty Liverpool 2026: ${gbp(t('england', R.avg))} on the Average Home`,
  description: `Stamp duty in Liverpool in 2026: ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average (UK HPI, ${M}), what a ${chg}% price rise does to the bill, and what landlords now pay.`,
  h1: 'Stamp duty in Liverpool',
  intro: `Liverpool prices rose faster than most of England in the year to ${M}; here is what that does to the tax.`,
  resume: `The average home in Liverpool sold for ${gbp(R.avg)} in ${M}, ${chg}% more than a year earlier according to the UK House Price Index. For a buyer who will own just that home, the Stamp Duty Land Tax is ${gbp(t('england', R.avg))}, against ${gbp(t('england', before))} on the price of a year before. Because the tax is a slice tax, a rising price only adds ${pct(S.residential[1][1])} of the increase while the home stays under ${gbp(top(S.residential, 1))}, which is the case for the city average and for its average flat, terrace and semi. First-time buyers paid ${gbp(R.ftb as number)} on average, inside the nil band of the relief, so they pay nothing. Landlords pay far more: ${gbp(t('england', R.flat as number, 'additional'))} on the ${gbp(R.flat as number)} average flat, because the ${pct(S.higher_rates_surcharge)} surcharge applies to the whole price, starting from the very first pound.`,
  faqs: [
    { q: 'House prices in Liverpool keep rising. Will my stamp duty jump?', a: `Not by much at today’s levels. Under ${gbp(top(S.residential, 1))} each extra pound costs ${pct(S.residential[1][1])} in SDLT for a one-home buyer, so a ${gbp(10000)} rise adds ${gbp(10000 * S.residential[1][1])}. The average Liverpool home went from about ${gbp(before)} to ${gbp(R.avg)} in a year, and its tax from ${gbp(t('england', before))} to ${gbp(t('england', R.avg))}.` },
    { q: 'What stamp duty does an investor pay on a Liverpool terrace?', a: `On the ${gbp(R.terraced as number)} average terraced price, ${gbp(t('england', R.terraced as number, 'additional'))} for a buyer who keeps another home, against ${gbp(t('england', R.terraced as number))} for someone buying their only home. The ${gbp(t('england', R.terraced as number, 'additional') - t('england', R.terraced as number))} difference is the surcharge, and it is not refundable on an investment purchase, whoever the buyer is.` },
    { q: 'Is a Liverpool first home free of stamp duty?', a: `On average, yes: first-time buyers paid ${gbp(R.ftb as number)} in ${M}, below the ${gbp(top(S.first_time_buyer, 0))} nil band, so the relief brings the tax to ${gbp(t('england', R.ftb as number, 'first'))}. A first home would have to cost more than ${gbp(top(S.first_time_buyer, 0))} before any tax was due, and the relief continues up to ${gbp(S.first_time_buyer_max_price)}.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-manchester', 'stamp-duty-on-200000', 'buy-to-let-stamp-duty', 'stamp-duty-second-home', 'stamp-duty-sheffield', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'govSdltHigher'],
  body: (h) => {
    const rows = [0, 5, 10, 15, 20].map((g) => { const p = Math.round(R.avg * (1 + g / 100)); return [`+${g}%`, h.gbp(p), h.gbp(h.t('england', p)), h.gbp(h.t('england', p, 'additional'))]; });
    return `
<h2>What a rising price does to the bill</h2>
<p>Prices climbing quickly feel expensive at the tax stage too, but the effect is gentle at Liverpool’s price level. The table applies further rises to today’s average: the tax for an owner-occupier grows by ${h.pct(S.residential[1][1])} of each pound until ${h.gbp(top(S.residential, 1))}, then by ${h.pct(S.residential[2][1])}.</p>
${h.table(['Further rise', 'Price', 'SDLT, one home', 'Additional property'], rows, 'Liverpool average under further price rises', ['l', 'r', 'r', 'r'])}
<h2>The city’s homes by type</h2>
${typesTable(h, R)}
<p>Liverpool’s detached average, ${h.gbp(R.detached as number)}, is the only one high enough to reach the ${h.pct(S.residential[2][1])} band. Its semis average ${h.gbp(R.semi as number)}, so even a family house rarely pays more than ${h.gbp(h.t('england', top(S.residential, 1)))} for a one-home buyer.</p>
<h2>Investors: where the tax really is</h2>
<p>At low prices the surcharge dominates the bill. On the average flat it multiplies the tax many times over: ${h.gbp(h.t('england', R.flat as number))} for an owner-occupier, ${h.gbp(h.t('england', R.flat as number, 'additional'))} for a landlord. Buying through a limited company does not avoid it, and a company buying a second flat in the same deal pays the higher rates on each. The ${h.a('stamp-duty-second-home', 'higher rates page')} explains who is caught.</p>`;
  },
});
