import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, compute } from '../../lib/kit';

const L = P.lbtt;
const ADS = L.ads_rate, PREV = L.ads_previous_rate, MIN = L.ads_min_price, MONTHS = L.replace_main_residence_months;
const ads = (p: number) => compute({ nation: 'scotland', price: p, situation: 'additional' }).surcharge;

export default definePage({
  id: 'additional-dwelling-supplement',
  group: 'scotland',
  order: 30,
  slug: 'additional-dwelling-supplement',
  nav: 'Additional Dwelling Supplement (ADS)',
  card: `${pct(ADS)} of the whole price on top of LBTT for second homes, buy-to-let and every company purchase, from ${gbp(MIN)}.`,
  title: `ADS 2026: ${pct(ADS)} Additional Dwelling Supplement in Scotland`,
  description: `ADS in 2026 is ${pct(ADS)} of the whole price on second homes and buy-to-let in Scotland: ${gbp(ads(200000))} on a ${gbp(200000)} flat, on top of LBTT. Who pays, couples, companies.`,
  h1: 'The Additional Dwelling Supplement (ADS)',
  intro: `Scotland’s charge on second homes is not a higher set of bands but a flat percentage of the price, and it reaches further than most buyers expect.`,
  resume: `The Additional Dwelling Supplement is ${pct(ADS)} of the whole purchase price, paid on top of Land and Buildings Transaction Tax, when a buyer of a home in Scotland will own two or more dwellings at the end of the day and is not replacing a main residence. It applies from a price of ${gbp(MIN)}, so a ${gbp(200000)} flat bought to let costs ${gbp(ads(200000))} of supplement plus ${gbp(t('scotland', 200000))} of LBTT, ${gbp(t('scotland', 200000, 'additional'))} in all. The rate rose from ${pct(PREV)} for transactions with an effective date on or after 5 December 2024, unless the contract was concluded before that date. Spouses, civil partners and cohabitants, with children under 16, count as one economic unit. Since 1 April 2024, a share in a dwelling worth less than ${gbp(MIN)} is ignored. Companies pay the supplement on every dwelling, even the first. A buyer who sold their previous main home within the ${MONTHS} months before the purchase does not pay it, and one who sells within ${MONTHS} months after can claim it back.`,
  faqs: [
    { q: 'Does the ADS apply to a flat I own jointly with my sister and never lived in?', a: `Usually yes, if your share of that flat is worth ${gbp(MIN)} or more. Owning part of a dwelling counts as owning it, whoever lives there. Since 1 April 2024, a share worth less than ${gbp(MIN)} is ignored, which helps owners of small inherited fractions. On a ${gbp(260000)} home for yourself, the supplement would be ${gbp(ads(260000))} unless you are replacing a main residence.` },
    { q: 'My partner and I are not married but live together. Does her rented-out flat trigger the ADS on my purchase?', a: `Yes. Revenue Scotland treats cohabitants living as if married in the same way as spouses and civil partners: together with children under 16, you form one economic unit, and her flat counts as a dwelling you own. If you buy a ${gbp(300000)} home in your name alone while she keeps the flat, the supplement of ${gbp(ads(300000))} is due.` },
    { q: 'We concluded missives in November 2024 but entry was in January 2025. Which ADS rate applies?', a: `The lower rate of ${pct(PREV)}. The transitional rule keeps the old rate for contracts concluded before 5 December 2024, even when the effective date falls after it. On a ${gbp(250000)} purchase that means ${gbp(Math.floor(250000 * PREV))} instead of ${gbp(ads(250000))}. Your solicitor states the contract date on the LBTT return.` },
    { q: 'Our company is buying its first flat in Edinburgh. Is that really an additional dwelling?', a: `For the supplement, yes. A company, or any buyer that is not an individual, pays the ADS on every dwelling it buys from ${gbp(MIN)}, including the first, because it cannot have a main residence to replace. On a ${gbp(350000)} flat that is ${gbp(ads(350000))} of supplement plus ${gbp(t('scotland', 350000))} of LBTT, and none of it can be repaid later.` },
    { q: 'I sold my house in Inverness two years ago and rented since. Do I pay ADS on my next home if I still own a holiday cottage?', a: `Not if the house you sold was your main residence and the new home replaces it. A previous main residence sold within the ${MONTHS} months before the purchase protects you, even though the cottage stays in your hands. Two years is inside that window. Wait beyond ${MONTHS} months and the cottage makes the purchase an additional one: ${gbp(ads(320000))} of supplement on a ${gbp(320000)} house.` },
  ],
  mini: 'adsScotland',
  miniHref: 'lbtt-calculator',
  related: ['ads-repayment', 'lbtt-calculator', 'lbtt-rates', 'buy-to-let-stamp-duty', 'stamp-duty-company-purchase', 'ltt-higher-rates'],
  sources: ['rsAds', 'lbttAct', 'rsAdsRepayment', 'rsResidential'],
  body: (h) => {
    const l = h.P.lbtt;
    const rows = [60000, 120000, 200000, 300000, 450000, 700000].map((p) => {
      const r = h.tax({ nation: 'scotland', price: p, situation: 'additional' });
      return [h.gbp(p), h.gbp(r.mainTax), h.gbp(r.surcharge), h.gbp(r.total), h.gbp(h.t('england', p, 'additional')), h.gbp(h.t('wales', p, 'additional'))];
    });
    return `
<h2>A flat percentage, from the first pound</h2>
<p>The supplement does not work like the LBTT bands. There is no nil band and there are no slices: once the price reaches ${h.gbp(l.ads_min_price)}, the whole of it is multiplied by ${h.pct(l.ads_rate)}. A ${h.gbp(150000)} flat therefore pays ${h.gbp(ads(150000))} of supplement while its LBTT is only ${h.gbp(h.t('scotland', 150000))}. On cheaper property the supplement is often many times the tax it is added to.</p>
${h.table(['Price', 'LBTT', 'ADS', 'Total in Scotland', 'England, higher rates', 'Wales, higher rates'], rows, 'Second home or buy-to-let: the three nations compared, 2026', ['l', 'r', 'r', 'r', 'r', 'r'])}
<p>The comparison shows where Scotland stands. At the bottom of the market the Scottish total is the heaviest of the three, because the supplement charges the full price while the English and Welsh surcharges start from bands. On expensive homes the gap narrows, as English and Welsh higher bands climb. A landlord comparing a ${h.gbp(120000)} flat in Dundee with one in Middlesbrough is comparing ${h.gbp(h.t('scotland', 120000, 'additional'))} with ${h.gbp(h.t('england', 120000, 'additional'))}.</p>
<h2>From 2016 to ${h.pct(l.ads_rate)}: how the rate has risen</h2>
<p>The supplement was introduced on 1 April 2016, a year after LBTT replaced SDLT in Scotland, and has been raised three times since: on 25 January 2019, on 16 December 2022, when it reached ${h.pct(l.ads_previous_rate)}, and on 5 December 2024, when it reached the current ${h.pct(l.ads_rate)}. Each rise applied from its date to transactions with an effective date on or after it.</p>
<p>The last change carries a transitional rule that still matters for slow purchases. If the contract was entered into before 5 December 2024, the old ${h.pct(l.ads_previous_rate)} applies even when entry happens later, so the date the missives were concluded is worth checking. On a ${h.gbp(400000)} property the difference is ${h.gbp(ads(400000) - Math.floor(400000 * l.ads_previous_rate))}.</p>
<h2>Who is the buyer? The economic unit</h2>
<p>The supplement is decided by looking at what the buyers own at the end of the day of the purchase, and Scotland looks further than the names on the title. Spouses, civil partners and cohabitants living together as if married are treated as one unit with their children under 16. A dwelling owned by any of them counts as owned by the buyer. A married man buying a flat in his own name pays the supplement if his wife owns a cottage in Fife, even if he never set foot in it.</p>
<p>The same logic catches parents: a flat bought in the name of a child under 16, or held for them, counts as the parents’ property. An older child is a separate person, so a parent who buys a flat for a student daughter of nineteen in the daughter’s own name does not add a dwelling to the parent’s count. If the parent buys it in their own name, though, the supplement is due.</p>
<h3>Joint buyers who are not a couple</h3>
<p>Where several people buy together, the supplement applies to the whole price if any one of them meets the conditions. Two friends buying a flat, one of whom already owns a home, pay ${h.pct(l.ads_rate)} on the full price, not on half of it.</p>
<h3>Shares worth less than ${h.gbp(l.ads_min_price)}</h3>
<p>Since 1 April 2024 an interest in a dwelling worth less than ${h.gbp(l.ads_min_price)} is left out of the count. A quarter share of a ${h.gbp(140000)} cottage inherited with three siblings, worth ${h.gbp(35000)}, no longer makes a later home purchase an additional one. Before that date, any share counted, however small. Inherited property is otherwise counted like any other, with one relief since 1 April 2024 for a dwelling inherited between the contract and the date of entry.</p>
<h2>Companies pay on every dwelling</h2>
<p>A company, or any other buyer that is not an individual, has no home to replace. The supplement therefore applies to every dwelling it buys from ${h.gbp(l.ads_min_price)}, the first included, and it can never be repaid because no main residence is ever sold. Investors weighing a limited company for buy-to-let in Scotland start with a cost of ${h.pct(l.ads_rate)} of every price.</p>
<h2>Replacing your home: the ${l.replace_main_residence_months}-month windows</h2>
<p>The supplement is not aimed at people moving house, and two windows protect them. If the buyer’s previous main residence was sold in the ${l.replace_main_residence_months} months before the new purchase, and the new home becomes the main residence, there is no supplement. If the new home is bought first, the supplement must be paid, and it can be reclaimed once the old home is sold, provided the sale happens within ${l.replace_main_residence_months} months of the purchase. Before 1 April 2024 the backward window was shorter. The ${h.a('ads-repayment', 'ADS repayment guide')} covers the conditions, the deadlines and the evidence.</p>
<p>The windows only cover a main residence. Someone who owns a flat they let out and a house they live in, and sells the flat to buy a new home, has not replaced anything: the house they keep is the dwelling that triggers the supplement. Wales has a comparable system with its own table of ${h.a('ltt-higher-rates', 'higher rates')}, and England adds ${h.pct(h.P.sdlt.higher_rates_surcharge)} to each band.</p>
<h2>One return, one payment</h2>
<p>The supplement is not a separate tax with its own form. It is declared on the same LBTT return as the main tax and paid with it, within ${l.return_days} days of the effective date. The return asks whether the buyer will own more than one dwelling at the end of that day and whether a main residence is being replaced, and the answers decide the figure. A mistake in either direction is corrected by amending the return.</p>
<p>The test is taken at the end of the day of entry, so the order of events on that day matters. A seller who completes the sale of their old home in the morning and takes entry to the new one in the afternoon owns one dwelling at the end of the day and pays no supplement. If the sale slips to the following week, the supplement of ${h.gbp(ads(380000))} on a ${h.gbp(380000)} house is due, and is only recovered later through a repayment claim.</p>`;
  },
});
