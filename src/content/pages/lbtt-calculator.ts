import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const L = P.lbtt;
const R = L.residential;

export default definePage({
  id: 'lbtt-calculator',
  group: 'calculators',
  order: 20,
  slug: 'lbtt-calculator',
  nav: 'LBTT calculator (Scotland)',
  card: `Land and Buildings Transaction Tax with the ${pct(L.ads_rate)} ADS and first-time buyer relief, band by band.`,
  title: 'LBTT Calculator 2026: Rates, ADS and First-Time Buyer Relief',
  description: `LBTT calculator 2026 for homes in Scotland: ${gbp(t('scotland', 300000))} on a ${gbp(300000)} home, the ${pct(L.ads_rate)} ADS on second homes and the nil band relief for first-time buyers, band by band.`,
  h1: 'LBTT calculator for Scotland',
  intro: 'Land and Buildings Transaction Tax only, with Revenue Scotland’s bands and the Additional Dwelling Supplement.',
  resume: `A ${gbp(300000)} home in Scotland costs ${gbp(t('scotland', 300000))} of Land and Buildings Transaction Tax for a buyer who will own nothing else, ${gbp(t('scotland', 300000, 'first'))} for a first-time buyer and ${gbp(t('scotland', 300000, 'additional'))} for someone adding a second home. LBTT is collected by Revenue Scotland on the bands in force since 1 April 2021: nothing up to ${gbp(top(R, 0))}, ${pct(R[1][1])} to ${gbp(top(R, 1))}, ${pct(R[2][1])} to ${gbp(top(R, 2))}, ${pct(R[3][1])} to ${gbp(top(R, 3))} and ${pct(R[4][1])} above. First-time buyers have a nil band stretched to ${gbp(L.first_time_buyer_nil_band)}, which saves up to ${gbp(L.first_time_buyer_max_saving)} at any price. The Additional Dwelling Supplement is a separate charge of ${pct(L.ads_rate)} on the whole price, due from ${gbp(L.ads_min_price)} when a buyer ends up owning more than one dwelling, and on every home a company buys. There is no surcharge for buyers living abroad. The return and the tax are due within ${L.return_days} days of the effective date.`,
  faqs: [
    { q: 'Does the LBTT calculator include the Additional Dwelling Supplement?', a: `Yes. Choose “additional property” and the result shows two lines: LBTT on the normal bands and the supplement of ${pct(L.ads_rate)} on the full price. On a ${gbp(200000)} buy-to-let flat in Dundee that is ${gbp(t('scotland', 200000))} of LBTT plus ${gbp(compute({ nation: 'scotland', price: 200000, situation: 'additional' }).surcharge)} of ADS. If the supplement is only due because your old home is still for sale, the refund line shows what comes back.` },
    { q: 'Why does a Scottish house cost less tax than in England at some prices and more at others?', a: `Because the bands sit in different places. Scotland’s nil band stops at ${gbp(top(R, 0))}, above England’s, so a ${gbp(250000)} home costs ${gbp(t('scotland', 250000))} against ${gbp(t('england', 250000))}. But Scotland reaches ${pct(R[3][1])} at ${gbp(top(R, 2))}, and on ${gbp(500000)} the bill is ${gbp(t('scotland', 500000))} against ${gbp(t('england', 500000))} south of the border. The crossover sits a little above ${gbp(top(R, 2))}.` },
    { q: 'Is the date that counts for LBTT the date of entry or the date missives conclude?', a: `For the rates, the effective date is normally the date of entry, when the price is paid and you take possession, and the ${L.return_days}-day deadline runs from it. The date the contract was concluded matters for one transitional rule: missives concluded before 5 December 2024 keep the supplement at ${pct(L.ads_previous_rate)} even if entry came later.` },
  ],
  tool: 'calc',
  toolProps: { nation: 'scotland', lockNation: true },
  related: ['lbtt-rates', 'additional-dwelling-supplement', 'lbtt-first-time-buyer-relief', 'ads-repayment', 'stamp-duty-edinburgh', 'ltt-calculator'],
  sources: ['rsResidential', 'rsAds', 'rsFtb', 'rsCalculator', 'lbttAct'],
  body: (h) => {
    const l = h.P.lbtt;
    const prices = [180000, 260000, 340000, 450000, 650000];
    const rows = prices.map((p) => [h.gbp(p), h.gbp(h.t('scotland', p, 'first')), h.gbp(h.t('scotland', p)), h.gbp(h.t('scotland', p, 'additional'))]);
    return `
<h2>Three situations, three different Scottish bills</h2>
<p>The calculator opens on Scotland and stays there. What changes the answer is your position on the day of entry. A <strong>first-time buyer</strong> gets the wider nil band, provided every buyer has never owned a dwelling anywhere. A buyer who will own <strong>one home only</strong>, including someone whose previous main home was sold before the new one, pays the standard bands. A buyer who will own <strong>two or more dwellings</strong> pays the same bands plus the supplement on the whole price.</p>
${h.table(['Price', 'First-time buyer', 'Only home', 'Additional dwelling'], rows, 'LBTT and ADS on the same prices in 2026', ['l', 'r', 'r', 'r'])}
<p>The gap between the second and third columns is the supplement alone, and it grows in a straight line with the price because it has no bands. The gap between the first two columns never exceeds ${h.gbp(l.first_time_buyer_max_saving)}.</p>
<h2>How the bands are applied</h2>
${h.bands('lbtt')}
<p>Each rate only touches the slice of the price inside its band. Revenue Scotland’s own illustration is a ${h.gbp(235000)} purchase, which pays ${h.gbp(h.t('scotland', 235000))}: nothing on the first ${h.gbp(top(l.residential, 0))} and ${h.pct(l.residential[1][1])} on the rest. The calculator reproduces that figure to the pound, and the ${h.gbp(875000)} example from the same guidance, ${h.gbp(h.t('scotland', 875000))}. The detail under the result lists every slice so you can see where the cost comes from.</p>
<h2>Sharing a result with your solicitor</h2>
<p>Every figure on the result panel can be copied as a link that reopens the calculator with the same price and situation. Solicitors in Scotland file the LBTT return online and pay the tax on your behalf, usually from funds you send before the date of entry, so arriving with the right amount saves a round of emails. If your offer is still being negotiated, try a few prices: because Scottish bands rise in steps of ${h.pct(l.residential[2][1] - l.residential[1][1])} or more, an extra ${h.gbp(10000)} near ${h.gbp(top(l.residential, 2))} costs noticeably more tax than the same amount lower down. At ${h.gbp(320000)} the bill is ${h.gbp(h.t('scotland', 320000))}; at ${h.gbp(330000)} it is ${h.gbp(h.t('scotland', 330000))}.</p>
<h2>What the calculator does not cover</h2>
<p>Commercial and mixed-use property in Scotland uses its own table; tick “non-residential” in the advanced options. Leases with rent, purchases of several dwellings at once and partial relief claims need a solicitor’s review, and the figure here should be read as the starting point for that conversation. To check an amount against the authority, use the ${h.src('rsCalculator', 'Revenue Scotland calculator')}, which works from the same bands. For the supplement in detail, the ${h.a('additional-dwelling-supplement', 'ADS guide')} explains who counts as one buyer and when a company pays.</p>`;
  },
});
