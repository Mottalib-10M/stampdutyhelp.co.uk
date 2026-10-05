import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { HPI, monthLabel } from '../../lib/hpi';

const R = place('belfast');
const NI = place('northern-ireland');
const M = monthLabel();
const S = P.sdlt;
const districts = Object.values(HPI.regions).filter((r) => r.gss.startsWith('N09')).sort((a, b) => b.avg - a.avg);

export default definePage({
  id: 'stamp-duty-belfast',
  group: 'places',
  order: 500,
  slug: 'stamp-duty-belfast',
  place: 'belfast',
  nav: 'Belfast and Northern Ireland',
  card: `Northern Ireland pays SDLT like England: ${gbp(t('england', R.avg))} on Belfast’s ${gbp(R.avg)} average.`,
  title: `Stamp Duty Belfast 2026: SDLT in Northern Ireland Explained`,
  description: `Stamp duty in Belfast and Northern Ireland in 2026: the same SDLT as England, ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} Belfast average (UK HPI, ${M}), every council.`,
  h1: 'Stamp duty in Belfast and Northern Ireland',
  intro: 'Northern Ireland never got its own purchase tax: buyers in Belfast pay HMRC’s Stamp Duty Land Tax.',
  resume: `Northern Ireland uses the same Stamp Duty Land Tax as England, collected by HMRC with the same bands, the same first-time buyer relief and the same surcharges, because the tax was devolved to Scotland and Wales but never to the Northern Ireland Assembly. The average home in Belfast sold for ${gbp(R.avg)} in ${M}, according to the UK House Price Index, so a buyer who will own only that home pays ${gbp(t('england', R.avg))}. A first-time buyer at that price pays ${gbp(t('england', R.avg, 'first'))}, since the relief is tax-free up to ${gbp(top(S.first_time_buyer, 0))}. Across Northern Ireland the average was ${gbp(NI.avg)}, which costs ${gbp(t('england', NI.avg))}. Lower prices than in most of England mean lower bills for owner-occupiers, but a second home or buy-to-let still pays the ${pct(S.higher_rates_surcharge)} surcharge: ${gbp(t('england', R.avg, 'additional'))} on the Belfast average.`,
  faqs: [
    { q: 'Is stamp duty in Northern Ireland the same as in England?', a: `Yes. The rates, the first-time buyer relief, the ${pct(S.higher_rates_surcharge)} higher rates, the ${pct(S.non_resident_surcharge)} non-resident surcharge and the ${pct(S.corporate_flat_rate)} company rate all apply unchanged, and the return goes to HMRC within ${S.return_days} days. Only Scotland and Wales have separate taxes. The difference in bills comes from prices, not rules.` },
    { q: 'Does a buyer from the Republic of Ireland pay the non-resident surcharge in Belfast?', a: `It depends on days spent in the UK, not on nationality. A buyer living in the Republic who was in the UK fewer than ${S.non_resident_days} days in the twelve months before completion pays the ${pct(S.non_resident_surcharge)} surcharge: on the ${gbp(R.avg)} Belfast average, ${gbp(t('england', R.avg, 'home', { nonResident: true }))} instead of ${gbp(t('england', R.avg))}. A home they already own in the Republic also makes the purchase an additional dwelling.` },
    { q: 'Why does this page not show first-time buyer or house-type prices for Belfast?', a: `Because the UK House Price Index for Northern Ireland, compiled by Land & Property Services, publishes district averages for all sales only. The calculator above opens on the Belfast average; enter your own price and situation to get the exact bill. Northern Ireland as a whole does publish averages by property type, shown in the table below.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['sdlt-calculator', 'non-resident-stamp-duty-surcharge', 'stamp-duty-on-200000', 'stamp-duty-first-time-buyer', 'stamp-duty-glasgow', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltOverview', 'govSdltRates', 'sdltmNonResident'],
  body: (h) => {
    const drows = districts.map((d) => [d.name, h.gbp(d.avg), h.gbp(h.t('england', d.avg)), h.gbp(h.t('england', d.avg, 'first')), h.gbp(h.t('england', d.avg, 'additional'))]);
    const types: Array<[string, number | null]> = [['Flat or maisonette', NI.flat], ['Terraced house', NI.terraced], ['Semi-detached', NI.semi], ['Detached', NI.detached]];
    return `
<h2>Every council area</h2>
<p>Northern Ireland’s index is published for each of its ${districts.length} local government districts. All of them use the same SDLT bands; the table only changes the price.</p>
${h.table(['District', 'Average price', 'SDLT, one home', 'First-time buyer', 'Additional property'], drows, `Northern Ireland districts, UK HPI ${M}`, ['l', 'r', 'r', 'r', 'r'])}
<h2>Northern Ireland by type of home</h2>
${h.table(['Home', 'Average price', 'SDLT, one home', 'Additional property'], types.filter(([, p]) => p).map(([l, p]) => [l, h.gbp(p as number), h.gbp(h.t('england', p as number)), h.gbp(h.t('england', p as number, 'additional'))]), `Northern Ireland, UK HPI ${M}`, ['l', 'r', 'r', 'r'])}
<p>At these prices, most owner-occupiers in Northern Ireland pay only the ${h.pct(S.residential[1][1])} band, between ${h.gbp(top(S.residential, 0) + 1)} and ${h.gbp(top(S.residential, 1))}. The detached average, ${h.gbp(NI.detached as number)}, is the only one to pay ${h.pct(S.residential[2][1])} on part of the price.</p>
<h2>Why Belfast is not like Edinburgh or Cardiff</h2>
<p>Scotland replaced SDLT in 2015 and Wales in 2018, each with its own bands and its own revenue authority. Northern Ireland kept SDLT, so everything on the ${h.a('sdlt-calculator', 'SDLT calculator')} and the England pages of this site applies in Belfast, from the first-time buyer cliff at ${h.gbp(S.first_time_buyer_max_price)} to the refund of the surcharge when an old home sells within ${S.replace_main_residence_years} years. A Belfast price compared with ${h.a('stamp-duty-glasgow', 'Glasgow')} shows how much the Scottish rules change at similar prices.</p>`;
  },
});
