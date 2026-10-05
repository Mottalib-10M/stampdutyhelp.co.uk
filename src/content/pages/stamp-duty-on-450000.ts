import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { sharedOwnership } from '../../lib/engine/tax';

const PRICE = 450000;
const S = P.sdlt;
const eng = t('england', PRICE), sco = t('scotland', PRICE), wal = t('wales', PRICE);
const eFtb = t('england', PRICE, 'first');
const LON = place('london');
const lonFtb = LON.ftb as number;
const mve = sharedOwnership(PRICE, PRICE, true).marketValueElection;

export default definePage({
  id: 'stamp-duty-on-450000',
  group: 'prices',
  order: 180,
  slug: 'stamp-duty-on-450000',
  nav: `Stamp duty on ${gbp(PRICE)}`,
  card: `Near the London first-time buyer average: ${gbp(eFtb)} with relief, ${gbp(eng)} without, and shared ownership options.`,
  title: `Stamp Duty on ${gbp(PRICE)} in 2026: A London First Home`,
  description: `Stamp duty on ${gbp(PRICE)} in 2026: ${gbp(eFtb)} for an English first-time buyer, ${gbp(eng)} for others, ${gbp(mve)} on a shared ownership election, ${gbp(sco)} in Scotland.`,
  h1: `Stamp duty on a ${gbp(PRICE)} property`,
  intro: `Close to what a first-time buyer pays on average in London, and the price HMRC uses for its shared ownership example.`,
  resume: `A first-time buyer paying ${gbp(PRICE)} in England or Northern Ireland owes ${gbp(eFtb)} of Stamp Duty Land Tax: nothing on the first ${gbp(top(S.first_time_buyer, 0))}, then ${pct(S.first_time_buyer[1][1])} on ${gbp(PRICE - top(S.first_time_buyer, 0))}. A buyer who has owned before pays ${gbp(eng)}, and a buyer of an additional property ${gbp(t('england', PRICE, 'additional'))}. The price matters in London, where first-time buyers paid ${gbp(lonFtb)} on average in July 2026 according to the UK House Price Index, a purchase that costs ${gbp(t('england', lonFtb, 'first'))} with the relief. It is also the figure in HMRC’s own shared ownership example: a first-time buyer who elects to pay on the full ${gbp(PRICE)} market value pays ${gbp(mve)} once, and nothing more on later shares. Paying in stages instead taxes only the share bought, which for a share of a quarter or less comes to nothing. In Scotland the same price costs ${gbp(sco)} of LBTT and in Wales ${gbp(wal)} of Land Transaction Tax, with no relief for first-time buyers in Wales.`,
  faqs: [
    { q: `We are buying a ${gbp(PRICE)} flat in London as first-time buyers. How far are we from losing the relief?`, a: `${gbp(S.first_time_buyer_max_price - PRICE)}. The relief applies up to a price of ${gbp(S.first_time_buyer_max_price)}; at ${gbp(PRICE)} you pay ${gbp(eFtb)}. If the agreed price rose above that limit, the relief would vanish and the whole price would be taxed at standard rates: ${gbp(t('england', S.first_time_buyer_max_price + 5000))} on ${gbp(S.first_time_buyer_max_price + 5000)}. Both buyers must never have owned a home anywhere.` },
    { q: `Shared ownership at ${gbp(PRICE)} market value: should we pay stamp duty on the full value or on our share?`, a: `With the market value election you pay ${gbp(mve)} now as first-time buyers, and later shares carry no further SDLT. Paying in stages, a share costing ${gbp(PRICE * 0.4)} costs ${gbp(sharedOwnership(PRICE, PRICE * 0.4, true).stages)}, but buying shares that take you above ${pct(S.shared_ownership_staircasing_return_share)} ownership will be taxed later. The right choice depends on how far and how fast you expect to staircase.` },
    { q: `How much more is a ${gbp(PRICE)} home in Edinburgh than in Manchester in tax?`, a: `For a buyer who has owned before, ${gbp(sco - eng)} more: ${gbp(sco)} of LBTT in Edinburgh against ${gbp(eng)} of SDLT in Manchester. For first-time buyers the gap grows to ${gbp(t('scotland', PRICE, 'first') - eFtb)}, because the English relief taxes this price at ${gbp(eFtb)} while the Scottish relief reduces the bill by no more than ${gbp(P.lbtt.first_time_buyer_max_saving)}.` },
  ],
  tool: 'calc',
  toolProps: { price: PRICE },
  related: ['stamp-duty-on-400000', 'stamp-duty-on-500000', 'shared-ownership-stamp-duty', 'stamp-duty-london', 'stamp-duty-first-time-buyer', 'stamp-duty-edinburgh'],
  sources: ['govSdltRates', 'govSdltSharedOwnership', 'sdltmFtbShared', 'ukhpi', 'rsResidential'],
  body: (h) => {
    const shares = [0.25, 0.4, 0.5, 0.75];
    const soRows = shares.map((s) => { const r = sharedOwnership(PRICE, PRICE * s, true), n = sharedOwnership(PRICE, PRICE * s, false); return [`${h.num(s * 100)}% share (${h.gbp(PRICE * s)})`, h.gbp(r.stages), h.gbp(n.stages)]; });
    soRows.push(['Market value election (full value)', h.gbp(mve), h.gbp(sharedOwnership(PRICE, PRICE, false).marketValueElection)]);
    const boroughs: Array<[string, string]> = [['london', 'London (region)'], ['lewisham', 'Lewisham'], ['hounslow', 'Hounslow'], ['lambeth', 'Lambeth'], ['southwark', 'Southwark']];
    const bRows = boroughs.filter(([k]) => { try { return h.place(k).ftb != null; } catch { return false; } }).map(([k, n]) => { const f = h.place(k).ftb!; return [n, h.gbp(f), h.gbp(h.t('england', f, 'first')), h.gbp(h.t('england', f))]; });
    return `
<h2>The London first-time buyer at ${h.gbp(PRICE)}</h2>
<p>The UK House Price Index for July 2026 gives ${h.gbp(lonFtb)} as the average price paid by first-time buyers across London, against ${h.gbp(LON.avg)} for all London purchases. The first figure sits inside the English first-time buyer relief; the second does not, because it exceeds the ${h.gbp(S.first_time_buyer_max_price)} price limit. For a London first purchase the band therefore matters: below the limit, each extra ${h.gbp(10000)} costs ${h.gbp(10000 * S.first_time_buyer[1][1])} in tax; above it, the relief is lost on the whole price.</p>
${h.table(['Area', 'First-time buyer average', 'SDLT with relief', 'SDLT without relief'], bRows, 'First-time buyer averages in London, UK HPI July 2026', ['l', 'r', 'r', 'r'])}
<p>Southwark shows the edge in practice: its first-time buyer average of ${h.gbp(h.place('southwark').ftb!)} is ${h.place('southwark').ftb! > S.first_time_buyer_max_price ? 'just above the limit, so the relief is lost and both columns are the same' : 'still inside the limit'}. In Lewisham and Hounslow the relief still applies, and the saving is the full ${h.gbp(eng - eFtb)} that it is worth anywhere between ${h.gbp(top(S.first_time_buyer, 0))} and the limit.</p>
<p>A buyer at ${h.gbp(PRICE)} keeps ${h.gbp(S.first_time_buyer_max_price - PRICE)} of headroom. The ${h.a('stamp-duty-london', 'London page')} covers the boroughs one by one.</p>
<h2>Shared ownership on a ${h.gbp(PRICE)} home</h2>
<p>Shared ownership lets a buyer purchase a share of a home and pay rent on the rest. For SDLT, there are two ways to be taxed (${h.src('govSdltSharedOwnership', 'GOV.UK')}). With a market value election, tax is paid once on the full market value, and later shares are free. GOV.UK’s example is precisely a ${h.gbp(PRICE)} home bought by a first-time buyer with the election, which comes to ${h.gbp(mve)}. Without the election, tax is paid on the price of the share bought now; nothing more is due on later shares until ownership passes ${h.pct(S.shared_ownership_staircasing_return_share)}, and then each further share is taxed.</p>
<p>First-time buyer relief applies to both methods when the market value is ${h.gbp(S.first_time_buyer_max_price)} or less (${h.src('sdltmFtbShared', 'SDLTM29880')}), which is the case here. The rent paid on the landlord’s share is left out of the table below.</p>
${h.table(['What is taxed', 'First-time buyer', 'Has owned before'], soRows, `Shared ownership, market value ${h.gbp(PRICE)}`, ['l', 'r', 'r'])}
<p>For a first-time buyer, paying in stages costs nothing on any share up to ${h.gbp(top(S.first_time_buyer, 0))}, which covers a ${h.num(Math.floor(top(S.first_time_buyer, 0) / PRICE * 100))}% share at this value. The ${h.a('shared-ownership-stamp-duty', 'shared ownership calculator')} adds later staircasing.</p>
<h2>The same price north and west of the border</h2>
<p>Scotland and Wales apply their own rules to shared ownership and shared equity, which this page does not model; Revenue Scotland and the Welsh Revenue Authority set them out. On an outright purchase at ${h.gbp(PRICE)}, LBTT is ${h.gbp(sco)}, or ${h.gbp(h.t('scotland', PRICE, 'first'))} for a first-time buyer, and Land Transaction Tax is ${h.gbp(wal)} for every buyer of an only home, first-time or not. The English first-time buyer therefore pays the least of the three by a wide margin.</p>`;
  },
});
