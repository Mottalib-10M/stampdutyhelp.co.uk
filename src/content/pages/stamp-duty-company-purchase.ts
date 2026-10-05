import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, compute } from '../../lib/kit';

const S = P.sdlt, L = P.lbtt;
const FLAT = S.corporate_flat_rate, THR = S.corporate_flat_threshold;
const EX = 750000;
const co = (p: number, relief = false, nonResident = false) => t('england', p, 'home', { company: true, companyRelief: relief, nonResident });

export default definePage({
  id: 'stamp-duty-company-purchase',
  group: 'england',
  order: 50,
  slug: 'stamp-duty-company-purchase',
  nav: 'Companies buying homes',
  card: `${pct(FLAT)} of the whole price above ${gbp(THR)} unless a relief applies, higher rates otherwise, and ADS or LTT higher rates outside England.`,
  title: `Stamp Duty for Limited Company Purchases 2026: ${pct(FLAT)} Rule`,
  description: `Stamp duty when a company buys a home in 2026: ${pct(FLAT)} of the whole price above ${gbp(THR)} without a relief, so ${gbp(EX)} costs ${gbp(co(EX))}. Reliefs, higher rates, ADS.`,
  h1: 'Stamp duty when a company buys a residential property',
  intro: 'A company never buys its “first home”: it starts at the higher rates and can fall into a flat rate on the whole price.',
  resume: `When a company buys a dwelling in England or Northern Ireland for more than ${gbp(THR)}, Stamp Duty Land Tax is charged at a flat ${pct(FLAT)} of the entire price, not band by band, unless the company qualifies for a relief. A ${gbp(EX)} flat bought by a company with no relief costs ${gbp(co(EX))}. The usual reliefs cover property used in a rental business, bought for development or resale, opened to the public, provided for employees or forming part of a farm. With a relief, or at ${gbp(THR)} and below, the company pays the higher rates for additional dwellings instead, ${pct(S.higher_rates_surcharge)} above the standard bands from ${gbp(S.higher_rates_min_price)}, so the same flat costs ${gbp(co(EX, true))}. A non-resident company adds ${pct(S.non_resident_surcharge)}. The flat rate was ${pct(S.previous.corporate_flat_rate_before_31_october_2024)} until 31 October 2024. In Scotland a company pays the ${pct(L.ads_rate)} Additional Dwelling Supplement on every dwelling it buys, even its first, and in Wales it pays the Land Transaction Tax higher rates. The annual tax on enveloped dwellings may also apply.`,
  faqs: [
    { q: `My limited company is buying its first buy-to-let at ${gbp(220000)}. Why does it pay the higher rates when it owns nothing else?`, a: `Because the higher rates apply to companies from the first purchase. The test about owning another home only protects individuals; a company buying a dwelling worth ${gbp(S.higher_rates_min_price)} or more pays ${pct(S.higher_rates_surcharge)} on top of every band whatever else it holds. At ${gbp(220000)} that means ${gbp(co(220000, true))}, against ${gbp(t('england', 220000))} for a person buying a sole home.` },
    { q: `Which reliefs take a company out of the ${pct(FLAT)} rate?`, a: `HMRC lists property bought for a property rental business, for development and resale by a property developer, for trading by a property trader, for opening to the public as part of a business, for occupation by employees, and farmhouses occupied by farm workers. The relief is claimed on the SDLT return, and the company then pays the higher rates instead, ${gbp(co(EX, true))} on a ${gbp(EX)} flat rather than ${gbp(co(EX))}.` },
    { q: `Is it worth keeping a company purchase at exactly ${gbp(THR)}?`, a: `For a company without a relief, the difference is large. At ${gbp(THR)} the bill is ${gbp(co(THR))} at the higher rates; one pound above, the flat ${pct(FLAT)} applies to the whole price and the bill becomes ${gbp(co(THR + 1))}. A genuine renegotiation is legitimate, but splitting the price artificially or paying separately for items that are part of the property is not.` },
    { q: 'Does a company pay the Scottish supplement on its very first flat?', a: `Yes. In Scotland, a company pays the ${pct(L.ads_rate)} Additional Dwelling Supplement on any dwelling of ${gbp(L.ads_min_price)} or more, even when it owns no other property, and it cannot reclaim it as a replacement of a main residence. On a ${gbp(200000)} flat in Glasgow, the company pays ${gbp(t('scotland', 200000, 'home', { company: true }))}, of which ${gbp(compute({ nation: 'scotland', price: 200000, situation: 'home', company: true }).surcharge)} is ADS.` },
  ],
  mini: 'companyPurchaseSdlt',
  related: ['buy-to-let-stamp-duty', 'stamp-duty-second-home', 'non-resident-stamp-duty-surcharge', 'additional-dwelling-supplement', 'ltt-higher-rates', 'stamp-duty-rates'],
  sources: ['govSdltCorporate', 'govSdltHigher', 'govSdltPrevious', 'rsAds', 'wraHigher'],
  body: (h) => {
    const s = h.P.sdlt, l = h.P.lbtt, w = h.P.ltt;
    const prices = [150000, 300000, 500000, 500001, 750000, 1500000, 3000000];
    const grid = prices.map((p) => [h.gbp(p), h.gbp(co(p)), h.gbp(co(p, true)), h.gbp(co(p, false, true)), h.gbp(h.t('england', p))]);
    const nations = [200000, 400000, 750000, 1500000].map((p) => [h.gbp(p), h.gbp(co(p, true)), h.gbp(h.t('scotland', p, 'home', { company: true })), h.gbp(h.t('wales', p, 'home', { company: true }))]);
    return `
<h2>The ${h.pct(s.corporate_flat_rate)} rate: a single rate on the full price</h2>
<p>The company rate is the one part of Stamp Duty Land Tax that ignores the slice system entirely. When a company, or another non-natural person, acquires a dwelling for more than ${h.gbp(s.corporate_flat_threshold)}, the tax is ${h.pct(s.corporate_flat_rate)} of the whole consideration. There is no nil band and no lower slice. The rate was ${h.pct(s.previous.corporate_flat_rate_before_31_october_2024)} until 30 October 2024 and rose to ${h.pct(s.corporate_flat_rate)} on 31 October 2024, when the higher rates surcharge also went up.</p>
<p>The flat rate applies only to dwellings: offices, shops and mixed-use buildings bought by a company follow the ${h.a('commercial-property-stamp-duty', 'non-residential scale')} like any other buyer.</p>
${h.table(['Price', 'Company, no relief', 'Company with a relief', 'Non-resident company, no relief', 'Individual, sole home'], grid, 'SDLT for a company buying one dwelling in England or Northern Ireland', ['l', 'r', 'r', 'r', 'r'])}
<p>The row at ${h.gbp(500001)} shows the cliff. One pound above the threshold the company without a relief moves from the higher rates to the flat rate, and its bill jumps from ${h.gbp(co(500000))} to ${h.gbp(co(500001))}. Above that point the gap with the higher rates narrows slowly as the price rises, because the higher rates themselves climb to ${h.pct(s.residential[4][1] + s.higher_rates_surcharge)} on the top slice.</p>
<h2>The reliefs that switch the flat rate off</h2>
<p>The ${h.src('govSdltCorporate', 'HMRC guidance on corporate bodies')} lists the activities that qualify for relief from the ${h.pct(s.corporate_flat_rate)} rate. In each case the company must buy the dwelling for the qualifying purpose, and the relief is claimed on the SDLT return:</p>
<ul>
<li>a property rental business letting the home to people not connected with the company;</li>
<li>a property developer buying to develop and resell, or a property trader buying to trade;</li>
<li>a dwelling opened to the public as part of a business;</li>
<li>accommodation provided to employees for use in the business;</li>
<li>farmhouses occupied by people working on the farm.</li>
</ul>
<p>Relief from the flat rate is not relief from tax. A qualifying company falls back to the higher rates for additional dwellings, because a company is never treated as replacing a main residence and can never be a first-time buyer. On a ${h.gbp(EX)} flat let on the open market, that is ${h.gbp(co(EX, true))} instead of ${h.gbp(co(EX))}. Keep evidence of the qualifying purpose, such as the letting agreement or the development plan, because HMRC can open a check after the return has been filed.</p>
${h.breakdown({ nation: 'england', price: EX, situation: 'home', company: true, companyRelief: true }, `A rental company buying a ${h.gbp(EX)} flat: higher rates band by band`)}
<h2>Companies below the threshold</h2>
<p>At ${h.gbp(s.corporate_flat_threshold)} or less the flat rate cannot apply, with or without a relief. A company buying a dwelling worth ${h.gbp(s.higher_rates_min_price)} or more then pays the higher rates from the first pound. Only below ${h.gbp(s.higher_rates_min_price)} does it pay the standard scale, which at that price means no tax. For a small landlord deciding between buying personally or through a company, this is the key comparison: a person replacing their own home, or buying a first home, avoids the surcharge; the company never does.</p>
<h2>Non-resident companies</h2>
<p>The ${h.pct(s.non_resident_surcharge)} non-resident surcharge applies to companies as well as individuals, and it stacks on every company scale: higher rates become ${h.pct(s.residential[0][1] + s.higher_rates_surcharge + s.non_resident_surcharge)} on the first slice, and the flat rate becomes ${h.pct(s.corporate_flat_rate + s.non_resident_surcharge)} of the price. The ${h.a('non-resident-stamp-duty-surcharge', 'non-resident surcharge page')} explains how residence is assessed and when the surcharge can be reclaimed.</p>
<h2>The annual tax on enveloped dwellings</h2>
<p>A company holding a high-value dwelling may also have to pay the annual tax on enveloped dwellings (ATED), a yearly charge separate from SDLT and filed with HMRC each year. Its bands, charges and reliefs are not covered on this site; check HMRC’s guidance on ATED before the purchase rather than after it, because the yearly cost belongs in the same calculation as the stamp duty.</p>
<h2>Companies in Scotland and Wales</h2>
<p>Neither devolved tax has a flat corporate rate. Instead, both treat every company purchase of a dwelling as an additional property. In Scotland, a company pays LBTT plus the ${h.pct(l.ads_rate)} Additional Dwelling Supplement on any dwelling of ${h.gbp(l.ads_min_price)} or more, including its first, and the replacement-of-main-residence refund is not available to it (${h.a('additional-dwelling-supplement', 'ADS explained')}). In Wales, a company pays the higher residential rates of Land Transaction Tax from ${h.gbp(w.higher_min_price)}, starting at ${h.pct(w.higher[0][1])} (${h.a('ltt-higher-rates', 'LTT higher rates')}).</p>
${h.table(['Price', 'England, company with relief', 'Scotland, company', 'Wales, company'], nations, 'A company buying one dwelling in each nation', ['l', 'r', 'r', 'r'])}
<p>For a rental company with a relief in England, the comparison runs on the same basis as for any landlord: higher rates in England, LBTT with ADS in Scotland, the Welsh higher scale in Wales. Without a relief, the flat rate changes the ranking. At ${h.gbp(750000)} a company with no relief pays ${h.gbp(co(750000))} in England, against ${h.gbp(h.t('scotland', 750000, 'home', { company: true }))} in Scotland and ${h.gbp(h.t('wales', 750000, 'home', { company: true }))} in Wales. At ${h.gbp(3000000)} the order shifts again, with ${h.gbp(co(3000000))} in England and ${h.gbp(h.t('scotland', 3000000, 'home', { company: true }))} in Scotland, because the Scottish supplement and the top LBTT band together overtake a single ${h.pct(s.corporate_flat_rate)} charge.</p>
<h2>Personal name or company: the stamp duty side of the choice</h2>
<p>For a landlord who already owns a home, the SDLT on a new buy-to-let is often the same either way. Bought personally, a ${h.gbp(300000)} flat is an additional dwelling and costs ${h.gbp(h.t('england', 300000, 'additional'))}. Bought by a rental company, it pays the higher rates too, and the bill is identical: ${h.gbp(co(300000, true))}. The tax only diverges in three situations. A buyer with no other home pays the standard scale personally but the higher rates through a company. A buyer replacing a main residence escapes the surcharge personally, never through a company. And above ${h.gbp(s.corporate_flat_threshold)}, a company that cannot show a qualifying business purpose meets the flat rate, which an individual never pays.</p>
<p>Income tax, corporation tax, mortgage terms and the yearly charges on company-held homes also differ between the two routes, and they recur every year while the purchase tax is paid once. The figures here only settle the stamp duty part, which your conveyancer will confirm before exchange; the ${h.a('buy-to-let-stamp-duty', 'buy-to-let page')} covers landlords buying in their own name.</p>`;
  },
});
