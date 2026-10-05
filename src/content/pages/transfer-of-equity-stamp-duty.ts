import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t } from '../../lib/kit';
import { transferConsideration } from '../../lib/engine/tax';

const S = P.sdlt;
/** Two worked cases: a partner added to the title, and a buy-out between unmarried co-owners. */
const MORT = 300000;
const added = transferConsideration(0, MORT, 0.5);
const BUY_CASH = 60000, BUY_MORT = 200000;
const buyout = transferConsideration(BUY_CASH, BUY_MORT, 0.5);

export default definePage({
  id: 'transfer-of-equity-stamp-duty',
  group: 'situations',
  order: 60,
  slug: 'transfer-of-equity-stamp-duty',
  nav: 'Transfer of equity',
  card: 'Adding a partner to the deeds or buying one out: the mortgage share taken on counts as price.',
  title: 'Transfer of Equity Stamp Duty 2026: Mortgage Share and Cash',
  description: `Transfer of equity stamp duty in 2026: half of a ${gbp(MORT)} mortgage taken on is ${gbp(added)} of price, ${gbp(t('england', added))} of SDLT. Gifts and divorce transfers pay nothing.`,
  h1: 'Stamp duty on a transfer of equity',
  intro: 'When a share of a home changes hands between owners, the tax looks at the money paid and at the debt that moves with the share.',
  resume: `A transfer of equity is taxed on its chargeable consideration: the cash paid to the other owner plus the share of any mortgage the new owner takes on. Adding a partner to the title of a house with a ${gbp(MORT)} mortgage, where they become liable for half of it, is a purchase for ${gbp(added)}, which costs ${gbp(t('england', added))} of SDLT in England, ${gbp(t('scotland', added))} in Scotland and ${gbp(t('wales', added))} in Wales. Buying out a former partner for ${gbp(BUY_CASH)} and taking over their half of a ${gbp(BUY_MORT)} mortgage means a consideration of ${gbp(buyout)}, or ${gbp(t('england', buyout))} of SDLT. Nothing is due, and no return is needed, when a share is given with no money and no mortgage taken on, or when the transfer is made under a divorce or dissolution settlement. If the person receiving the share owns another home, the surcharge can apply, except between spouses and civil partners.`,
  faqs: [
    { q: 'My girlfriend is moving in and going on the mortgage. Does she pay stamp duty on her half?', a: `Only if the share of the mortgage she takes on, plus any cash she pays you, exceeds the nil band. Half of a ${gbp(MORT)} mortgage is ${gbp(added)}, which gives ${gbp(t('england', added))} of SDLT in England. If she still owns a flat of her own, the higher rates apply instead: ${gbp(t('england', added, 'additional'))}. Married couples and civil partners are spared that surcharge on transfers between them.` },
    { q: 'My dad is gifting me half his house, which has no mortgage. Is there stamp duty?', a: `No. A gift with no consideration is exempt from SDLT, and no return has to be filed. The exemption is lost as soon as you pay something or take over part of a loan secured on the house: the debt you assume becomes the price. A gift of half a ${gbp(500000)} house that carries no loan therefore costs nothing in SDLT, while taking on half of a ${gbp(MORT)} loan would create a price of ${gbp(added)}.` },
    { q: 'We are divorcing and I am taking the house and the whole mortgage. Do I pay SDLT?', a: `No. A transfer between spouses or civil partners made under a divorce or dissolution settlement is exempt, whatever the size of the mortgage you take on, and no return is required. Between unmarried partners who split up there is no such exemption, so the buy-out is taxed on the cash plus the mortgage share taken on.` },
  ],
  tool: 'transfer',
  related: ['stamp-duty-joint-purchase', 'stamp-duty-exemptions', 'shared-ownership-stamp-duty', 'stamp-duty-second-home', 'how-stamp-duty-is-calculated'],
  sources: ['govSdltTransfers', 'govSdltReliefs', 'govSdltHigher', 'fa2003s55'],
  body: (h) => {
    const cases: Array<[string, number]> = [
      ['Partner added, takes on half of a ' + h.gbp(MORT) + ' mortgage', added],
      [`Buy-out: ${h.gbp(BUY_CASH)} cash and half of a ${h.gbp(BUY_MORT)} mortgage`, buyout],
      [`Parent adds a child, no cash, half of a ${h.gbp(100000)} mortgage`, transferConsideration(0, 100000, 0.5)],
      ['Gift of half a house with no mortgage', 0],
    ];
    const rows = cases.map(([l, c]) => [l, h.gbp(c), h.gbp(h.t('england', c)), h.gbp(h.t('scotland', c)), h.gbp(h.t('wales', c))]);
    return `
<h2>What counts as the price</h2>
<p>There is no purchase price on a transfer of equity, so the tax builds one from what the new owner gives up or takes over. Cash paid to the person leaving or reducing their share counts in full. A mortgage counts in proportion to the share of it that the new owner becomes liable for: joining a joint mortgage for half of the debt means half of the outstanding balance. The value of the property is irrelevant; a half share of a ${h.gbp(600000)} house transferred with no cash and no debt has a consideration of nothing.</p>
${h.table(['Case', 'Consideration', 'England & NI', 'Scotland', 'Wales'], rows, 'Tax on common transfers of equity, one-home rates', ['l', 'r', 'r', 'r', 'r'])}
<p>When the debt taken on is a fraction of the value of the house, the consideration can stay inside the nil band: ${h.gbp(h.P.sdlt.residential[0][0] as number)} in England, ${h.gbp(h.P.lbtt.residential[0][0] as number)} in Scotland, ${h.gbp(h.P.ltt.main[0][0] as number)} in Wales.</p>
<h2>When the surcharge applies</h2>
<p>A transfer is a purchase of a share of a dwelling, so the person receiving it is tested like any other buyer. If they own another home that they keep, the ${h.a('stamp-duty-second-home', 'higher rates')} apply to the consideration: ${h.gbp(h.t('england', added, 'additional'))} instead of ${h.gbp(h.t('england', added))} in the first case of the table. Transfers between spouses or civil partners are kept out of the surcharge, so a wife added to her husband’s house pays at most the ordinary rates on her share of the mortgage.</p>
<h2>Exempt transfers</h2>
<p>Two situations are exempt and need no return at all: a genuine gift, where the new owner pays nothing and takes on no debt, and a transfer between spouses or civil partners under a divorce or dissolution arrangement. Both are listed by HMRC among the ${h.src('govSdltTransfers', 'land and property transfers')} that carry no SDLT. The ${h.a('stamp-duty-exemptions', 'exemptions guide')} covers the full list.</p>
<h2>Filing the return</h2>
<p>When tax is due on a transfer, the return and the payment follow the deadlines of an ordinary purchase: ${h.P.sdlt.return_days} days after the effective date for SDLT and ${h.P.lbtt.return_days} days for LBTT and LTT. Late filing of an SDLT return brings a fixed penalty of ${h.gbp(h.P.sdlt.penalty_fixed_first)}, rising to ${h.gbp(h.P.sdlt.penalty_fixed_after_3_months)} for a longer delay, plus interest on any tax paid late. A transfer is a land transaction like any other in this respect, even between members of the same family.</p>`;
  },
});
