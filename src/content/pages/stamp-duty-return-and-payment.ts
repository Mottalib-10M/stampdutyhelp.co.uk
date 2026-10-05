import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t } from '../../lib/kit';

const S = P.sdlt, L = P.lbtt, W = P.ltt;
const PEN1 = S.penalty_fixed_first, PEN2 = S.penalty_fixed_after_3_months, GEAR = S.penalty_tax_geared_after_months;
const EX = 325000;

export default definePage({
  id: 'stamp-duty-return-and-payment',
  group: 'england',
  order: 70,
  slug: 'stamp-duty-return-and-payment',
  nav: 'Return, payment and deadlines',
  card: `${S.return_days} days for SDLT, ${L.return_days} for LBTT and LTT, counted from completion: who files, how to pay and what a late return costs.`,
  title: `Stamp Duty Return and Payment 2026: Deadlines and Penalties`,
  description: `Stamp duty return and payment in 2026: SDLT within ${S.return_days} days of completion, LBTT and LTT within ${L.return_days}. Late SDLT returns cost ${gbp(PEN1)}, then ${gbp(PEN2)}, plus interest.`,
  h1: 'Filing the stamp duty return and paying the tax',
  intro: 'The clock starts at completion, and the conveyancer usually does the filing, but the deadline is still yours.',
  resume: `A Stamp Duty Land Tax return must reach HMRC, and the tax must be paid, within ${S.return_days} days of completion for a purchase in England or Northern Ireland. In Scotland, the Land and Buildings Transaction Tax return and payment are due within ${L.return_days} days, and in Wales the Land Transaction Tax return within ${W.return_days} days. For an ordinary purchase the date that starts the clock, the effective date, is completion, not exchange. Your solicitor or conveyancer usually files the return and pays the tax on completion day, ${gbp(t('england', EX))} on a ${gbp(EX)} sole home. A late SDLT return costs a fixed ${gbp(PEN1)}, rising to ${gbp(PEN2)} once it is more than three months late, and after ${GEAR} months HMRC can add a tax-based penalty of up to the full tax due. Tax paid late also carries interest from the day after the deadline. A mistake can be corrected by amending the return within ${S.amend_months} months of the filing date.`,
  faqs: [
    { q: 'Do I send the stamp duty return myself, or does my solicitor do it?', a: `Usually the solicitor or conveyancer files it online and pays the tax on completion day, using money you transfer to them in advance, so you never deal with HMRC directly. If you buy without a legal representative, or they do not handle it, you file and pay yourself within ${S.return_days} days. Either way, check the figure on the draft return before completion.` },
    { q: 'What happens if my SDLT return reaches HMRC a month after the deadline?', a: `HMRC charges a fixed penalty of ${gbp(PEN1)} for a return filed up to three months after the filing date, and interest on any tax paid late, from the day after it was due. You can appeal the penalty if an unforeseeable event beyond your control prevented filing, but interest is not a penalty and cannot be appealed. A return still missing after ${GEAR} months risks a tax-based penalty too.` },
    { q: 'My parents are giving me their old flat for nothing. Do I need to file a return?', a: `No, if it is a genuine gift with no consideration: a transfer for no money and no debt taken over is exempt and needs no SDLT return. If you take over part of their mortgage, that share counts as consideration and the transfer may become taxable. On a ${gbp(150000)} share of a mortgage, standard rates give ${gbp(t('england', 150000))} of tax.` },
    { q: 'Is the stamp duty deadline counted from exchange of contracts or from completion?', a: `From the effective date, which for an ordinary purchase is completion. Exchange fixes the price, but the ${S.return_days}-day SDLT window, and the ${L.return_days}-day windows for LBTT and LTT, start when the purchase completes. A long gap between exchange and completion therefore does not shorten the time you have to file, and the rates are those in force at completion.` },
    { q: 'How long do I have to correct a mistake on my SDLT return?', a: `You can amend the return within ${S.amend_months} months of the filing date, which is how a missed first-time buyer relief or a wrongly applied surcharge is put right. Some refunds follow their own timetable: the higher rates are reclaimed within ${S.refund_claim_months} months of selling the old main home or of the filing date, whichever is later, and the non-resident surcharge within ${S.non_resident_refund_years} years.` },
  ],
  mini: 'returnDeadline',
  related: ['stamp-duty-surcharge-refund', 'stamp-duty-exemptions', 'transfer-of-equity-stamp-duty', 'sdlt-calculator', 'ads-repayment', 'ltt-higher-rates-refund'],
  sources: ['govSdltOverview', 'govSdltPenalties', 'govSdltRefunds', 'govSdltTransfers', 'rsResidential', 'wraGuide'],
  body: (h) => {
    const s = h.P.sdlt, l = h.P.lbtt, w = h.P.ltt;
    const deadlines = [
      ['England and Northern Ireland', 'Stamp Duty Land Tax', 'HMRC', `${s.return_days} days after completion`, `${s.amend_months} months after the filing date`],
      ['Scotland', 'LBTT and ADS', 'Revenue Scotland', `${l.return_days} days after completion`, `${l.amend_months} months after the filing date`],
      ['Wales', 'Land Transaction Tax', 'Welsh Revenue Authority', `${w.return_days} days after completion`, `${w.amend_months} months after the filing date`],
    ];
    const pens = [
      ['Return filed up to three months after the filing date', h.gbp(s.penalty_fixed_first)],
      ['Return filed more than three months after the filing date', h.gbp(s.penalty_fixed_after_3_months)],
      [`Return still not filed ${s.penalty_tax_geared_after_months} months after the filing date`, 'Fixed penalty plus a tax-based penalty of up to the full tax due'],
      ['Tax paid late', 'Interest from the day after the deadline, at the official rate set by HM Treasury'],
    ];
    return `
<h2>The effective date starts the clock</h2>
<p>Every deadline on this page runs from the effective date of the transaction. For an ordinary purchase, with exchange followed by completion, that is the day of completion: the day the money moves and the keys are handed over. Exchange of contracts fixes the price and commits both sides, but it does not start the filing period, and it does not decide which rates apply. A purchase that exchanged under one set of rates and completed under another is taxed at the rates in force on completion, which is what decided the bill for buyers whose chains ran past ${h.a('stamp-duty-changes-april-2025', '31 March 2025')}.</p>
<p>From that date, the three nations give different amounts of time:</p>
${h.table(['Nation', 'Tax', 'Authority', 'Return and payment due', 'Amendment allowed until'], deadlines, 'Filing deadlines for residential purchases', ['l', 'l', 'l', 'l', 'l'])}
<p>In England the window is short. A solicitor who files on completion day, as HMRC describes as the usual practice, leaves a comfortable margin; one who waits for a missing document or a buyer’s confirmation can run close to the line, and the penalty does not depend on whose delay it was.</p>
<h2>Who files, and how the money gets to HMRC</h2>
<p>The HMRC overview is direct: if you have a solicitor, agent or conveyancer, they will usually file the SDLT return and pay the tax on your behalf on the day of completion. In practice the tax appears on the completion statement your solicitor sends before the move, alongside the balance of the deposit, legal fees and Land Registry fees. You transfer the total; the firm pays HMRC from its client account.</p>
<p>If your representative does not handle the return, or you are buying without one, you can file and pay yourself. The same deadline applies. Whoever submits the return, the facts on it come from you: the price, the situation of each buyer and any relief claimed. Read the draft before you approve it. Two lines deserve attention: whether any buyer will own another dwelling at the end of completion day, and whether every buyer is genuinely a first-time buyer.</p>
<h3>A worked example</h3>
<p>A buyer completes on a ${h.gbp(EX)} house in Derby, their only home. The completion statement shows ${h.gbp(h.t('england', EX))} of SDLT, worked out band by band:</p>
${h.breakdown({ nation: 'england', price: EX, situation: 'home' }, `SDLT on a ${h.gbp(EX)} purchase, standard rates`)}
<p>That figure is fixed by the situation declared on the return, so a buyer who still owns another home on completion night would see the higher rates on the same statement instead: ${h.gbp(h.t('england', EX, 'additional'))}. The same house in Scotland would carry ${h.gbp(h.t('scotland', EX))} of LBTT, due within ${l.return_days} days, and in Wales ${h.gbp(h.t('wales', EX))} of LTT, also within ${w.return_days} days.</p>
<h2>Late returns and late payment in England and Northern Ireland</h2>
<p>HMRC’s ${h.src('govSdltPenalties', 'guidance on penalties and interest')} sets out a ladder that starts the day after the filing date. The fixed penalties apply even when the tax itself was paid on time, because they punish the late return, not the late money.</p>
${h.table(['Situation', 'What HMRC charges'], pens, 'SDLT penalties and interest', ['l', 'l'])}
<p>Interest works differently from penalties. It runs from the day after the tax should have been paid until the day it is paid, at the official rate set by HM Treasury. Because it compensates for the delay rather than punishing it, there is no appeal against interest. A penalty can be appealed if an unusual event, unforeseeable or beyond your control, stopped you from filing or from arranging for someone else to file.</p>
<h2>Scotland and Wales run their own systems</h2>
<p>Revenue Scotland and the Welsh Revenue Authority collect their taxes separately from HMRC, with their own online services and their own penalty rules. The ${l.return_days}-day deadline is the main practical difference from England: a buyer in Edinburgh or Cardiff has more than twice as long to file as a buyer in York. Penalty amounts in the devolved systems are not reproduced here; ask your solicitor or the authority if a return is at risk of being late.</p>
<p>A Scottish purchase that attracts the Additional Dwelling Supplement is declared on the same LBTT return, and the supplement is paid with the rest of the tax. If the old main home is sold later, the repayment is claimed by amending the return within ${l.amend_months} months of the filing date or, after that, by an overpayment claim within ${l.overpayment_claim_years} years (${h.a('ads-repayment', 'ADS repayment')}). In Wales, a refund of the higher rates is claimed by amending the return within ${w.amend_months} months of the filing date, or by a claim within ${w.refund_claim_years} years starting the day after it (${h.a('ltt-higher-rates-refund', 'LTT higher rates refund')}).</p>
<h2>Correcting and reclaiming in England</h2>
<p>An SDLT return can be amended within ${s.amend_months} months of the filing date. That covers the common errors: a relief forgotten, a situation ticked wrongly, a price that changed at the last moment. Two refunds follow longer timetables. The higher rates paid on a new main home bought before the old one sold are reclaimed within ${s.refund_claim_months} months of the sale or of the filing date, whichever is later, provided the old home sells within ${s.replace_main_residence_years} years (${h.a('stamp-duty-surcharge-refund', 'surcharge refund calculator')}). The ${h.pct(s.non_resident_surcharge)} non-resident surcharge is reclaimed by amending the return within ${s.non_resident_refund_years} years of the day after completion.</p>
<h2>Transfers that need no return</h2>
<p>Some transfers of property are exempt and need no SDLT return at all: a gift with no money paid and no debt taken on, property left in a will, a transfer between spouses or civil partners on divorce or dissolution, and the purchase of a freehold for less than ${h.gbp(s.higher_rates_min_price)}. The exemption depends on the absence of consideration. Where a transfer of equity includes taking over a share of a mortgage, the share counts as price and the ordinary rules apply (${h.a('transfer-of-equity-stamp-duty', 'transfer of equity')}). The ${h.a('stamp-duty-exemptions', 'exemptions page')} lists each case.</p>`;
  },
});
