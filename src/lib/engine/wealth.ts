/**
 * Taxes after the purchase: Capital Gains Tax, Inheritance Tax, dividend tax and Income Tax on rental
 * profits, 2026 to 2027 tax year. Every value comes from `params-2026.json > wealth` (RECETTE §4);
 * the worked examples of GOV.UK and HMRC are the reference cases of `wealth.test.ts`.
 * Each function takes an optional parameter set so that HMRC examples written with older rates
 * (the Section 24 case studies use 2016 to 2017 bands) can be replayed exactly.
 */
import { P } from './params';

export type Band = [number | null, number];
const W = P.wealth as unknown as {
  income_tax: { personal_allowance: number; pa_taper_threshold: number; pa_taper_ratio: number; ruk: Band[]; scotland: Band[]; property_allowance: number; rent_a_room: number };
  cgt: { annual_exempt_amount: number; basic_rate_band: number; rate_lower: number; rate_higher: number; badr_rate: number; report_days_residential: number };
  prr: { final_period_months: number };
  dividends: { allowance: number; ordinary_rate: number; upper_rate: number; additional_rate: number; previous_rates: number[] };
  rental: { finance_cost_credit_rate: number; mtd: Array<[string, number, string]>; test_2016_17: { personal_allowance: number; bands: Band[] } };
  iht: { charity_rate: number; pay_months: number; apr_bpr_allowance: number; nil_rate_band: number; residence_nil_rate_band: number; taper_threshold: number; taper_ratio: number; rate: number; gift_taper: Array<[number, number]>; gift_years: number; pensions_from: string };
};
export const WP = W;
export type Region = 'ruk' | 'scotland';
export const REGION_LABEL: Record<Region, string> = { ruk: 'England, Wales or Northern Ireland', scotland: 'Scotland' };

const r2 = (x: number) => Math.round(x * 100) / 100;
const pos = (x: number) => Math.max(0, x);

/* ------------------------------------------------------------------ Income Tax */

export interface IncomeParams { personal_allowance: number; pa_taper_threshold: number; pa_taper_ratio: number; bands: Band[] }
export const incomeParams = (region: Region = 'ruk'): IncomeParams => ({
  personal_allowance: W.income_tax.personal_allowance, pa_taper_threshold: W.income_tax.pa_taper_threshold, pa_taper_ratio: W.income_tax.pa_taper_ratio,
  bands: region === 'scotland' ? W.income_tax.scotland : W.income_tax.ruk,
});
/** UK bands are used for dividends and for the Capital Gains Tax basic rate band in every nation. */
const UK_BANDS = (): Band[] => W.income_tax.ruk;

/** Personal Allowance after the taper: £1 lost for every £2 of adjusted net income above £100,000. */
export function personalAllowance(adjustedNetIncome: number, p: Pick<IncomeParams, 'personal_allowance' | 'pa_taper_threshold' | 'pa_taper_ratio'> = incomeParams()): number {
  return Math.ceil(pos(p.personal_allowance - pos(adjustedNetIncome - p.pa_taper_threshold) * p.pa_taper_ratio));
}

export interface Slice { from: number; to: number | null; rate: number; amount: number; tax: number }
/** Tax on a slice of taxable income starting at `start` (taxable income already used by other income). */
export function sliceTax(amount: number, start: number, bands: Band[], rateOf: (i: number, r: number) => number = (_i, r) => r): { tax: number; slices: Slice[] } {
  const slices: Slice[] = [];
  let from = 0, tax = 0;
  bands.forEach(([to, rate], i) => {
    const lo = Math.max(from, start), hi = Math.min(to ?? Infinity, start + amount);
    if (hi > lo) { const rr = rateOf(i, rate); const t = (hi - lo) * rr; tax += t; slices.push({ from, to, rate: rr, amount: hi - lo, tax: t }); }
    from = to ?? from;
  });
  return { tax, slices };
}

export interface IncomeResult { allowance: number; taxable: number; tax: number; slices: Slice[]; marginal: number }
/** Income Tax on non-savings income (wages, pensions, self-employment, rental profits). */
export function incomeTax(gross: number, region: Region = 'ruk', p: IncomeParams = incomeParams(region)): IncomeResult {
  const allowance = personalAllowance(gross, p);
  const taxable = pos(gross - allowance);
  const { tax, slices } = sliceTax(taxable, 0, p.bands);
  const marginal = slices.length ? slices[slices.length - 1].rate : 0;
  return { allowance, taxable, tax: r2(tax), slices, marginal };
}

/* ------------------------------------------------------------------ Dividends */

export interface DividendInput { otherIncome: number; dividends: number; region?: Region; rates?: number[] }
export interface DividendResult { allowanceUsed: number; dividendTax: number; otherTax: number; total: number; taxableDividends: number; slices: Slice[]; band: 'personal allowance' | 'basic' | 'higher' | 'additional' }
/** Dividends sit on top of other income; the £500 allowance is taxed at 0% but still uses band space. */
export function dividendTax({ otherIncome, dividends, region = 'ruk', rates: given }: DividendInput): DividendResult {
  const D = W.dividends;
  const pa = personalAllowance(otherIncome + dividends);
  const otherTaxable = pos(otherIncome - pa);
  const paLeft = pos(pa - otherIncome);
  const taxableDividends = pos(dividends - paLeft);
  const otherTax = sliceTax(otherTaxable, 0, incomeParams(region).bands).tax;
  const free = Math.min(D.allowance, taxableDividends);
  const rates = given ?? [D.ordinary_rate, D.upper_rate, D.additional_rate];
  const charged = sliceTax(taxableDividends - free, otherTaxable + free, UK_BANDS(), (i) => rates[i]);
  const top = otherTaxable + taxableDividends;
  const ub = UK_BANDS();
  const band = taxableDividends === 0 ? 'personal allowance' : top <= (ub[0][0] as number) ? 'basic' : top <= (ub[1][0] as number) ? 'higher' : 'additional';
  return { allowanceUsed: free, dividendTax: r2(charged.tax), otherTax: r2(otherTax), total: r2(otherTax + charged.tax), taxableDividends, slices: charged.slices, band };
}

/* ------------------------------------------------------------------ Capital Gains Tax */

export interface CgtInput { gains: number; losses?: number; taxableIncome: number; badr?: boolean; aea?: number }
export interface CgtResult { net: number; aea: number; taxable: number; atLower: number; atHigher: number; tax: number; rate: number }
/** Capital Gains Tax for an individual (GOV.UK method): gains above the allowance are added to taxable
 *  income; the part inside the unused basic rate band pays 18%, the rest 24%. BADR gains pay 18% flat. */
export function cgt({ gains, losses = 0, taxableIncome, badr = false, aea = W.cgt.annual_exempt_amount }: CgtInput): CgtResult {
  const C = W.cgt;
  const net = pos(gains - losses);
  const used = Math.min(aea, net);
  const taxable = net - used;
  if (badr) return { net, aea: used, taxable, atLower: taxable, atHigher: 0, tax: r2(taxable * C.badr_rate), rate: C.badr_rate };
  const room = pos(C.basic_rate_band - taxableIncome);
  const atLower = Math.min(room, taxable), atHigher = taxable - atLower;
  const tax = r2(atLower * C.rate_lower + atHigher * C.rate_higher);
  return { net, aea: used, taxable, atLower, atHigher, tax, rate: taxable ? tax / taxable : 0 };
}

export interface PrrInput { monthsOwned: number; monthsLived: number }
/** Share of the gain covered by Private Residence Relief: months lived in, plus the final 9 months
 *  if the property was the main home at some point, over months owned. Assumes the owner lived there
 *  first and let it or left it afterwards (the GOV.UK letting example), so the final months are extra. */
export function prrShare({ monthsOwned, monthsLived }: PrrInput): number {
  if (monthsOwned <= 0 || monthsLived <= 0) return 0;
  const lived = Math.min(monthsLived, monthsOwned);
  const finalExtra = Math.min(W.prr.final_period_months, monthsOwned - lived);
  return Math.min(1, (lived + finalExtra) / monthsOwned);
}

export interface PropertyGainInput { sale: number; purchase: number; buyingCosts?: number; sellingCosts?: number; improvements?: number; share?: number; monthsOwned?: number; monthsLived?: number }
export interface PropertyGainResult { gain: number; prr: number; prrShare: number; chargeable: number }
/** Gain on a property: proceeds minus purchase price and allowable costs (stamp duty, legal and agent
 *  fees, improvements), times the share owned, less Private Residence Relief. */
export function propertyGain({ sale, purchase, buyingCosts = 0, sellingCosts = 0, improvements = 0, share = 1, monthsOwned = 0, monthsLived = 0 }: PropertyGainInput): PropertyGainResult {
  const gain = pos(sale - purchase - buyingCosts - sellingCosts - improvements) * share;
  const s = prrShare({ monthsOwned, monthsLived });
  const prr = Math.round(gain * s);
  return { gain, prr, prrShare: s, chargeable: gain - prr };
}

/** Last day to report and pay CGT on a UK residential property: 60 days after completion. */
export function cgtDeadline(completionIso: string): string {
  const d = new Date(`${completionIso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + W.cgt.report_days_residential);
  return d.toISOString().slice(0, 10);
}

/* ------------------------------------------------------------------ Rental income */

export interface RentalInput { rent: number; expenses: number; financeCosts: number; otherIncome: number; region?: Region; useAllowance?: boolean; broughtForward?: number }
export interface RentalResult {
  profit: number; deduction: 'expenses' | 'property allowance'; taxBefore: number; taxWithRent: number; credit: number; carriedForward: number;
  totalTax: number; rentalTax: number; allowanceBetter: boolean; marginal: number
}
/** Income Tax on rental profits for an individual landlord. Mortgage interest is not deducted
 *  (Section 24): it gives a credit of 20% of the lowest of finance costs, property profits and
 *  income above the Personal Allowance. `p` lets the HMRC case studies run with their own bands. */
export function rentalTax({ rent, expenses, financeCosts, otherIncome, region = 'ruk', useAllowance = false, broughtForward = 0 }: RentalInput, p: IncomeParams = incomeParams(region)): RentalResult {
  const A = W.income_tax.property_allowance;
  const allowance = Math.min(A, rent);
  const allowanceBetter = allowance > expenses && financeCosts === 0;
  const deduction = useAllowance ? 'property allowance' : 'expenses';
  const profit = pos(rent - (useAllowance ? allowance : expenses));
  const before = incomeTax(otherIncome, region, p);
  const withRent = incomeTax(otherIncome + profit, region, p);
  const finance = useAllowance ? 0 : financeCosts + broughtForward;
  const base = Math.min(finance, profit, withRent.taxable);
  const credit = Math.min(r2(base * W.rental.finance_cost_credit_rate), withRent.tax);
  const totalTax = r2(withRent.tax - credit);
  return {
    profit, deduction, taxBefore: before.tax, taxWithRent: withRent.tax, credit, carriedForward: pos(finance - base),
    totalTax, rentalTax: r2(totalTax - before.tax), allowanceBetter, marginal: withRent.marginal,
  };
}
export const S24_TEST_PARAMS: IncomeParams = { personal_allowance: W.rental.test_2016_17.personal_allowance, pa_taper_threshold: W.income_tax.pa_taper_threshold, pa_taper_ratio: W.income_tax.pa_taper_ratio, bands: W.rental.test_2016_17.bands };

/** Making Tax Digital start date for a qualifying income (gross self-employment plus property income)
 *  of a given tax year: the first threshold it exceeds, in date order. */
export function mtdStart(qualifyingIncome: number, taxYear: '2024 to 2025' | '2025 to 2026' | '2026 to 2027'): string | null {
  const row = W.rental.mtd.find(([, , y]) => y === taxYear);
  return row && qualifyingIncome > row[1] ? row[0] : null;
}

/* ------------------------------------------------------------------ Inheritance Tax */

export interface IhtParams { nil_rate_band: number; residence_nil_rate_band: number; taper_threshold: number; taper_ratio: number; rate: number }
export const ihtParams = (): IhtParams => ({ nil_rate_band: W.iht.nil_rate_band, residence_nil_rate_band: W.iht.residence_nil_rate_band, taper_threshold: W.iht.taper_threshold, taper_ratio: W.iht.taper_ratio, rate: W.iht.rate });

export interface IhtInput {
  /** Everything owned at death, less debts and funeral costs, before exemptions. */
  estate: number;
  /** Value of the home (or share) left to children or grandchildren. */
  homeToDescendants?: number;
  /** Left to a spouse, civil partner or charity: exempt. */
  exempt?: number;
  /** Chargeable gifts in the 7 years before death (after annual and other exemptions). */
  gifts?: number;
  /** Unused share of a late spouse's nil-rate band and residence nil-rate band, 0 to 1. */
  transferredNrb?: number;
  transferredRnrb?: number;
  /** Unused pension pot: counts in the estate only for deaths on or after 6 April 2027. */
  pension?: number;
  deathFromApril2027?: boolean;
}
export interface IhtResult {
  estate: number; nrb: number; nrbLeftForEstate: number; rnrbMax: number; taper: number; rnrb: number; chargeable: number; tax: number;
  unusedNrb: number; unusedRnrb: number; effectiveRate: number; pensionIncluded: number
}
export function iht(i: IhtInput, p: IhtParams = ihtParams()): IhtResult {
  const pensionIncluded = i.deathFromApril2027 ? (i.pension ?? 0) : 0;
  const estate = i.estate + pensionIncluded;
  const exempt = Math.min(i.exempt ?? 0, estate);
  const nrb = p.nil_rate_band * (1 + Math.min(1, i.transferredNrb ?? 0));
  const rnrbMax = p.residence_nil_rate_band * (1 + Math.min(1, i.transferredRnrb ?? 0));
  const taper = Math.min(rnrbMax, pos(estate - p.taper_threshold) * p.taper_ratio);
  const rnrb = Math.min(i.homeToDescendants ?? 0, rnrbMax - taper);
  const nrbLeftForEstate = pos(nrb - (i.gifts ?? 0));
  const afterRnrb = pos(estate - exempt - rnrb);
  const chargeable = pos(afterRnrb - nrbLeftForEstate);
  const tax = r2(chargeable * p.rate);
  return {
    estate, nrb, nrbLeftForEstate, rnrbMax, taper, rnrb, chargeable, tax,
    unusedNrb: pos(nrbLeftForEstate - afterRnrb), unusedRnrb: pos(rnrbMax - taper - rnrb), effectiveRate: estate ? tax / estate : 0, pensionIncluded,
  };
}

/** Rate of Inheritance Tax on a gift by full years between the gift and the death (taper relief). */
export function giftRate(yearsBeforeDeath: number): number {
  for (const [under, rate] of W.iht.gift_taper) if (yearsBeforeDeath < under) return rate;
  return 0;
}
export interface GiftResult { rate: number; taxable: number; tax: number; nrbUsed: number }
/** Tax on one gift when the giver dies within 7 years: the part above the nil-rate band left after
 *  earlier gifts, at the tapered rate. Taper only reduces tax, so a gift inside the band pays nothing. */
export function giftTax(gift: number, yearsBeforeDeath: number, earlierGifts = 0, nrb = W.iht.nil_rate_band): GiftResult {
  const rate = giftRate(yearsBeforeDeath);
  const room = pos(nrb - earlierGifts);
  const taxable = rate ? pos(gift - room) : 0;
  return { rate, taxable, tax: r2(taxable * rate), nrbUsed: Math.min(room, gift) };
}
