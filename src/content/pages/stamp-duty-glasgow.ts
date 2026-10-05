import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('city-of-glasgow');
const M = monthLabel();
const L = P.lbtt;
const ftb = R.ftb as number;

export default definePage({
  id: 'stamp-duty-glasgow',
  group: 'places',
  order: 520,
  slug: 'stamp-duty-glasgow',
  place: 'city-of-glasgow',
  nav: 'Glasgow',
  card: `First-time buyers average ${gbp(ftb)}: LBTT relief brings their bill to ${gbp(t('scotland', ftb, 'first'))}.`,
  title: `LBTT Glasgow 2026: ${gbp(t('scotland', R.avg))} on the ${gbp(R.avg)} Average Home`,
  description: `LBTT in Glasgow in 2026: ${gbp(t('scotland', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), first-time buyer relief worth up to ${gbp(L.first_time_buyer_max_saving)}, and the ADS on flats bought to let.`,
  h1: 'Stamp duty (LBTT) in Glasgow',
  intro: `A Glasgow flat averages ${gbp(R.flat as number)}: at that price the Scottish first-time buyer relief decides almost the whole bill.`,
  resume: `Glasgow buyers pay Land and Buildings Transaction Tax, Scotland’s replacement for stamp duty. The average home in the City of Glasgow sold for ${gbp(R.avg)} in ${M}, according to the UK House Price Index, and LBTT on that price is ${gbp(t('scotland', R.avg))} for a buyer who will own only that home. First-time buyers paid ${gbp(ftb)} on average, which is ${ftb <= L.first_time_buyer_nil_band ? 'inside' : 'just above'} the ${gbp(L.first_time_buyer_nil_band)} nil band their relief provides, so a typical first purchase costs ${gbp(t('scotland', ftb, 'first'))}. The relief is worth at most ${gbp(L.first_time_buyer_max_saving)} and, unlike the English one, never disappears at a higher price. The average flat, at ${gbp(R.flat as number)}, costs ${gbp(t('scotland', R.flat as number))} for an owner-occupier, but ${gbp(t('scotland', R.flat as number, 'additional'))} for a landlord, because the Additional Dwelling Supplement adds ${pct(L.ads_rate)} of the whole price, which on a cheap flat is far more than the tax itself.`,
  faqs: [
    { q: 'Does a Glasgow first-time buyer pay any LBTT on a typical flat?', a: `On the ${gbp(R.flat as number)} average flat, ${gbp(t('scotland', R.flat as number, 'first'))}. The relief removes tax on the first ${gbp(L.first_time_buyer_nil_band)}, and Scotland charges ${pct(L.residential[1][1])} on the next slice up to ${gbp(top(L.residential, 1))}. Without the relief the same flat would cost ${gbp(t('scotland', R.flat as number))}, so the relief saves ${gbp(t('scotland', R.flat as number) - t('scotland', R.flat as number, 'first'))} on it.` },
    { q: 'Is LBTT in Glasgow cheaper than stamp duty in Manchester at the same price?', a: `At the Glasgow average of ${gbp(R.avg)}, LBTT is ${gbp(t('scotland', R.avg))} and English SDLT would be ${gbp(t('england', R.avg))}, because Scotland’s nil band (${gbp(top(L.residential, 0))}) is higher than England’s (${gbp(top(P.sdlt.residential, 0))}). For a landlord the order reverses: ${gbp(t('scotland', R.avg, 'additional'))} in Glasgow against ${gbp(t('england', R.avg, 'additional'))} in England, because of the supplement.` },
    { q: 'I own a flat in Glasgow and want to buy a second one to let. What tax should I budget?', a: `LBTT at the normal rates plus ${pct(L.ads_rate)} of the full price as ADS. At ${gbp(150000)}, that is ${gbp(t('scotland', 150000))} of LBTT and ${gbp(150000 * L.ads_rate)} of ADS, ${gbp(t('scotland', 150000, 'additional'))} in total, due with the return within ${L.return_days} days. ADS on a rental is never repaid.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['lbtt-first-time-buyer-relief', 'additional-dwelling-supplement', 'stamp-duty-edinburgh', 'stamp-duty-aberdeen', 'stamp-duty-manchester', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'rsResidential', 'rsFtb', 'rsAds'],
  body: (h) => {
    const rows = [120000, 150000, L.first_time_buyer_nil_band, ftb, 200000, 250000].sort((a, b) => a - b).map((p) => [h.gbp(p), h.gbp(h.t('scotland', p, 'first')), h.gbp(h.t('scotland', p)), h.gbp(h.t('scotland', p) - h.t('scotland', p, 'first'))]);
    return `
<h2>First-time buyer relief at Glasgow prices</h2>
<p>Scotland’s relief works by moving the nil band up, from ${h.gbp(top(L.residential, 0))} to ${h.gbp(L.first_time_buyer_nil_band)}. Below ${h.gbp(top(L.residential, 0))} it changes nothing, between the two thresholds it removes the tax, and above ${h.gbp(L.first_time_buyer_nil_band)} it saves a fixed ${h.gbp(L.first_time_buyer_max_saving)}.</p>
${h.table(['Price', 'First-time buyer', 'Without relief', 'Saving'], rows, 'LBTT first-time buyer relief around Glasgow prices', ['r', 'r', 'r', 'r'])}
<h2>Glasgow homes by type</h2>
${typesTable(h, R)}
<p>Flats are the cheapest homes in the city at ${h.gbp(R.flat as number)} on average, but semis (${h.gbp(R.semi as number)}) and detached houses (${h.gbp(R.detached as number)}) reach the ${h.pct(L.residential[2][1])} and ${h.pct(L.residential[3][1])} bands. Prices moved ${h.num(R.change ?? 0, 1)}% over the year to ${M}.</p>
<h2>Letting a Glasgow flat</h2>
<p>For an investor the supplement is most of the bill. On a ${h.gbp(150000)} flat the ADS (${h.gbp(150000 * L.ads_rate)}) is far larger than the LBTT itself (${h.gbp(h.t('scotland', 150000))}). It applies to companies on every purchase, even their first, and to an individual who keeps any other home, anywhere in the world. Only a buyer replacing a main residence can get it back, and only if the old home sells within ${L.replace_main_residence_months} months; see ${h.a('ads-repayment', 'ADS repayment')}.</p>`;
  },
});
