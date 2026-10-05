import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t } from '../../lib/kit';

const S = P.sdlt;
/** SDLT: a freehold bought for less than this needs no tax and no return (params: sdlt.freehold_no_return_below). */
const FREEHOLD_EXEMPT = S.freehold_no_return_below;
const DEBT = 180000;

export default definePage({
  id: 'stamp-duty-exemptions',
  group: 'situations',
  order: 80,
  slug: 'stamp-duty-exemptions',
  nav: 'Exemptions and reliefs',
  card: 'Gifts, wills, divorce, cheap freeholds: the transfers that carry no stamp duty, and the reliefs you must claim.',
  title: 'Stamp Duty Exemptions 2026: Gifts, Wills, Divorce, Reliefs',
  description: `Stamp duty exemptions in 2026: gifts, wills, divorce transfers and freeholds under ${gbp(FREEHOLD_EXEMPT)} pay nothing; a gift with a ${gbp(DEBT)} mortgage still costs ${gbp(t('england', DEBT))}.`,
  h1: 'Stamp duty exemptions and reliefs',
  intro: 'Some transfers are outside the tax altogether and need no return; others are taxable but reduced by a relief that has to be claimed.',
  resume: `Four kinds of transfer carry no Stamp Duty Land Tax and need no return to HMRC: a gift for which nothing is paid and no debt is taken on, property left to you in a will, a transfer between spouses or civil partners on divorce or dissolution, and the purchase of a freehold for less than ${gbp(FREEHOLD_EXEMPT)}. The exemption depends on the absence of consideration, so a “gift” that comes with a mortgage is not exempt: taking over ${gbp(DEBT)} of debt is taxed like a ${gbp(DEBT)} purchase, ${gbp(t('england', DEBT))} in England. Reliefs are different. First-time buyer relief, the reliefs that keep a company out of the ${pct(S.corporate_flat_rate)} rate and the treatment of six or more dwellings as non-residential all reduce a tax that is otherwise due, and they only apply if the conveyancer claims them on the return within ${S.return_days} days. Scotland and Wales tax the consideration in the same way and keep their own lists of exemptions and reliefs.`,
  faqs: [
    { q: 'Is a gift of a house to my son free of stamp duty?', a: `Yes, if he pays nothing and takes on no mortgage. A transfer with no chargeable consideration is exempt from SDLT and needs no return. If the house is mortgaged and he becomes liable for the loan, the debt he takes over is the price: ${gbp(DEBT)} of mortgage gives ${gbp(t('england', DEBT))} in England, or ${gbp(t('england', DEBT, 'additional'))} if he keeps another home.` },
    { q: `Do I need to file an SDLT return for a garage bought for ${gbp(15000)}?`, a: `Not if you buy the freehold. HMRC exempts a freehold purchase for less than ${gbp(FREEHOLD_EXEMPT)}, and no return has to be filed for it. The exemption is written for freeholds, so if the garage comes with a long lease rather than the freehold, ask your conveyancer to check the lease rules before you assume nothing is due.` },
    { q: 'Is a first-time buyer relief an exemption?', a: `No, it is a relief: the purchase remains taxable, a return must be filed within ${S.return_days} days of completion, and the relief is claimed on that return. If the conveyancer forgets to claim it, the full tax is charged until the return is amended, which is possible within ${S.amend_months} months of the filing date. An exempt transfer, such as an outright gift, needs no return at all.` },
    { q: 'We are separating but not married. Is the transfer of the house to me exempt?', a: `No. The exemption covers spouses and civil partners transferring property under a divorce or dissolution settlement. Unmarried partners who split up are taxed on the consideration, which is the cash paid plus the share of the mortgage taken on. Buying out a partner’s half of a ${gbp(300000)} mortgage with no cash is a ${gbp(150000)} purchase: ${gbp(t('england', 150000))} in England.` },
  ],
  mini: 'giftWithDebt',
  related: ['transfer-of-equity-stamp-duty', 'inherited-property-stamp-duty', 'stamp-duty-first-time-buyer', 'stamp-duty-company-purchase', 'commercial-property-stamp-duty', 'stamp-duty-return-and-payment'],
  sources: ['govSdltReliefs', 'govSdltTransfers', 'govSdltCorporate', 'sdltmFtb', 'rsResidential', 'wraGuide'],
  body: (h) => {
    const ex = h.table(['Transaction', 'SDLT due', 'Return needed'], [
      ['Gift with no money paid and no debt taken on', h.gbp(0), 'No'],
      ['Property received under a will', h.gbp(0), 'No'],
      ['Transfer between spouses or civil partners on divorce or dissolution', h.gbp(0), 'No'],
      [`Freehold bought for less than ${h.gbp(FREEHOLD_EXEMPT)}`, h.gbp(0), 'No'],
      [`Gift of a house with ${h.gbp(DEBT)} of mortgage taken over`, h.gbp(h.t('england', DEBT)), 'Yes'],
    ], 'Exempt and non-exempt transfers in England and Northern Ireland', ['l', 'r', 'l']);
    const rel = h.table(['Relief', 'Who claims it', 'Effect at an example price'], [
      ['First-time buyer relief', 'Every buyer a first-time buyer, living there', `${h.gbp(400000)}: ${h.gbp(h.t('england', 400000, 'first'))} instead of ${h.gbp(h.t('england', 400000))}`],
      [`Relief from the ${h.pct(S.corporate_flat_rate)} company rate`, 'Rental business, developer, trader and other listed activities', `${h.gbp(800000)}: ${h.gbp(h.t('england', 800000, 'additional', { company: true, companyRelief: true }))} instead of ${h.gbp(h.t('england', 800000, 'additional', { company: true }))}`],
      ['Six or more dwellings in one transaction', 'Any buyer', `${h.gbp(1200000)}: ${h.gbp(h.t('england', 1200000, 'home', { kind: 'nonresidential' }))} on the non-residential table`],
    ], 'Reliefs claimed on the SDLT return', ['l', 'l', 'l']);
    return `
<h2>Exempt: no tax and no return</h2>
<p>An exemption takes a transaction outside SDLT entirely. Nothing is paid, and HMRC does not expect a return. The common thread is the absence of chargeable consideration: no money, no debt assumed, nothing given in exchange. HMRC’s ${h.src('govSdltTransfers', 'guidance on land and property transfers')} and its ${h.src('govSdltReliefs', 'list of reliefs and exemptions')} set out the cases below.</p>
${ex}
<h3>Gifts</h3>
<p>A parent who signs a flat over to a child, with nothing paid and no loan attached, makes an exempt transfer. The value of the flat does not matter. What breaks the exemption is consideration in any form, and the most common one is a mortgage. If the child becomes responsible for the loan, the amount taken over is treated as the price, and the transfer becomes an ordinary purchase at that figure, with the surcharge if the child keeps another home. The mini-simulator above shows the bill for the debt you enter.</p>
<h3>Wills and inheritance</h3>
<p>Property passing to a beneficiary under a will is exempt. The executors do not file an SDLT return to transfer it to you. The inheritance can still affect your next purchase, through the higher rates or through the loss of first-time buyer status, as the ${h.a('inherited-property-stamp-duty', 'inherited property guide')} explains.</p>
<h3>Divorce and dissolution</h3>
<p>A transfer between spouses or civil partners as part of a divorce or dissolution is exempt, even when the receiving spouse takes over the whole mortgage. The exemption does not extend to unmarried couples. For them, any change of ownership is a ${h.a('transfer-of-equity-stamp-duty', 'transfer of equity')} taxed on the cash and the debt that move.</p>
<h3>Cheap freeholds</h3>
<p>Buying a freehold for less than ${h.gbp(FREEHOLD_EXEMPT)} needs no tax and no return. That can cover a garage, a strip of garden or a parking space bought freehold at a modest price. Above the figure, the ordinary bands apply, and a cheap purchase may still carry no tax because it falls inside the nil band, with the return then left to your conveyancer to assess.</p>
<h2>Family transfers that are not exempt</h2>
<p>Being related to the other party is not an exemption in itself. Three situations catch families out. A parent who adds an adult child to the title of a mortgaged house, with the child becoming jointly liable for the loan, makes a taxable transfer: half of a ${h.gbp(240000)} mortgage is a ${h.gbp(120000)} consideration, inside the nil band of all three nations, though a larger loan would not be. A sale to a relative at a reduced price is taxed on the consideration, which is normally the price in the contract: selling a ${h.gbp(350000)} house to a daughter for ${h.gbp(200000)} costs her ${h.gbp(h.t('england', 200000))} as a first home at standard rates, or ${h.gbp(h.t('england', 200000, 'first'))} if she qualifies as a first-time buyer. And a gift between partners who are not married is exempt only while no debt passes; once it does, there is no divorce exemption to fall back on.</p>
<h2>Checking an exemption before completion</h2>
<ol>
<li>List everything the recipient gives: cash, a promise to pay, a share of a loan, works carried out. Any of these is consideration.</li>
<li>Check who the parties are. The divorce and dissolution exemption needs spouses or civil partners and a settlement or order.</li>
<li>For a freehold bought cheaply, confirm that the price is genuinely below ${h.gbp(FREEHOLD_EXEMPT)}, with nothing else paid on the side for the same land.</li>
<li>Keep the documents. An exempt transfer has no return, so the deed and the settlement are your evidence if the position is ever questioned.</li>
</ol>
<h2>Leases and the rent</h2>
<p>A new residential lease is taxed on two elements: any premium paid for it, under the ordinary bands, and the rent, at ${h.pct(S.lease_npv_residential_rate)} of the net present value of the rent above ${h.gbp(S.lease_npv_residential_threshold)}. A lease whose rent has a net present value below that threshold therefore pays nothing on the rent. The net present value is computed by your conveyancer from the rent and the term of the lease; this site does not compute it.</p>
<h2>Reliefs: taxable, but reduced on a claim</h2>
<p>A relief leaves the transaction inside the tax. The return is filed in the usual way and the relief is claimed on it, with the reduced tax paid within ${S.return_days} days. A relief that is not claimed is not given, though a return can be amended within ${S.amend_months} months of its filing date.</p>
${rel}
<p>First-time buyer relief is the most widely used, and its conditions are strict: every buyer must never have owned a home anywhere in the world, and must intend to live in the property (${h.a('stamp-duty-first-time-buyer', 'first-time buyer guide')}). The company reliefs keep a business that lets, develops or trades in property out of the flat ${h.pct(S.corporate_flat_rate)} rate and on the higher rates instead (${h.a('stamp-duty-company-purchase', 'company purchases')}). Since multiple dwellings relief was abolished on 1 June 2024, buyers of six or more dwellings in a single transaction can be taxed on the ${h.a('commercial-property-stamp-duty', 'non-residential table')}.</p>
<p>Some features of the rules look like reliefs but are not. The ordinary rates for a buyer replacing a main residence are simply the absence of the surcharge, and the refund for a late sale is a repayment of tax already paid. Neither is claimed as a relief on the original return.</p>
<h2>Scotland and Wales</h2>
<p>Land and Buildings Transaction Tax and Land Transaction Tax are both charged on the chargeable consideration, so a transfer for which nothing is paid and no debt is assumed produces no tax under either. Each nation has its own statutory list of exemptions and reliefs and its own rules on returns, which this site has not verified one by one. The points we have verified are these: Scotland’s first-time buyer relief raises the nil band to ${h.gbp(h.P.lbtt.first_time_buyer_nil_band)}, worth up to ${h.gbp(h.P.lbtt.first_time_buyer_max_saving)}; Wales has no first-time buyer relief, keeps a relief for multiple dwellings, and taxes companies at its higher rates. For anything else, check ${h.src('rsResidential', 'Revenue Scotland')} or the ${h.src('wraGuide', 'Welsh Revenue Authority')} before relying on an exemption.</p>`;
  },
});
