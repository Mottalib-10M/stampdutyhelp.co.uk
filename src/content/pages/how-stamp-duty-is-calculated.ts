import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const S = P.sdlt, L = P.lbtt, W = P.ltt;
const EX = 400000;
const e = compute({ nation: 'england', price: EX, situation: 'home' });

export default definePage({
  id: 'how-stamp-duty-is-calculated',
  group: 'situations',
  order: 85,
  slug: 'how-stamp-duty-is-calculated',
  nav: 'How the tax is worked out',
  card: 'Slices, not brackets: the method shared by SDLT, LBTT and LTT, what counts as the price, and where the cliffs are.',
  title: 'Stamp Duty Explained 2026: The Slice Method, Step by Step',
  description: `Stamp duty explained for 2026: each rate taxes only its own slice of the price, so ${gbp(EX)} costs ${gbp(e.total)} in England. Worked examples and the cliffs explained.`,
  h1: 'How stamp duty is calculated',
  intro: 'One method across the three nations, a handful of exceptions, and a few prices where the method breaks.',
  resume: `Stamp Duty Land Tax in England and Northern Ireland, Land and Buildings Transaction Tax in Scotland and Land Transaction Tax in Wales all work out the tax the same way: the price is cut into slices at each band threshold, each slice is taxed at its own rate, and the results are added. A ${gbp(EX)} home bought as a sole residence in England pays nothing on the first ${gbp(top(S.residential, 0))}, ${pct(S.residential[1][1])} on the next slice to ${gbp(top(S.residential, 1))} and ${pct(S.residential[2][1])} on the remaining ${gbp(EX - top(S.residential, 1))}, for ${gbp(e.total)} in total, an effective rate of ${pct(e.effectiveRate)}. The same home costs ${gbp(t('scotland', EX))} in Scotland and ${gbp(t('wales', EX))} in Wales. The price taxed is the chargeable consideration: the money paid plus any debt taken over, such as a share of a mortgage. Three features break the smooth slice pattern: first-time buyer relief in England, which vanishes above ${gbp(S.first_time_buyer_max_price)}; the ${gbp(S.higher_rates_min_price)} floor for second-home surcharges; and the ${pct(S.corporate_flat_rate)} company rate on the whole price above ${gbp(S.corporate_flat_threshold)}.`,
  faqs: [
    { q: 'If my price crosses into a higher band, does the higher rate apply to everything I pay?', a: `No. Under the slice method a band threshold only changes the rate on the pounds above it. Going from ${gbp(249000)} to ${gbp(251000)} in England raises the bill from ${gbp(t('england', 249000))} to ${gbp(t('england', 251000))}: the extra ${gbp(1000)} above the line is taxed at ${pct(S.residential[2][1])}, and nothing below it is recalculated. The exceptions are reliefs and surcharges with a price limit.` },
    { q: 'Why does a calculator round my stamp duty down to the pound?', a: `Because the tax is due in whole pounds and the authorities’ own worked examples round down. Each slice can produce pence, for instance ${pct(S.residential[1][1])} of an odd amount, so the slices are added first and the total is then rounded down. HMRC’s example of a ${gbp(295000)} purchase gives ${gbp(t('england', 295000))}, the same figure as the slice method here.` },
    { q: 'Is the mortgage I take over when buying my partner out part of the price for stamp duty?', a: `Yes. On a transfer of equity, the chargeable consideration is the cash you pay plus the share of the mortgage you take on. Paying ${gbp(40000)} and taking over half of a ${gbp(220000)} mortgage means tax on ${gbp(40000 + 110000)}: ${gbp(t('england', 150000))} at standard rates. A transfer made under a divorce or dissolution is exempt, whatever the consideration.` },
    { q: 'Why does Scotland’s supplement not appear in the band-by-band table like the English surcharge?', a: `Because it is calculated differently. The English higher rates raise the rate of each slice by ${pct(S.higher_rates_surcharge)}, so they live inside the bands. Scotland’s Additional Dwelling Supplement is a flat ${pct(L.ads_rate)} of the whole price, added after LBTT is worked out slice by slice. On a ${gbp(EX)} second home it is ${gbp(compute({ nation: 'scotland', price: EX, situation: 'additional' }).surcharge)} on top of ${gbp(t('scotland', EX))} of LBTT.` },
  ],
  mini: 'sliceMethod',
  related: ['stamp-duty-rates', 'lbtt-rates', 'ltt-rates', 'stamp-duty-england-scotland-wales-compared', 'transfer-of-equity-stamp-duty', 'stamp-duty-company-purchase'],
  sources: ['fa2003s55', 'govSdltRates', 'govSdltTransfers', 'rsResidential', 'wraRates', 'rsAds'],
  body: (h) => {
    const s = h.P.sdlt, l = h.P.lbtt, w = h.P.ltt;
    const step = [100000, 200000, 300000, 500000, 1000000, 2000000].map((p) => [h.gbp(p), ...(['england', 'scotland', 'wales'] as const).map((n) => h.gbp(h.t(n, p + 1000) - h.t(n, p)))]);
    const cliffs: Array<[string, number, Parameters<typeof h.t>[2], Parameters<typeof h.t>[3], string]> = [
      ['First-time buyer relief ends (England)', s.first_time_buyer_max_price, 'first', {}, 'england'],
      ['Higher rates start (England)', s.higher_rates_min_price - 1, 'additional', {}, 'england'],
      ['Company flat rate starts (England)', s.corporate_flat_threshold, 'home', { company: true }, 'england'],
      ['Additional Dwelling Supplement starts (Scotland)', l.ads_min_price - 1, 'additional', {}, 'scotland'],
      ['Higher rates start (Wales)', w.higher_min_price - 1, 'additional', {}, 'wales'],
    ];
    const cliffRows = cliffs.map(([label, p, sit, extra, n]) => [label, h.gbp(p), h.gbp(h.t(n as 'england', p, sit, extra)), h.gbp(h.t(n as 'england', p + 1, sit, extra))]);
    return `
<h2>Slices, not brackets</h2>
<p>Section 55 of the Finance Act 2003 sets out the method for SDLT, and LBTT and LTT follow the same logic: the rate for each band applies only to the part of the consideration that falls within that band. A bracket system would do the opposite, applying one rate to the whole price according to where it lands, and many buyers still picture stamp duty that way. For residential purchases by individuals, the whole price never jumps to a higher rate just because it crosses a threshold.</p>
<p>The method has three steps. Cut the price at each threshold of the applicable table. Multiply each slice by its rate. Add the results and round down to the pound. The table changes with the buyer’s situation, but the method does not.</p>
<h2>The same ${h.gbp(EX)} home in three nations</h2>
<h3>England and Northern Ireland</h3>
${h.breakdown({ nation: 'england', price: EX, situation: 'home' }, `SDLT on ${h.gbp(EX)}, one home`)}
<p>Most of the ${h.gbp(e.total)} comes from the ${h.pct(s.residential[2][1])} slice. The first two slices together cost ${h.gbp(Math.floor(((s.residential[1][0] as number) - (s.residential[0][0] as number)) * s.residential[1][1]))}, a small share of the bill.</p>
<h3>Scotland</h3>
${h.breakdown({ nation: 'scotland', price: EX, situation: 'home' }, `LBTT on ${h.gbp(EX)}, one home`)}
<p>Scotland’s table has a higher nil band, ${h.gbp(l.residential[0][0] as number)}, but its ${h.pct(l.residential[3][1])} band starts at ${h.gbp((l.residential[2][0] as number) + 1)}, much lower than in England. That is why LBTT is lighter on modest homes and heavier from the mid-range upwards.</p>
<h3>Wales</h3>
${h.breakdown({ nation: 'wales', price: EX, situation: 'home' }, `LTT on ${h.gbp(EX)}, one home`)}
<p>Wales leaves the first ${h.gbp(w.main[0][0] as number)} untaxed for every buyer, then charges ${h.pct(w.main[1][1])} straight away. There is no ${h.pct(s.residential[1][1])} step and no first-time buyer scale, so the slices are fewer and steeper.</p>
<h2>Surcharges inside and outside the slices</h2>
<p>The three nations treat second homes in three different ways, and the difference is visible in a breakdown. England keeps the slices and adds ${h.pct(s.higher_rates_surcharge)} to the rate of each, so a ${h.gbp(EX)} additional property shows five slices at raised rates. Wales swaps in a separate higher table with its own thresholds. Scotland leaves the LBTT slices alone and adds a single line, the ${h.pct(l.ads_rate)} supplement on the whole price.</p>
${h.breakdown({ nation: 'scotland', price: EX, situation: 'additional' }, `LBTT plus ADS on a ${h.gbp(EX)} second home`)}
<h2>Commercial and mixed-use property: same method, other tables</h2>
<p>Shops, offices and buildings that mix homes with other uses are taxed with the slice method too, on the non-residential tables of each nation. In England that table has three slices: nothing to ${h.gbp(s.non_residential[0][0] as number)}, ${h.pct(s.non_residential[1][1])} to ${h.gbp(s.non_residential[1][0] as number)} and ${h.pct(s.non_residential[2][1])} above.</p>
${h.breakdown({ nation: 'england', price: 275000, kind: 'nonresidential', situation: 'home' }, `SDLT on a ${h.gbp(275000)} shop with a flat above`)}
<p>No surcharge for second homes applies on these tables, which is why a mixed-use purchase can cost less than a pure residential one at the same price for a buyer who already owns a home. The ${h.a('commercial-property-stamp-duty', 'commercial property calculator')} applies the Scottish and Welsh non-residential slices as well.</p>
<h2>What counts as the price</h2>
<p>The figure fed into the slices is the chargeable consideration, not the asking price or the valuation. For a normal sale it is the price in the contract. On a transfer of equity it is the money paid plus the share of any mortgage taken over, so a partner buying out the other’s half pays tax on cash and debt together. A genuine gift, with nothing paid and no debt assumed, has no consideration and is exempt, as are inheritances and transfers on divorce or dissolution (${h.a('transfer-of-equity-stamp-duty', 'transfer of equity calculator')}).</p>
<p>Shared ownership adds a choice: tax on the full market value at the start, or tax on each share as it is bought. Both are applications of the same slice method to a different consideration (${h.a('shared-ownership-stamp-duty', 'shared ownership')}).</p>
<h2>The cost of the next ${h.gbp(1000)}</h2>
<p>A useful way to read any table is to ask what one more thousand pounds on the offer costs. Under the slice method the answer is simply the rate of the top slice applied to that thousand.</p>
${h.table(['Price', 'England', 'Scotland', 'Wales'], step, `Extra tax on the next ${h.gbp(1000)}, one home`, ['l', 'r', 'r', 'r'])}
<p>The marginal cost stays modest at lower prices and rises steeply with the top band. Above ${h.gbp(l.residential[3][0] as number)} in Scotland and ${h.gbp(s.residential[3][0] as number)} in England and Wales, every extra thousand costs ${h.gbp(1000 * s.residential[4][1])}.</p>
<h2>Working it out by hand</h2>
<ol>
<li>Find the consideration: the contract price, plus any debt you take over, minus nothing for the deposit or fees.</li>
<li>Pick the table that matches every buyer’s situation at the end of completion day: first-time buyer, one home, or additional dwelling, and add the non-resident surcharge in England if any buyer fails the day count.</li>
<li>Cut the price at each threshold of that table and multiply each slice by its rate.</li>
<li>Add the slices, add any supplement charged on the whole price, and round the total down to the pound.</li>
</ol>
<p>The check that catches most mistakes is the effective rate. If the result divided by the price comes out above the top rate you reached, a slice has been taxed twice; if it comes out at the top rate exactly, the whole price has been taxed at one rate, which only the company flat rate ever does. A Scottish supplement adds its own fixed share on top, so remove it before running the check.</p>
<h2>Where the slice method breaks: the cliffs</h2>
<p>Pure slice systems have no cliffs: a pound more on the price can never add more than a fraction of a pound of tax. Reliefs and surcharges with a price limit break that rule, because they switch on or off for the whole price at once.</p>
${h.table(['Rule', 'Price', 'Tax at that price', 'Tax a pound higher'], cliffRows, 'Cliff edges in the three systems', ['l', 'r', 'r', 'r'])}
<p>For an individual the largest is the end of English first-time buyer relief, where one pound costs ${h.gbp(h.t('england', s.first_time_buyer_max_price + 1, 'first') - h.t('england', s.first_time_buyer_max_price, 'first'))}. A company without a relief faces a bigger jump still at ${h.gbp(s.corporate_flat_threshold)}: ${h.gbp(h.t('england', s.corporate_flat_threshold + 1, 'home', { company: true }) - h.t('england', s.corporate_flat_threshold, 'home', { company: true }))} for the same pound. The ${h.gbp(s.higher_rates_min_price)} floors in all three nations are small in pounds but large in proportion, since below them a second home of that value pays nothing at all. Near any of these prices, a few pounds of negotiation matter more than the band tables suggest.</p>`;
  },
});
