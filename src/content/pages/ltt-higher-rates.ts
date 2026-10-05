import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const W = P.ltt;
const H = W.higher;
const extra = (p: number) => compute({ nation: 'wales', price: p, situation: 'additional' }).surcharge;

export default definePage({
  id: 'ltt-higher-rates',
  group: 'wales',
  order: 20,
  slug: 'ltt-higher-rates',
  nav: 'LTT higher rates (second homes)',
  card: `A separate Welsh table from ${pct(H[0][1])} to ${pct(H[5][1])} for second homes, buy-to-let and companies: who pays it and who does not.`,
  title: 'LTT Higher Rates 2026: Second Homes and Buy-to-Let in Wales',
  description: `LTT higher rates 2026: ${pct(H[0][1])} to ${pct(H[5][1])} on a separate table for second homes in Wales. A ${gbp(260000)} holiday home pays ${gbp(t('wales', 260000, 'additional'))}. Spouses, joint buyers, companies.`,
  h1: 'Land Transaction Tax higher rates',
  intro: 'Wales does not add a surcharge to its main bands: it swaps the whole table for a dearer one.',
  resume: `A buyer of a home in Wales who will own two or more dwellings at the end of the day pays Land Transaction Tax on the higher residential rates, a separate table in force since 11 December 2024: ${pct(H[0][1])} up to ${gbp(top(H, 0))}, ${pct(H[1][1])} to ${gbp(top(H, 1))}, ${pct(H[2][1])} to ${gbp(top(H, 2))}, ${pct(H[3][1])} to ${gbp(top(H, 3))}, ${pct(H[4][1])} to ${gbp(top(H, 4))} and ${pct(H[5][1])} above. There is no nil band, so the Welsh Revenue Authority’s example of a ${gbp(260000)} second home costs ${gbp(t('wales', 260000, 'additional'))}, against ${gbp(t('wales', 260000))} at the main rates. Dwellings anywhere in the world count. Spouses and civil partners are treated as one buyer, and when several people buy together, one of them owning another home is enough to put the whole purchase on the higher rates. Companies pay them on every dwelling from ${gbp(W.higher_min_price)}. Below ${gbp(W.higher_min_price)} they never apply, and a buyer replacing a main residence sold within ${W.replace_main_residence_years} years can avoid them or claim the difference back.`,
  faqs: [
    { q: 'My mother is buying a flat in Cardiff with me so I can get a mortgage. Do we pay the higher rates?', a: `If she goes on the title as a co-buyer while still owning her own home, yes: the Welsh Revenue Authority’s own example of a parent co-buyer ends with the higher rates on the whole purchase, ${gbp(t('wales', 200000, 'additional'))} on a ${gbp(200000)} flat that would otherwise cost ${gbp(t('wales', 200000))}. A joint borrower, sole proprietor mortgage, where she borrows with you but does not own a share, keeps the purchase on the main rates.` },
    { q: 'I am separated but not divorced, and my husband still owns our old house. Does it count for LTT?', a: `Spouses and civil partners count as one buyer only while they are living together. If you have separated in circumstances likely to be permanent, his house is no longer treated as yours for the higher rates, and a ${gbp(240000)} home bought in your own name stays at ${gbp(t('wales', 240000))}. Keep evidence of the separation, such as the date you stopped living together.` },
    { q: 'Do LTT higher rates apply to a shop with a flat above it in Aberystwyth?', a: `No. A purchase that includes both residential and non-residential property is taxed on the non-residential table, and the higher residential rates are not used. On ${gbp(300000)} that gives ${gbp(t('wales', 300000, 'home', { kind: 'nonresidential' }))}, whatever else the buyer owns. A flat bought on its own, then let, would pay ${gbp(t('wales', 300000, 'additional'))} by comparison.` },
    { q: 'I own a small flat in Portugal. Does it push my first Welsh purchase onto the higher rates?', a: `Yes, if the flat is worth ${gbp(W.higher_min_price)} or more and you keep it. Dwellings anywhere in the world count, and a home abroad is not a main residence you are replacing unless you lived in it and sell it within ${W.replace_main_residence_years} years. On a ${gbp(275000)} house in Wales the higher rates cost ${gbp(t('wales', 275000, 'additional'))}, against ${gbp(t('wales', 275000))} at main rates.` },
    { q: `How much more do the higher rates cost on a ${gbp(400000)} house?`, a: `On ${gbp(400000)} the higher table gives ${gbp(t('wales', 400000, 'additional'))}, against ${gbp(t('wales', 400000))} on the main table, a difference of ${gbp(extra(400000))}. That is the amount at stake when timing the sale of a former home, because it is also the refund a replacing buyer can claim once the old home sells within ${W.replace_main_residence_years} years.` },
  ],
  mini: 'lttHigherCost',
  miniHref: 'ltt-calculator',
  related: ['ltt-higher-rates-refund', 'ltt-calculator', 'ltt-rates', 'buy-to-let-stamp-duty', 'additional-dwelling-supplement', 'stamp-duty-joint-purchase'],
  sources: ['wraHigher', 'wraHigherTech', 'wraRates', 'lttAct'],
  body: (h) => {
    const w = h.P.ltt, hi = w.higher, m = w.main;
    const rows = [100000, 180000, 260000, 350000, 500000, 900000].map((p) => {
      const r = h.tax({ nation: 'wales', price: p, situation: 'additional' });
      return [h.gbp(p), h.gbp(r.mainTax), h.gbp(r.total), h.gbp(r.surcharge)];
    });
    return `
<h2>A table of its own since 11 December 2024</h2>
${h.bands('lttHigher')}
<p>England adds a fixed surcharge to every band of its ordinary table, and Scotland adds a flat supplement on the whole price. Wales does neither. It publishes a second table with its own thresholds and rates and applies it from the first pound. The thresholds of the higher table do not even match the main ones: the first band stops at ${h.gbp(top(hi, 0))}, the second at ${h.gbp(top(hi, 1))}, and only from ${h.gbp(top(hi, 2))} upwards do the two tables share their limits.</p>
<p>The current higher table took effect on 11 December 2024, when each of its rates was raised. The previous version had applied from 22 December 2020 to 10 December 2024. Purchases with an effective date in 2026 use the table above.</p>
<h2>What it costs compared with the main rates</h2>
${h.table(['Price', 'Main rates', 'Higher rates', 'Extra cost'], rows, 'LTT main and higher rates on the same price, 2026', ['l', 'r', 'r', 'r'])}
<p>The extra cost is largest, in proportion, on cheaper homes. Below the main nil band of ${h.gbp(top(m, 0))}, a buyer of a single home pays nothing while an investor pays the whole higher bill: ${h.gbp(h.t('wales', 180000, 'additional'))} on a ${h.gbp(180000)} terrace in the Valleys, every pound of it due only because of the other property. Above the nil band, the gap keeps growing in pounds but shrinks as a share of the bill.</p>
<p>Against the other two nations, the picture depends on the price. On a ${h.gbp(250000)} buy-to-let the three bills are ${h.gbp(h.t('wales', 250000, 'additional'))} in Wales, ${h.gbp(h.t('england', 250000, 'additional'))} in England and ${h.gbp(h.t('scotland', 250000, 'additional'))} in Scotland.</p>
<h2>Who is caught</h2>
<p>The test looks at the end of the day of the purchase. If any buyer will then own more than one dwelling worth ${h.gbp(w.higher_min_price)} or more, anywhere in the world, and the new home is not replacing a main residence, the higher rates apply to the whole price. A flat in Bristol counts as much as a cottage on Anglesey; so does an apartment in Spain.</p>
<h3>Spouses and civil partners</h3>
<p>A married couple or civil partners living together are treated as one buyer. A home owned by one of them counts as owned by the other, even if only one name is on the new purchase. Buying a seaside flat in Saundersfoot in your own name, while your wife owns the family house, is an additional purchase.</p>
<h3>Joint buyers who are not a couple</h3>
<p>When several people buy together, one of them owning another dwelling puts the whole purchase on the higher table. Two friends who pool their savings for a house in Cardiff, one of whom still owns a flat in Leeds, pay ${h.gbp(h.t('wales', 300000, 'additional'))} on a ${h.gbp(300000)} house rather than ${h.gbp(h.t('wales', 300000))}.</p>
<h3>A parent as co-buyer, or as joint borrower</h3>
<p>This is the case the Welsh Revenue Authority illustrates in its guidance, and the outcome depends on one detail. A parent who becomes a co-owner of the child’s first home, while keeping their own, makes the purchase an additional one: the higher rates apply to the whole price. A parent who signs a joint borrower, sole proprietor mortgage, sharing the loan but not the ownership, does not own a dwelling interest in the new home, and the purchase stays on the main rates. For a ${h.gbp(230000)} flat, the difference between the two arrangements is ${h.gbp(extra(230000))}.</p>
<h3>Companies</h3>
<p>A company, or any buyer that is not an individual, pays the higher rates on every dwelling from ${h.gbp(w.higher_min_price)}, including its first. There is no main residence to replace, so nothing is ever refunded. Unlike England, Wales has no flat company rate on expensive homes; the higher table simply applies at every price.</p>
<h2>A landlord’s budget, purchase by purchase</h2>
<p>For an investor building a portfolio in Wales, the higher table is the normal table: every purchase after the first home pays it. Take a landlord who lives in her own house in Bridgend and buys three flats to let over a few years, at ${h.gbp(150000)}, ${h.gbp(190000)} and ${h.gbp(240000)}. The tax is ${h.gbp(h.t('wales', 150000, 'additional'))}, ${h.gbp(h.t('wales', 190000, 'additional'))} and ${h.gbp(h.t('wales', 240000, 'additional'))}, or ${h.gbp(h.t('wales', 150000, 'additional') + h.t('wales', 190000, 'additional') + h.t('wales', 240000, 'additional'))} in total. At the main rates, the first two flats would have cost nothing and the third ${h.gbp(h.t('wales', 240000))}.</p>
<p>That cost belongs in the yield calculation from the start, because it is paid in cash on completion and cannot be refunded. Buying the same flats through a company changes nothing to the LTT, since a company pays the higher rates on every dwelling anyway; the choice between personal and company ownership turns on other taxes, which this site does not cover.</p>
<h2>Who is not caught</h2>
<ul>
<li><strong>Cheap dwellings.</strong> Properties bought for less than ${h.gbp(w.higher_min_price)} never pay the higher rates, and a dwelling worth less than that is ignored when counting what a buyer already owns.</li>
<li><strong>Mixed-use purchases.</strong> A dwelling bought together with commercial premises goes on the non-residential table, where the higher residential rates have no place.</li>
<li><strong>Buyers replacing their main residence.</strong> If the previous main home was sold within ${w.replace_main_residence_years} years before the purchase, the main rates apply. If it is sold within ${w.replace_main_residence_years} years after, the difference between the two tables is refunded; the ${h.a('ltt-higher-rates-refund', 'refund guide')} covers the claim.</li>
</ul>
<h2>Paying, and what to keep</h2>
<p>The higher rates are declared on the ordinary LTT return, filed with the payment within ${w.return_days} days of completion. The return records whether the higher rates apply, and the Welsh Revenue Authority can check that answer after completion. Keep a note of what each buyer owned on the day, with values for any small property you treated as below ${h.gbp(w.higher_min_price)}. To try other prices, the ${h.a('ltt-calculator', 'LTT calculator')} shows both tables side by side, and the ${h.src('wraHigherTech', 'technical guidance')} covers the rarer cases.</p>`;
  },
});
