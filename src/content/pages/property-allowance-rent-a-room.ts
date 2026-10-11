import { definePage } from '../../lib/page-types';
import { P, gbp } from '../../lib/kit';

const IT = P.wealth.income_tax;
const A = IT.property_allowance, RR = IT.rent_a_room, RRS = IT.rent_a_room_shared;

export default definePage({
  id: 'property-allowance-rent-a-room',
  group: 'gains',
  order: 120,
  slug: 'property-allowance-rent-a-room',
  nav: 'Property allowance and Rent a Room',
  card: `${gbp(A)} of rent tax-free for any landlord, ${gbp(RR)} for a lodger in your home, and when expenses beat both.`,
  title: `Property Allowance 2026: ${gbp(A)} Free, Rent a Room ${gbp(RR)}`,
  description: `Property allowance and Rent a Room in 2026: ${gbp(A)} of gross rent tax-free, ${gbp(RR)} for a furnished room in your home (${gbp(RRS)} shared), and when to report.`,
  h1: 'The property allowance and the Rent a Room Scheme',
  intro: 'Two simple reliefs for small amounts of rent: one for any letting, one for sharing your own home.',
  resume: `Two allowances keep small amounts of rent out of tax. The property allowance lets any individual receive ${gbp(A)} a year of gross property income tax-free; above that, it can be deducted instead of actual expenses, so ${gbp(3000)} of rent from letting a parking space becomes ${gbp(3000 - A)} of taxable profit without any receipts. Joint owners each get their own ${gbp(A)} against their share. The Rent a Room Scheme goes further for resident landlords: up to ${gbp(RR)} a year from letting furnished accommodation in your own home, or ${gbp(RRS)} if the income is shared with someone else, is exempt automatically. Above the threshold you can opt into the scheme on your tax return and pay tax only on the excess, or declare income and expenses in the normal way. Neither allowance can be combined with actual expenses on the same income, and the property allowance is unavailable to a landlord who claims the finance-cost credit for mortgage interest.`,
  faqs: [
    { q: 'I let my driveway through an app for £900 a year. Do I need to tell HMRC?', a: `No, provided that is all your property income. Gross property income of ${gbp(A)} or less is covered in full by the property allowance, and you do not need to tell HMRC or declare it, unless you cannot use the allowance, for example because the income comes from a company you control. Keep a simple record of what you received.` },
    { q: 'Can I use Rent a Room for a flat I converted in my house?', a: 'No. GOV.UK says the scheme cannot be used for homes converted into separate flats. It is for furnished accommodation in your only or main home, whether you own it or rent it, and it also covers running a bed and breakfast or a guest house. You can let as much of your home as you want within the scheme.' },
    { q: 'When is it better not to use the property allowance?', a: `When your expenses are larger than ${gbp(A)}, or when you have mortgage interest on a residential let. Claiming the allowance rules out deducting any actual expenses from that income, and HMRC does not allow the allowance at all if you claim the tax reducer for finance costs. If expenses exceed income, claiming them can also create a loss to carry forward.` },
  ],
  mini: 'rentARoom',
  miniHref: 'rental-income-tax-calculator',
  related: ['rental-income-tax-calculator', 'section-24-mortgage-interest', 'making-tax-digital-landlords', 'buy-to-let-stamp-duty', 'private-residence-relief'],
  sources: ['govPropertyAllowance', 'govRentARoom', 'govRentingTax'],
  body: (h) => {
    const cmp = [800, 2000, 6000, 9000].map((r) => [h.gbp(r), h.gbp(Math.max(0, r - 300)), h.gbp(Math.max(0, r - A)), r <= RR ? h.gbp(0) : h.gbp(r - RR)]);
    return `
<h2>The property allowance in practice</h2>
<p>The allowance has existed since 6 April 2017 and applies to income from land or property received by individuals: letting a whole house, a garage, a parking space, a field for grazing or a holiday cottage. It works in two ways. If gross property income for the year is ${h.gbp(A)} or less, it is all exempt and there is nothing to declare; HMRC calls this full relief. Above ${h.gbp(A)}, you may deduct ${h.gbp(A)} from the gross income instead of your actual expenses; this is partial relief. The allowance cannot create a loss: it is limited to the income itself.</p>
<p>Joint owners each have their own allowance against their share of the gross rent. A brother and sister who inherit a cottage and let it for ${h.gbp(1800)} a year between them receive ${h.gbp(900)} each, inside the allowance, and neither needs to report it.</p>
<h2>When you cannot use it</h2>
<ul>
<li>When the income comes from a company you or someone connected to you owns or controls, a partnership in which you or a connected person are partners, or your employer or your spouse’s employer.</li>
<li>When you claim the tax reducer for finance costs, such as mortgage interest on a residential let.</li>
<li>On income from a room in your own home under the Rent a Room Scheme, or when you deduct expenses from such room income instead of using the scheme.</li>
<li>Where you have two property businesses and claim the allowance in one, you may not claim actual expenses in the other.</li>
</ul>
<h2>The Rent a Room Scheme</h2>
<p>You are a resident landlord when you let part of the property that is your only or main home, whether you own it or rent it. Under the scheme, up to ${h.gbp(RR)} a year from furnished accommodation in that home is tax-free, halved to ${h.gbp(RRS)} if you share the income with someone else, such as a partner who co-owns the house. The exemption is automatic below the threshold. If you earn more, you must complete a tax return, and you then choose between opting into the scheme, paying tax on the amount above ${h.gbp(RR)} with no expenses, or recording income and expenses on the property pages in the normal way. The scheme also covers bed and breakfast and guest house owners, but not homes converted into separate flats.</p>
<p>A lodger paying ${h.gbp(650)} a month brings in ${h.gbp(650 * 12)} over a year, which is ${h.gbp(650 * 12 - RR)} above the threshold; opting in, only that slice is taxed.</p>
<h2>Which option leaves the lowest profit</h2>
${h.table(['Gross rent', `Actual expenses of ${h.gbp(300)}`, `Property allowance of ${h.gbp(A)}`, `Rent a Room (lodger only)`], cmp, 'Taxable profit under each method', ['r', 'r', 'r', 'r'])}
<p>The Rent a Room column applies only to a furnished room in your own home, and the property allowance column only to other lettings. For a separate buy-to-let with a mortgage the allowance is normally the wrong choice, because it excludes the ${h.a('section-24-mortgage-interest', 'finance-cost credit')}.</p>
<h2>Reporting to HMRC</h2>
<p>Rent covered by the property allowance or below the Rent a Room threshold needs no report. Gross property income above ${h.gbp(A)} and up to ${h.gbp(IT.sa_property_income_after_expenses)}: contact HMRC. Above ${h.gbp(IT.sa_property_income_after_expenses)} after allowable expenses, or ${h.gbp(IT.sa_property_income_before_expenses)} before them, you must file a Self Assessment return, registering by 5 October after the end of the tax year if you do not already. Landlords with larger gross rents also fall under ${h.a('making-tax-digital-landlords', 'Making Tax Digital')}.</p>
<h2>Expenses landlords who claim them can deduct</h2>
<p>For an ordinary residential let, allowable expenses are the day-to-day costs of running the property: letting agents’ fees, legal fees for lets of a year or less, accountants’ fees, buildings and contents insurance, maintenance and repairs but not improvements, utility bills, ground rent and service charges, Council Tax, services such as cleaning or gardening, and direct costs like advertising and phone calls. Replacing a domestic item such as a bed, sofa, carpet or fridge used by tenants qualifies for replacement of domestic items relief, provided the old item is no longer used in the property. Buying the property or renovating it beyond repairs is capital spending and is not deductible against rent.</p>
<h2>Records, even when nothing is due</h2>
<p>Using either allowance does not remove the need for evidence. HMRC asks anyone relying on the property or trading allowance to keep a record of the income: copies of invoices, paper or electronic, a spreadsheet of receipts, or emails confirming payments. For a parking space let through an app, the app’s own annual statement usually does the job. A resident landlord under the Rent a Room threshold should keep the lodger agreement and a note of what was received each month, because the exemption depends on the total staying below ${h.gbp(RR)}, or ${h.gbp(RRS)} where the income is shared.</p>
<p>Those records also protect the future. If the income rises above the threshold the following year, you will need to decide between the allowance and actual expenses, and only a record of costs makes the second option possible. They also help when the property is sold, because ${h.a('capital-gains-tax-on-property', 'Capital Gains Tax')} allows improvement costs but not the repairs already claimed against rent.</p>
<h2>Holiday lets after April 2025</h2>
<p>Furnished holiday lettings lost their special tax rules on 6 April 2025 for Income Tax and Capital Gains Tax. A cottage let to holidaymakers is now treated like any other residential let: the property allowance can apply to small amounts of income, finance costs go through the credit, and the gain on sale is taxed under the ordinary ${h.a('capital-gains-tax-on-property', 'Capital Gains Tax rules for property')}.</p>
<h2>Lodgers and your main home relief</h2>
<p>Having a lodger who shares your living space does not count as letting part of your home for Capital Gains Tax, so the ${h.a('private-residence-relief', 'Private Residence Relief')} on a later sale is not affected. Letting a self-contained part of the house to a tenant is different and can reduce the relief.</p>`;
  },
});
