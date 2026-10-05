import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top } from '../../lib/kit';

const S = P.sdlt;

export default definePage({
  id: 'sdlt-calculator',
  group: 'calculators',
  order: 10,
  slug: 'sdlt-calculator',
  nav: 'SDLT calculator (England & NI)',
  card: 'Stamp Duty Land Tax for England and Northern Ireland, every surcharge, band by band.',
  title: 'SDLT Calculator 2026: England and Northern Ireland Rates',
  description: `SDLT calculator 2026 for England and Northern Ireland: first-time buyer relief, the ${pct(S.higher_rates_surcharge)} higher rates, the ${pct(S.non_resident_surcharge)} non-resident surcharge and the ${pct(S.corporate_flat_rate)} company rate.`,
  h1: 'SDLT calculator for England and Northern Ireland',
  intro: 'Stamp Duty Land Tax only, with HMRC’s rates from 1 April 2025 and every surcharge that can apply.',
  resume: `Stamp Duty Land Tax is charged by HMRC on purchases of land and property in England and Northern Ireland, at the rates in force since 1 April 2025: nothing up to ${gbp(top(S.residential, 0))}, ${pct(S.residential[1][1])} to ${gbp(top(S.residential, 1))}, ${pct(S.residential[2][1])} to ${gbp(top(S.residential, 2))}, ${pct(S.residential[3][1])} to ${gbp(top(S.residential, 3))} and ${pct(S.residential[4][1])} above. A ${gbp(400000)} home therefore costs ${gbp(t('england', 400000))}. The calculator adds what HMRC adds: ${pct(S.higher_rates_surcharge)} on every band if a buyer will own two homes, ${pct(S.non_resident_surcharge)} more if any buyer was in the UK fewer than ${S.non_resident_days} days in the year before completion, and the flat ${pct(S.corporate_flat_rate)} rate when a company buys a home above ${gbp(S.corporate_flat_threshold)} without a relief. First-time buyers get their own bands up to ${gbp(S.first_time_buyer_max_price)}. The return and the payment are due within ${S.return_days} days of completion, usually through your conveyancer.`,
  faqs: [
    { q: 'Does Northern Ireland have its own stamp duty?', a: `No. Northern Ireland never devolved the tax, so a house in Belfast or Derry pays exactly the same Stamp Duty Land Tax as one in England, to HMRC, with the same first-time buyer relief and the same ${pct(S.non_resident_surcharge)} non-resident surcharge. Scotland and Wales are the two nations with their own taxes and their own calculators.` },
    { q: 'Why does this SDLT calculator give a different figure from my solicitor?', a: 'Usually because the solicitor knows a fact the calculator does not: a lease with rent, a second property owned by a spouse, a linked purchase from the same seller, or a relief such as the one for a company letting the home. Send us the share link if the facts are identical and the figures still differ; we check every report against HMRC’s bands.' },
    { q: 'Is SDLT charged on the asking price or the price I pay?', a: 'On the chargeable consideration, which is normally the price in the contract you sign, not the asking price. It also includes any debt you take over, such as a share of a mortgage on a transfer, and the value of works or services given in exchange. Furniture and fittings sold separately at a fair value are not part of it.' },
  ],
  tool: 'calc',
  toolProps: { nation: 'england', lockNation: true },
  related: ['stamp-duty-rates', 'stamp-duty-first-time-buyer', 'stamp-duty-second-home', 'non-resident-stamp-duty-surcharge', 'stamp-duty-company-purchase', 'lbtt-calculator'],
  sources: ['govSdltRates', 'govSdltHigher', 'govSdltCorporate', 'sdltmNonResident', 'hmrcCalculator', 'fa2003s55'],
  body: (h) => `
<h2>What this calculator asks, and why</h2>
<p>Four facts decide an SDLT bill. The <strong>price</strong> sets which bands are reached. Your <strong>situation</strong> picks the table: first-time buyer, a single home, or a purchase that leaves a buyer with two dwellings. <strong>Who buys</strong> matters because a company never gets the relief and may fall under the ${h.pct(h.P.sdlt.corporate_flat_rate)} rate. <strong>Residence</strong> matters because non-UK residents pay ${h.pct(h.P.sdlt.non_resident_surcharge)} more on every band. The advanced options cover mixed-use and commercial property, which uses a separate table with a nil band to ${h.gbp(h.P.sdlt.non_residential[0][0] as number)}, and the reliefs that keep a company out of the flat rate.</p>
${h.bands('sdlt')}
<h2>Reading the result</h2>
<p>The large figure is the tax due. Under it, each band shows the slice of the price that falls in it and the tax on that slice, so you can see which part of the price costs most. The surcharge lines separate what you pay because of a second home or residence abroad, and the refund line tells you how much comes back if the surcharge is only due because your old home has not sold yet. The three boxes at the bottom compare the same purchase in Scotland and Wales.</p>
<p>The figure is rounded down to the pound, as HMRC does. At ${h.gbp(295000)}, the calculator returns ${h.gbp(h.t('england', 295000))}, the exact figure printed in HMRC’s guidance.</p>
<h2>When to use the official calculator as well</h2>
<p>HMRC’s own calculator asks more questions than this one because it also handles leases with rent, linked purchases and several reliefs. If your purchase involves a new lease with an annual rent, a purchase from a connected seller, or six or more dwellings at once, run it there too and ask your conveyancer which figure goes on the return. For the ordinary cases, a house or flat bought by one or more people, a second home, a company purchase or a buyer living abroad, the two give the same answer, and this page also shows the slices and what you would pay in ${h.a('lbtt-calculator', 'Scotland')} or ${h.a('ltt-calculator', 'Wales')}.</p>`,
});
