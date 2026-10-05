import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place, compute } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('brighton-and-hove');
const M = monthLabel();
const S = P.sdlt;
const CAP = S.first_time_buyer_max_price;
const mover = R.mover as number;

export default definePage({
  id: 'stamp-duty-brighton',
  group: 'places',
  order: 480,
  slug: 'stamp-duty-brighton',
  place: 'brighton-and-hove',
  nav: 'Brighton',
  card: `Movers average ${gbp(mover)}, right at the ${gbp(CAP)} mark: ${gbp(t('england', mover))} of SDLT.`,
  title: `Stamp Duty Brighton 2026: ${gbp(t('england', R.avg))} on a ${gbp(R.avg)} Home`,
  description: `Stamp duty in Brighton and Hove in 2026: ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), first homes above the nil band, and second homes priced.`,
  h1: 'Stamp duty in Brighton and Hove',
  intro: 'A seaside city with London prices: first-time buyers pay tax here, and second-home buyers pay a great deal more.',
  resume: `Brighton and Hove homes sold for ${gbp(R.avg)} on average in ${M}, on the UK House Price Index, which makes ${gbp(t('england', R.avg))} of Stamp Duty Land Tax for a buyer who will own only that home. First-time buyers paid ${gbp(R.ftb as number)} on average, above the ${gbp(top(S.first_time_buyer, 0))} nil band of the relief, so the typical first purchase costs ${gbp(t('england', R.ftb as number, 'first'))}. Home movers paid ${gbp(mover)}, almost exactly ${gbp(CAP)}, and pay ${gbp(t('england', mover))}. A buyer who keeps a home elsewhere, in London or abroad, faces a very different bill: the ${pct(S.higher_rates_surcharge)} surcharge brings the tax on the average home to ${gbp(t('england', R.avg, 'additional'))}. A buyer who also lives abroad adds another ${gbp(compute({ nation: 'england', price: R.avg, situation: 'additional', nonResident: true }).nonResidentSurcharge)} at that price, payable to HMRC together with the rest of the tax within ${S.return_days} days of completion.`,
  faqs: [
    { q: 'Do first-time buyers pay stamp duty on a Brighton flat?', a: `Usually a little. The average Brighton flat sold for ${gbp(R.flat as number)} in ${M}; with the relief, a first-time buyer pays ${pct(S.first_time_buyer[1][1])} only on the part above ${gbp(top(S.first_time_buyer, 0))}, so ${gbp(t('england', R.flat as number, 'first'))} at that price. A first home at ${gbp(R.ftb as number)}, the city’s first-time buyer average, costs ${gbp(t('england', R.ftb as number, 'first'))}.` },
    { q: 'How much stamp duty on a weekend flat in Brighton if I keep my London home?', a: `On the ${gbp(R.flat as number)} average flat, ${gbp(t('england', R.flat as number, 'additional'))}, because you will own two homes at the end of completion day. The same flat bought as your only home would cost ${gbp(t('england', R.flat as number))}. The surcharge is only refundable if the Brighton flat replaces your main home and the London one is sold within ${S.replace_main_residence_years} years.` },
    { q: `Our Brighton house is on the market at ${gbp(CAP + 10000)}. Does the price cross a stamp duty cliff?`, a: `Only for a first-time buyer, who loses the relief entirely above ${gbp(CAP)}: at ${gbp(CAP + 10000)} they pay ${gbp(t('england', CAP + 10000, 'first'))} instead of ${gbp(t('england', CAP, 'first'))} at ${gbp(CAP)}. For a home mover there is no cliff: ${gbp(t('england', CAP + 10000))} against ${gbp(t('england', CAP))}, a difference of ${pct(S.residential[2][1])} of the extra ${gbp(10000)}.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-london', 'stamp-duty-on-500000', 'stamp-duty-second-home', 'non-resident-stamp-duty-surcharge', 'stamp-duty-oxford', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'govSdltHigher', 'sdltmNonResident'],
  body: (h) => {
    const rows = [[`First-time buyer at the city average (${h.gbp(R.ftb as number)})`, R.ftb as number, 'first'], [`Mover at the city average (${h.gbp(mover)})`, mover, 'home'], [`Second home at the overall average (${h.gbp(R.avg)})`, R.avg, 'additional']] as Array<[string, number, 'first' | 'home' | 'additional']>;
    return `
<h2>Three typical Brighton purchases</h2>
${h.table(['Purchase', 'SDLT', 'Share of the price'], rows.map(([l, p, s]) => [l, h.gbp(h.t('england', p, s)), h.pct(h.t('england', p, s) / p)]), `Brighton and Hove, UK HPI ${M}`, ['l', 'r', 'r'])}
<p>The first line shows a relief that still works but no longer makes a first home free. The second sits on the ${h.gbp(CAP)} line, which matters only for first-time buyers. The third shows how much a second home costs in tax: more than ${h.num(h.t('england', R.avg, 'additional') / Math.max(1, h.t('england', R.avg)), 1)} times the bill of an owner-occupier at the same price.</p>
<h2>Homes by type</h2>
${typesTable(h, R)}
<p>A Brighton terrace averages ${h.gbp(R.terraced as number)} and a semi ${h.gbp(R.semi as number)}. Both are well into the ${h.pct(S.residential[2][1])} band, where each ${h.gbp(10000)} of price costs ${h.gbp(10000 * S.residential[2][1])} in tax. Prices moved ${h.num(R.change ?? 0, 1)}% over the year to ${M}.</p>
<h2>Second homes and buyers from abroad</h2>
<p>Whether a flat in Brighton is a second home depends on the end of completion day, not on how you use it. If you keep a home anywhere in the world, including abroad, the higher rates apply. If you also spent fewer than ${S.non_resident_days} days in the UK in the year before completion, the ${h.pct(S.non_resident_surcharge)} non-resident surcharge is added on top; spouses living with a UK-resident partner are treated as resident. Both rules are explained on the ${h.a('stamp-duty-second-home', 'second home')} and ${h.a('non-resident-stamp-duty-surcharge', 'non-resident')} pages.</p>`;
  },
});
