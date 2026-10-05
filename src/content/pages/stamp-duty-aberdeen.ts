import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { HPI, monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('city-of-aberdeen');
const A = place('aberdeenshire');
const M = monthLabel();
const L = P.lbtt;
const chg = R.change ?? 0;
const councils = Object.values(HPI.regions).filter((r) => r.gss.startsWith('S12')).length;

export default definePage({
  id: 'stamp-duty-aberdeen',
  group: 'places',
  order: 530,
  slug: 'stamp-duty-aberdeen',
  place: 'city-of-aberdeen',
  nav: 'Aberdeen',
  card: `Average ${gbp(R.avg)}, under the ${gbp(top(L.residential, 0))} LBTT nil band: no tax for a one-home buyer.`,
  title: `LBTT Aberdeen 2026: Homes Under the ${gbp(top(L.residential, 0))} Nil Band`,
  description: `LBTT in Aberdeen in 2026: the ${gbp(R.avg)} average home (UK HPI, ${M}) pays ${gbp(t('scotland', R.avg))} for a buyer with one home, but ${gbp(t('scotland', R.avg, 'additional'))} as a second home or rental with the ADS.`,
  h1: 'Stamp duty (LBTT) in Aberdeen',
  intro: `One of the few large cities in Britain where the average home sells below the nil band of its purchase tax.`,
  resume: `The average home in the City of Aberdeen sold for ${gbp(R.avg)} in ${M}, according to the UK House Price Index, ${chg < 0 ? `${Math.abs(chg)}% less` : `${chg}% more`} than a year earlier. That is below ${gbp(top(L.residential, 0))}, the top of the nil band of Scotland’s Land and Buildings Transaction Tax, so a buyer who will own only that home pays ${gbp(t('scotland', R.avg))}. First-time buyers paid ${gbp(R.ftb as number)} and home movers ${gbp(R.mover as number)}; the movers’ average just crosses the nil band and costs ${gbp(t('scotland', R.mover as number))}. The contrast with a second home is stark: the Additional Dwelling Supplement takes ${pct(L.ads_rate)} of the whole price from ${gbp(L.ads_min_price)}, so a landlord buying at the city average pays ${gbp(t('scotland', R.avg, 'additional'))}, and on the ${gbp(R.flat as number)} average flat, ${gbp(t('scotland', R.flat as number, 'additional'))}. In Aberdeen, the tax on a home is almost entirely a question of whether it is your only one.`,
  faqs: [
    { q: 'Do I pay LBTT on an average Aberdeen flat?', a: `Not if it will be your only home: the ${gbp(R.flat as number)} average flat is under the ${gbp(top(L.residential, 0))} nil band, so the tax is ${gbp(t('scotland', R.flat as number))}. You still file an LBTT return within ${L.return_days} days because the price is above ${gbp(L.ads_min_price)}. If you keep another home, the ADS makes it ${gbp(t('scotland', R.flat as number, 'additional'))}.` },
    { q: 'Does first-time buyer relief help in Aberdeen?', a: `Rarely, because most first homes in the city cost less than ${gbp(top(L.residential, 0))} and already pay nothing. First-time buyers paid ${gbp(R.ftb as number)} on average. The relief only saves money between ${gbp(top(L.residential, 0) + 1)} and ${gbp(L.first_time_buyer_nil_band)} and above, where it is worth up to ${gbp(L.first_time_buyer_max_saving)}, for example on a semi at ${gbp(R.semi as number)}.` },
    { q: 'Is Aberdeenshire more expensive in tax than the city?', a: `Prices are higher there: the Aberdeenshire average was ${gbp(A.avg)} in ${M}, against ${gbp(R.avg)} in the city, so a one-home buyer pays ${gbp(t('scotland', A.avg))} instead of ${gbp(t('scotland', R.avg))}. The rules are identical, since LBTT and the ADS apply in the same way across all ${councils} Scottish councils.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-glasgow', 'stamp-duty-edinburgh', 'additional-dwelling-supplement', 'lbtt-rates', 'stamp-duty-on-125000', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'rsResidential', 'rsAds'],
  body: (h) => {
    const rows = [R.flat as number, R.ftb as number, R.avg, R.terraced as number, R.mover as number, R.semi as number, R.detached as number].sort((a, b) => a - b).map((p) => [h.gbp(p), h.gbp(h.t('scotland', p)), h.gbp(h.t('scotland', p, 'additional')), h.pct(h.t('scotland', p, 'additional') / p)]);
    return `
<h2>When the supplement is the whole bill</h2>
<p>For an owner-occupier, nothing at all is due on the average Aberdeen sale; among the cities in this guide only ${h.a('stamp-duty-swansea', 'Swansea')}, under the Welsh nil band, is in the same position. For a second home or rental the ADS turns that zero into a bill of ${h.pct(L.ads_rate)} of the price or more, because it is charged on every pound, not on a slice.</p>
${h.table(['Aberdeen average price', 'LBTT, one home', 'LBTT + ADS', 'Effective rate with ADS'], rows, `Aberdeen averages, ${M}`, ['r', 'r', 'r', 'r'])}
<h2>Prices by type of home</h2>
${typesTable(h, R)}
<p>Only the detached average, ${h.gbp(R.detached as number)}, goes beyond ${h.gbp(top(L.residential, 1))} and into the ${h.pct(L.residential[2][1])} band. Over the year to ${M} the city’s index moved ${h.num(chg, 1)}%; when prices fall, more homes drop into the nil band and the tax on them reaches zero.</p>
<h2>Moving within the city</h2>
<p>A family selling a flat to buy a semi at ${h.gbp(R.semi as number)} pays ${h.gbp(h.t('scotland', R.semi as number))} if the flat is sold first. If the purchase completes first, the ADS of ${h.gbp(h.tax({ nation: 'scotland', price: R.semi as number, situation: 'additional' }).surcharge)} is due too, then repayable if the flat sells within ${L.replace_main_residence_months} months (${h.a('ads-repayment', 'ADS repayment')}). Selling first matters far more in Scotland, where the ADS is a share of the whole price, than in England.</p>`;
  },
});
