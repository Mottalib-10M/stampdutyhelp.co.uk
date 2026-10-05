import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';

const R = place('manchester');
const M = monthLabel();
const avg = R.avg, ftb = R.ftb as number, mover = R.mover as number;

export default definePage({
  id: 'stamp-duty-manchester',
  group: 'places',
  order: 410,
  slug: 'stamp-duty-manchester',
  place: 'manchester',
  nav: 'Manchester',
  card: `Average home ${gbp(avg)}: ${gbp(t('england', avg))} of SDLT, ${gbp(t('england', ftb, 'first'))} for the typical first-time buyer.`,
  title: `Stamp Duty Manchester 2026: Tax on the ${gbp(avg)} Average`,
  description: `Stamp duty in Manchester in 2026: ${gbp(t('england', avg))} on the ${gbp(avg)} average home (UK HPI, ${M}), nothing for most first-time buyers, landlords and terraces priced.`,
  h1: 'Stamp duty in Manchester',
  intro: `What SDLT costs on the homes Manchester actually sells, from the ${gbp(R.flat as number)} average flat to the ${gbp(R.detached as number)} detached house.`,
  resume: `The average home sold in the City of Manchester cost ${gbp(avg)} in ${M}, according to the UK House Price Index published by HM Land Registry, and a buyer who will own only that home pays ${gbp(t('england', avg))} of Stamp Duty Land Tax on it. First-time buyers paid ${gbp(ftb)} on average, below the ${gbp(P.sdlt.first_time_buyer[0][0] as number)} nil band of first-time buyer relief, so the typical first purchase in the city is free of SDLT. Former owner-occupiers moving within or into Manchester paid ${gbp(mover)}, which costs ${gbp(t('england', mover))}. For a landlord buying at the average price, the ${pct(P.sdlt.higher_rates_surcharge)} higher rates bring the bill to ${gbp(t('england', avg, 'additional'))}, and a company buying through a limited company pays the same higher rates while the price stays under ${gbp(P.sdlt.corporate_flat_threshold)}, which covers every average in the city.`,
  faqs: [
    { q: 'Do first-time buyers in Manchester usually pay stamp duty?', a: `Mostly not. The average price paid by first-time buyers in the city was ${gbp(ftb)} in ${M}, and first-time buyer relief charges nothing up to ${gbp(P.sdlt.first_time_buyer[0][0] as number)}. Only a first home above that line pays ${pct(P.sdlt.first_time_buyer[1][1])} on the excess, for example ${gbp(t('england', 325000, 'first'))} on ${gbp(325000)}.` },
    { q: 'How much stamp duty does a landlord pay on an average Manchester flat?', a: `On the ${gbp(R.flat as number)} average flat price, a buyer who already owns a home pays ${gbp(t('england', R.flat as number, 'additional'))} at the higher rates, against ${gbp(t('england', R.flat as number))} for someone buying their only home. The difference, ${gbp(t('england', R.flat as number, 'additional') - t('england', R.flat as number))}, is the ${pct(P.sdlt.higher_rates_surcharge)} surcharge added to every band, and it applies whether the landlord buys personally or through a company.` },
    { q: 'Is Manchester stamp duty different from the rest of England?', a: `No. Stamp Duty Land Tax has the same bands in every English council and in Northern Ireland; only the price changes. What makes Manchester distinctive is the gap between a first-time buyer price that stays under the relief threshold and detached homes that reach the ${pct(P.sdlt.residential[2][1])} band.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-liverpool', 'stamp-duty-leeds', 'stamp-duty-birmingham', 'buy-to-let-stamp-duty', 'stamp-duty-first-time-buyer', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'govSdltHigher'],
  body: (h) => {
    const types: Array<[string, number | null]> = [['Flat or maisonette', R.flat], ['Terraced house', R.terraced], ['Semi-detached house', R.semi], ['Detached house', R.detached], ['All homes', R.avg]];
    const rows = types.filter(([, p]) => p).map(([l, p]) => [l, h.gbp(p as number), h.gbp(h.t('england', p as number, 'first')), h.gbp(h.t('england', p as number)), h.gbp(h.t('england', p as number, 'additional'))]);
    return `
<h2>The tax on each type of Manchester home</h2>
${h.table(['Average price, ' + M, 'Price', 'First-time buyer', 'One home', 'Additional property'], rows, 'SDLT on Manchester average prices (UK HPI), 2026 bands', ['l', 'r', 'r', 'r', 'r'])}
<p>Flats dominate sales in the city centre, Salford Quays sits in a different council, and the inner suburbs of Chorlton, Didsbury and Levenshulme sell mostly terraces and semis. The index for the City of Manchester mixes all of them, which is why the average flat and the average detached house are more than ${h.gbp((R.detached as number) - (R.flat as number))} apart. Prices moved by ${h.num(R.change ?? 0, 1)}% over the year to ${M}.</p>
<h2>First-time buyers: why most pay nothing</h2>
<p>Manchester is one of the large English cities where the typical first purchase stays below ${h.gbp(h.P.sdlt.first_time_buyer[0][0] as number)}. That changed nothing in April 2025 for buyers at the average: they paid nothing under the old ${h.gbp(h.P.sdlt.previous.first_time_buyer[0][0] as number)} nil band and still pay nothing now. The buyers who lost out are those buying family houses in the southern suburbs between ${h.gbp(h.P.sdlt.first_time_buyer[0][0] as number + 1)} and ${h.gbp(h.P.sdlt.previous.first_time_buyer_max_price)}, who now pay up to ${h.gbp(h.t('england', h.P.sdlt.first_time_buyer_max_price, 'first'))}.</p>
<h2>Landlords and the higher rates</h2>
<p>A flat bought to let carries the ${h.pct(h.P.sdlt.higher_rates_surcharge)} surcharge from ${h.gbp(h.P.sdlt.higher_rates_min_price)} upwards, whether the buyer is an individual who owns a home or a limited company buying its first flat. Below ${h.gbp(h.P.sdlt.corporate_flat_threshold)} the company pays the same as the individual; the ${h.pct(h.P.sdlt.corporate_flat_rate)} flat rate only concerns more expensive homes, and a letting business is relieved from it. See ${h.a('buy-to-let-stamp-duty', 'buy-to-let stamp duty')} for the full comparison.</p>
<h2>Moving home within the city</h2>
<p>A family selling a terrace to buy a semi pays ${h.gbp(h.t('england', R.semi as number))} on the average semi-detached price, provided the old home is sold on or before completion day. If the sale falls through and they complete anyway, they pay ${h.gbp(h.t('england', R.semi as number, 'additional'))} and can reclaim ${h.gbp(h.t('england', R.semi as number, 'additional') - h.t('england', R.semi as number))} once the old house sells within ${h.P.sdlt.replace_main_residence_years} years (${h.a('stamp-duty-surcharge-refund', 'surcharge refund')}).</p>`;
  },
});
