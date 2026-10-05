import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('leeds');
const M = monthLabel();
const S = P.sdlt;
const B2 = top(S.residential, 1);
const mover = R.mover as number;

export default definePage({
  id: 'stamp-duty-leeds',
  group: 'places',
  order: 430,
  slug: 'stamp-duty-leeds',
  place: 'leeds',
  nav: 'Leeds',
  card: `Average ${gbp(R.avg)} just under the ${gbp(B2)} line; home movers pay ${gbp(t('england', mover))} on their average.`,
  title: `Stamp Duty Leeds 2026: Tax on Homes Around ${gbp(B2)}`,
  description: `Stamp duty in Leeds in 2026: ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), why ${gbp(B2)} matters, and the bill for first-time buyers and movers.`,
  h1: 'Stamp duty in Leeds',
  intro: `The Leeds average sits a whisker below ${gbp(B2)}, the point where SDLT moves from ${pct(S.residential[1][1])} to ${pct(S.residential[2][1])}.`,
  resume: `In ${M} the average Leeds home sold for ${gbp(R.avg)} on the UK House Price Index, which costs ${gbp(t('england', R.avg))} of Stamp Duty Land Tax for a buyer who will own only that home. That price falls just short of ${gbp(B2)}, the top of the ${pct(S.residential[1][1])} band: every pound above it is taxed at ${pct(S.residential[2][1])}, so a home at ${gbp(B2 + 50000)} costs ${gbp(t('england', B2 + 50000))} rather than ${gbp(t('england', B2))}. Former owner-occupiers, the people selling one Leeds home to buy another, paid ${gbp(mover)} on average and so pay ${gbp(t('england', mover))}, most of it in the higher band. First-time buyers paid ${gbp(R.ftb as number)} on average, within the nil band of the relief, and pay nothing. A buyer adding a second home at the average price pays ${gbp(t('england', R.avg, 'additional'))}, because the surcharge is added to every band, the nil band included.`,
  faqs: [
    { q: `Is it worth keeping an offer in Leeds under ${gbp(B2)} for stamp duty?`, a: `Only a little. The band change at ${gbp(B2)} is a slice threshold, not a cliff: the first ${gbp(10000)} above it costs ${gbp(t('england', B2 + 10000) - t('england', B2))} more in tax than the same ${gbp(10000)} below it would. For a first-time buyer the line that matters is ${gbp(top(S.first_time_buyer, 0))}, where the relief starts charging ${pct(S.first_time_buyer[1][1])}.` },
    { q: 'What do home movers in Leeds typically pay in stamp duty?', a: `On the ${gbp(mover)} average paid by former owner-occupiers in ${M}, ${gbp(t('england', mover))}: ${pct(S.residential[1][1])} on the slice from ${gbp(top(S.residential, 0) + 1)} to ${gbp(B2)} and ${pct(S.residential[2][1])} on the ${gbp(mover - B2)} above it. That assumes the old home is sold by completion; otherwise the higher rates apply until it sells.` },
    { q: 'My parents want to buy a flat in Leeds for me to live in while I study. Who pays what?', a: `If the parents buy it and already own their home, the purchase is an additional dwelling: on the ${gbp(R.flat as number)} average Leeds flat that is ${gbp(t('england', R.flat as number, 'additional'))}. If you buy it yourself as a first-time buyer, with their help as a gift or a joint borrower sole proprietor mortgage, the relief can apply and the tax is ${gbp(t('england', R.flat as number, 'first'))}.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-on-250000', 'stamp-duty-sheffield', 'stamp-duty-manchester', 'stamp-duty-joint-purchase', 'stamp-duty-moving-home', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'govSdltHigher', 'sdltmFtb'],
  body: (h) => {
    const rows = [200000, 225000, B2, 275000, 300000, 325000].map((p) => [h.gbp(p), h.gbp(h.t('england', p)), h.gbp(h.t('england', p, 'first')), h.gbp(h.t('england', p) - h.t('england', p - 25000))]);
    return `
<h2>The ${h.gbp(B2)} band change, step by step</h2>
<p>Below ${h.gbp(B2)}, each extra ${h.gbp(25000)} of price adds ${h.gbp(25000 * S.residential[1][1])} of tax. Above it, the same step adds ${h.gbp(25000 * S.residential[2][1])}. Leeds has a lot of homes on both sides of that line, which is why two neighbouring houses can carry noticeably different bills.</p>
${h.table(['Price', 'SDLT, one home', 'First-time buyer', 'Extra tax on the last £25,000'], rows, 'How the tax climbs around the Leeds average', ['l', 'r', 'r', 'r'])}
<h2>By property type</h2>
${typesTable(h, R)}
<p>Flats average ${h.gbp(R.flat as number)} and terraces ${h.gbp(R.terraced as number)}: both cost a one-home buyer less than ${h.gbp(h.t('england', B2))}. The semi-detached average, ${h.gbp(R.semi as number)}, crosses the line, and a detached house at ${h.gbp(R.detached as number)} pays ${h.gbp(h.t('england', R.detached as number))}. Prices in the city rose ${h.num(R.change ?? 0, 1)}% in the year to ${M}.</p>
<h2>Parents, students and first homes</h2>
<p>Leeds has two large universities, and parents buying a flat for a son or daughter raises a question the calculator answers in seconds. The answer turns on who goes on the deeds. Parents who own their own home and buy in their names pay the ${h.pct(S.higher_rates_surcharge)} surcharge. A child buying alone, never having owned a home, can claim first-time buyer relief, even with a parental gift towards the deposit. Putting a parent on the title alongside the child loses the relief and brings in the surcharge, because one buyer’s position decides the rate for the whole purchase; the ${h.a('stamp-duty-joint-purchase', 'joint purchase calculator')} shows the effect.</p>`;
  },
});
