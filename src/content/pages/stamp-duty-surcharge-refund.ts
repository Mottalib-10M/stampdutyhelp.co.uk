import { definePage } from '../../lib/page-types';
import { P, gbp, compute } from '../../lib/kit';
import { refundWindowEnd } from '../../lib/engine/tax';
import { displayDate } from '../../lib/format';

const S = P.sdlt, L = P.lbtt, W = P.ltt;
const PRICE = 400000;
const back = (n: 'england' | 'scotland' | 'wales', p = PRICE) => compute({ nation: n, price: p, situation: 'additional' }).refundable;
/** Worked example: a completion on 1 November 2026. */
const DONE = '2026-11-01';
const d = (iso: string) => displayDate(iso, 'en-GB');

export default definePage({
  id: 'stamp-duty-surcharge-refund',
  group: 'situations',
  order: 50,
  slug: 'stamp-duty-surcharge-refund',
  nav: 'Surcharge refund',
  card: 'Sold your old home after buying the new one? How much comes back in each nation, and the dates that matter.',
  title: 'Stamp Duty Surcharge Refund 2026: Amounts and Deadlines',
  description: `Stamp duty surcharge refund in 2026: ${gbp(back('england'))} back on a ${gbp(PRICE)} home in England, ${gbp(back('scotland'))} of ADS in Scotland, ${gbp(back('wales'))} in Wales, with each claim deadline.`,
  h1: 'Getting the second-home surcharge back',
  intro: 'For home movers who completed before their old home sold: what is repaid, the sale deadline and the claim deadline in each nation.',
  resume: `If you paid the additional-property surcharge only because your previous main residence had not sold by completion, the surcharge comes back once it sells in time. On a ${gbp(PRICE)} home the refund is ${gbp(back('england'))} of SDLT in England or Northern Ireland, ${gbp(back('scotland'))} of Additional Dwelling Supplement in Scotland and ${gbp(back('wales'))} of LTT in Wales, the difference between the higher and the ordinary bill. The sale must take place within ${S.replace_main_residence_years} years of completion in England, ${L.replace_main_residence_months} months in Scotland and ${W.replace_main_residence_years} years in Wales. The claim then has its own deadline: ${S.refund_claim_months} months from the sale or from the filing date, whichever is later, for SDLT; an amendment within ${L.amend_months} months of filing, or an overpayment claim within ${L.overpayment_claim_years} years, for the ADS; an amendment within ${W.amend_months} months, or a claim within ${W.refund_claim_years} years, for LTT. Enter your completion date below to see your own dates.`,
  faqs: [
    { q: 'We completed on 1 November 2026. What is the last day to sell our old house and still get the surcharge back?', a: `${d(refundWindowEnd(DONE, 'england'))} in all three nations: ${S.replace_main_residence_years} years in England, Northern Ireland and Wales, ${L.replace_main_residence_months} months in Scotland, which lands on the same day. The claim deadline then differs. In England you have ${S.refund_claim_months} months from the sale, or from the filing date if later. In Scotland and Wales, amending the return is possible for ${L.amend_months} months after filing; after that, a separate repayment claim is needed.` },
    { q: 'How long does Revenue Scotland take to repay the ADS?', a: `Revenue Scotland aims to process an ADS repayment within ${L.repayment_target_working_days} working days of receiving the claim, and repays with interest. The Welsh Revenue Authority indicates ${W.refund_processing_working_days} working days for an LTT higher rates refund. In both nations only the surcharge part is repaid; the ordinary LBTT or main-rate LTT on the new home stays with the authority.` },
    { q: 'Do I get back the whole stamp duty or just the extra?', a: `Only the extra. The refund is the difference between what you paid with the surcharge and what a buyer replacing a main residence would have paid. On a ${gbp(PRICE)} English home you paid ${gbp(compute({ nation: 'england', price: PRICE, situation: 'additional' }).total)} and keep ${gbp(compute({ nation: 'england', price: PRICE, situation: 'home' }).total)}; the ${gbp(back('england'))} balance comes back. In Scotland the whole ADS is repaid and the LBTT stays.` },
  ],
  tool: 'refund',
  related: ['stamp-duty-moving-home', 'ads-repayment', 'ltt-higher-rates-refund', 'stamp-duty-second-home', 'stamp-duty-return-and-payment'],
  sources: ['govSdltRefunds', 'govSdltHigher', 'rsAdsRepayment', 'wraRefund'],
  body: (h) => {
    const prices = [250000, 400000, 600000, 900000];
    const rows = prices.map((p) => [h.gbp(p), h.gbp(back('england', p)), h.gbp(back('scotland', p)), h.gbp(back('wales', p))]);
    return `
<h2>What comes back at each price</h2>
${h.table(['Price of the new home', 'England & NI', 'Scotland (ADS)', 'Wales'], rows, 'Refundable surcharge, 2026 rates', ['l', 'r', 'r', 'r'])}
<p>The Scottish column is a straight ${h.pct(L.ads_rate)} of the price, because the ADS is a separate charge that is repaid in full. The English column is ${h.pct(S.higher_rates_surcharge)} of the price, the uplift on every band. The Welsh column varies, because the higher-rates table has its own bands and does not track the main table in step.</p>
<h2>Three claims, three procedures</h2>
<h3>SDLT: a claim to HMRC</h3>
<p>Once the old home is sold, you apply to HMRC for a repayment of the higher rates, giving the details of the new purchase and of the sale (${h.src('govSdltRefunds', 'GOV.UK refunds guidance')}). The time limit runs ${S.refund_claim_months} months from the sale, or from the filing date of the return for the new home if that is later. HMRC can also accept a late sale where exceptional circumstances outside your control, such as restrictions imposed by a public authority, prevented it. A refund is refused if a spouse or civil partner keeps a share of the old home.</p>
<h3>ADS: amend the return or claim an overpayment</h3>
<p>Within ${L.amend_months} months of the filing date, the buyer or their agent amends the original LBTT return. After that, the route is a claim for repayment of overpaid tax, possible within ${L.overpayment_claim_years} years of the date the return was due. The old property must have been your main residence in the ${L.replace_main_residence_months} months before the purchase, and the new one must now be the main residence of every buyer. Revenue Scotland allows no extension beyond the ${L.replace_main_residence_months} months: in MacQuarrie v Revenue Scotland the tribunal confirmed that a slow market is no excuse. Details are in the ${h.a('ads-repayment', 'ADS repayment guide')}.</p>
<h3>LTT: amend or claim with the WRA</h3>
<p>Wales uses the same two-step logic: an amendment within ${W.amend_months} months of the filing date, then a claim within ${W.refund_claim_years} years starting the day after the filing date. The repayment is the higher rates minus the main rates (${h.a('ltt-higher-rates-refund', 'LTT refund guide')}).</p>
<h2>Before you rely on a refund</h2>
<p>The refund is not automatic and it only exists for a replacement of your main residence. A landlord selling one rental after buying another gets nothing back, and a buyer who never lived in the property sold cannot claim. If you are still choosing whether to complete before or after your sale, read ${h.a('stamp-duty-moving-home', 'moving home and stamp duty')} first: the cheapest refund is the one you never need.</p>`;
  },
});
