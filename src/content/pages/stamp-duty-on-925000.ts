import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const PRICE = 925000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const nr = t('england', PRICE, 'home', { nonResident: true });
const nrAdd = t('england', PRICE, 'additional', { nonResident: true });
const r5 = pct(S.residential[2][1]);

export default definePage({
  id: 'stamp-duty-on-925000',
  group: 'prices',
  order: 220,
  slug: 'stamp-duty-on-925000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `The top of the English ${r5} band: ${gbp(eng)} for a home, ${gbp(nrAdd)} for an overseas buyer who owns another.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: The Last Pound at ${r5}`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eng)} in England, ${gbp(nrAdd)} for an overseas buyer of a second home, ${gbp(sco)} of LBTT in Scotland and ${gbp(wal)} of LTT in Wales.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `The longest band of Stamp Duty Land Tax ends here, and every surcharge in England is charged on top of it.`,
  resume: `On a ${gbp(PRICE)} home bought as an only residence in England or Northern Ireland, Stamp Duty Land Tax is ${gbp(eng)}: nothing on the first ${gbp(top(S.residential, 0))}, ${pct(S.residential[1][1])} on the next ${gbp(top(S.residential, 1) - top(S.residential, 0))} and ${r5} on the remaining ${gbp(PRICE - top(S.residential, 1))}. ${gbp(PRICE)} is the last pound of that ${r5} band, the widest in the English table; from the next pound the rate is ${pct(S.residential[3][1])}. The surcharges stack on top. A buyer who will own another home pays ${gbp(t('england', PRICE, 'additional'))}, a buyer who spent fewer than ${S.non_resident_days} days in the UK in the year before completion pays ${gbp(nr)}, and a non-resident who also owns another home pays ${gbp(nrAdd)}, which is ${pct(nrAdd / PRICE)} of the price. A company without a relief pays ${gbp(compute({ nation: 'england', price: PRICE, situation: 'home', company: true }).total)}. The same purchase costs ${gbp(sco)} of LBTT in Scotland and ${gbp(wal)} of Land Transaction Tax in Wales, with no non-resident surcharge in either.`,
  faqs: [
    { q: `I live in Singapore and own a flat there. What is the stamp duty on a ${gbp(PRICE)} London flat?`, a: `${gbp(nrAdd)}. Your Singapore flat counts for the higher rates, because a dwelling anywhere in the world is taken into account, which adds ${pct(S.higher_rates_surcharge)} to every band. Being non-resident adds another ${pct(S.non_resident_surcharge)}. On an only home, a UK resident would pay ${gbp(eng)}. Spending ${S.non_resident_days} days in the UK within the qualifying period lets you reclaim the non-resident part, ${gbp(nrAdd - t('england', PRICE, 'additional'))}.` },
    { q: `The asking price is ${gbp(PRICE + 25000)}. What does the slice above ${gbp(PRICE)} cost in SDLT?`, a: `${gbp(t('england', PRICE + 25000) - eng)} for a buyer of an only home, because the ${gbp(25000)} above ${gbp(top(S.residential, 2))} falls in the ${pct(S.residential[3][1])} band. The total becomes ${gbp(t('england', PRICE + 25000))}. For a second home the extra slice is charged at ${pct(S.residential[3][1] + S.higher_rates_surcharge)}, adding ${gbp(t('england', PRICE + 25000, 'additional') - t('england', PRICE, 'additional'))}. Nothing changes for the first ${gbp(PRICE)}: only the new slice pays the higher rate.` },
    { q: `Does a ${gbp(PRICE)} house in Scotland or Wales carry an overseas buyer surcharge?`, a: `No. Only England and Northern Ireland charge non-UK residents extra. A buyer living abroad pays ${gbp(sco)} of LBTT in Scotland or ${gbp(wal)} of LTT in Wales on an only home, the same as a resident. Owning another home anywhere still brings the Additional Dwelling Supplement in Scotland, ${gbp(t('scotland', PRICE, 'additional'))} in total, or the Welsh higher rates, ${gbp(t('wales', PRICE, 'additional'))}.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-750000', 'stamp-duty-on-1000000', 'non-resident-stamp-duty-surcharge', 'stamp-duty-second-home', 'stamp-duty-london', 'stamp-duty-rates'],
  sources: ['govSdltRates', 'govSdltHigher', 'sdltmNonResident', 'sdltmNonResRefund', 'govSdltCorporate'],
  body: (h) => {
    const co = (nonResident: boolean) => h.tax({ nation: 'england', price: PRICE, situation: 'home', company: true, nonResident }).total;
    const stack = [
      ['UK resident, only home', h.gbp(eng), h.pct(eng / PRICE)],
      ['Non-resident, only home', h.gbp(nr), h.pct(nr / PRICE)],
      ['UK resident, owns another home', h.gbp(h.t('england', PRICE, 'additional')), h.pct(h.t('england', PRICE, 'additional') / PRICE)],
      ['Non-resident, owns another home', h.gbp(nrAdd), h.pct(nrAdd / PRICE)],
      ['UK company, no relief', h.gbp(co(false)), h.pct(co(false) / PRICE)],
      ['Non-resident company, no relief', h.gbp(co(true)), h.pct(co(true) / PRICE)],
    ];
    const bor: Array<[string, string]> = [['camden', 'Camden'], ['city-of-westminster', 'Westminster'], ['richmond-upon-thames', 'Richmond upon Thames']];
    const borRows = bor.map(([k, n]) => [n, h.gbp(h.place(k).avg), h.gbp(h.t('england', h.place(k).avg)), h.gbp(h.t('england', h.place(k).avg, 'additional', { nonResident: true }))]);
    return `
<h2>The ceiling of the ${r5} band</h2>
<p>The ${r5} band of SDLT runs from ${h.gbp(top(S.residential, 1) + 1)} to ${h.gbp(top(S.residential, 2))}, a stretch of ${h.gbp(top(S.residential, 2) - top(S.residential, 1))}, far longer than any other band in the table. At ${h.gbp(PRICE)} it is completely used, and the tax on it alone is ${h.gbp((top(S.residential, 2) - top(S.residential, 1)) * S.residential[2][1])}. Everything above is charged at ${h.pct(S.residential[3][1])} until ${h.gbp(top(S.residential, 3))}. The effective rate on the whole price is ${h.pct(eng / PRICE)}, well under the ${r5} of the top slice.</p>
${h.breakdown({ nation: 'england', price: PRICE, situation: 'home' }, `SDLT on ${h.gbp(PRICE)}, standard rates`)}
<h2>When the surcharges stack</h2>
<p>England has two surcharges for individuals, and they add together. The higher rates add ${h.pct(S.higher_rates_surcharge)} to each band for a buyer who will own more than one dwelling at the end of completion day, counting homes anywhere in the world (${h.src('govSdltHigher', 'HMRC guidance')}). The ${h.a('non-resident-stamp-duty-surcharge', 'non-resident surcharge')} adds ${h.pct(S.non_resident_surcharge)} for a buyer who spent fewer than ${S.non_resident_days} days in the UK in the year before completion. Both apply to every slice, nil band included, so on ${h.gbp(PRICE)} together they add ${h.gbp(nrAdd - eng)}.</p>
${h.table(['Buyer', 'SDLT', 'Effective rate'], stack, `Every English surcharge on ${h.gbp(PRICE)}`, ['l', 'r', 'r'])}
<p>A company above ${h.gbp(S.corporate_flat_threshold)} without a relief pays the flat ${h.pct(S.corporate_flat_rate)} rate instead of the slices, plus the non-resident surcharge if it is non-resident. Only the non-resident part can be recovered later by an individual who meets the ${S.non_resident_days}-day test (${h.src('sdltmNonResRefund', 'SDLTM09960')}).</p>
<p>The higher-rate part is different when the other home is the main residence being sold. A resident who buys at ${h.gbp(PRICE)} before selling pays ${h.gbp(h.t('england', PRICE, 'additional'))} and can reclaim ${h.gbp(h.tax({ nation: 'england', price: PRICE, situation: 'additional' }).refundable)} once the old home is sold within ${S.replace_main_residence_years} years. In Scotland and Wales the picture is simpler for overseas buyers, who pay what residents pay: ${h.gbp(sco)} of LBTT and ${h.gbp(wal)} of LTT on an only home, with the supplement or higher rates for anyone keeping another home, wherever it is.</p>
<h2>London boroughs around ${h.gbp(PRICE)}</h2>
<p>At July 2026 prices, the average home in several inner and west London boroughs sat between ${h.gbp(800000)} and ${h.gbp(900000)}. The table shows SDLT on each average for a resident buying an only home and for an overseas buyer who owns another property.</p>
${h.table(['Borough', 'Average price', 'Resident, only home', 'Non-resident, second home'], borRows, 'UK HPI July 2026 averages', ['l', 'r', 'r', 'r'])}
<p>${bor.every(([k]) => h.place(k).avg <= top(S.residential, 2)) ? `None of these averages passes ${h.gbp(top(S.residential, 2))}, so a resident buyer at the average never reaches the ${h.pct(S.residential[3][1])} slice.` : `Some of these averages pass ${h.gbp(top(S.residential, 2))} and reach the ${h.pct(S.residential[3][1])} slice.`} The overseas buyer of a second home pays ${h.pct(S.higher_rates_surcharge + S.non_resident_surcharge)} of the whole price on top. The ${h.a('stamp-duty-london', 'London page')} has every borough.</p>`;
  },
});
