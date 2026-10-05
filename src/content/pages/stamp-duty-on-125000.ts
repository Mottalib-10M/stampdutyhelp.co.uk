import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const PRICE = 125000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const eAdd = t('england', PRICE, 'additional'), sAdd = t('scotland', PRICE, 'additional'), wAdd = t('wales', PRICE, 'additional');
const eNr = t('england', PRICE, 'home', { nonResident: true });

export default definePage({
  id: 'stamp-duty-on-125000',
  group: 'prices',
  order: 110,
  slug: 'stamp-duty-on-125000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `The exact top of the SDLT nil band: ${gbp(eng)} on an only home, ${gbp(eAdd)} on a second one.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: Top of the Nil Band`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eng)} on an only home in England, Scotland or Wales, but ${gbp(eAdd)} on an English second home and ${gbp(sAdd)} with ADS in Scotland.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `${gbp(PRICE)} is the last price at which an English home buyer pays nothing, and the first where a landlord already pays in full.`,
  resume: `At ${gbp(PRICE)}, a buyer who will own only this home pays no property purchase tax anywhere in the UK. In England and Northern Ireland the price sits exactly on the top of the Stamp Duty Land Tax nil band, so the bill is ${gbp(eng)}, and the very next pound would be taxed at ${pct(S.residential[1][1])}. Scotland’s nil band runs further, to ${gbp(top(L.residential, 0))}, and Wales leaves everything up to ${gbp(top(W.main, 0))} untaxed, so both charge ${gbp(sco)} with room to spare. The answer changes for anyone keeping another home. A second home or buy-to-let at this price costs ${gbp(eAdd)} in England, because the higher rates add ${pct(S.higher_rates_surcharge)} even to the band that is normally free, ${gbp(wAdd)} in Wales at the higher rates and ${gbp(sAdd)} in Scotland, where the Additional Dwelling Supplement takes ${pct(L.ads_rate)} of the whole price. A buyer who spent fewer than ${S.non_resident_days} days in the UK over the past year pays ${gbp(eNr)} in England, even on an only home.`,
  faqs: [
    { q: `The flat costs ${gbp(PRICE)} and I am keeping my current house. Do I pay stamp duty on it?`, a: `Yes, ${gbp(eAdd)} in England or Northern Ireland. The higher rates apply from ${gbp(S.higher_rates_min_price)} and add ${pct(S.higher_rates_surcharge)} to every band, including the nil band, so the whole ${gbp(PRICE)} is taxed. A dwelling you keep that is worth less than ${gbp(S.higher_rates_min_price)} does not count, and then the bill drops back to ${gbp(eng)}. In Scotland the same flat costs ${gbp(sAdd)} with the supplement.` },
    { q: `I am relocating from abroad and buying a ${gbp(PRICE)} flat in England. Why is tax due if the nil band covers it?`, a: `Because the non-resident surcharge of ${pct(S.non_resident_surcharge)} is added to every band, nil band included, which gives ${gbp(eNr)} here. It applies when you spent fewer than ${S.non_resident_days} days in the UK in the year before completion. If you reach ${S.non_resident_days} days within a continuous year around the purchase, you can amend the return within ${S.non_resident_refund_years} years and reclaim it.` },
    { q: `What would a ${gbp(PRICE + 20000)} house cost me in tax instead?`, a: `${gbp(t('england', PRICE + 20000))} in England and Northern Ireland, because the extra ${gbp(20000)} falls in the ${pct(S.residential[1][1])} band. In Scotland the bill stays at ${gbp(t('scotland', PRICE + 20000))}, since ${gbp(PRICE + 20000)} is still inside the LBTT nil band, and in Wales it also stays at ${gbp(t('wales', PRICE + 20000))}. A first-time buyer in England would pay nothing at either price.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-175000', 'stamp-duty-second-home', 'non-resident-stamp-duty-surcharge', 'additional-dwelling-supplement', 'stamp-duty-rates', 'stamp-duty-exemptions'],
  sources: ['govSdltRates', 'govSdltHigher', 'sdltmNonResident', 'rsAds', 'wraHigher'],
  body: (h) => {
    const steps = [PRICE, PRICE + 10000, PRICE + 20000, PRICE + 30000, PRICE + 40000];
    const stepRows = steps.map((p) => [h.gbp(p), h.gbp(h.t('england', p)), h.gbp(h.t('scotland', p)), h.gbp(h.t('wales', p))]);
    const co = (n: 'england' | 'scotland' | 'wales') => h.gbp(compute({ nation: n, price: PRICE, situation: 'home', company: true }).total);
    const sitRows = [
      ['Only home, or moving home', h.gbp(eng), h.gbp(sco), h.gbp(wal)],
      ['Additional property', h.gbp(eAdd), h.gbp(sAdd), h.gbp(wAdd)],
      ['Non-UK resident, only home', h.gbp(eNr), h.gbp(sco), h.gbp(wal)],
      ['Limited company', co('england'), co('scotland'), co('wales')],
    ];
    return `
<h2>The last pound of the English nil band</h2>
<p>Stamp Duty Land Tax charges nothing on the first ${h.gbp(top(S.residential, 0))} of a residential price. At ${h.gbp(PRICE)} the whole price fits in that slice, so a buyer of an only home writes a cheque of ${h.gbp(eng)}. Add ${h.gbp(10000)} and the bill becomes ${h.gbp(h.t('england', PRICE + 10000))}, because each pound above the line is charged at ${h.pct(S.residential[1][1])}. That rate holds all the way to ${h.gbp(top(S.residential, 1))}, which keeps the climb gentle.</p>
<p>The other two nations draw their zero line higher. Revenue Scotland taxes nothing up to ${h.gbp(top(L.residential, 0))}, and the Welsh Revenue Authority nothing up to ${h.gbp(top(W.main, 0))}. A buyer in Wales could spend another ${h.gbp(top(W.main, 0) - PRICE)} on top of this price and still pay no Land Transaction Tax. England’s band was also wider before 1 April 2025; the ${h.a('stamp-duty-rates', 'SDLT rates page')} keeps both tables.</p>
${h.table(['Price', 'England & NI', 'Scotland', 'Wales'], stepRows, `Tax on an only home, in steps of ${h.gbp(10000)} above the English nil band`, ['l', 'r', 'r', 'r'])}
<h2>Nothing for a home, a full bill for a second one</h2>
<p>The nil band only protects buyers on the standard rates. Someone who will own two dwellings worth ${h.gbp(S.higher_rates_min_price)} or more at the end of completion day pays the ${h.a('stamp-duty-second-home', 'higher rates')}, which lift every band by ${h.pct(S.higher_rates_surcharge)}. The free slice becomes a ${h.pct(S.residential[0][1] + S.higher_rates_surcharge)} slice, and the whole ${h.gbp(PRICE)} is taxed: ${h.gbp(eAdd)}.</p>
<p>Wales reaches the same figure by another route. Its higher rates are a separate table that starts at ${h.pct(W.higher[0][1])} and runs to ${h.gbp(top(W.higher, 0))}, so ${h.gbp(PRICE)} costs ${h.gbp(wAdd)}. Scotland adds the ${h.a('additional-dwelling-supplement', 'Additional Dwelling Supplement')} at ${h.pct(L.ads_rate)} of the full price, giving ${h.gbp(sAdd)}, the highest of the three. A company pays these surcharges on its very first dwelling, as the table shows.</p>
${h.table(['Buyer', 'England & NI', 'Scotland', 'Wales'], sitRows, `Tax on ${h.gbp(PRICE)}, by buyer and nation`, ['l', 'r', 'r', 'r'])}
<p>Overseas buyers face one more layer in England and Northern Ireland only: the ${h.a('non-resident-stamp-duty-surcharge', 'non-resident surcharge')} of ${h.pct(S.non_resident_surcharge)} applies on top of whichever table is used, nil band included. Scotland and Wales have no equivalent.</p>
<h2>Where ${h.gbp(PRICE)} buys a home</h2>
<p>On the UK House Price Index for July 2026, the average home in ${h.a('stamp-duty-aberdeen', 'Aberdeen')} sold for ${h.gbp(h.place('city-of-aberdeen').avg)}, within a few thousand pounds of this price. The average flat in Wales cost ${h.gbp(h.place('wales').flat!)} and the average flat in Northern Ireland ${h.gbp(h.place('northern-ireland').flat!)}. Buyers of those homes as a main residence pay nothing; buyers adding them to a portfolio pay the figures above.</p>
<h2>New leases and a second ${h.gbp(PRICE)} line</h2>
<p>The same amount appears elsewhere in the SDLT rules. When a new residential lease is granted, tax is also due on the rent: ${h.pct(S.lease_npv_residential_rate)} of the net present value of the rent above ${h.gbp(S.lease_npv_residential_threshold)}. See ${h.src('govSdltRates', 'GOV.UK on residential rates')} for the rules.</p>`;
  },
});
