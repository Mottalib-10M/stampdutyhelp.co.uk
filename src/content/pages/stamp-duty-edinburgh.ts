import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place, compute } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('city-of-edinburgh');
const M = monthLabel();
const L = P.lbtt;
const B3 = top(L.residential, 2);
const mover = R.mover as number;

export default definePage({
  id: 'stamp-duty-edinburgh',
  group: 'places',
  order: 510,
  slug: 'stamp-duty-edinburgh',
  place: 'city-of-edinburgh',
  nav: 'Edinburgh',
  card: `LBTT, not stamp duty: ${gbp(t('scotland', R.avg))} on the ${gbp(R.avg)} average, ${gbp(t('scotland', R.avg, 'additional'))} with the ADS.`,
  title: `LBTT Edinburgh 2026: Stamp Duty on a ${gbp(R.avg)} Home`,
  description: `LBTT in Edinburgh in 2026: ${gbp(t('scotland', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), the ${pct(L.residential[3][1])} band from ${gbp(B3)} and the ${pct(L.ads_rate)} ADS on second homes and lets.`,
  h1: 'Stamp duty (LBTT) in Edinburgh',
  intro: `Scotland’s capital is where the ${pct(L.residential[3][1])} LBTT band, starting at ${gbp(B3)}, catches the most buyers.`,
  resume: `Edinburgh buyers do not pay Stamp Duty Land Tax but Scotland’s Land and Buildings Transaction Tax, collected by Revenue Scotland. The average home in the City of Edinburgh sold for ${gbp(R.avg)} in ${M}, on the UK House Price Index, and LBTT on that price is ${gbp(t('scotland', R.avg))} for a buyer who will own only that home. Home movers paid ${gbp(mover)} on average, above the ${gbp(B3)} point where Scotland’s ${pct(L.residential[3][1])} band begins, so their tax rises to ${gbp(t('scotland', mover))}. First-time buyers paid ${gbp(R.ftb as number)} on average; their relief lifts the nil band to ${gbp(L.first_time_buyer_nil_band)} and brings the bill to ${gbp(t('scotland', R.ftb as number, 'first'))}. Second homes and rentals pay the Additional Dwelling Supplement of ${pct(L.ads_rate)} of the whole price on top: ${gbp(compute({ nation: 'scotland', price: R.avg, situation: 'additional' }).surcharge)} on the average, ${gbp(t('scotland', R.avg, 'additional'))} in all.`,
  faqs: [
    { q: 'Why is the tax on an Edinburgh family house so much higher than in England?', a: `Because Scotland’s ${pct(L.residential[3][1])} band starts at ${gbp(B3)}, against ${gbp(top(P.sdlt.residential, 2))} for England’s equivalent band. On the ${gbp(R.semi as number)} average Edinburgh semi, LBTT is ${gbp(t('scotland', R.semi as number))} while SDLT on the same price would be ${gbp(t('england', R.semi as number))}. Below about ${gbp(B3)} the two taxes are much closer.` },
    { q: 'How much ADS on a buy-to-let flat in Edinburgh?', a: `${pct(L.ads_rate)} of the price, from the first pound. On the ${gbp(R.flat as number)} average Edinburgh flat that is ${gbp(compute({ nation: 'scotland', price: R.flat as number, situation: 'additional' }).surcharge)} of ADS on top of ${gbp(t('scotland', R.flat as number))} of LBTT, so ${gbp(t('scotland', R.flat as number, 'additional'))} in total. Companies pay it even on their first flat, and it is never repaid on a property bought to let.` },
    { q: 'We bought in Edinburgh before selling our flat in Leith. Can we get the ADS back?', a: `Yes, if the Leith flat was your main home in the ${L.replace_main_residence_months} months before the purchase, is sold within ${L.replace_main_residence_months} months after it, and you live in the new home. Revenue Scotland repays the ADS with interest, usually within ${L.repayment_target_working_days} working days once the claim and evidence are in. It cannot extend the deadline for any reason.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['lbtt-rates', 'additional-dwelling-supplement', 'ads-repayment', 'stamp-duty-glasgow', 'stamp-duty-newcastle', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'rsResidential', 'rsAds', 'rsAdsRepayment', 'rsFtb'],
  body: (h) => {
    const rows = [R.flat as number, R.avg, R.terraced as number, mover, R.semi as number, R.detached as number].sort((a, b) => a - b).map((p) => [h.gbp(p), h.gbp(h.t('scotland', p)), h.gbp(h.t('england', p)), h.gbp(h.t('scotland', p) - h.t('england', p))]);
    return `
<h2>The ${h.gbp(B3)} threshold</h2>
<p>LBTT charges ${h.pct(L.residential[2][1])} between ${h.gbp(top(L.residential, 1) + 1)} and ${h.gbp(B3)}, then ${h.pct(L.residential[3][1])} up to ${h.gbp(top(L.residential, 3))}. Edinburgh’s average sale sits just below ${h.gbp(B3)}, its average mover purchase above it. Each ${h.gbp(10000)} spent above the threshold costs ${h.gbp(10000 * L.residential[3][1])} in tax, twice the English rate at the same price.</p>
${h.table(['Price (Edinburgh averages)', 'LBTT', 'SDLT at the same price', 'Difference'], rows, `Edinburgh averages, ${M}, under both taxes`, ['r', 'r', 'r', 'r'])}
<h2>Tenement flats, terraces and villas</h2>
${typesTable(h, R)}
<p>The average Edinburgh flat, ${h.gbp(R.flat as number)}, costs a first-time buyer ${h.gbp(h.t('scotland', R.flat as number, 'first'))}. Detached houses average ${h.gbp(R.detached as number)}, which takes them into the ${h.pct(L.residential[3][1])} band for most of their price. Prices moved ${h.num(R.change ?? 0, 1)}% over the year to ${M}.</p>
<h2>Second homes and the ADS</h2>
<p>The supplement is a flat percentage of the whole price, so it weighs most on cheap properties. It applies from ${h.gbp(L.ads_min_price)}, counts homes owned anywhere in the world, and treats a married couple, civil partners or cohabitants, with their children under 16, as one buyer. A rental flat bought as an investment never qualifies for a repayment. See the ${h.a('additional-dwelling-supplement', 'ADS page')} and the ${h.a('ads-repayment', 'repayment rules')}.</p>`;
  },
});
