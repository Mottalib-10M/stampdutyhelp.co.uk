import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';
import type { Nation } from '../../lib/engine/tax';

const PRICE = 1000000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const add = (n: Nation) => t(n, PRICE, 'additional');

export default definePage({
  id: 'stamp-duty-on-1000000',
  group: 'prices',
  order: 230,
  slug: 'stamp-duty-on-1000000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `${gbp(eng)} in England, ${gbp(wal)} in Wales, ${gbp(sco)} in Scotland: the same million, three very different bills.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: Three Nations Apart`,
  description: `Stamp duty on a ${gbp(PRICE)} home in 2026: ${gbp(eng)} in England, ${gbp(wal)} in Wales, ${gbp(sco)} in Scotland, and up to ${gbp(add('scotland'))} if one buyer owns another home.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `A round million shows how far the three UK tables have drifted apart.`,
  resume: `A ${gbp(PRICE)} home bought as an only residence costs ${gbp(eng)} of Stamp Duty Land Tax in England and Northern Ireland, ${gbp(wal)} of Land Transaction Tax in Wales and ${gbp(sco)} of Land and Buildings Transaction Tax in Scotland. The Scottish bill is ${gbp(sco - eng)} more than the English one, almost double, because Scotland reaches its ${pct(L.residential[4][1])} top rate at ${gbp(top(L.residential, 3) + 1)}, whereas England only moves from ${pct(S.residential[2][1])} to ${pct(S.residential[3][1])} above ${gbp(top(S.residential, 2))}. Wales sits between the two, with ${pct(W.main[3][1])} on the slice above ${gbp(top(W.main, 2))}. Effective rates are ${pct(eng / PRICE)}, ${pct(wal / PRICE)} and ${pct(sco / PRICE)}. If any one of the buyers will own another dwelling after completion, the whole purchase moves to the surcharged rates: ${gbp(add('england'))} in England, ${gbp(add('wales'))} in Wales and ${gbp(add('scotland'))} in Scotland, where the Additional Dwelling Supplement is ${pct(L.ads_rate)} of the full price. First-time buyer relief in England does not apply at this price.`,
  faqs: [
    { q: `My brother and I are buying a ${gbp(PRICE)} house together and he still owns a flat. Do I pay the surcharge too?`, a: `Yes. When several people buy together, one buyer who will own another dwelling is enough to put the whole purchase on the higher rates, not just his share. In England that means ${gbp(add('england'))} instead of ${gbp(eng)}. Scotland and Wales apply the same logic, with ${gbp(add('scotland'))} and ${gbp(add('wales'))}. Spouses are treated as one unit, so a husband or wife’s flat counts even if only one of you buys.` },
    { q: `Would a ${gbp(PRICE)} house cost less tax in Cardiff or in Edinburgh?`, a: `In Cardiff, by ${gbp(sco - wal)}. Land Transaction Tax on ${gbp(PRICE)} is ${gbp(wal)}, LBTT is ${gbp(sco)}. The Welsh table stays at ${pct(W.main[2][1])} until ${gbp(top(W.main, 2))} and then charges ${pct(W.main[3][1])}, while Scotland moves to ${pct(L.residential[4][1])} above ${gbp(top(L.residential, 3))}. For a second home, the order is the same: ${gbp(add('wales'))} against ${gbp(add('scotland'))}.` },
    { q: `Our parents will be co-buyers on our ${gbp(PRICE)} Welsh home to help with the mortgage. Does that matter?`, a: `It can. The Welsh Revenue Authority gives the example of a parent added as a co-buyer who owns a home: the higher rates then apply, ${gbp(add('wales'))} here instead of ${gbp(wal)}. A joint borrower, sole proprietor mortgage, where the parent is on the loan but not on the title, does not bring in the higher rates.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-925000', 'stamp-duty-on-1500000', 'stamp-duty-england-scotland-wales-compared', 'stamp-duty-joint-purchase', 'ltt-higher-rates', 'stamp-duty-cardiff'],
  sources: ['govSdltRates', 'govSdltHigher', 'rsResidential', 'rsAds', 'wraRates', 'wraHigherTech'],
  body: (h) => {
    // Tax per slice of the million, using each nation's own band limits.
    const slices: Array<[number, number]> = [[0, top(S.residential, 0)], [top(S.residential, 0), top(S.residential, 1)], [top(S.residential, 1), top(W.main, 1)], [top(W.main, 1), top(L.residential, 3)], [top(L.residential, 3), top(S.residential, 2)], [top(S.residential, 2), PRICE]];
    const slice = (n: Nation, a: number, b: number) => compute({ nation: n, price: b, situation: 'home' }).total - compute({ nation: n, price: a, situation: 'home' }).total;
    const sliceRows = slices.map(([a, b]) => [`${h.gbp(a === 0 ? 0 : a + 1)} to ${h.gbp(b)}`, h.gbp(slice('england', a, b)), h.gbp(slice('wales', a, b)), h.gbp(slice('scotland', a, b))]);
    sliceRows.push(['<strong>Total</strong>', `<strong>${h.gbp(eng)}</strong>`, `<strong>${h.gbp(wal)}</strong>`, `<strong>${h.gbp(sco)}</strong>`]);
    const jointRows: Array<Array<string>> = [
      ['Everyone owns only this home', h.gbp(eng), h.gbp(wal), h.gbp(sco)],
      ['One co-buyer keeps another dwelling', h.gbp(add('england')), h.gbp(add('wales')), h.gbp(add('scotland'))],
      ['Surcharge added by that co-buyer', h.gbp(add('england') - eng), h.gbp(add('wales') - wal), h.gbp(add('scotland') - sco)],
    ];
    return `
<h2>Three bills for one million</h2>
<p>At ${h.gbp(top(S.residential, 1))}, the three UK property taxes produce bills no more than ${h.gbp(Math.max(h.t('england', top(S.residential, 1)), h.t('scotland', top(S.residential, 1)), h.t('wales', top(S.residential, 1))) - Math.min(h.t('england', top(S.residential, 1)), h.t('scotland', top(S.residential, 1)), h.t('wales', top(S.residential, 1))))} apart. By ${h.gbp(PRICE)} the spread is ${h.gbp(sco - eng)} between the cheapest and the dearest nation. The table splits the price into slices and shows what each nation takes from each, so the source of the gap is visible: the upper slices, where Scotland charges ${h.pct(L.residential[3][1])} from ${h.gbp(top(L.residential, 2) + 1)} and ${h.pct(L.residential[4][1])} from ${h.gbp(top(L.residential, 3) + 1)}, Wales ${h.pct(W.main[2][1])} from ${h.gbp(top(W.main, 1) + 1)} and ${h.pct(W.main[3][1])} from ${h.gbp(top(W.main, 2) + 1)}, and England a steady ${h.pct(S.residential[2][1])} almost to the end.</p>
${h.table(['Slice of the price', 'England & NI', 'Wales', 'Scotland'], sliceRows, `Tax taken from each slice of ${h.gbp(PRICE)}`, ['l', 'r', 'r', 'r'])}
<p>The English slice above ${h.gbp(top(S.residential, 2))} is short, ${h.gbp(PRICE - top(S.residential, 2))}, so the ${h.pct(S.residential[3][1])} band barely touches this price. The ${h.a('stamp-duty-england-scotland-wales-compared', 'three-nation comparison')} runs the same exercise across the whole price range.</p>
<h2>One co-buyer with another property</h2>
<p>When a home is bought with someone else, a partner, a sibling or a parent, the surcharge rules look at every one of the buyers. In all three nations, a single buyer who will own another dwelling after completion puts the entire purchase on the surcharged rates. Married couples and civil partners are treated as one: a spouse’s flat counts even when the spouse is not on the title.</p>
${h.table(['Buyers', 'England & NI', 'Wales', 'Scotland'], jointRows, `Joint purchase at ${h.gbp(PRICE)}`, ['l', 'r', 'r', 'r'])}
<p>Wales publishes worked cases on this (${h.src('wraHigherTech', 'WRA technical guidance')}): a parent who owns a home and joins as a co-buyer brings in the higher rates, while a parent who is only a joint borrower on a joint borrower, sole proprietor mortgage, without a share of the property, does not. In Scotland, since 1 April 2024, a share of another dwelling worth less than ${h.gbp(L.ads_min_price)} is ignored for the supplement. The ${h.a('stamp-duty-joint-purchase', 'joint purchase calculator')} tests each buyer’s position.</p>
<h2>A million bought from abroad or through a company</h2>
<p>Overseas buyers and companies change the picture again, because only England and Northern Ireland have a non-resident surcharge and a flat corporate rate. A buyer who spent fewer than ${S.non_resident_days} days in the UK in the year before completion pays ${h.gbp(h.t('england', PRICE, 'home', { nonResident: true }))} on an only home, ${h.gbp(h.t('england', PRICE, 'home', { nonResident: true }) - eng)} more than a resident. A company without a relief pays the flat ${h.pct(S.corporate_flat_rate)} rate, ${h.gbp(compute({ nation: 'england', price: PRICE, situation: 'home', company: true }).total)}. Scotland and Wales have neither rule: a company there pays ${h.gbp(compute({ nation: 'scotland', price: PRICE, situation: 'home', company: true }).total)} with the supplement or ${h.gbp(compute({ nation: 'wales', price: PRICE, situation: 'home', company: true }).total)} at the Welsh higher rates, the same as an individual landlord, and an overseas individual pays exactly what a resident pays.</p>`;
  },
});
