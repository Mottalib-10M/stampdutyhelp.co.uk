import { definePage } from '../../lib/page-types';
import { P, gbp, compute } from '../../lib/kit';
import { refundWindowEnd, addDays } from '../../lib/engine/tax';

const W = P.ltt;
const YEARS = W.replace_main_residence_years;
const back = (p: number) => compute({ nation: 'wales', price: p, situation: 'additional' }).refundable;

export default definePage({
  id: 'ltt-higher-rates-refund',
  group: 'wales',
  order: 40,
  slug: 'ltt-higher-rates-refund',
  nav: 'LTT higher rates refund',
  card: `Sold your old home within ${YEARS} years of buying the new one? The gap between the higher and main rates comes back.`,
  title: `LTT Higher Rates Refund 2026: Old Home Sold Within ${YEARS} Years`,
  description: `LTT higher rates refund 2026: sell your former main home within ${YEARS} years and reclaim the gap, ${gbp(back(350000))} on a ${gbp(350000)} home. Time limits, evidence, WRA processing.`,
  h1: 'Claiming back the LTT higher rates',
  intro: 'Buying before selling puts a Welsh purchase on the higher table. Selling in time takes it back to the main one.',
  resume: `A buyer in Wales who completes on a new main home before selling the old one pays Land Transaction Tax at the higher rates, and can claim a refund once the former main residence is sold within ${YEARS} years of the purchase. The refund is the difference between the two tables, not a fixed percentage: ${gbp(back(350000))} on a ${gbp(350000)} home, which paid ${gbp(compute({ nation: 'wales', price: 350000, situation: 'additional' }).total)} instead of ${gbp(compute({ nation: 'wales', price: 350000, situation: 'home' }).total)}, and ${gbp(back(200000))} on ${gbp(200000)}, where the main rates charge nothing. The claim is made by amending the LTT return within ${W.amend_months} months of its filing date or, after that, by a refund claim within ${W.refund_claim_years} years starting the day after the filing date. The Welsh Revenue Authority asks for evidence of the sale, such as the TR1 or TP1 transfer deed or the contract, and says it processes claims in ${W.refund_processing_working_days} working days. A buyer whose old home sells before the purchase never pays the higher rates.`,
  faqs: [
    { q: 'We sold our old house in Barry four years after buying in Penarth. Can we still get the LTT refund?', a: `No. The former main residence has to be sold within ${YEARS} years of the effective date of the new purchase, and four years is outside that window. The higher rates paid then stay due, ${gbp(back(380000))} more than the main rates on a ${gbp(380000)} house. The ${W.refund_claim_years}-year claim period does not help, because it only gives time to claim a refund that already exists.` },
    { q: 'Does the WRA refund the higher rates automatically when Land Registry records my sale?', a: `No. The Welsh Revenue Authority only refunds on a claim, either an amended return or a refund request, with evidence that the old home was sold. Your conveyancer can make it, or you can claim yourself online. Expect the money in ${W.refund_processing_working_days} working days once the claim is complete; missing documents are the usual cause of delay.` },
    { q: 'Our old flat was let for the last two years before we sold it. Does its sale still give an LTT refund?', a: `Only if the flat was your main residence at some point in the ${YEARS} years before you bought the new home, and the new home is now your main residence. A flat that was only ever let is not a former main residence, and selling it does not move the purchase back to the main rates. A solicitor can check the dates against the guidance before you claim ${gbp(back(300000))}.` },
    { q: 'Our old house in Newport sold the week before we completed in Cardiff. Is there a refund to claim?', a: `No, because there is nothing to refund. When the former main residence is sold before the new purchase, within the ${YEARS} years before it, the purchase is a replacement from the start and the return is made at the main rates: ${gbp(compute({ nation: 'wales', price: 330000, situation: 'home' }).total)} on a ${gbp(330000)} house. Check that your conveyancer did not file at the higher rates by mistake.` },
  ],
  mini: 'lttRefund',
  miniHref: 'ltt-calculator',
  related: ['ltt-higher-rates', 'ltt-calculator', 'stamp-duty-surcharge-refund', 'ads-repayment', 'stamp-duty-moving-home', 'ltt-rates'],
  sources: ['wraRefund', 'wraHigher', 'wraHigherTech', 'lttAct'],
  body: (h) => {
    const w = h.P.ltt;
    const rows = [190000, 225000, 280000, 350000, 480000, 750000].map((p) => {
      const r = h.tax({ nation: 'wales', price: p, situation: 'additional' });
      return [h.gbp(p), h.gbp(r.total), h.gbp(r.mainTax), h.gbp(r.refundable)];
    });
    const done = '2026-03-20';
    const filed = addDays(done, 21);
    return `
<h2>Why a mover ends up on the higher table</h2>
<p>The Welsh test is taken at the end of the day of completion. A buyer who completes on a new home in the morning, while the old one is still on the market, owns two dwellings that evening. The return therefore has to be made at the higher rates, and the tax paid on that basis within ${w.return_days} days. The rules recognise that this buyer is moving, not investing, and provide two ways out.</p>
<ul>
<li><strong>Sale first.</strong> If the previous main residence was sold within the ${w.replace_main_residence_years} years before the new purchase, the purchase is a replacement and the main rates apply from the start. Nothing to claim later.</li>
<li><strong>Purchase first.</strong> If the previous main residence is still owned at completion, the higher rates are paid, and a refund is claimed when the old home is sold within ${w.replace_main_residence_years} years after the purchase.</li>
</ul>
<h2>The refund is the gap between two tables</h2>
<p>England refunds a surcharge, and Scotland refunds a supplement of a fixed percentage. Wales refunds the difference between two different band tables, so the amount does not grow in a straight line with the price.</p>
${h.table(['Price of the new home', 'Paid at higher rates', 'Due at main rates', 'Refund'], rows, 'LTT higher rates refund at different prices, 2026 tables', ['l', 'r', 'r', 'r'])}
<p>Below ${h.gbp(top0(w))}, the main rates charge nothing, so the whole higher-rates bill comes back: ${h.gbp(back(190000))} on ${h.gbp(190000)}. Above it, part of the bill was due anyway, and the refund settles at a level set by the gap between the two tables at that price.</p>
<h2>The conditions</h2>
<p>Three facts are checked. The home sold must have been the buyer’s only or main residence at some point in the ${w.replace_main_residence_years} years before the new purchase. The new home must be bought to replace it, which means the buyer now lives there as their main residence. And the disposal of the old home must happen within ${w.replace_main_residence_years} years of the effective date of the new purchase, which is normally the date of completion.</p>
<p>The refund only follows the sale of a former main residence. Selling a flat that was let throughout, while keeping the old family home, gives nothing back. A parent who went on the title of a child’s first home while keeping their own house has not replaced anything either, so the higher rates on that joint purchase stay due whatever is sold later.</p>
<h2>When the sale is slow</h2>
<p>A ${w.replace_main_residence_years}-year window sounds generous, but a home that will not sell is exactly what puts a buyer in this position, and the same market can keep it unsold for a long time. Two choices are worth weighing early. Reducing the asking price on the old home costs money once; missing the window costs the whole refund, ${h.gbp(back(420000))} on a ${h.gbp(420000)} purchase. And letting the old home while waiting for the market does not, by itself, end its status as a former main residence: what matters is that it was your main home in the ${w.replace_main_residence_years} years before the new purchase and that it is sold within ${w.replace_main_residence_years} years after. Keep the tenancy agreement and the dates you moved out with the rest of the evidence, because they show when the home stopped being lived in and why.</p>
<h2>Two time limits, one after the other</h2>
<p>The Welsh Revenue Authority offers two routes, depending on how long ago the return was filed.</p>
<ol>
<li><strong>Amend the return</strong> within ${w.amend_months} months of the filing date. The amended return shows the main-rate figure, and the difference is repaid.</li>
<li><strong>Claim a refund</strong> after that, within ${w.refund_claim_years} years starting the day after the filing date. This is the route for a sale that takes more than a year.</li>
</ol>
<p>On a calendar: a buyer who completes in Llandaff on ${h.date(done)} and files on ${h.date(filed)} must sell the old home by ${h.date(refundWindowEnd(done, 'wales'))}. A sale before ${h.date(addMonths(filed, w.amend_months))} can go through an amended return. A later sale is claimed on the refund form, with plenty of time, since the claim period runs until ${h.date(addMonths(addDays(filed, 1), w.refund_claim_years * 12))}. The binding constraint is the ${w.replace_main_residence_years}-year sale deadline, not the claim period.</p>
<h2>The evidence to send</h2>
<p>The authority asks for proof that the former main residence has been disposed of. The usual documents are the transfer deed registered at HM Land Registry, a TR1 for the whole of a registered title or a TP1 for part of one, or the contract for the sale where the deed is not available. It also asks for the details of the new purchase, so that the claim can be matched to the original return. Keep proof that the old home was your main residence, such as council tax and utility bills in your name at that address, in case the authority asks.</p>
<p>The authority states that it processes refund claims in ${w.refund_processing_working_days} working days once it has what it needs. A claim made with the transfer deed attached is the fastest. The ${h.src('wraRefund', 'Welsh Revenue Authority refund page')} has the online form and the latest guidance.</p>
<h2>Wales, Scotland and England side by side</h2>
<p>The three nations agree on the idea and differ on everything else. Scotland gives ${h.P.lbtt.replace_main_residence_months} months to sell and repays the ${h.a('ads-repayment', 'Additional Dwelling Supplement')} in full. England gives ${h.P.sdlt.replace_main_residence_years} years and refunds the ${h.pct(h.P.sdlt.higher_rates_surcharge)} surcharge on each band, with a claim due within ${h.P.sdlt.refund_claim_months} months of the sale or of the filing date, whichever is later; the ${h.a('stamp-duty-surcharge-refund', 'surcharge refund calculator')} works it out. On a ${h.gbp(350000)} home the three refunds are ${h.gbp(back(350000))} in Wales, ${h.gbp(h.tax({ nation: 'scotland', price: 350000, situation: 'additional' }).refundable)} in Scotland and ${h.gbp(h.tax({ nation: 'england', price: 350000, situation: 'additional' }).refundable)} in England.</p>`;
  },
});

function top0(w: typeof P.ltt) { return w.main[0][0] as number; }
function addMonths(iso: string, months: number) {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}
