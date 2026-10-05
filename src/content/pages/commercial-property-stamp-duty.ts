import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top } from '../../lib/kit';

const NR = { kind: 'nonresidential' as const };
const nr = (n: 'england' | 'scotland' | 'wales', p: number) => t(n, p, 'home', NR);
const S = P.sdlt.non_residential, L = P.lbtt.non_residential, W = P.ltt.non_residential;
/** Price of a shop with a flat above, used as the running example. */
const SHOP = 400000;
/** First price (in £1,000 steps) where the Welsh non-residential bill overtakes the English one. */
const firstAbove = (a: 'england' | 'scotland' | 'wales', b: 'england' | 'scotland' | 'wales') => { for (let p = 150000; p <= 5000000; p += 1000) if (nr(a, p) > nr(b, p)) return p; return 0; };
const walesAboveScotland = firstAbove('wales', 'scotland');
const walesOvertakes = (() => { for (let p = 300000; p <= 5000000; p += 1000) if (nr('wales', p) > nr('england', p)) return p; return 0; })();

export default definePage({
  id: 'commercial-property-stamp-duty',
  group: 'calculators',
  order: 50,
  slug: 'commercial-property-stamp-duty',
  nav: 'Commercial and mixed-use',
  card: `Shops, offices, land and mixed-use buildings: the non-residential bands of SDLT, LBTT and LTT, with no surcharge.`,
  title: 'Commercial Property Stamp Duty 2026: Non-Residential Rates',
  description: `Commercial property stamp duty in 2026: ${gbp(nr('england', SHOP))} on a ${gbp(SHOP)} shop with a flat above in England, ${gbp(nr('scotland', SHOP))} in Scotland, ${gbp(nr('wales', SHOP))} in Wales. No second-home surcharge.`,
  h1: 'Stamp duty on commercial and mixed-use property',
  intro: 'Offices, shops, farmland, a pub with living quarters: the separate tables each nation applies when a purchase is not purely residential.',
  resume: `Non-residential and mixed-use purchases have their own tables in each nation. In England and Northern Ireland, SDLT charges nothing up to ${gbp(top(S, 0))}, ${pct(S[1][1])} up to ${gbp(top(S, 1))} and ${pct(S[2][1])} above, so a ${gbp(SHOP)} shop with a flat above costs ${gbp(nr('england', SHOP))}. Scotland’s LBTT uses ${pct(L[1][1])} instead of ${pct(S[1][1])} in the middle band, giving ${gbp(nr('scotland', SHOP))} on the same building. Wales has the widest nil band, ${gbp(top(W, 0))}, then ${pct(W[1][1])}, ${pct(W[2][1])} up to ${gbp(top(W, 2))} and ${pct(W[3][1])} beyond, which makes ${gbp(nr('wales', SHOP))}. None of the residential surcharges applies on these tables in SDLT: no ${pct(P.sdlt.higher_rates_surcharge)} for a second property, no ${pct(P.sdlt.non_resident_surcharge)} for buyers abroad, and no ${pct(P.sdlt.corporate_flat_rate)} company rate. Since 1 June 2024, a single English purchase of six or more dwellings can also be taxed on this table. Returns follow the usual deadlines: ${P.sdlt.return_days} days after completion for SDLT and ${P.lbtt.return_days} days for LBTT and LTT.`,
  faqs: [
    { q: 'Is a shop with a flat above taxed as residential or commercial?', a: `As mixed-use, which means the non-residential table applies to the whole price, flat included. For a ${gbp(SHOP)} building in England that gives ${gbp(nr('england', SHOP))}, against ${gbp(t('england', SHOP))} if it were a house and ${gbp(t('england', SHOP, 'additional'))} if it were a second home. HMRC states that the higher rates for additional dwellings do not apply to mixed property.` },
    { q: 'Do overseas companies pay extra SDLT when buying an office in London?', a: `No. The ${pct(P.sdlt.non_resident_surcharge)} non-resident surcharge only applies to residential property, so an office, warehouse or shop bought by a company or individual based abroad pays the same ${pct(S[2][1])} top rate as a UK buyer. On a ${gbp(2000000)} office that is ${gbp(nr('england', 2000000))}. The ${pct(P.sdlt.corporate_flat_rate)} rate for companies concerns dwellings only.` },
    { q: 'We are buying a block of eight flats in one go. Which table applies?', a: `In England and Northern Ireland, a purchase of six or more dwellings in a single transaction can be treated as non-residential since 1 June 2024, when multiple dwellings relief was abolished. On a ${gbp(1600000)} block the non-residential table gives ${gbp(nr('england', 1600000))}. Wales still has its own relief for multiple dwellings, which this calculator does not model.` },
  ],
  tool: 'calc',
  toolProps: { kind: 'nonresidential' },
  related: ['stamp-duty-company-purchase', 'buy-to-let-stamp-duty', 'stamp-duty-rates', 'lbtt-rates', 'ltt-rates', 'stamp-duty-england-scotland-wales-compared'],
  sources: ['govSdltNonRes', 'govSdltHigher', 'rsNonResidential', 'wraRates'],
  body: (h) => {
    const prices = [150000, 250000, 400000, 750000, 1000000, 2000000, 5000000];
    const rows = prices.map((p) => [h.gbp(p), h.gbp(nr('england', p)), h.gbp(nr('scotland', p)), h.gbp(nr('wales', p))]);
    return `
<h2>Three tables side by side</h2>
${h.bands('sdltNonRes')}
${h.bands('lbttNonRes')}
${h.bands('lttNonRes')}
${h.table(['Price', 'SDLT (England & NI)', 'LBTT (Scotland)', 'LTT (Wales)'], rows, 'Non-residential tax computed on the 2026 tables', ['l', 'r', 'r', 'r'])}
<p>Up to about ${h.gbp(walesAboveScotland - 1000)} Wales is the cheapest of the three, thanks to its ${h.gbp(top(W, 0))} nil band. Scotland takes over from ${h.gbp(walesAboveScotland)}, and from ${h.gbp(walesOvertakes)} the Welsh ${h.pct(W[3][1])} rate above ${h.gbp(top(W, 2))} has wiped out the head start entirely, so the Welsh bill is higher than the English one too. Scotland stays a little below England at every price because its middle band is charged at ${h.pct(L[1][1])}.</p>
<h2>What counts as non-residential</h2>
<p>The non-residential tables cover property that is not a dwelling, such as offices, shops and warehouses, and they also cover mixed purchases where a dwelling and non-residential property are bought together in one transaction, like a high-street unit sold with the flat above it. In that case the whole consideration goes through the non-residential bands; it is not split between two tables. Here is the ${h.gbp(SHOP)} shop with its flat, band by band, under SDLT:</p>
${h.breakdown({ nation: 'england', price: SHOP, situation: 'home', kind: 'nonresidential' }, `SDLT on a ${h.gbp(SHOP)} mixed-use building`)}
<p>The same building would cost ${h.gbp(h.t('england', SHOP))} as a house bought by someone with no other home, so the mixed-use table saves ${h.gbp(h.t('england', SHOP) - nr('england', SHOP))} even before any surcharge is considered. The category follows the property as it stands on the effective date, and your conveyancer states it on the return.</p>
<h3>The six-dwelling rule in England and Northern Ireland</h3>
<p>Multiple dwellings relief was abolished for SDLT from 1 June 2024. Investors buying six or more dwellings in a single transaction can still use the non-residential table instead of the residential rates and their surcharges. Below that number, a portfolio purchase is taxed on the residential bands, at the ${h.a('stamp-duty-second-home', 'higher rates')} when the buyer already owns a dwelling.</p>
<h2>No surcharges on these tables</h2>
<p>HMRC’s rules for the ${h.pct(h.P.sdlt.higher_rates_surcharge)} higher rates exclude mixed property, the non-resident surcharge applies only to residential purchases, and the ${h.pct(h.P.sdlt.corporate_flat_rate)} company rate is reserved for dwellings above ${h.gbp(h.P.sdlt.corporate_flat_threshold)}. A ${h.a('stamp-duty-company-purchase', 'company')} buying a ${h.gbp(SHOP)} shop with a flat therefore pays the same ${h.gbp(nr('england', SHOP))} as a sole trader. The return deadline does not change: ${h.P.sdlt.return_days} days for SDLT, ${h.P.lbtt.return_days} days for LBTT and ${h.P.ltt.return_days} days for LTT.</p>
<p>The calculator above covers the price paid for a freehold or for the assignment of an existing lease. Rent payable under a new lease is assessed separately and is not included in its result.</p>`;
  },
});
