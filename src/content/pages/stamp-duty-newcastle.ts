import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('newcastle-upon-tyne');
const E = place('city-of-edinburgh');
const M = monthLabel();
const S = P.sdlt;

export default definePage({
  id: 'stamp-duty-newcastle',
  group: 'places',
  order: 470,
  slug: 'stamp-duty-newcastle',
  place: 'newcastle-upon-tyne',
  nav: 'Newcastle',
  card: `Average ${gbp(R.avg)}: ${gbp(t('england', R.avg))} of SDLT, and how it compares with LBTT over the border.`,
  title: `Stamp Duty Newcastle 2026: ${gbp(t('england', R.avg))} on the Average Home`,
  description: `Stamp duty in Newcastle upon Tyne in 2026: ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), first homes, rentals, and SDLT against Scottish LBTT.`,
  h1: 'Stamp duty in Newcastle upon Tyne',
  intro: 'The last large English city before the Scottish border, where SDLT and LBTT can be compared on the same budget.',
  resume: `A home in Newcastle upon Tyne sold for ${gbp(R.avg)} on average in ${M} on the UK House Price Index, and Stamp Duty Land Tax on that price is ${gbp(t('england', R.avg))} for a buyer who will own just that home. First-time buyers paid ${gbp(R.ftb as number)} on average, well inside the ${gbp(top(S.first_time_buyer, 0))} nil band of the relief, so they typically pay nothing. Because Newcastle is within easy reach of the border, buyers sometimes weigh it against Scottish towns, and the taxes then differ: the same ${gbp(R.avg)} home would cost ${gbp(t('scotland', R.avg))} in Land and Buildings Transaction Tax in Scotland, where the nil band stops at ${gbp(top(P.lbtt.residential, 0))}. For a landlord the gap is wider still: ${gbp(t('england', R.avg, 'additional'))} in Newcastle against ${gbp(t('scotland', R.avg, 'additional'))} in Scotland, where the Additional Dwelling Supplement takes ${pct(P.lbtt.ads_rate)} of the whole price on top of the ordinary tax.`,
  faqs: [
    { q: 'Would I pay less tax buying in Newcastle than just over the border in Scotland?', a: `It depends on the price and on who you are. At the Newcastle average of ${gbp(R.avg)}, a one-home buyer pays ${gbp(t('england', R.avg))} in England and ${gbp(t('scotland', R.avg))} in Scotland. A first-time buyer pays ${gbp(t('england', R.avg, 'first'))} in England against ${gbp(t('scotland', R.avg, 'first'))} in Scotland. A landlord pays much more in Scotland because of the ${pct(P.lbtt.ads_rate)} supplement.` },
    { q: 'What is the stamp duty on an average Newcastle flat for a first-time buyer?', a: `Nothing. The average flat in the city sold for ${gbp(R.flat as number)} in ${M}, below the ${gbp(top(S.first_time_buyer, 0))} nil band of first-time buyer relief. A buyer who has owned a home before would pay ${gbp(t('england', R.flat as number))} if it becomes their only home, and ${gbp(t('england', R.flat as number, 'additional'))} if they keep another.` },
    { q: 'Do Newcastle detached houses reach the higher stamp duty band?', a: `Yes. The average detached house, ${gbp(R.detached as number)}, is above ${gbp(top(S.residential, 1))}, so the part over that line pays ${pct(S.residential[2][1])}: the bill is ${gbp(t('england', R.detached as number))} for a one-home buyer. Semis average ${gbp(R.semi as number)} and stay in the ${pct(S.residential[1][1])} band, which keeps their bill at ${gbp(t('england', R.semi as number))}.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-edinburgh', 'stamp-duty-sheffield', 'stamp-duty-england-scotland-wales-compared', 'lbtt-rates', 'buy-to-let-stamp-duty', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'rsResidential', 'rsAds'],
  body: (h) => {
    const rows = [R.flat as number, R.terraced as number, R.semi as number, R.detached as number].map((p) => [h.gbp(p), h.gbp(h.t('england', p)), h.gbp(h.t('scotland', p)), h.gbp(h.t('england', p, 'additional')), h.gbp(h.t('scotland', p, 'additional'))]);
    return `
<h2>The same Newcastle prices under SDLT and LBTT</h2>
<p>The table applies both taxes to Newcastle’s average prices for each type of home. It is not a comparison of real homes on both sides of the border, since prices differ, but it isolates the effect of the tax rules alone.</p>
${h.table(['Price', 'SDLT, one home', 'LBTT, one home', 'SDLT, additional', 'LBTT + ADS'], rows, `Newcastle averages (${M}) under both regimes`, ['r', 'r', 'r', 'r', 'r'])}
<p>For an owner-occupier the two taxes are close on modest homes, because Scotland’s nil band (${h.gbp(top(P.lbtt.residential, 0))}) is higher than England’s (${h.gbp(top(S.residential, 0))}) but its ${h.pct(P.lbtt.residential[2][1])} band starts at the same ${h.gbp(top(P.lbtt.residential, 1))}. The Scottish ${h.pct(P.lbtt.residential[3][1])} band, from ${h.gbp(top(P.lbtt.residential, 2))}, makes larger houses dearer there. Edinburgh, the nearest large Scottish city, averages ${h.gbp(E.avg)}: see ${h.a('stamp-duty-edinburgh', 'stamp duty in Edinburgh')}.</p>
<h2>Every type of Newcastle home</h2>
${typesTable(h, R)}
<h2>Investors on Tyneside</h2>
<p>A buy-to-let at the city average pays ${h.gbp(h.t('england', R.avg, 'additional'))} with the ${h.pct(S.higher_rates_surcharge)} surcharge, ${h.gbp(h.t('england', R.avg, 'additional') - h.t('england', R.avg))} more than an owner-occupier. Prices in the city moved ${h.num(R.change ?? 0, 1)}% in the year to ${M}. The ${h.a('buy-to-let-stamp-duty', 'buy-to-let page')} covers company purchases and the rules for a first rental bought by someone with no home of their own.</p>`;
  },
});
