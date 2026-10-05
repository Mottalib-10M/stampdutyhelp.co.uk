import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('sheffield');
const M = monthLabel();
const S = P.sdlt;
const B2 = top(S.residential, 1);
const semi = R.semi as number;

export default definePage({
  id: 'stamp-duty-sheffield',
  group: 'places',
  order: 460,
  slug: 'stamp-duty-sheffield',
  place: 'sheffield',
  nav: 'Sheffield',
  card: `Average ${gbp(R.avg)}; even the average semi stays in the ${pct(S.residential[1][1])} band: ${gbp(t('england', semi))}.`,
  title: `Stamp Duty Sheffield 2026: ${gbp(t('england', R.avg))} on an Average Home`,
  description: `Stamp duty in Sheffield in 2026: ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), family semis under ${gbp(B2)}, first homes and second homes priced.`,
  h1: 'Stamp duty in Sheffield',
  intro: `In Sheffield the flat, the terrace and the semi all stay below ${gbp(B2)}: only detached houses reach the ${pct(S.residential[2][1])} band.`,
  resume: `Sheffield homes sold for ${gbp(R.avg)} on average in ${M}, according to the UK House Price Index, and a buyer who will own only that home pays ${gbp(t('england', R.avg))} of Stamp Duty Land Tax. What sets the city apart from Leeds or Bristol is that its family housing is still priced inside the ${pct(S.residential[1][1])} band: the average semi-detached house, at ${gbp(semi)}, costs ${gbp(t('england', semi))}, and the average terrace, at ${gbp(R.terraced as number)}, costs ${gbp(t('england', R.terraced as number))}. First-time buyers paid ${gbp(R.ftb as number)} on average and pay nothing thanks to the relief, which is tax-free up to ${gbp(top(S.first_time_buyer, 0))}. Only the detached average, ${gbp(R.detached as number)}, crosses ${gbp(B2)} and starts paying ${pct(S.residential[2][1])} on the excess. A second home at the average price costs ${gbp(t('england', R.avg, 'additional'))} with the surcharge, which applies whether the buyer is a person or a company.`,
  faqs: [
    { q: 'How much stamp duty on a semi-detached house in Sheffield?', a: `At the ${gbp(semi)} average, ${gbp(t('england', semi))} for a buyer who will own only that home, nothing for a first-time buyer, and ${gbp(t('england', semi, 'additional'))} for a purchase that leaves the buyer with two homes. Because the price is below ${gbp(B2)}, all of the standard tax comes from the ${pct(S.residential[1][1])} band.` },
    { q: `At what price does a Sheffield house start paying ${pct(S.residential[2][1])} stamp duty?`, a: `Above ${gbp(B2)}, for a buyer who is not a first-time buyer: only the part of the price over that figure pays ${pct(S.residential[2][1])}. A ${gbp(300000)} detached house therefore costs ${gbp(t('england', 300000))}, of which ${gbp(t('england', 300000) - t('england', B2))} comes from the higher band. Sheffield’s average detached house, ${gbp(R.detached as number)}, costs ${gbp(t('england', R.detached as number))}.` },
    { q: 'I am buying a Sheffield flat to rent out while keeping my home. What is the tax?', a: `On the ${gbp(R.flat as number)} average flat, ${gbp(t('england', R.flat as number, 'additional'))}, because the ${pct(S.higher_rates_surcharge)} surcharge applies to every band once you will own two homes. A buyer purchasing the same flat as their only home would pay ${gbp(t('england', R.flat as number))}. The surcharge on a rental is not refundable.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-leeds', 'stamp-duty-newcastle', 'stamp-duty-on-250000', 'stamp-duty-second-home', 'stamp-duty-first-time-buyer', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'govSdltHigher'],
  body: (h) => `
<h2>Family houses inside the ${h.pct(S.residential[1][1])} band</h2>
<p>For a home mover the tax on a Sheffield semi is ${h.gbp(h.t('england', semi))}; the same buyer moving to the average semi in ${h.a('stamp-duty-bristol', 'Bristol')} pays ${h.gbp(h.t('england', h.place('city-of-bristol').semi as number))}. The difference comes almost entirely from the band above ${h.gbp(B2)}, which Sheffield’s semis do not reach. Prices rose ${h.num(R.change ?? 0, 1)}% over the year to ${M}; another ${h.gbp(10000)} on a semi below the line adds ${h.gbp(10000 * S.residential[1][1])} of tax.</p>
${typesTable(h, R)}
<h2>Moving from a terrace to a detached house</h2>
<p>The step that costs the most in tax is the one that crosses ${h.gbp(B2)}. Going from the average terrace to the average semi raises the bill from ${h.gbp(h.t('england', R.terraced as number))} to ${h.gbp(h.t('england', semi))}. Going on to the average detached house takes it to ${h.gbp(h.t('england', R.detached as number))}. If the purchase completes before the sale, the higher rates apply for a time: ${h.gbp(h.t('england', R.detached as number, 'additional'))} on the detached average, with ${h.gbp(h.t('england', R.detached as number, 'additional') - h.t('england', R.detached as number))} to reclaim when the old house sells (${h.a('stamp-duty-moving-home', 'moving home')}).</p>
<h2>Second homes and rentals</h2>
<p>At Sheffield prices the surcharge is the biggest part of an investor’s bill. On the average terrace a landlord pays ${h.gbp(h.t('england', R.terraced as number, 'additional'))}, compared with ${h.gbp(h.t('england', R.terraced as number))} for an owner-occupier. Nothing changes if the landlord buys through a company, as long as the price stays under ${h.gbp(S.corporate_flat_threshold)}.</p>`,
});
