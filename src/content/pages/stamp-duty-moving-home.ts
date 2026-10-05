import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, compute } from '../../lib/kit';

const S = P.sdlt, L = P.lbtt, W = P.ltt;
const NEXT = 425000;
const extra = (n: 'england' | 'scotland' | 'wales', p: number) => compute({ nation: n, price: p, situation: 'additional' }).refundable;

export default definePage({
  id: 'stamp-duty-moving-home',
  group: 'situations',
  order: 20,
  slug: 'stamp-duty-moving-home',
  nav: 'Moving home',
  card: 'Sell first and pay ordinary rates; buy first and fund the surcharge until the refund arrives.',
  title: 'Stamp Duty When Moving Home 2026: Sell First or Buy First',
  description: `Stamp duty when moving home in 2026: ${gbp(t('england', NEXT))} on a ${gbp(NEXT)} home in England if you sell first, ${gbp(t('england', NEXT, 'additional'))} if you buy first, and when the surcharge comes back.`,
  h1: 'Stamp duty when you move home',
  intro: 'The order of your sale and your purchase decides whether you pay the surcharge up front, and each nation gives a different window to put it right.',
  resume: `A home mover pays ordinary rates when the old main residence is sold before or on the day the new one completes: ${gbp(t('england', NEXT))} of SDLT on a ${gbp(NEXT)} house in England or Northern Ireland, ${gbp(t('scotland', NEXT))} of LBTT in Scotland, ${gbp(t('wales', NEXT))} of LTT in Wales. Buy before the sale goes through and, for that moment, you own two homes, so the surcharge is due at completion: ${gbp(extra('england', NEXT))} more in England, ${gbp(extra('scotland', NEXT))} of ADS in Scotland and ${gbp(extra('wales', NEXT))} more in Wales. The extra comes back once the old home sells, provided the sale happens within ${S.replace_main_residence_years} years in England, ${L.replace_main_residence_months} months in Scotland or ${W.replace_main_residence_years} years in Wales, and you claim in time. Scotland and Wales also look backwards: a main home sold up to ${L.replace_main_residence_months} months (Scotland) or ${W.replace_main_residence_years} years (Wales) before the purchase still counts as replaced, even if you own another property.`,
  faqs: [
    { q: 'Our sale and purchase complete on the same day. Do we pay the higher rates?', a: `No. In England and Northern Ireland the surcharge is avoided when the old main residence is disposed of on or before the effective date of the new purchase, and same-day completion meets that test. Your conveyancer files the return at ordinary rates, ${gbp(t('england', NEXT))} on a ${gbp(NEXT)} home. In Scotland and Wales, a sale within the time limit has the same effect.` },
    { q: 'Our buyer pulled out but we still want to complete on the new house. How much extra do we need?', a: `The full surcharge, paid within the return deadline. On a ${gbp(NEXT)} home that is ${gbp(extra('england', NEXT))} in England, ${gbp(extra('scotland', NEXT))} in Scotland and ${gbp(extra('wales', NEXT))} in Wales. It is a loan to the tax authority rather than a cost, as long as the old home sells within ${S.replace_main_residence_years} years (${L.replace_main_residence_months} months in Scotland) and you file the refund claim.` },
    { q: 'We sold our house a year ago and rent now, but we still own a flat that is let. Do we pay the surcharge on our next home?', a: `In Wales, no: a main residence sold within ${W.replace_main_residence_years} years before the purchase counts as replaced. In Scotland the look-back is ${L.replace_main_residence_months} months, with the same result. England’s higher rates guidance deals with this case separately and its conditions are technical, so ask your conveyancer to check your dates against it before you file at standard rates.` },
    { q: 'My wife keeps her half of our old house after we move. Can we still reclaim the surcharge?', a: `Not in England and Northern Ireland. HMRC refuses the refund when a spouse or civil partner keeps an interest in the old main residence, because the couple has not fully disposed of it. Until her share is sold too, the ${pct(S.higher_rates_surcharge)} surcharge stays paid. Sell the whole property, including her share, within ${S.replace_main_residence_years} years, then claim.` },
    { q: 'Is there any extension if our old flat in Scotland cannot be sold within the ADS time limit?', a: `No. Revenue Scotland applies the ${L.replace_main_residence_months}-month limit strictly, and the tribunal case MacQuarrie v Revenue Scotland confirmed there is no discretion for exceptional circumstances. England is different: HMRC’s rules allow a late sale to qualify where exceptional circumstances, such as restrictions imposed by a public authority, prevented it. In Scotland the only safe plan is to market the old flat early and price it to sell.` },
  ],
  mini: 'moveSellFirst',
  related: ['stamp-duty-surcharge-refund', 'ads-repayment', 'ltt-higher-rates-refund', 'stamp-duty-second-home', 'stamp-duty-joint-purchase', 'stamp-duty-return-and-payment'],
  sources: ['govSdltHigher', 'govSdltRefunds', 'rsAdsRepayment', 'rsAds', 'wraRefund'],
  body: (h) => {
    const prices = [250000, 350000, 425000, 550000, 750000, 1000000];
    const rows = prices.map((p) => [h.gbp(p), h.gbp(h.t('england', p)), h.gbp(extra('england', p)), h.gbp(h.t('scotland', p)), h.gbp(extra('scotland', p)), h.gbp(h.t('wales', p)), h.gbp(extra('wales', p))]);
    const win = h.table(['', 'England & NI', 'Scotland', 'Wales'], [
      ['Old home sold before the purchase', 'On or before completion day', `Within ${L.replace_main_residence_months} months before`, `Within ${W.replace_main_residence_years} years before`],
      ['Old home sold after the purchase', `Within ${S.replace_main_residence_years} years: refund`, `Within ${L.replace_main_residence_months} months: refund`, `Within ${W.replace_main_residence_years} years: refund`],
      ['Claim by', `${S.refund_claim_months} months after the sale or the filing date, whichever is later`, `Amend within ${L.amend_months} months of filing; later, overpayment claim within ${L.overpayment_claim_years} years`, `Amend within ${W.amend_months} months of filing; later, claim within ${W.refund_claim_years} years`],
      ['Exceptional circumstances', 'Allowed (public authority restrictions)', 'None', 'Not covered here'],
    ], 'Replacing a main residence: the time limits', ['l', 'l', 'l', 'l']);
    return `
<h2>Same-day completion is the clean case</h2>
<p>When a chain is arranged so that the sale of the old house and the purchase of the new one complete on the same day, that timing matters for tax as much as for the removal van. SDLT asks how many dwellings you own at the end of the day of completion, and a main residence sold that day is gone by then. The new home is a replacement, so ordinary rates apply and nothing needs to be reclaimed later. Scotland and Wales reach the same answer through their look-back rules, which treat a main residence already sold as replaced.</p>
<p>The bill is then what any buyer of a single home would pay. On a ${h.gbp(NEXT)} house that is ${h.gbp(h.t('england', NEXT))} in England or Northern Ireland, ${h.gbp(h.t('scotland', NEXT))} in Scotland and ${h.gbp(h.t('wales', NEXT))} in Wales. First-time buyer relief is not available to a mover, whatever the price, because you have owned a home before.</p>
<h2>Buying before you sell: what completion costs</h2>
<p>When the new purchase completes first, you own two homes at the end of that day, so the return must be filed with the surcharge. The table shows the ordinary bill and the extra you must find, which is also the amount you can later get back.</p>
${h.table(['Price', 'England', 'Extra', 'Scotland', 'Extra (ADS)', 'Wales', 'Extra'], rows, 'Ordinary bill and surcharge to fund if the old home is unsold, 2026 rates', ['l', 'r', 'r', 'r', 'r', 'r', 'r'])}
<p>The extra grows fastest in Scotland, because the ADS is ${h.pct(L.ads_rate)} of the whole price, while England adds ${h.pct(S.higher_rates_surcharge)} to each band and Wales switches to a separate higher-rates table. For a family buying at ${h.gbp(550000)}, the difference between buying a week before the sale and a week after is ${h.gbp(extra('england', 550000))} of cash in England and ${h.gbp(extra('scotland', 550000))} in Scotland. That money has to be in your conveyancer’s client account before the return deadline: ${S.return_days} days after completion for SDLT, ${L.return_days} days for LBTT and LTT.</p>
<h2>The windows, nation by nation</h2>
${win}
<h3>England and Northern Ireland</h3>
<p>The old home must be sold within ${S.replace_main_residence_years} years of the new purchase, and the refund must be claimed within ${S.refund_claim_months} months of that sale or of the filing date of the original return, whichever is later. HMRC pays the difference between the higher rates and the ordinary rates, not the whole tax. The ${h.a('stamp-duty-surcharge-refund', 'surcharge refund page')} works out the dates from your completion day.</p>
<h3>Scotland</h3>
<p>The ADS is repaid when the previous main residence is sold within ${L.replace_main_residence_months} months of buying the new one. Three further conditions apply: the old property must have been your main residence at some point in the ${L.replace_main_residence_months} months before the purchase, the new one must become your main residence, and for purchases since 1 April 2024 every buyer must live in it, although only one of them needs to have sold. Revenue Scotland aims to repay within ${L.repayment_target_working_days} working days, with interest. The ${h.a('ads-repayment', 'ADS repayment guide')} covers the claim.</p>
<h3>Wales</h3>
<p>The Welsh Revenue Authority refunds the difference between the higher and the main rates when the previous main residence is sold within ${W.replace_main_residence_years} years. The claim goes in by amending the return within ${W.amend_months} months of filing, or later by a separate claim within ${W.refund_claim_years} years of the day after the filing date, and the WRA indicates ${W.refund_processing_working_days} working days to process it (${h.a('ltt-higher-rates-refund', 'LTT higher rates refund')}).</p>
<h3>A worked case</h3>
<p>A couple in Bristol agree to buy a ${h.gbp(550000)} semi while their flat is still on the market. Completion comes first, so their conveyancer files the SDLT return at the higher rates and collects ${h.gbp(h.t('england', 550000, 'additional'))}. Their flat sells eight months later. They then claim the ${h.gbp(extra('england', 550000))} difference from HMRC, well inside both the ${h.P.sdlt.replace_main_residence_years}-year sale window and the ${h.P.sdlt.refund_claim_months}-month claim window. Had the same couple been buying in Edinburgh, the extra at completion would have been ${h.gbp(extra('scotland', 550000))}, the ADS on the full price.</p>
<h2>Scotland and Wales look back as well</h2>
<p>A buyer who sold the family home, moved into rented accommodation and only then found the next house does not pay the surcharge just because they still own something else, such as a let flat or a share in a holiday cottage. Scotland treats the purchase as a replacement if the previous main residence was sold in the ${L.replace_main_residence_months} months before it. Wales does the same with a ${W.replace_main_residence_years}-year look-back. Without that previous sale, the other property would trigger the ADS or the higher rates.</p>
<p>A mover who owns nothing else after selling has no problem in any nation: a single dwelling at the end of the day means ordinary rates, wherever the money came from.</p>
<h2>What can cost you the refund</h2>
<ul>
<li><strong>A share left behind.</strong> In England, if your spouse or civil partner keeps an interest in the old home, HMRC treats it as not sold.</li>
<li><strong>A late sale in Scotland.</strong> There is no discretion beyond ${L.replace_main_residence_months} months, even when the market is slow or the property is hard to sell.</li>
<li><strong>The wrong old home.</strong> The property sold must have been your main residence, not a flat you let out. A rental sale never unlocks a refund, as explained in the ${h.a('buy-to-let-stamp-duty', 'buy-to-let guide')}.</li>
<li><strong>Not moving in (Scotland).</strong> The ADS refund needs the new property to be occupied as the main residence of every buyer; buying the next home as a pied-à-terre while staying in the old one does not qualify.</li>
<li><strong>A missed deadline.</strong> The sale can be on time and the claim still late: diarise both.</li>
</ul>
<h2>Funding the gap</h2>
<p>If your sale lags, the surcharge has to come from somewhere: savings, a bridging loan, or a family loan repaid when the refund arrives. Whatever the source, build the surcharge into your budget before exchanging contracts on the new home, because the return deadline does not move if your buyer withdraws. If you are buying with someone who does not own a home, remember that one owner is enough to bring the surcharge into play for the whole purchase; the ${h.a('stamp-duty-joint-purchase', 'joint purchase calculator')} shows how the rate is decided.</p>`;
  },
});
