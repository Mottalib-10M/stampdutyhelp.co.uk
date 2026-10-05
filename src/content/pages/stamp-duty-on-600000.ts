import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute, sdltPrevious } from '../../lib/kit';

const PRICE = 600000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const oldFtb = sdltPrevious(PRICE, 'first');
const co = (extra: { companyRelief?: boolean; nonResident?: boolean } = {}) => compute({ nation: 'england', price: PRICE, situation: 'home', company: true, ...extra }).total;

export default definePage({
  id: 'stamp-duty-on-600000',
  group: 'prices',
  order: 200,
  slug: 'stamp-duty-on-600000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `${gbp(eng)} for every home buyer in England, first-time or not; ${gbp(co())} for a company without a relief.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: No Relief, Full Rates`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eng)} in England for first-time buyers too (${gbp(oldFtb)} before April 2025), ${gbp(co())} for a company, ${gbp(sco)} of LBTT in Scotland.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `Above the English relief limit, below the old one, and squarely in the range where a company pays ${pct(S.corporate_flat_rate)}.`,
  resume: `A ${gbp(PRICE)} home in England or Northern Ireland costs ${gbp(eng)} of Stamp Duty Land Tax for anyone buying their only home, and that includes first-time buyers: the price is above the ${gbp(S.first_time_buyer_max_price)} limit of first-time buyer relief, so the standard table applies to the whole amount. Until 31 March 2025 the relief reached ${gbp(S.previous.first_time_buyer_max_price)}, and the same first-time buyer paid ${gbp(oldFtb)}; the change costs ${gbp(eng - oldFtb)} at this price. An individual buying a second home or a buy-to-let pays ${gbp(t('england', PRICE, 'additional'))}. A company pays ${pct(S.corporate_flat_rate)} of the whole price, ${gbp(co())}, unless it qualifies for a relief such as a property rental business, in which case it pays the higher rates, ${gbp(co({ companyRelief: true }))}. In Scotland the purchase costs ${gbp(sco)} of LBTT, or ${gbp(t('scotland', PRICE, 'first'))} for a first-time buyer, whose relief has no price limit. In Wales it costs ${gbp(wal)} of Land Transaction Tax, the lowest of the three.`,
  faqs: [
    { q: `We bought our first home for ${gbp(PRICE)} in 2024 and paid less than friends buying the same in 2025. Why?`, a: `Because first-time buyer relief changed on 1 April 2025. Before, it covered prices up to ${gbp(S.previous.first_time_buyer_max_price)}, with a nil band to ${gbp(top(S.previous.first_time_buyer, 0))}, so you paid ${gbp(oldFtb)}. Now the limit is ${gbp(S.first_time_buyer_max_price)}, and a ${gbp(PRICE)} first home is taxed at standard rates: ${gbp(eng)}. Nothing is owed back on a purchase that completed under the old rules.` },
    { q: `Should I buy a ${gbp(PRICE)} rental flat personally or through my limited company?`, a: `On SDLT alone, a company that qualifies for the property rental business relief pays the same as you would personally, ${gbp(co({ companyRelief: true }))} at the higher rates. Without the relief, the company would pay ${gbp(co())}. The choice also involves income tax, corporation tax and, for companies, the Annual Tax on Enveloped Dwellings, which this page does not cover.` },
    { q: `Is first-time buyer relief in Scotland still available on a ${gbp(PRICE)} flat in Edinburgh?`, a: `Yes. The Scottish relief has no price cap: it raises the LBTT nil band to ${gbp(L.first_time_buyer_nil_band)} on any purchase, saving ${gbp(sco - t('scotland', PRICE, 'first'))}. The bill falls from ${gbp(sco)} to ${gbp(t('scotland', PRICE, 'first'))}. All buyers must be first-time buyers and live in the flat as their main residence. Nobody may have owned a home anywhere before, inherited homes included.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-500000', 'stamp-duty-on-750000', 'stamp-duty-changes-april-2025', 'stamp-duty-company-purchase', 'lbtt-first-time-buyer-relief', 'stamp-duty-oxford'],
  sources: ['govSdltRates', 'govSdltPrevious', 'govSdltCorporate', 'rsFtb', 'wraRates'],
  body: (h) => {
    const prices = [S.first_time_buyer_max_price, PRICE - 50000, PRICE, S.previous.first_time_buyer_max_price, S.previous.first_time_buyer_max_price + 25000];
    const histRows = prices.map((p) => [h.gbp(p), h.gbp(sdltPrevious(p, 'first')), h.gbp(h.t('england', p, 'first')), h.gbp(h.t('england', p, 'first') - sdltPrevious(p, 'first'))]);
    const coRows = [
      ['Individual landlord (higher rates)', h.gbp(h.t('england', PRICE, 'additional'))],
      ['Company with a relief (higher rates)', h.gbp(co({ companyRelief: true }))],
      [`Company without a relief (${h.pct(S.corporate_flat_rate)} of the price)`, h.gbp(co())],
      ['Non-resident company without a relief', h.gbp(co({ nonResident: true }))],
      ['Company in Scotland (LBTT and supplement)', h.gbp(compute({ nation: 'scotland', price: PRICE, situation: 'home', company: true }).total)],
      ['Company in Wales (higher rates)', h.gbp(compute({ nation: 'wales', price: PRICE, situation: 'home', company: true }).total)],
    ];
    return `
<h2>A first home with no relief left</h2>
<p>In England and Northern Ireland, first-time buyer relief is claimed only on a purchase of ${h.gbp(S.first_time_buyer_max_price)} or less. A ${h.gbp(PRICE)} first home is ${h.gbp(PRICE - S.first_time_buyer_max_price)} over, so the buyers pay what a family moving house would pay: ${h.gbp(eng)}, made of ${h.pct(S.residential[1][1])} on ${h.gbp(top(S.residential, 1) - top(S.residential, 0))} and ${h.pct(S.residential[2][1])} on ${h.gbp(PRICE - top(S.residential, 1))}. There is no partial relief or tapering near the limit.</p>
${h.breakdown({ nation: 'england', price: PRICE, situation: 'first' }, `SDLT for a first-time buyer at ${h.gbp(PRICE)}, standard rates`)}
<p>The two other nations treat the same buyer differently. Scotland keeps its relief at every price, so a first-time buyer pays ${h.gbp(h.t('scotland', PRICE, 'first'))} of LBTT instead of ${h.gbp(sco)}. Wales has no relief at any price and charges ${h.gbp(wal)}, still the lowest bill of the three. A first-time buyer who lives abroad and buys in England adds the ${h.pct(S.non_resident_surcharge)} non-resident surcharge to the standard table: ${h.gbp(h.t('england', PRICE, 'first', { nonResident: true }))}.</p>
<h2>Between the old limit and the new one</h2>
<p>From 23 September 2022 to 31 March 2025, the relief applied up to ${h.gbp(S.previous.first_time_buyer_max_price)}, and its nil band ran to ${h.gbp(top(S.previous.first_time_buyer, 0))}. Prices from ${h.gbp(S.first_time_buyer_max_price + 1)} to ${h.gbp(S.previous.first_time_buyer_max_price)} were inside the old relief and are outside the new one, which is where the reform weighs most on first-time buyers. Above the old limit, the difference comes only from the standard table, whose nil band also went from ${h.gbp(top(S.previous.residential, 0))} back to ${h.gbp(top(S.residential, 0))}.</p>
${h.table(['Price', 'First-time buyer, until 31 March 2025', 'From 1 April 2025', 'Increase'], histRows, 'First-time buyers between the two price limits', ['l', 'r', 'r', 'r'])}
<p>In ${h.a('stamp-duty-oxford', 'Oxford')}, the average semi-detached house sold for ${h.gbp(h.place('oxford').semi!)} in July 2026, close to this price. A first-time buyer at that average pays the standard table, ${h.gbp(h.t('england', h.place('oxford').semi!, 'first'))}, where the old relief would have charged ${h.gbp(sdltPrevious(h.place('oxford').semi!, 'first'))}. The ${h.a('stamp-duty-changes-april-2025', 'April 2025 page')} has the full before-and-after comparison.</p>
<h2>Buying through a company at ${h.gbp(PRICE)}</h2>
<p>A company buying a dwelling above ${h.gbp(S.corporate_flat_threshold)} pays a single ${h.pct(S.corporate_flat_rate)} rate on the full price, no slices. At ${h.gbp(PRICE)} that is ${h.gbp(co())}. A relief, for example for a property rental business or a developer, replaces it with the higher rates, which are exactly what an individual landlord pays. Scotland and Wales have no flat corporate rate; a company there pays the supplement or the higher rates even on its first dwelling. A non-resident company adds ${h.pct(S.non_resident_surcharge)} to the flat rate in England, and a company holding a dwelling may also come within the Annual Tax on Enveloped Dwellings, a yearly charge separate from SDLT.</p>
${h.table(['Buyer of a dwelling', 'Tax'], coRows, `Landlords and companies at ${h.gbp(PRICE)}`, ['l', 'r'])}`;
  },
});
