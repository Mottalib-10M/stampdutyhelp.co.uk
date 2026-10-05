import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top } from '../../lib/kit';

const W = P.ltt;
const M = W.main;
/** First price (in £1,000 steps) where Welsh main rates cost more than SDLT for the same single home. */
const CROSS_E = (() => { for (let p = top(M, 0); p < 3_000_000; p += 1000) if (t('wales', p) > t('england', p)) return p; return 0; })();

export default definePage({
  id: 'ltt-rates',
  group: 'wales',
  order: 10,
  slug: 'land-transaction-tax-rates',
  nav: 'LTT rates and bands',
  card: `Nothing up to ${gbp(top(M, 0))}, then ${pct(M[1][1])} straight away: the Welsh main bands since October 2022, with worked examples.`,
  title: 'Land Transaction Tax Rates 2026: Main Bands in Wales',
  description: `Land Transaction Tax rates 2026: nothing up to ${gbp(top(M, 0))}, then ${pct(M[1][1])} to ${pct(M[4][1])}. A ${gbp(280000)} home pays ${gbp(t('wales', 280000))}. Bands in force since October 2022, commercial rates too.`,
  h1: 'Land Transaction Tax rates and bands',
  intro: 'The main residential table of the Welsh Revenue Authority, read slice by slice and set against England and Scotland.',
  resume: `Land Transaction Tax on a home in Wales is charged at the main rates when the buyer will own no other dwelling: nothing on the first ${gbp(top(M, 0))}, ${pct(M[1][1])} on the part up to ${gbp(top(M, 1))}, ${pct(M[2][1])} up to ${gbp(top(M, 2))}, ${pct(M[3][1])} up to ${gbp(top(M, 3))} and ${pct(M[4][1])} above. These bands have applied since 10 October 2022. Each rate covers only its slice of the price, so the Welsh Revenue Authority’s example of a ${gbp(280000)} home pays ${gbp(t('wales', 280000))}, and a ${gbp(450000)} family house ${gbp(t('wales', 450000))}. The nil band is the widest in the United Kingdom, which makes Wales cheaper than England for a single home up to about ${gbp(CROSS_E - 1000)}. Every buyer of a single home uses this table, because Wales has no first-time buyer relief and no surcharge for buyers living abroad. Second homes and company purchases go through a separate higher-rates table. The return and the tax are due within ${W.return_days} days of completion.`,
  faqs: [
    { q: `Why does Welsh LTT jump straight to ${pct(M[1][1])} after the nil band?`, a: `Because the Welsh table has no low first band. Where England charges ${pct(P.sdlt.residential[1][1])} on the first taxed slice and Scotland the same, Wales keeps a longer nil band, up to ${gbp(top(M, 0))}, and then charges ${pct(M[1][1])}. The result is that cheaper homes pay nothing and homes just above the nil band pay quickly: ${gbp(t('wales', 260000))} on ${gbp(260000)}.` },
    { q: 'Do LTT main rates apply if I am buying my first home in Swansea?', a: `Yes, the main rates are the only rates a first-time buyer can pay in Wales, since there is no separate relief. On a ${gbp(190000)} terrace that means ${gbp(t('wales', 190000))}, because the price is inside the nil band; on ${gbp(260000)} it is ${gbp(t('wales', 260000))}. The same price in England would cost a first-time buyer ${gbp(t('england', 260000, 'first'))}.` },
    { q: 'Which LTT table applies to a farmhouse sold with its land?', a: `A purchase that combines a dwelling with land or buildings used for something else, such as farmland, is mixed-use and is taxed on the non-residential table: nothing up to ${gbp(top(W.non_residential, 0))}, then ${pct(W.non_residential[1][1])}, ${pct(W.non_residential[2][1])} and ${pct(W.non_residential[3][1])}. On ${gbp(600000)} that gives ${gbp(t('wales', 600000, 'home', { kind: 'nonresidential' }))}, against ${gbp(t('wales', 600000))} at the residential main rates.` },
    { q: 'Who sends the LTT return to the Welsh Revenue Authority?', a: `In almost every purchase, the conveyancer acting for the buyer files the return online and pays the tax from funds the buyer provides, within ${W.return_days} days of the effective date, usually completion. Completion and the return go together in practice, so ask your conveyancer for the submission reference and keep it with your purchase papers. The tax remains the buyer’s liability even when someone else files.` },
  ],
  mini: 'lttMain',
  miniHref: 'ltt-calculator',
  related: ['ltt-calculator', 'ltt-higher-rates', 'ltt-first-time-buyers', 'stamp-duty-cardiff', 'stamp-duty-swansea', 'lbtt-rates'],
  sources: ['wraRates', 'wraGuide', 'wraCalculator', 'lttAct'],
  body: (h) => {
    const w = h.P.ltt, m = w.main;
    const cf = h.place('cardiff'), sw = h.place('swansea');
    const homes = [['Cardiff', cf], ['Swansea', sw]].flatMap(([n, c]) => {
      const r = c as typeof cf;
      return ([['average home', r.avg], ['terraced house', r.terraced], ['detached house', r.detached]] as Array<[string, number | undefined]>)
        .filter(([, v]) => v).map(([k, v]) => [`${n}, ${k}`, h.gbp(v as number), h.gbp(h.t('wales', v as number)), h.gbp(h.t('england', v as number))]);
    });
    const cmp = [200000, 225000, 250000, 300000, 350000, 400000, 600000, 1000000].map((p) => [h.gbp(p), h.gbp(h.t('wales', p)), h.gbp(h.t('england', p)), h.gbp(h.t('scotland', p))]);
    const walesNeverDearer = [150000, 200000, 250000, 300000, 400000, 600000, 1000000, 2000000].every((p) => h.t('wales', p) <= h.t('scotland', p));
    return `
<h2>The main table since 10 October 2022</h2>
${h.bands('ltt')}
<p>Wales took over the tax on property purchases on 1 April 2018, when Land Transaction Tax replaced SDLT under the Land Transaction Tax and Anti-avoidance of Devolved Taxes (Wales) Act 2017. The main residential bands were last changed on 10 October 2022, when the nil band was raised to ${h.gbp(top(m, 0))}. They have not moved since.</p>
<p>The shape of the table is unusual. It has the widest nil band of the three nations, then no gentle band at all: the first taxed pound pays ${h.pct(m[1][1])}. After that the steps are modest, to ${h.pct(m[2][1])}, ${h.pct(m[3][1])} and ${h.pct(m[4][1])}, and the higher thresholds sit where England puts them, at ${h.gbp(top(m, 3))} for the top rate.</p>
<h2>The authority’s ${h.gbp(280000)} example</h2>
${h.breakdown({ nation: 'wales', price: 280000, situation: 'home' }, `LTT on ${h.gbp(280000)} at main rates`)}
<p>Only the ${h.gbp(280000 - top(m, 0))} above the nil band is taxed, all of it at ${h.pct(m[1][1])}, which gives ${h.gbp(h.t('wales', 280000))}. A family house at ${h.gbp(520000)} reaches the third band:</p>
${h.breakdown({ nation: 'wales', price: 520000, situation: 'home' }, `LTT on ${h.gbp(520000)} at main rates`)}
<p>The bill is ${h.gbp(h.t('wales', 520000))}, and more than half of it comes from the ${h.pct(m[1][1])} slice between ${h.gbp(top(m, 0) + 1)} and ${h.gbp(top(m, 1))}, which every buyer above ${h.gbp(top(m, 1))} pays in full: ${h.gbp(h.t('wales', top(m, 1)))}.</p>
<h2>Wales against England and Scotland for a single home</h2>
${h.table(['Price', 'LTT, Wales', 'SDLT, England & NI', 'LBTT, Scotland'], cmp, 'Tax on the same single home, standard or main rates, 2026', ['l', 'r', 'r', 'r'])}
<p>Below ${h.gbp(top(m, 0))}, Wales charges nothing at all, while England has taxed every pound above ${h.gbp(top(h.P.sdlt.residential, 0))} and Scotland every pound above ${h.gbp(top(h.P.lbtt.residential, 0))}. Above the nil band, the ${h.pct(m[1][1])} rate closes the gap fast. By our calculation, from ${h.gbp(CROSS_E)} a buyer of a single home pays more in Wales than in England, and the difference grows on expensive homes. ${walesNeverDearer ? 'Against Scotland, the Welsh main rates are never higher at any price we tested, because the Scottish table reaches ' + h.pct(h.P.lbtt.residential[3][1]) + ' at ' + h.gbp(top(h.P.lbtt.residential, 2)) + '.' : ''}</p>
<p>These comparisons hold for buyers of one home who are not first-time buyers in England. An English first-time buyer pays nothing up to ${h.gbp(top(h.P.sdlt.first_time_buyer, 0))}, which reverses the picture for first purchases; the ${h.a('ltt-first-time-buyers', 'page on first-time buyers in Wales')} works through that case.</p>
<h2>Trading up the Welsh ladder</h2>
<p>Because the nil band is wide and the next rate is high, the tax on each move up the ladder rises faster in Wales than the price does. Follow a couple who start in a ${h.gbp(210000)} terrace in Newport: they pay ${h.gbp(h.t('wales', 210000))}. Their next move, to a ${h.gbp(330000)} semi-detached house in the Vale of Glamorgan, costs ${h.gbp(h.t('wales', 330000))}. A later move to a ${h.gbp(480000)} detached house costs ${h.gbp(h.t('wales', 480000))}. The price has a little more than doubled across the three purchases; the tax has gone from nothing to a five-figure sum.</p>
<p>Seen as a share of the price, the bill is ${h.pct(Math.round(h.t('wales', 330000) / 330000 * 1000) / 1000)} at ${h.gbp(330000)}, ${h.pct(Math.round(h.t('wales', 480000) / 480000 * 1000) / 1000)} at ${h.gbp(480000)} and ${h.pct(Math.round(h.t('wales', 900000) / 900000 * 1000) / 1000)} at ${h.gbp(900000)}. The headline rates of ${h.pct(m[2][1])} or ${h.pct(m[3][1])} are never what a buyer actually pays on the whole price, since the nil band and the lower slices always pull the average down. That matters when budgeting: a buyer who assumes ${h.pct(m[2][1])} of ${h.gbp(480000)} would set aside ${h.gbp(480000 * m[2][1])}, more than twice the real figure.</p>
<p>Near the border, the choice between these tables is made by the land, not by the buyer. A house in Chepstow pays LTT and one a few miles away in Gloucestershire pays SDLT, so two homes at ${h.gbp(400000)} on either side of the Wye cost ${h.gbp(h.t('wales', 400000))} and ${h.gbp(h.t('england', 400000))}. Where a single property straddles the line, each part is taxed by its own nation, and the conveyancer files two returns.</p>
<h2>What the bands mean in Cardiff and Swansea</h2>
<p>The UK House Price Index gives the average price paid in each Welsh council area. Run through the main table, the two largest cities look like this:</p>
${h.table(['Home', 'Average price', 'LTT, main rates', 'SDLT at the same price'], homes, 'UK HPI averages and the tax due, 2026 bands', ['l', 'r', 'r', 'r'])}
<p>The table shows how much depends on which side of ${h.gbp(top(m, 0))} a home falls: below it the Welsh bill is nothing, above it every ${h.gbp(10000)} costs ${h.gbp(h.t('wales', top(m, 0) + 10000))} until ${h.gbp(top(m, 1))}. City pages for ${h.a('stamp-duty-cardiff', 'Cardiff')} and ${h.a('stamp-duty-swansea', 'Swansea')} go into each housing stock in more detail.</p>
<h2>Buyers living outside the UK</h2>
<p>Wales charges no surcharge for non-resident buyers. Someone moving back from Singapore to a house in Monmouthshire, or an overseas buyer purchasing a flat in Cardiff Bay, uses the main table if it will be their only dwelling. The test that does reach abroad is the one for additional homes: a flat still owned in another country counts as a dwelling, and with it the purchase moves to the higher table. On a ${h.gbp(350000)} house that is the difference between ${h.gbp(h.t('wales', 350000))} and ${h.gbp(h.t('wales', 350000, 'additional'))}. In England, the same buyer could face a ${h.pct(h.P.sdlt.non_resident_surcharge)} surcharge on top of everything else.</p>
<h2>A second table for additional homes</h2>
<p>The main rates are only half of the Welsh system. A buyer who will own two or more dwellings at the end of the day, and any company buying a home, pays the higher residential rates instead. These are a separate table, not a surcharge on this one, and they start at ${h.pct(w.higher[0][1])} from the first pound: ${h.gbp(h.t('wales', 280000, 'additional'))} on the same ${h.gbp(280000)} home. The ${h.a('ltt-higher-rates', 'higher rates guide')} covers who pays them.</p>
<h2>Commercial and mixed-use property</h2>
${h.bands('lttNonRes')}
<p>Shops, offices, farmland and mixed-use purchases use this table. Its nil band matches the residential one, but the taxed slices are lighter until ${h.gbp(top(w.non_residential, 2))}, after which ${h.pct(w.non_residential[3][1])} applies. A ${h.gbp(400000)} shop with a flat above costs ${h.gbp(h.t('wales', 400000, 'home', { kind: 'nonresidential' }))}. Wales also has a relief for purchases of several dwellings at once, which this site does not model.</p>
<h2>The ${w.return_days}-day return</h2>
<p>The return and the payment are due within ${w.return_days} days of the effective date, which is normally completion. Your conveyancer files the return with the Welsh Revenue Authority and pays from the funds you send. A mistake can be corrected by amending the return within ${w.amend_months} months of the filing date. To check a figure, the ${h.src('wraCalculator', 'Welsh Revenue Authority calculator')} uses the same bands as our ${h.a('ltt-calculator', 'LTT calculator')}.</p>`;
  },
});
