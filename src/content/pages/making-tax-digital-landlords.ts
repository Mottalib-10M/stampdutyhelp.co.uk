import { definePage } from '../../lib/page-types';
import { P, gbp } from '../../lib/kit';
import { displayDate } from '../../lib/format';

const M = P.wealth.rental.mtd as Array<[string, number, string]>;
const d = (iso: string) => displayDate(iso, 'en-GB');

export default definePage({
  id: 'making-tax-digital-landlords',
  group: 'gains',
  order: 110,
  slug: 'making-tax-digital-landlords',
  nav: 'Making Tax Digital for landlords',
  card: `Over ${gbp(M[0][1])} of gross rent and turnover: software records and updates from ${d(M[0][0])}; ${gbp(M[1][1])} from ${d(M[1][0])}.`,
  title: `Making Tax Digital for Landlords 2026: the ${gbp(M[0][1])} Test`,
  description: `Making Tax Digital for landlords: from ${d(M[0][0])} if 2024 to 2025 gross income passed ${gbp(M[0][1])}, then ${gbp(M[1][1])} in 2027 and ${gbp(M[2][1])} in 2028. Who is caught.`,
  h1: 'Making Tax Digital for Income Tax: what landlords must do',
  intro: 'Landlords and sole traders above a gross income threshold now keep digital records and send updates through software.',
  resume: `Making Tax Digital for Income Tax applies to landlords and sole traders registered for Self Assessment whose qualifying income, the gross total of property income and self-employment turnover before expenses, exceeds a threshold. Those with more than ${gbp(M[0][1])} in the ${M[0][2]} tax year should have started on ${d(M[0][0])}. The threshold falls to ${gbp(M[1][1])}, based on ${M[1][2]} income, from ${d(M[1][0])}, and to ${gbp(M[2][1])}, based on ${M[2][2]} income, from ${d(M[2][0])}. HMRC reviews each Self Assessment return and writes to those who must join, but the duty to check is yours even if no letter arrives. A landlord letting two flats in Bristol for ${gbp(2100)} a month each has ${gbp(2100 * 2 * 12)} of qualifying income and is caught from ${d(M[1][0])} if that was the ${M[1][2]} figure, whatever their profit after mortgage interest and repairs. Partnerships will join later, on a timetable not yet set, and digitally excluded landlords can ask for an exemption.`,
  faqs: [
    { q: 'Is the Making Tax Digital threshold based on profit or on rent?', a: 'On gross income. Qualifying income is the total of your rental income and any self-employment turnover before expenses, mortgage interest or allowances are taken off. A landlord whose rent is high but whose profit is small after interest can therefore be caught. Income from employment, pensions and dividends does not count towards the threshold.' },
    { q: 'I own the house jointly with my wife. Whose income counts?', a: `Each owner looks at their own share of the gross rent. If a couple share ${gbp(56000)} of rent equally, each has ${gbp(28000)} of qualifying property income and neither is above the ${gbp(M[1][1])} threshold for ${M[1][2]} on rent alone, unless one of them also has self-employment income to add.` },
    { q: 'Do I still file a tax return once I am in Making Tax Digital?', a: 'HMRC’s guidance says you still submit a Self Assessment return for the tax year before you start. From your start date you report through compatible software, chosen and authorised when you sign up, and HMRC’s sign-up pages set out each step for a sole trader or landlord. An agent can sign you up and act for you once you have authorised them.' },
  ],
  mini: 'mtdStart',
  miniHref: 'rental-income-tax-calculator',
  related: ['rental-income-tax-calculator', 'section-24-mortgage-interest', 'property-allowance-rent-a-room', 'buy-to-let-stamp-duty', 'capital-gains-tax-60-day-return'],
  sources: ['govMtd', 'govRentingTax'],
  body: (h) => {
    const rows = M.map(([start, t, y]) => [y, `over ${h.gbp(t)}`, d(start)]);
    const ex = [[18000, 0], [26000, 9000], [36000, 0], [52000, 0]].map(([rent, trade]) => {
      const q = rent + trade;
      const when = M.find(([, t]) => q > t);
      return [h.gbp(rent), h.gbp(trade), h.gbp(q), when ? d(when[0]) : `not before ${d(M[M.length - 1][0])}`];
    });
    return `
<h2>The three thresholds</h2>
${h.table(['Qualifying income in tax year', 'Threshold', 'Start using Making Tax Digital'], rows, 'Making Tax Digital for Income Tax, HMRC guidance updated 26 March 2026', ['l', 'l', 'l'])}
<p>The test for each start date looks back at a past tax year, the one whose return HMRC has already received. A landlord whose rent was ${h.gbp(45000)} in ${M[0][2]} was not caught in April 2026, but if their gross rent passed ${h.gbp(M[1][1])} in ${M[1][2]}, they will be from ${d(M[1][0])}.</p>
${h.table(['Gross rent', 'Self-employed turnover', 'Qualifying income', 'Earliest start if this was the income of each test year'], ex, 'Examples, assuming the same income every year', ['r', 'r', 'r', 'l'])}
<h2>What counts as qualifying income</h2>
<p>Only two sources: income from property and income from self-employment, both taken gross, before expenses. Rent from a buy-to-let, from a holiday let or from land counts; so does turnover as a sole trader. Salary, pensions, savings interest, dividends and capital gains do not. This is a different measure from the one used for the tax itself, where expenses, the ${h.gbp(h.P.wealth.income_tax.property_allowance)} property allowance and the ${h.a('section-24-mortgage-interest', 'finance-cost credit')} all reduce what you pay. A landlord can be well inside the basic rate band and still inside Making Tax Digital because their gross rent is high.</p>
<p>Joint owners each count their own share of the rent. A landlord with a property in their sole name and a share of another owned with a sibling adds the two figures together.</p>
<h2>How HMRC tells you, and why you should not wait</h2>
<p>Each year HMRC reviews Self Assessment returns and checks qualifying income. Where it is above the threshold that applies, HMRC writes to confirm that the landlord must start using Making Tax Digital at the beginning of the next tax year. The guidance is explicit that a missing letter does not remove the obligation: if your qualifying income is above the threshold you should use HMRC’s online checker, speak to your agent, or ask whoever helps you with your tax, and sign up in time.</p>
<p>To sign up you must already be registered for Self Assessment and have submitted a return in the last two years. You then choose compatible software and authorise it, or decide how your agent will act for you. HMRC’s checker asks about the ${M.map(([, , y]) => y).join(', ')} tax years: whether you filed a return, which income sources you declared and how much property and self-employment income you received.</p>
<h2>Exemptions</h2>
<p>Some landlords will not have to use the service. HMRC gives the example of people who are digitally excluded, and has a separate page explaining how to apply for an exemption. An exempt landlord keeps filing a normal Self Assessment return and reports income and gains on it as before. If you disagree with HMRC that you must join, the guidance says to contact HMRC.</p>
<h2>Partnerships and companies</h2>
<p>Partnerships are not yet included; HMRC says it will set out a timetable later. Companies that own buy-to-let property pay Corporation Tax and are outside Making Tax Digital for Income Tax altogether. A landlord who receives rent personally and also has a share of a partnership counts only their personal property and self-employment income for now.</p>
<h2>A landlord’s year under the new system</h2>
<p>For most landlords the practical change is keeping records in compatible software, chosen and authorised at sign-up, and reporting through it rather than relying on one paper-style return after the year ends. The tax itself does not change: the same rental profit, the same rates and the same credit for mortgage interest. The ${h.a('rental-income-tax-calculator', 'rental income calculator')} gives the figure you are working towards. Other deadlines run alongside: a property sale at a gain still needs its own ${h.a('capital-gains-tax-60-day-return', '60-day Capital Gains Tax return')}, outside the Making Tax Digital updates.</p>
<h2>Landlords below the thresholds</h2>
<p>Being outside Making Tax Digital does not mean being outside tax. The ordinary Self Assessment rules still decide whether a small landlord must file. Gross rent of ${h.gbp(h.P.wealth.income_tax.property_allowance)} or less is covered by the property allowance and needs no report. Between that and ${h.gbp(h.P.wealth.income_tax.sa_property_income_after_expenses)}, HMRC asks you to contact it. Above ${h.gbp(h.P.wealth.income_tax.sa_property_income_after_expenses)} after allowable expenses, or ${h.gbp(h.P.wealth.income_tax.sa_property_income_before_expenses)} before them, rental income goes on a Self Assessment return, and anyone not already registered must register by 5 October after the end of the tax year. Those returns are the ones HMRC reads to decide who joins Making Tax Digital next, so a landlord growing a portfolio moves from one regime to the other without a separate application.</p>
<p>A lodger in your own home is a special case: under the Rent a Room Scheme up to ${h.gbp(h.P.wealth.income_tax.rent_a_room)} a year of furnished letting in your home is tax-free, ${h.gbp(h.P.wealth.income_tax.rent_a_room_shared)} if the income is shared. The ${h.a('property-allowance-rent-a-room', 'property allowance and Rent a Room page')} compares the options and shows which leaves the lowest taxable profit.</p>
<p>The figures used to decide on Making Tax Digital are the gross ones on your return, so they are worth getting right even in a year where expenses wipe out the profit. A landlord who has left rent undeclared in past years can tell HMRC about it: GOV.UK says any penalty will then be lower than if HMRC finds the income itself, and the disclosure reference then gives a fixed period to work out and pay what is owed.</p>
<h2>Planning the next purchase</h2>
<p>Adding a property can take a landlord over the threshold in a single step, because the test is gross rent. Someone already earning ${h.gbp(24000)} of rent who buys a second flat let at ${h.gbp(1000)} a month will have ${h.gbp(24000 + 12000)} of qualifying income in the first full year. Budget for software and perhaps an agent alongside the ${h.a('buy-to-let-stamp-duty', 'stamp duty on the purchase')}.</p>`;
  },
});
