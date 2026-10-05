import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place, compute } from '../../lib/kit';
import { HPI, monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('london');
const M = monthLabel();
const S = P.sdlt;
const CAP = S.first_time_buyer_max_price;
const boroughs = Object.values(HPI.regions).filter((r) => r.gss.startsWith('E09'));
const ftbOver = boroughs.filter((b) => (b.ftb ?? 0) > CAP).length;
const dearest = [...boroughs].sort((a, b) => b.avg - a.avg)[0];
const cheapest = [...boroughs].sort((a, b) => a.avg - b.avg)[0];

export default definePage({
  id: 'stamp-duty-london',
  group: 'places',
  order: 400,
  slug: 'stamp-duty-london',
  place: 'london',
  nav: 'London',
  card: `Average home ${gbp(R.avg)}: ${gbp(t('england', R.avg))} of SDLT, and first-time buyers close to the ${gbp(CAP)} cliff.`,
  title: `Stamp Duty London 2026: ${gbp(t('england', R.avg))} on the Average Home`,
  description: `Stamp duty in London in 2026: ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), the first-time buyer cliff at ${gbp(CAP)}, borough by borough, all ${boroughs.length}.`,
  h1: 'Stamp duty in London',
  intro: `The capital is where the first-time buyer cliff at ${gbp(CAP)} decides most bills: here is the tax borough by borough.`,
  resume: `The average London home sold for ${gbp(R.avg)} in ${M}, according to the UK House Price Index, and a buyer who will own only that home pays ${gbp(t('england', R.avg))} of Stamp Duty Land Tax on it. First-time buyers in London paid ${gbp(R.ftb as number)} on average, inside the ${gbp(CAP)} limit of the relief, so the typical first purchase costs ${gbp(t('england', R.ftb as number, 'first'))} instead of ${gbp(t('england', R.ftb as number))}. That margin is thin: in ${ftbOver} of the ${boroughs.length} London local authorities the average first-time buyer price is already above ${gbp(CAP)}, where the relief vanishes and the full standard bill applies. Home movers paid ${gbp(R.mover as number)} on average, which carries ${gbp(t('england', R.mover as number))} of tax, and an investor buying the average flat at ${gbp(R.flat as number)} pays ${gbp(t('england', R.flat as number, 'additional'))} at the higher rates. The borough table below applies the same rules to each of the ${boroughs.length} local authorities.`,
  faqs: [
    { q: 'Do first-time buyers in London still get stamp duty relief?', a: `Yes, on any home costing ${gbp(CAP)} or less: nothing up to ${gbp(top(S.first_time_buyer, 0))}, then ${pct(S.first_time_buyer[1][1])} on the rest. The London average first-time buyer price of ${gbp(R.ftb as number)} costs ${gbp(t('england', R.ftb as number, 'first'))}. A first flat at ${gbp(CAP + 25000)} gets no relief at all and pays ${gbp(t('england', CAP + 25000, 'first'))}.` },
    { q: 'Which London borough has the highest stamp duty on an average home?', a: `On the ${M} index, ${dearest.name}, where the average sale of ${gbp(dearest.avg)} carries ${gbp(t('england', dearest.avg))} of SDLT for a one-home buyer. The lowest is ${cheapest.name}, at ${gbp(cheapest.avg)} and ${gbp(t('england', cheapest.avg))}. Borough averages in central London move a lot from month to month because few, very different homes are sold.` },
    { q: 'I work in London but lived overseas last year. Will I pay more stamp duty on a flat?', a: `If you spent fewer than ${S.non_resident_days} days in the UK in the twelve months before completion, the ${pct(S.non_resident_surcharge)} surcharge applies: on the ${gbp(R.flat as number)} average London flat that is ${gbp(compute({ nation: 'england', price: R.flat as number, situation: 'home', nonResident: true }).nonResidentSurcharge)} more. Once you reach ${S.non_resident_days} days within a year of completion, the return can be amended to reclaim it.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-on-500000', 'stamp-duty-first-time-buyer', 'non-resident-stamp-duty-surcharge', 'stamp-duty-oxford', 'stamp-duty-brighton', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'sdltmNonResident'],
  body: (h) => {
    const rows = [...boroughs].sort((a, b) => b.avg - a.avg).map((b) => [b.name, h.gbp(b.avg), h.gbp(h.t('england', b.avg)), b.ftb ? h.gbp(b.ftb) : 'n/a', b.ftb ? h.gbp(h.t('england', b.ftb, 'first')) : 'n/a']);
    return `
<h2>Every borough at its average price</h2>
<p>Thirty-two boroughs and the City of London, each with its own index. The fourth column is what first-time buyers actually paid there; the fifth applies the relief to that price, and shows the cliff wherever the average passes ${h.gbp(CAP)}.</p>
${h.table(['Local authority', 'Average price', 'SDLT, one home', 'First-time buyer average', 'SDLT with relief'], rows, `London boroughs, UK HPI ${M}`, ['l', 'r', 'r', 'r', 'r'])}
<h2>The ${h.gbp(CAP)} line in practice</h2>
<p>Outside London the cliff concerns few first homes. Here it shapes negotiations: a flat listed at ${h.gbp(CAP + 10000)} costs a first-time buyer ${h.gbp(h.t('england', CAP + 10000, 'first'))}, while the same flat bought at ${h.gbp(CAP)} costs ${h.gbp(h.t('england', CAP, 'first'))}. Ten thousand pounds off the price saves ${h.gbp(h.t('england', CAP + 10000, 'first') - h.t('england', CAP, 'first'))} of tax on top. Before 1 April 2025 the relief ran to ${h.gbp(S.previous.first_time_buyer_max_price)}, and the return to ${h.gbp(CAP)} is the change that reaches the most first-time buyers in the capital, where ${ftbOver} local authorities now average above the line.</p>
<h2>Flats, terraces and family houses</h2>
${typesTable(h, R)}
<p>A London semi averages ${h.gbp(R.semi as number)} and a terrace ${h.gbp(R.terraced as number)}, both deep in the ${h.pct(S.residential[2][1])} band, which runs to ${h.gbp(top(S.residential, 2))}. Detached houses average ${h.gbp(R.detached as number)}, enough to reach the ${h.pct(S.residential[3][1])} band, so each extra ${h.gbp(10000)} there costs ${h.gbp(10000 * S.residential[3][1])} in tax.</p>
<h2>Investors and companies</h2>
<p>A London buy-to-let flat at the average price pays ${h.gbp(h.t('england', R.flat as number, 'additional'))} with the ${h.pct(S.higher_rates_surcharge)} surcharge. Above ${h.gbp(S.corporate_flat_threshold)} a company without a relief pays ${h.pct(S.corporate_flat_rate)} of the whole price: ${h.gbp(h.t('england', 600000, 'home', { company: true }))} on a ${h.gbp(600000)} flat, against ${h.gbp(h.t('england', 600000, 'home', { company: true, companyRelief: true }))} if it lets the flat as a business. See ${h.a('stamp-duty-company-purchase', 'company purchases')}.</p>`;
  },
});
