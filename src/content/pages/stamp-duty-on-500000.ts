import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, compute } from '../../lib/kit';

const PRICE = 500000;
const S = P.sdlt, L = P.lbtt, W = P.ltt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const eFtb = t('england', PRICE, 'first'), overFtb = t('england', PRICE + 1, 'first');
const co = (p: number, extra: { companyRelief?: boolean; nonResident?: boolean } = {}) => compute({ nation: 'england', price: p, situation: 'home', company: true, ...extra }).total;

export default definePage({
  id: 'stamp-duty-on-500000',
  group: 'prices',
  order: 190,
  slug: 'stamp-duty-on-500000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `${gbp(eFtb)} for a first-time buyer at ${gbp(PRICE)}, ${gbp(overFtb)} one pound higher; companies jump to ${pct(S.corporate_flat_rate)}.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: The One-Pound Cliff`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eFtb)} for a first-time buyer, ${gbp(overFtb)} one pound above, ${gbp(eng)} for other buyers, and ${gbp(co(PRICE + 1))} for a company one pound over.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `Two English rules switch on at the same pound: the end of first-time buyer relief and the ${pct(S.corporate_flat_rate)} rate for companies.`,
  resume: `At exactly ${gbp(PRICE)}, a first-time buyer in England or Northern Ireland pays ${gbp(eFtb)} of Stamp Duty Land Tax, the figure HMRC itself gives as an example: nothing up to ${gbp(top(S.first_time_buyer, 0))} and ${pct(S.first_time_buyer[1][1])} on the next ${gbp(PRICE - top(S.first_time_buyer, 0))}. One pound more and the relief is withdrawn entirely, so a ${gbp(PRICE + 1)} purchase costs ${gbp(overFtb)}, the same as for any buyer of an only home. A buyer who has owned before pays ${gbp(eng)} at ${gbp(PRICE)}. The same pound decides the treatment of companies buying a dwelling: up to ${gbp(S.corporate_flat_threshold)} they pay the higher rates, ${gbp(co(PRICE))} here; above it, a flat ${pct(S.corporate_flat_rate)} of the whole price applies unless a relief such as a property rental business is claimed, which turns ${gbp(PRICE + 1)} into ${gbp(co(PRICE + 1))}. Scotland and Wales have no cliff at this price: ${gbp(sco)} of LBTT and ${gbp(wal)} of Land Transaction Tax, rising smoothly above it.`,
  faqs: [
    { q: `Our first flat is on the market at ${gbp(PRICE + 5000)}. Is it worth negotiating down to ${gbp(PRICE)}?`, a: `In tax terms, by a wide margin. At ${gbp(PRICE + 5000)} the relief is lost and you would pay ${gbp(t('england', PRICE + 5000, 'first'))}; at ${gbp(PRICE)} the relief applies and the bill is ${gbp(eFtb)}. The ${gbp(5000)} off the price saves ${gbp(t('england', PRICE + 5000, 'first') - eFtb)} of tax as well. The relief also requires that every buyer has never owned a home anywhere and that you live in the flat.` },
    { q: `My company is buying a ${gbp(PRICE + 25000)} flat to let out. Does it pay ${pct(S.corporate_flat_rate)}?`, a: `Not if it is a property rental business: letting is one of the reliefs from the ${pct(S.corporate_flat_rate)} rate, and the company then pays the higher rates, ${gbp(co(PRICE + 25000, { companyRelief: true }))} here. Without a relief the bill would be ${gbp(co(PRICE + 25000))}. Above ${gbp(S.corporate_flat_threshold)} the flat rate applies to the whole price, not to a slice, which is why the gap is so wide. The company may also fall within the Annual Tax on Enveloped Dwellings.` },
    { q: `Is a ${gbp(PRICE)} home in Wales cheaper for first-time buyers than in England?`, a: `No. Wales has no first-time buyer relief, so a ${gbp(PRICE)} first home costs ${gbp(wal)} of Land Transaction Tax there, against ${gbp(eFtb)} in England. Above ${gbp(PRICE)} the English relief disappears and the comparison flips for a moment: at ${gbp(PRICE + 10000)}, ${gbp(t('england', PRICE + 10000, 'first'))} in England against ${gbp(t('wales', PRICE + 10000))} in Wales. Below the limit, Wales never charges a first-time buyer less than England does.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-450000', 'stamp-duty-on-600000', 'stamp-duty-first-time-buyer', 'stamp-duty-company-purchase', 'buy-to-let-stamp-duty', 'ltt-first-time-buyers'],
  sources: ['govSdltRates', 'sdltmFtb', 'govSdltCorporate', 'rsResidential', 'wraGuide'],
  body: (h) => {
    const near = [PRICE - 10000, PRICE, PRICE + 1, PRICE + 10000, PRICE + 50000];
    const ftbRows = near.map((p) => [h.gbp(p), h.gbp(h.t('england', p, 'first')), h.gbp(h.t('scotland', p, 'first')), h.gbp(h.t('wales', p, 'first'))]);
    const coRows = [PRICE, PRICE + 1, PRICE + 100000].map((p) => [h.gbp(p), h.gbp(co(p)), h.gbp(co(p, { companyRelief: true })), h.gbp(co(p, { nonResident: true }))]);
    return `
<h2>One pound over: the first-time buyer cliff</h2>
<p>Most of the SDLT system works in slices, so a slightly higher price only adds tax on the extra amount. First-time buyer relief is the exception. It is available only when the price is ${h.gbp(S.first_time_buyer_max_price)} or less; above that, the buyer is taxed as if the relief never existed, on the standard table, from the first pound (${h.src('sdltmFtb', 'HMRC, SDLTM29845')}). At ${h.gbp(PRICE)} the bill is ${h.gbp(eFtb)}; at ${h.gbp(PRICE + 1)} it is ${h.gbp(overFtb)}, a jump of ${h.gbp(overFtb - eFtb)}.</p>
<p>Neither Scotland nor Wales has a cliff of this kind. The Scottish relief has no price limit and is claimed on any purchase, while Wales gives no relief at all, so the first-time buyer columns below rise steadily through the line.</p>
${h.table(['Price', 'England & NI', 'Scotland', 'Wales'], ftbRows, 'First-time buyer around the English price limit', ['l', 'r', 'r', 'r'])}
<p>The cliff was higher before 1 April 2025, when the limit was ${h.gbp(S.previous.first_time_buyer_max_price)}; the ${h.a('stamp-duty-on-600000', 'page on £600,000')} looks at buyers caught between the two limits.</p>
<h2>Companies meet the ${h.pct(S.corporate_flat_rate)} rate at the same pound</h2>
<p>A company buying a residential property for more than ${h.gbp(S.corporate_flat_threshold)} pays ${h.pct(S.corporate_flat_rate)} of the entire price (${h.src('govSdltCorporate', 'HMRC guidance')}). There are no slices: the rate applies from the first pound. At or below the threshold, the company pays the higher rates for additional dwellings instead, because a company is charged them even on its first property.</p>
<p>The flat rate is avoided where a relief applies: a property rental business, property developers and traders, homes open to the public, homes for employees and farmhouses among them. The company then pays the higher rates. A non-resident company adds the ${h.pct(S.non_resident_surcharge)} surcharge in either case. A company holding a dwelling may also have to file for the Annual Tax on Enveloped Dwellings, a separate tax.</p>
${h.table(['Price', `${h.pct(S.corporate_flat_rate)} rate, no relief`, 'With a relief (higher rates)', 'Non-resident company, no relief'], coRows, 'Company buying a dwelling in England', ['l', 'r', 'r', 'r'])}
<p>The ${h.a('stamp-duty-company-purchase', 'company purchase guide')} lists the reliefs and the conditions that keep them.</p>
<h2>Landlords and movers in the three nations</h2>
<p>For an individual, nothing special happens at this price. A buyer moving home pays ${h.gbp(eng)} in England, ${h.gbp(sco)} of LBTT in Scotland and ${h.gbp(wal)} in Wales. An individual landlord adding a ${h.gbp(PRICE)} property to a portfolio pays ${h.gbp(h.t('england', PRICE, 'additional'))} in England, ${h.gbp(h.t('wales', PRICE, 'additional'))} at the Welsh higher rates and ${h.gbp(h.t('scotland', PRICE, 'additional'))} in Scotland, where the supplement alone is ${h.gbp(PRICE * L.ads_rate)}. In both devolved nations a company pays those same surcharged figures; neither has a flat corporate rate.</p>`;
  },
});
