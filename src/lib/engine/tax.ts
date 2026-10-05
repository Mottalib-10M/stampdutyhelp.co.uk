/**
 * Property purchase taxes of the United Kingdom, 2026 rates (effective dates from 1 April 2025).
 *
 *   England and Northern Ireland : Stamp Duty Land Tax (HMRC), Finance Act 2003
 *   Scotland                     : Land and Buildings Transaction Tax + Additional Dwelling Supplement (Revenue Scotland)
 *   Wales                        : Land Transaction Tax, main and higher rates (Welsh Revenue Authority)
 *
 * Pure functions, every rate from params-2026.json. Amounts are computed in pence-free pounds with
 * Math.floor per band, as the authorities' worked examples do (tax is due in whole pounds).
 */
import { P, type Band } from './params';

export type Nation = 'england' | 'scotland' | 'wales';
/** first = every buyer is a first-time buyer; home = the only home after the purchase, or a replacement
 *  of the main residence sold on or before completion; additional = the buyer will own more than one
 *  dwelling at the end of the day (second home, buy-to-let, or old home not yet sold). */
export type Situation = 'first' | 'home' | 'additional';
export type PropertyKind = 'residential' | 'nonresidential';

export interface Input {
  nation: Nation;
  price: number;
  situation: Situation;
  /** Buyer is a company or other non-natural person. */
  company?: boolean;
  /** Company qualifies for a relief from the 17% SDLT rate (rental business, developer, trader…). */
  companyRelief?: boolean;
  /** SDLT only: at least one buyer was in the UK fewer than 183 days in the 12 months before. */
  nonResident?: boolean;
  kind?: PropertyKind;
}

export interface BandLine { from: number; to: number | null; rate: number; taxable: number; tax: number }
export interface Result {
  nation: Nation;
  taxName: string;
  total: number;
  /** Tax on the main-rate basis (what a buyer with no other property would pay). */
  mainTax: number;
  bands: BandLine[];
  /** Additional-property surcharge included in total (SDLT 5 points, ADS, LTT higher minus main). */
  surcharge: number;
  /** SDLT non-resident 2-point surcharge included in total. */
  nonResidentSurcharge: number;
  /** First-time buyer relief: tax saved against the standard rates. */
  ftbSaving: number;
  /** Amount a buyer can reclaim if the surcharge was paid only because the old main home was not yet sold. */
  refundable: number;
  effectiveRate: number;
  /** Name of the rule actually applied, shown on the result line (RECETTE §17.3). */
  rule: string;
  notes: string[];
}

export const TAX_NAME: Record<Nation, string> = {
  england: 'Stamp Duty Land Tax',
  scotland: 'Land and Buildings Transaction Tax',
  wales: 'Land Transaction Tax',
};
export const TAX_SHORT: Record<Nation, string> = { england: 'SDLT', scotland: 'LBTT', wales: 'LTT' };
export const NATION_LABEL: Record<Nation, string> = { england: 'England and Northern Ireland', scotland: 'Scotland', wales: 'Wales' };

/** Slice tax: each rate applies to the portion of the price inside its band. `add` raises every rate. */
export function banded(price: number, bands: Band[], add = 0): { tax: number; lines: BandLine[] } {
  const lines: BandLine[] = [];
  let from = 0;
  let tax = 0;
  const p = Math.max(0, price);
  for (const [upper, rate] of bands) {
    const to = upper;
    const top = to === null ? p : Math.min(p, to);
    const taxable = Math.max(0, top - from);
    const r = rate + add;
    const t = taxable * r;
    lines.push({ from, to, rate: r, taxable, tax: t });
    tax += t;
    if (to === null || p <= to) break;
    from = to;
  }
  // Tax is due in whole pounds: the total is rounded down once, the band lines keep their pence.
  return { tax: Math.floor(tax + 1e-6), lines };
}

const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
const gbp = (n: number) => `£${n.toLocaleString('en-GB')}`;

function sdlt(i: Input): Result {
  const s = P.sdlt;
  const price = Math.max(0, i.price);
  const nr = i.nonResident ? s.non_resident_surcharge : 0;
  const notes: string[] = [];
  const main = banded(price, s.residential);
  if (i.kind === 'nonresidential') {
    const r = banded(price, s.non_residential);
    return pack('england', r.tax, r.tax, r.lines, 0, 0, 0, 0, 'Non-residential and mixed-use rates', notes, price);
  }
  // Companies: 17% of the whole price above £500,000 unless a relief applies, otherwise higher rates.
  if (i.company) {
    if (price > s.corporate_flat_threshold && !i.companyRelief) {
      const rate = s.corporate_flat_rate + nr;
      const total = Math.floor(price * rate + 1e-9);
      const nrPart = Math.floor(price * nr + 1e-9);
      return pack('england', total, main.tax, [{ from: 0, to: null, rate, taxable: price, tax: total }], total - main.tax - nrPart, nrPart, 0, 0,
        `Corporate rate of ${pct(s.corporate_flat_rate)} on the whole price${nr ? ` + ${pct(P.sdlt.non_resident_surcharge)} non-resident surcharge` : ''}`, notes, price);
    }
    const add = price >= s.higher_rates_min_price ? s.higher_rates_surcharge : 0;
    const r = banded(price, s.residential, add + nr);
    const nrPart = banded(price, s.residential, nr).tax - main.tax;
    return pack('england', r.tax, main.tax, r.lines, r.tax - main.tax - nrPart, nrPart, 0, 0,
      add ? `Higher rates for companies (+${pct(add)} on every band)${nr ? ` + ${pct(P.sdlt.non_resident_surcharge)} non-resident surcharge` : ''}` : `Standard rates (price under ${gbp(s.higher_rates_min_price)})`, notes, price);
  }
  if (i.situation === 'first') {
    if (price <= s.first_time_buyer_max_price) {
      const r = banded(price, s.first_time_buyer, nr);
      const std = banded(price, s.residential, nr).tax;
      const nrPart = r.tax - banded(price, s.first_time_buyer).tax;
      return pack('england', r.tax, banded(price, s.first_time_buyer).tax, r.lines, 0, nrPart, std - r.tax, 0,
        `First-time buyer relief (nil band to ${gbp(s.first_time_buyer[0][0] as number)})${nr ? ` + ${pct(P.sdlt.non_resident_surcharge)} non-resident surcharge` : ''}`, notes, price);
    }
    notes.push(`Price above ${gbp(s.first_time_buyer_max_price)}: first-time buyer relief is lost entirely and standard rates apply to the whole price.`);
  }
  const add = i.situation === 'additional' && price >= s.higher_rates_min_price ? s.higher_rates_surcharge : 0;
  const r = banded(price, s.residential, add + nr);
  const nrPart = banded(price, s.residential, nr).tax - main.tax;
  const surcharge = r.tax - main.tax - nrPart;
  if (i.situation === 'additional' && !add) notes.push(`Higher rates do not apply to a purchase under ${gbp(s.higher_rates_min_price)}.`);
  const rule = add ? `Higher rates for additional dwellings (+${pct(add)} on every band)` : 'Standard residential rates';
  return pack('england', r.tax, main.tax, r.lines, surcharge, nrPart, 0, surcharge, rule + (nr ? ` + ${pct(P.sdlt.non_resident_surcharge)} non-resident surcharge` : ''), notes, price);
}

function lbtt(i: Input): Result {
  const s = P.lbtt;
  const price = Math.max(0, i.price);
  const notes: string[] = [];
  if (i.nonResident) notes.push('Scotland has no non-resident surcharge: LBTT is the same for UK and overseas buyers.');
  if (i.kind === 'nonresidential') {
    const r = banded(price, s.non_residential);
    return pack('scotland', r.tax, r.tax, r.lines, 0, 0, 0, 0, 'Non-residential and mixed-use rates', notes, price);
  }
  const main = banded(price, s.residential);
  const adsDue = (i.company || i.situation === 'additional') && price >= s.ads_min_price;
  if (!adsDue && i.situation === 'first' && !i.company) {
    const ftbBands: Band[] = [[s.first_time_buyer_nil_band, 0], ...s.residential.slice(1)];
    const r = banded(price, ftbBands);
    return pack('scotland', r.tax, r.tax, r.lines, 0, 0, main.tax - r.tax, 0, `First-time buyer relief (nil band to ${gbp(s.first_time_buyer_nil_band)})`, notes, price);
  }
  if (!adsDue) {
    if ((i.company || i.situation === 'additional') && price < s.ads_min_price) notes.push(`ADS does not apply to a purchase under ${gbp(s.ads_min_price)}.`);
    return pack('scotland', main.tax, main.tax, main.lines, 0, 0, 0, 0, 'Standard residential rates', notes, price);
  }
  const ads = Math.floor(price * s.ads_rate + 1e-9);
  const lines = [...main.lines, { from: 0, to: null, rate: s.ads_rate, taxable: price, tax: ads }];
  return pack('scotland', main.tax + ads, main.tax, lines, ads, 0, 0, i.company ? 0 : ads,
    `Additional Dwelling Supplement: ${pct(s.ads_rate)} of the whole price on top of LBTT`, notes, price);
}

function ltt(i: Input): Result {
  const s = P.ltt;
  const price = Math.max(0, i.price);
  const notes: string[] = [];
  if (i.nonResident) notes.push('Wales has no non-resident surcharge: LTT is the same for UK and overseas buyers.');
  if (i.kind === 'nonresidential') {
    const r = banded(price, s.non_residential);
    return pack('wales', r.tax, r.tax, r.lines, 0, 0, 0, 0, 'Non-residential and mixed-use rates', notes, price);
  }
  const main = banded(price, s.main);
  if (i.situation === 'first' && !i.company) notes.push(`Wales has no first-time buyer relief: main rates apply, with a nil band to ${gbp(s.main[0][0] as number)} for every buyer.`);
  const higher = (i.company || i.situation === 'additional') && price >= s.higher_min_price;
  if (!higher) {
    if ((i.company || i.situation === 'additional') && price < s.higher_min_price) notes.push(`Higher rates do not apply to a purchase under ${gbp(s.higher_min_price)}.`);
    return pack('wales', main.tax, main.tax, main.lines, 0, 0, 0, 0, 'Main residential rates', notes, price);
  }
  const r = banded(price, s.higher);
  const surcharge = r.tax - main.tax;
  return pack('wales', r.tax, main.tax, r.lines, surcharge, 0, 0, i.company ? 0 : surcharge, 'Higher residential rates (separate band table)', notes, price);
}

function pack(nation: Nation, total: number, mainTax: number, bands: BandLine[], surcharge: number, nonResidentSurcharge: number,
  ftbSaving: number, refundable: number, rule: string, notes: string[], price: number): Result {
  return { nation, taxName: TAX_NAME[nation], total, mainTax, bands, surcharge, nonResidentSurcharge, ftbSaving, refundable,
    effectiveRate: price > 0 ? total / price : 0, rule, notes };
}

export function compute(i: Input): Result {
  if (i.nation === 'scotland') return lbtt(i);
  if (i.nation === 'wales') return ltt(i);
  return sdlt(i);
}

/** Same purchase in the three nations (non-resident surcharge only bites in England and NI). */
export function compareNations(i: Omit<Input, 'nation'>): Record<Nation, Result> {
  return { england: compute({ ...i, nation: 'england' }), scotland: compute({ ...i, nation: 'scotland' }), wales: compute({ ...i, nation: 'wales' }) };
}

/** SDLT under the rates in force from 23 September 2022 to 31 March 2025 (history page only).
 *  `surcharge` is 0.03 before 31 October 2024 and 0.05 after. */
export function sdltPrevious(price: number, situation: Situation, surcharge = P.sdlt.higher_rates_surcharge): number {
  const s = P.sdlt.previous;
  if (situation === 'first' && price <= s.first_time_buyer_max_price) return banded(price, s.first_time_buyer).tax;
  const add = situation === 'additional' && price >= P.sdlt.higher_rates_min_price ? surcharge : 0;
  return banded(price, s.residential, add).tax;
}

// ------------------------------------------------------------------------------------------------
// Joint purchases
// ------------------------------------------------------------------------------------------------
export interface Buyer {
  /** Has owned a home (or a share of one) anywhere in the world before. */
  everOwned: boolean;
  /** Will still own another dwelling worth £40,000 or more at the end of completion day. */
  ownsOther: boolean;
  /** The other dwelling is the main home being sold (only relevant if ownsOther). */
  sellingMainHomeLater?: boolean;
  /** SDLT: in the UK fewer than 183 days in the 12 months before completion. */
  nonResident?: boolean;
}
export interface JointResolution { situation: Situation; nonResident: boolean; reasons: string[] }
/** One buyer's position decides for everyone: first-time buyer relief needs all of them; the surcharge
 *  applies to the whole purchase if any of them triggers it. Married couples or civil partners living
 *  together count as one unit: a non-resident spouse of a UK resident is treated as resident (SDLTM09885),
 *  and a spouse's property counts as the buyer's own for the higher rates. */
export function resolveJoint(buyers: Buyer[], married: boolean): JointResolution {
  const reasons: string[] = [];
  const anyOther = buyers.some((b) => b.ownsOther);
  const allFirst = buyers.every((b) => !b.everOwned && !b.ownsOther);
  let situation: Situation = allFirst ? 'first' : anyOther ? 'additional' : 'home';
  if (anyOther) reasons.push('At least one buyer will own another home at the end of completion day, so the surcharge applies to the whole purchase, not to that buyer’s share.');
  else if (!allFirst) reasons.push('At least one buyer has owned a home before, so first-time buyer relief is lost for everyone.');
  else reasons.push('Every buyer is a first-time buyer, so the relief can be claimed.');
  const nrs = buyers.map((b) => !!b.nonResident);
  let nonResident = nrs.some(Boolean);
  if (nonResident && married && buyers.length === 2 && nrs.filter(Boolean).length === 1) {
    nonResident = false;
    reasons.push(`A non-resident spouse or civil partner living with a UK-resident partner is treated as UK resident: no ${pct(P.sdlt.non_resident_surcharge)} SDLT surcharge.`);
  } else if (nonResident) reasons.push(`At least one buyer is non-UK resident, so the ${pct(P.sdlt.non_resident_surcharge)} SDLT surcharge applies to the whole price in England and Northern Ireland.`);
  if (situation === 'additional' && buyers.filter((b) => b.ownsOther).every((b) => b.sellingMainHomeLater)) {
    reasons.push('If the home being sold is sold within the time limit, the surcharge can be reclaimed.');
  }
  return { situation, nonResident, reasons };
}

// ------------------------------------------------------------------------------------------------
// Shared ownership (England and Northern Ireland)
// ------------------------------------------------------------------------------------------------
export interface SharedResult { marketValueElection: number; stages: number; ftbApplies: boolean; staircasingFree: boolean }
/** Market value election: SDLT on the full market value, once. Paying in stages: SDLT on the share
 *  price now (rent ignored here). First-time buyer rates apply to both when the market value is
 *  £500,000 or less (SDLTM29880, SDLTM29885). */
export function sharedOwnership(marketValue: number, sharePrice: number, firstTime: boolean): SharedResult {
  const s = P.sdlt;
  const ftbApplies = firstTime && marketValue <= s.first_time_buyer_max_price;
  const bands = ftbApplies ? s.first_time_buyer : s.residential;
  return { marketValueElection: banded(marketValue, bands).tax, stages: banded(sharePrice, bands).tax, ftbApplies, staircasingFree: true };
}
/** Tax on a share bought in stages that takes ownership above 80%: SDLT on the total paid so far,
 *  times this share's fraction of that total (GOV.UK worked example). */
export function staircasingTax(totalPaidSoFar: number, thisShare: number): number {
  if (totalPaidSoFar <= 0) return 0;
  const t = banded(totalPaidSoFar, P.sdlt.residential).tax;
  return Math.floor(t * (thisShare / totalPaidSoFar) + 1e-9);
}

// ------------------------------------------------------------------------------------------------
// Transfers of equity: the chargeable consideration is the cash paid plus the share of the mortgage taken on.
// ------------------------------------------------------------------------------------------------
export function transferConsideration(cash: number, mortgage: number, shareTaken: number): number {
  return Math.max(0, cash) + Math.max(0, mortgage) * Math.min(1, Math.max(0, shareTaken));
}

// ------------------------------------------------------------------------------------------------
// Deadlines
// ------------------------------------------------------------------------------------------------
export const RETURN_DAYS: Record<Nation, number> = { england: P.sdlt.return_days, scotland: P.lbtt.return_days, wales: P.ltt.return_days };
/** Last day to sell the old main home and still reclaim the surcharge (3 years / 36 months after completion). */
export function refundWindowEnd(completionIso: string, nation: Nation): string {
  const d = new Date(`${completionIso}T00:00:00Z`);
  const months = nation === 'scotland' ? P.lbtt.replace_main_residence_months : (nation === 'wales' ? P.ltt.replace_main_residence_years : P.sdlt.replace_main_residence_years) * 12;
  d.setUTCMonth(d.getUTCMonth() + months);
  return d.toISOString().slice(0, 10);
}
export function addDays(iso: string, days: number): string {
  const d = new Date(`${iso}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}
