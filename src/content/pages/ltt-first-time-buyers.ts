import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top } from '../../lib/kit';

const W = P.ltt;
const NIL = top(W.main, 0);
const ENG_NIL = top(P.sdlt.first_time_buyer, 0);

export default definePage({
  id: 'ltt-first-time-buyers',
  group: 'wales',
  order: 30,
  slug: 'first-time-buyers-wales-ltt',
  nav: 'First-time buyers in Wales',
  card: `No relief in Wales, but a nil band to ${gbp(NIL)} for everyone: what a first home costs there against England and Scotland.`,
  title: `LTT First-Time Buyers 2026: No Relief, ${gbp(NIL)} Nil Band`,
  description: `LTT for first-time buyers in 2026: Wales has no relief, but nothing is due up to ${gbp(NIL)}. A ${gbp(260000)} first home pays ${gbp(t('wales', 260000, 'first'))}, against ${gbp(t('england', 260000, 'first'))} with English relief.`,
  h1: 'Land Transaction Tax for first-time buyers in Wales',
  intro: 'Wales chose a wide nil band for every buyer instead of a relief for first purchases. Here is what that choice costs, and saves.',
  resume: `Wales has no first-time buyer relief for Land Transaction Tax. A first home is taxed on the main rates like any other single home, with nothing to pay on the first ${gbp(NIL)} and ${pct(W.main[1][1])} on the slice above it up to ${gbp(top(W.main, 1))}. Below ${gbp(NIL)} that makes no difference, because no buyer pays anything: a ${gbp(200000)} first flat in Swansea is free of LTT. Above it, Welsh first-time buyers pay more than their English counterparts, who have a nil band to ${gbp(ENG_NIL)}: on ${gbp(280000)} the bill is ${gbp(t('wales', 280000, 'first'))} in Wales against ${gbp(t('england', 280000, 'first'))} in England, and on ${gbp(400000)}, ${gbp(t('wales', 400000, 'first'))} against ${gbp(t('england', 400000, 'first'))}. Against Scotland, whose relief stretches the nil band to ${gbp(P.lbtt.first_time_buyer_nil_band)}, Wales is cheaper on modest homes. The Welsh nil band does have one advantage: it has no conditions, so a buyer who once owned a home, or buys with someone who did, keeps it.`,
  faqs: [
    { q: 'Is there any help with LTT for first-time buyers in Wales in 2026?', a: `Not through the tax itself. The Welsh Revenue Authority confirms that there is no first-time buyer relief, so the main rates apply to every buyer of a single home. The help is built into the table instead: the nil band of ${gbp(NIL)} applies to everyone. Help with the deposit or the mortgage comes from other schemes, which do not change the LTT due.` },
    { q: 'We are first-time buyers looking on both sides of the border near Chester. Where is the tax lower?', a: `In England, at any price above ${gbp(NIL)}. A first-time buyer in Cheshire West and Chester pays nothing up to ${gbp(ENG_NIL)}, while in Flintshire or Wrexham the main rates charge ${pct(W.main[1][1])} above ${gbp(NIL)}. On a ${gbp(290000)} house the difference is ${gbp(t('wales', 290000, 'first'))} in Wales against ${gbp(t('england', 290000, 'first'))} in England. Below ${gbp(NIL)} both bills are nil, so the border only matters above it.` },
    { q: 'I owned a flat with an ex-partner years ago. Do I pay more LTT on my next purchase than a first-time buyer would?', a: `No. Because Wales gives first-time buyers no special rates, your history makes no difference: a ${gbp(240000)} home costs ${gbp(t('wales', 240000))} whether or not you owned before. What matters is whether you still own a dwelling on the day. If you do, and are not replacing your main home, the higher rates apply: ${gbp(t('wales', 240000, 'additional'))}.` },
    { q: 'Can my parents buy with me in Wales without raising the LTT?', a: `Only if they do not become owners. A parent who goes on the title while keeping their own home puts the purchase on the higher rates, ${gbp(t('wales', 220000, 'additional'))} on a ${gbp(220000)} flat that would otherwise cost ${gbp(t('wales', 220000))}. A joint borrower, sole proprietor mortgage lets them share the loan without owning a share, and the purchase stays on the main rates.` },
  ],
  mini: 'lttFirstHomeCompare',
  miniHref: 'ltt-calculator',
  related: ['ltt-rates', 'ltt-calculator', 'stamp-duty-first-time-buyer', 'lbtt-first-time-buyer-relief', 'stamp-duty-cardiff', 'stamp-duty-england-scotland-wales-compared'],
  sources: ['wraGuide', 'wraRates', 'wraHigher', 'sdltmFtb', 'rsFtb'],
  body: (h) => {
    const w = h.P.ltt, m = w.main;
    const lnil = h.P.lbtt.first_time_buyer_nil_band;
    const prices = [170000, 200000, 225000, 250000, 275000, 300000, 350000, 400000, 450000, 550000];
    const rows = prices.map((p) => [h.gbp(p), h.gbp(h.t('wales', p, 'first')), h.gbp(h.t('england', p, 'first')), h.gbp(h.t('scotland', p, 'first'))]);
    const cheaperThanScot = prices.filter((p) => h.t('wales', p, 'first') < h.t('scotland', p, 'first'));
    const dearerThanScot = prices.filter((p) => h.t('wales', p, 'first') > h.t('scotland', p, 'first'));
    const cf = h.place('cardiff'), sw = h.place('swansea');
    const cfF = cf.ftb as number, swF = sw.ftb as number;
    return `
<h2>No relief, by design</h2>
<p>When Land Transaction Tax replaced SDLT in Wales on 1 April 2018, the Welsh Government did not carry over a separate relief for first purchases. Instead, the main table starts with a nil band that every buyer of a single home enjoys, first-time or not. Since 10 October 2022 that band runs to ${h.gbp(top(m, 0))}. Before that date it was lower. The 2022 rise helped buyers of modest first homes, but it reached every buyer in that price range, not only those who had never owned, which is the logic of the whole Welsh approach.</p>
<p>The consequence is simple to state. A first-time buyer in Wales fills in the same return, answers the same questions and pays the same amount as a family moving from one home to another at the same price. There is nothing to claim, no definition of “first-time buyer” to satisfy, and no evidence to keep about past ownership. The ${h.a('ltt-calculator', 'LTT calculator')} still offers the option, but returns the main-rate figure with a note.</p>
<h2>A first home in the three nations</h2>
${h.table(['Price', 'Wales (main rates)', 'England & NI (relief)', 'Scotland (relief)'], rows, 'Tax on a first home in 2026, each nation’s rules for first-time buyers', ['l', 'r', 'r', 'r'])}
<p>Three zones appear. Up to ${h.gbp(lnil)} no nation charges a first-time buyer anything, so a first flat at that level is tax-free wherever it is. Between ${h.gbp(lnil)} and ${h.gbp(top(m, 0))}, Wales still charges nothing while Scotland starts taxing at ${h.pct(h.P.lbtt.residential[1][1])}. Above ${h.gbp(top(m, 0))}, the Welsh ${h.pct(m[1][1])} rate begins and England, where nothing is due until ${h.gbp(ENG_NIL)}, becomes clearly cheaper.</p>
<p>${cheaperThanScot.length ? `Against Scotland, Wales comes out cheaper in our table at ${cheaperThanScot.map((p) => h.gbp(p)).join(', ')}` : 'Against Scotland, Wales is not cheaper at any price in the table'}${dearerThanScot.length ? `, and dearer at ${dearerThanScot.map((p) => h.gbp(p)).join(', ')}` : ''}. The Scottish relief is capped at ${h.gbp(h.P.lbtt.first_time_buyer_max_saving)}, so above its bands the comparison is really between two ordinary tables.</p>
<h2>Why it matters near the border</h2>
<p>Several housing markets straddle the line between England and Wales: Chester and the Flintshire towns, Shrewsbury and Welshpool, the Wye valley around Monmouth and Ross. A first-time buyer looking at similar homes on both sides is choosing between two tax systems, and the gap opens as soon as the price passes ${h.gbp(top(m, 0))}.</p>
<p>Take a couple choosing between a ${h.gbp(285000)} semi in Saltney, on the Welsh side, and one at the same price a mile away in England. In Wales they pay ${h.gbp(h.t('wales', 285000, 'first'))}. In England, as first-time buyers, they pay ${h.gbp(h.t('england', 285000, 'first'))}. If one of them has owned a home before, the English relief is lost and the English bill becomes ${h.gbp(h.t('england', 285000))}; the Welsh bill does not change at all. That is the Welsh system’s one real advantage for first purchases: it cannot be lost.</p>
<p>The tax follows the land. A postcode or a post town on the English side does not make a Welsh property English for tax purposes, and the conveyancer will check which side of the line the title sits on. Where a property straddles the border, the price is split between the two nations and each part is taxed on its own table.</p>
<h2>Negotiating just above the nil band</h2>
<p>When a first home is priced close to ${h.gbp(top(m, 0))}, the arithmetic is gentle but relentless. Every pound above the nil band is taxed at ${h.pct(m[1][1])}, so each ${h.gbp(1000)} added to an offer adds ${h.gbp(h.t('wales', top(m, 0) + 1000))} of LTT. A bid of ${h.gbp(235000)} instead of ${h.gbp(225000)} costs ${h.gbp(h.t('wales', 235000))} in tax on top of the extra ${h.gbp(10000)} of price.</p>
<p>There is no cliff, which is the reassuring part. Unlike the English relief, which vanishes entirely above ${h.gbp(h.P.sdlt.first_time_buyer_max_price)}, the Welsh table never makes a slightly higher price suddenly much more expensive. A first-time buyer can bid with a simple rule in mind: ${h.pct(m[1][1])} of whatever they offer above ${h.gbp(top(m, 0))}, up to ${h.gbp(top(m, 1))}.</p>
<h2>What a first purchase costs in Cardiff and Swansea</h2>
<p>The UK House Price Index publishes the average price paid by first-time buyers. In Cardiff it was ${h.gbp(cfF)}, which costs ${h.gbp(h.t('wales', cfF, 'first'))} of LTT; a first-time buyer paying the same price in England would owe ${h.gbp(h.t('england', cfF, 'first'))}. In Swansea the first-time buyer average was ${h.gbp(swF)}, ${cfF > top(m, 0) && swF <= top(m, 0) ? 'inside the nil band, so the typical first purchase there pays nothing' : `which costs ${h.gbp(h.t('wales', swF, 'first'))}`}. The ${h.a('stamp-duty-cardiff', 'Cardiff page')} breaks the city down by type of home.</p>
<h2>The rules that still apply to first-time buyers</h2>
<p>No relief does not mean no rules. The test that matters in Wales is the one for the higher rates: will any buyer own more than one dwelling at the end of the day? A first-time buyer who already owns nothing passes it automatically. But the test looks at everyone on the title, so the choices made to finance a first purchase can change the bill.</p>
<ul>
<li><strong>A parent as co-owner.</strong> If a parent who owns their own home goes on the title, the purchase becomes an additional one and the ${h.a('ltt-higher-rates', 'higher rates')} apply to the whole price, from ${h.pct(w.higher[0][1])} on the first pound.</li>
<li><strong>A parent as joint borrower only.</strong> A joint borrower, sole proprietor mortgage keeps the parent off the title, and the purchase stays on the main rates. The Welsh Revenue Authority uses this exact case as an example.</li>
<li><strong>A home owned abroad.</strong> A buyer who has never owned in the UK but keeps a flat overseas is not buying a single home: the higher rates apply unless that flat was a main residence being replaced.</li>
</ul>
<p>One rule that does not exist in Wales is worth knowing for buyers coming home from abroad. England adds a ${h.pct(h.P.sdlt.non_resident_surcharge)} surcharge for buyers who spent fewer than ${h.P.sdlt.non_resident_days} days in the UK in the year before the purchase, even on a first home. Wales has no such surcharge: a first-time buyer returning from a posting overseas pays the same main rates as a neighbour who never left, ${h.gbp(h.t('wales', 300000))} on a ${h.gbp(300000)} house.</p>
<p>The return and the payment are due within ${w.return_days} days of completion, as for any purchase, and the conveyancer normally handles both.</p>`;
  },
});
