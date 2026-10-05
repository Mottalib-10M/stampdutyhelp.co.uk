import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { sharedOwnership, staircasingTax } from '../../lib/engine/tax';

const S = P.sdlt;
const MV = 400000, SHARE = 0.4, LOW = 280000;
const std = sharedOwnership(MV, MV * SHARE, false);
const ftb = sharedOwnership(MV, MV * SHARE, true);
const OVER = S.shared_ownership_staircasing_return_share;
/** HMRC's staircasing example: £260,000 paid in total, the last tranche £65,000. */
const STAIR_TOTAL = 260000, STAIR_LAST = 65000;

export default definePage({
  id: 'shared-ownership-stamp-duty',
  group: 'situations',
  order: 40,
  slug: 'shared-ownership-stamp-duty',
  nav: 'Shared ownership',
  card: 'Pay once on the full value or pay share by share: the SDLT election every shared owner has to make.',
  title: 'Shared Ownership Stamp Duty 2026: Election or Stages',
  description: `Shared ownership stamp duty in 2026: ${gbp(std.marketValueElection)} once on a ${gbp(MV)} home with the market value election, or ${gbp(std.stages)} on a ${pct(SHARE)} share paid in stages, plus later steps.`,
  h1: 'Stamp duty on shared ownership homes',
  intro: 'England and Northern Ireland let shared owners choose how SDLT is charged; the choice is made once, on the first return.',
  resume: `A shared owner in England or Northern Ireland chooses between two ways of paying Stamp Duty Land Tax. With the market value election, tax is paid once on the full market value stated in the lease, ${gbp(std.marketValueElection)} on a ${gbp(MV)} home at standard rates, and nothing more is due when you buy further shares. Paying in stages charges only the price of the share bought now: ${gbp(std.stages)} on a ${pct(SHARE)} share of the same home. Later shares cost nothing until your ownership goes above ${pct(OVER)}; the share that crosses that line is taxed on the total paid so far, pro rata. First-time buyers can claim the relief either way if the full market value is ${gbp(S.first_time_buyer_max_price)} or less, which brings the election on this home to ${gbp(ftb.marketValueElection)}. Scotland and Wales have their own shared ownership rules, which this page does not model.`,
  faqs: [
    { q: 'Should a first-time buyer on a 25% share make the market value election?', a: `Often yes when the full value is low. With the relief, a ${gbp(LOW)} home costs ${gbp(sharedOwnership(LOW, LOW, true).marketValueElection)} under the election, and every later share is then free of SDLT. Paying in stages also costs ${gbp(sharedOwnership(LOW, LOW * 0.25, true).stages)} on the first share, but can leave a bill on the step that takes you above ${pct(OVER)}. Compare both in the calculator before your conveyancer files.` },
    { q: 'I chose to pay in stages. What will staircasing to full ownership cost in stamp duty?', a: `Nothing until a purchase takes you above ${pct(OVER)}. That purchase, and any after it, is taxed on the total you have paid for all your shares, then reduced to the fraction the new share represents. In the GOV.UK example, ${gbp(STAIR_TOTAL)} paid in total with a last tranche of ${gbp(STAIR_LAST)} gives ${gbp(staircasingTax(STAIR_TOTAL, STAIR_LAST))}. The calculator estimates a final step from your own figures.` },
    { q: 'Does shared ownership in Scotland work the same way for LBTT?', a: `No. Land and Buildings Transaction Tax has its own treatment of shared ownership, set out by Revenue Scotland, and the Welsh Revenue Authority has its own rules for Land Transaction Tax. We do not publish figures for them because we have not verified those rules in detail; ask your conveyancer or the authority before you complete.` },
  ],
  tool: 'shared',
  related: ['stamp-duty-first-time-buyer', 'stamp-duty-joint-purchase', 'transfer-of-equity-stamp-duty', 'stamp-duty-on-300000', 'how-stamp-duty-is-calculated'],
  sources: ['govSdltSharedOwnership', 'sdltmFtbShared', 'govSdltRates', 'rsResidential', 'wraGuide'],
  body: (h) => {
    const rows = [200000, 280000, 400000, 450000, 550000].map((mv) => {
      const a = sharedOwnership(mv, mv * SHARE, false), b = sharedOwnership(mv, mv * SHARE, true);
      return [h.gbp(mv), h.gbp(a.marketValueElection), h.gbp(a.stages), h.gbp(b.marketValueElection), h.gbp(b.stages)];
    });
    return `
<h2>The two routes in figures</h2>
${h.table(['Full market value', 'Election, standard', `Stages, ${h.pct(SHARE)} share`, 'Election, first-time', 'Stages, first-time'], rows, 'SDLT under each route, rent ignored', ['l', 'r', 'r', 'r', 'r'])}
<p>On a cheap home the election costs little, sometimes nothing, and buys certainty: every future share is free of SDLT. At ${h.gbp(LOW)}, the GOV.UK example, it costs ${h.gbp(sharedOwnership(LOW, LOW, false).marketValueElection)} at standard rates. On an expensive one the stages route spreads the tax and may avoid part of it if you never staircase far. Above ${h.gbp(S.first_time_buyer_max_price)} of market value, the first-time buyer columns fall back to standard rates.</p>
<h2>Staircasing past ${h.pct(OVER)}</h2>
<p>Under the stages route, buying extra shares is free until the purchase that takes you above ${h.pct(OVER)}. That step, and every later one, is taxed in a particular way: SDLT is worked out on the total you have paid for all your shares so far, then multiplied by the fraction that the new share represents. The GOV.UK example uses ${h.gbp(STAIR_TOTAL)} paid in total, of which a final tranche of ${h.gbp(STAIR_LAST)}: the tax on the total is ${h.gbp(h.t('england', STAIR_TOTAL))} and the tranche bears ${h.gbp(staircasingTax(STAIR_TOTAL, STAIR_LAST))}. Keep the completion statement of every share you buy, because the total paid so far is the base of every later calculation, possibly years after your first purchase.</p>
<h2>First-time buyers and the ${h.gbp(S.first_time_buyer_max_price)} test</h2>
<p>The relief is open to both routes, but the test is the full market value, not your share. A ${h.gbp(450000)} home bought with the election costs a first-time buyer ${h.gbp(sharedOwnership(450000, 450000 * SHARE, true).marketValueElection)} once (HMRC manual SDLTM29880). If the market value exceeds ${h.gbp(S.first_time_buyer_max_price)}, the relief is unavailable even for a small share, and the ordinary ${h.a('stamp-duty-first-time-buyer', 'rules for first-time buyers')} lose their effect. Every buyer on the lease must qualify, as in any ${h.a('stamp-duty-joint-purchase', 'joint purchase')}.</p>
<h2>Rent under the lease</h2>
<p>A shared ownership lease carries rent on the part you do not own. SDLT on a new residential lease can also be due on rent, at ${h.pct(S.lease_npv_residential_rate)} of its net present value above ${h.gbp(S.lease_npv_residential_threshold)}. The calculator leaves rent aside; your conveyancer computes the net present value from the lease.</p>
<h2>Scotland and Wales</h2>
<p>Revenue Scotland and the Welsh Revenue Authority apply their own rules to shared ownership, and they differ from the SDLT election described here. We do not show figures for them. Start with ${h.src('rsResidential', 'Revenue Scotland’s residential guidance')} or the ${h.src('wraGuide', 'Welsh Revenue Authority’s LTT guide')}, and ask your solicitor to confirm the treatment before completion.</p>`;
  },
});
