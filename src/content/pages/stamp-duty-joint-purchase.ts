import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t } from '../../lib/kit';

const S = P.sdlt, L = P.lbtt;
const PRICE = 350000;

export default definePage({
  id: 'stamp-duty-joint-purchase',
  group: 'situations',
  order: 30,
  slug: 'stamp-duty-joint-purchase',
  nav: 'Buying with someone else',
  card: 'Couples, friends, a parent on the deeds: one buyer’s history can set the rate for everybody.',
  title: 'Stamp Duty on a Joint Purchase 2026: Whose Situation Counts',
  description: `Stamp duty on a joint purchase in 2026: two first-time buyers pay ${gbp(t('england', PRICE, 'first'))} on a ${gbp(PRICE)} flat in England, but one co-buyer who owns a home makes it ${gbp(t('england', PRICE, 'additional'))}.`,
  h1: 'Stamp duty when you buy with someone else',
  intro: 'The tax is charged on the whole price once, and the least favourable buyer decides which table is used.',
  resume: `When two or more people buy together, the tax is assessed once on the whole price, not share by share, and the position of a single buyer can change the rate for all of them. First-time buyer relief needs every purchaser to qualify: two friends buying a ${gbp(PRICE)} flat in England pay ${gbp(t('england', PRICE, 'first'))} if neither has ever owned a home, and ${gbp(t('england', PRICE))} if one of them once did. If any buyer will still own another dwelling at the end of completion day, the whole purchase goes onto the surcharge: ${gbp(t('england', PRICE, 'additional'))} in England, ${gbp(t('scotland', PRICE, 'additional'))} with the ADS in Scotland, ${gbp(t('wales', PRICE, 'additional'))} at the Welsh higher rates. Spouses and civil partners living together are treated as one buyer, so a husband’s rental flat counts even if he is not on the new title. The tool below tests up to four buyers and shows who decides the rate.`,
  faqs: [
    { q: 'Mum is going on the deeds to help us get a mortgage. Does that change our stamp duty?', a: `Yes, if she still owns her own home. As a co-owner she makes the purchase one by a buyer with another dwelling, so the whole ${gbp(PRICE)} is taxed at the higher rates: ${gbp(t('england', PRICE, 'additional'))} in England instead of ${gbp(t('england', PRICE, 'first'))} for two first-time buyers. A joint borrower, sole proprietor mortgage lets her borrow without owning, which the Welsh Revenue Authority confirms keeps the main rates.` },
    { q: 'I own 10% of a house with my brother. Does that small share count when I buy with my partner?', a: `In England and Wales, yes: keeping a share of a home means you will own another dwelling at the end of completion day, which puts the whole joint purchase on the higher rates. Owning any share also ends your first-time buyer status. Scotland is more lenient since 1 April 2024: a share worth less than ${gbp(L.ads_min_price)} is ignored for the ADS, so a small stake may leave the purchase free of it.` },
    { q: 'My husband lives abroad but I live in London. Do we pay the non-resident surcharge on our flat?', a: `Not if you are married or civil partners living together and you are UK resident. HMRC treats a non-resident spouse of a UK resident as resident for this purpose (SDLTM09885), so the ${pct(S.non_resident_surcharge)} surcharge does not apply. Two unmarried buyers are treated differently: one non-resident is enough to put the ${pct(S.non_resident_surcharge)} on the whole price.` },
  ],
  tool: 'joint',
  related: ['stamp-duty-first-time-buyer', 'stamp-duty-second-home', 'additional-dwelling-supplement', 'ltt-higher-rates', 'non-resident-stamp-duty-surcharge', 'transfer-of-equity-stamp-duty'],
  sources: ['govSdltHigher', 'sdltmFtb', 'sdltmNonResSpouse', 'rsAds', 'wraHigher'],
  body: (h) => {
    const cases: Array<[string, 'first' | 'home' | 'additional']> = [
      ['Two first-time buyers', 'first'],
      ['One of them owned a home before, neither owns one now', 'home'],
      ['One of them keeps a flat or a share of a home', 'additional'],
    ];
    const rows = cases.map(([l, s]) => [l, h.gbp(h.t('england', PRICE, s)), h.gbp(h.t('scotland', PRICE, s)), h.gbp(h.t('wales', PRICE, s))]);
    return `
<h2>One purchase, one rate</h2>
<p>The authorities look at the transaction, not at each name on it. The tax is calculated on the full price, then the strictest situation among the buyers chooses the table. A 1% owner who keeps a buy-to-let has the same effect as a 99% owner who does.</p>
${h.table(['Buyers', 'England & NI', 'Scotland', 'Wales'], rows, `Joint purchase at ${h.gbp(PRICE)}, by the buyers’ history`, ['l', 'r', 'r', 'r'])}
<p>The middle row explains a frequent surprise. A buyer who sold a flat years ago no longer owns anything, so there is no surcharge, but the past ownership still removes ${h.a('stamp-duty-first-time-buyer', 'first-time buyer relief')} for the couple. In Wales the first two rows are identical, because Wales has no first-time buyer relief at all.</p>
<h2>Married couples and civil partners</h2>
<p>Spouses and civil partners who are not separated count as one unit. In England and Wales, a property owned by one of them counts as owned by both for the surcharge, even if only the other signs the purchase. Scotland’s economic unit is wider still and includes unmarried partners who live together as if married. The rule cuts both ways for the relief in England: when one spouse buys alone, HMRC does not test the other spouse’s past ownership for first-time buyer relief (SDLTM29845), but it does count the other spouse’s current home for the higher rates.</p>
<h2>Parents, friends and siblings</h2>
<p>A parent added to the title to support the mortgage is the case the Welsh Revenue Authority uses as its own example of the higher rates applying. The alternative it describes, a joint borrower, sole proprietor mortgage, keeps the parent off the title and the purchase on main rates. Friends and siblings face the same logic: if one of them keeps a home elsewhere, the ${h.a('stamp-duty-second-home', 'higher rates')} apply to everybody, and the extra cost is shared however the buyers agree between themselves.</p>
<h2>Non-resident co-buyers</h2>
<p>In England and Northern Ireland, one buyer who spent fewer than ${h.P.sdlt.non_resident_days} days in the UK during the year before completion adds ${h.pct(S.non_resident_surcharge)} to every band for the whole purchase, ${h.gbp(h.tax({ nation: 'england', price: PRICE, situation: 'home', nonResident: true }).nonResidentSurcharge)} at ${h.gbp(PRICE)}. The only exception is a married couple or civil partners living together where the other partner is UK resident. Scotland and Wales have no surcharge of this kind.</p>
<p>Later changes in ownership between co-owners, such as one partner buying out the other, are taxed as a ${h.a('transfer-of-equity-stamp-duty', 'transfer of equity')}.</p>`;
  },
});
