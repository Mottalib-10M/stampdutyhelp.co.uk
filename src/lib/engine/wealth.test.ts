/** Reference cases for the taxes after the purchase: the worked examples printed on GOV.UK and in
 *  HMRC guidance (read on 2026-10-11), then the boundaries of each rule (RECETTE §17.4). */
import { describe, it, expect } from 'vitest';
import { cgt, prrShare, propertyGain, cgtDeadline, dividendTax, incomeTax, personalAllowance, rentalTax, S24_TEST_PARAMS, mtdStart, iht, giftTax, giftRate, ihtParams } from './wealth';
import { P } from './params';

const W = P.wealth;

describe('parameters, 2026 to 2027 (GOV.UK)', () => {
  it('CGT allowance £3,000, rates 18% / 24%, BADR 18%', () => {
    expect(W.cgt.annual_exempt_amount).toBe(3000);
    expect([W.cgt.rate_lower, W.cgt.rate_higher, W.cgt.badr_rate]).toEqual([0.18, 0.24, 0.18]);
    expect(W.cgt.basic_rate_band).toBe(37700);
  });
  it('dividend allowance £500, rates 10.75% / 35.75% / 39.35%', () => {
    expect(W.dividends.allowance).toBe(500);
    expect([W.dividends.ordinary_rate, W.dividends.upper_rate, W.dividends.additional_rate]).toEqual([0.1075, 0.3575, 0.3935]);
  });
  it('IHT nil-rate band £325,000, residence band £175,000, taper from £2m, 40%', () => {
    expect([W.iht.nil_rate_band, W.iht.residence_nil_rate_band, W.iht.taper_threshold, W.iht.rate]).toEqual([325000, 175000, 2000000, 0.4]);
  });
  it('Scottish bands rebuilt from the GOV.UK table with the standard allowance', () => {
    const pa = W.income_tax.personal_allowance;
    const gross = [16537, 29526, 43662, 75000];
    W.income_tax.scotland.slice(0, 4).forEach(([to], i) => expect((to as number) + pa).toBe(gross[i]));
  });
});

describe('Capital Gains Tax, GOV.UK examples for 2026 to 2027', () => {
  it('taxable income £20,000, gains £12,600 → £1,728', () => expect(cgt({ gains: 12600, taxableIncome: 20000 }).tax).toBe(1728));
  it('taxable income £20,000, gains £52,600 → £10,842 (18% on £17,700, 24% on £31,900)', () => {
    const r = cgt({ gains: 52600, taxableIncome: 20000 });
    expect(r.atLower).toBe(17700); expect(r.atHigher).toBe(31900); expect(r.tax).toBe(10842);
  });
  it('gains inside the allowance pay nothing', () => expect(cgt({ gains: 3000, taxableIncome: 60000 }).tax).toBe(0));
  it('higher-rate taxpayer pays 24% on everything above the allowance', () => expect(cgt({ gains: 13000, taxableIncome: 40000 }).tax).toBe(2400));
  it('losses come off before the allowance', () => expect(cgt({ gains: 20000, losses: 7000, taxableIncome: 0 }).taxable).toBe(10000));
  it('BADR gains pay 18% flat', () => expect(cgt({ gains: 103000, taxableIncome: 90000, badr: true }).tax).toBe(18000));
});

describe('Private Residence Relief, GOV.UK examples', () => {
  it('£120,000 gain, 15 years owned, 7.5 lived → 55% relief, £54,000 chargeable', () => {
    expect(prrShare({ monthsOwned: 180, monthsLived: 90 })).toBeCloseTo(0.55, 10);
    expect(propertyGain({ sale: 420000, purchase: 300000, monthsOwned: 180, monthsLived: 90 }).chargeable).toBe(54000);
  });
  it('lived in first, let afterwards: the final 9 months are added to the months lived in', () => {
    expect(prrShare({ monthsOwned: 240, monthsLived: 180 })).toBeCloseTo(189 / 240, 10);
    expect(prrShare({ monthsOwned: 240, monthsLived: 235 })).toBe(1);
  });
  it('never lived there → no relief; lived all along → full relief', () => {
    expect(prrShare({ monthsOwned: 120, monthsLived: 0 })).toBe(0);
    expect(prrShare({ monthsOwned: 120, monthsLived: 120 })).toBe(1);
  });
  it('costs, stamp duty and improvements come off the gain; share of a joint property', () => {
    expect(propertyGain({ sale: 400000, purchase: 250000, buyingCosts: 7000, sellingCosts: 5000, improvements: 30000, share: 0.5 }).gain).toBe(54000);
  });
  it('60-day deadline', () => expect(cgtDeadline('2026-07-01')).toBe('2026-08-30'));
});

describe('Dividends, GOV.UK example for 2026 to 2027', () => {
  it('£3,000 dividends and £29,570 wages → £268.75 dividend tax, £3,400 on wages', () => {
    const r = dividendTax({ otherIncome: 29570, dividends: 3000 });
    expect(r.allowanceUsed).toBe(500); expect(r.dividendTax).toBe(268.75); expect(r.otherTax).toBe(3400); expect(r.band).toBe('basic');
  });
  it('dividends covered by the unused Personal Allowance pay nothing', () => expect(dividendTax({ otherIncome: 0, dividends: 13000 }).dividendTax).toBe(0));
  it('higher-rate slice at 35.75%', () => expect(dividendTax({ otherIncome: 60000, dividends: 10500 }).dividendTax).toBe(3575));
  it('Scottish wages change the tax on wages, not on dividends', () => {
    const s = dividendTax({ otherIncome: 29570, dividends: 3000, region: 'scotland' });
    expect(s.dividendTax).toBe(268.75); expect(s.otherTax).not.toBe(3400);
  });
});

describe('Income Tax and Personal Allowance', () => {
  it('allowance tapers to zero at £125,140', () => { expect(personalAllowance(110000)).toBe(7570); expect(personalAllowance(125140)).toBe(0); });
  it('£35,000 → basic rate on £22,430 (GOV.UK example)', () => expect(incomeTax(35000).tax).toBe(22430 * 0.2));
  it('Scotland 2026 to 2027 at £30,000: 19% / 20% / 21% slices', () => expect(incomeTax(30000, 'scotland').tax).toBe(r(3967 * 0.19 + 12989 * 0.2 + 474 * 0.21)));
});
function r(x: number) { return Math.round(x * 100) / 100; }

describe('Rental income, HMRC Section 24 case studies (2016 to 2017 bands)', () => {
  it('Sophia: rent £52,000, interest £20,000, expenses £9,000 → £2,400', () => expect(rentalTax({ rent: 52000, expenses: 9000, financeCosts: 20000, otherIncome: 0 }, S24_TEST_PARAMS).totalTax).toBe(2400));
  it('John: £35,000 self-employed, rent £18,000, interest £8,000 → £8,000', () => {
    const j = rentalTax({ rent: 18000, expenses: 2000, financeCosts: 8000, otherIncome: 35000 }, S24_TEST_PARAMS);
    expect(j.credit).toBe(1600); expect(j.totalTax).toBe(8000);
  });
  it('Brian: credit limited to profits, £2,000 carried forward → £6,200', () => {
    const b = rentalTax({ rent: 20000, expenses: 7000, financeCosts: 15000, otherIncome: 36000 }, S24_TEST_PARAMS);
    expect(b.credit).toBe(2600); expect(b.carriedForward).toBe(2000); expect(b.totalTax).toBe(6200);
  });
  it('property allowance replaces expenses', () => expect(rentalTax({ rent: 3000, expenses: 200, financeCosts: 0, otherIncome: 20000, useAllowance: true }).profit).toBe(2000));
  it('MTD: £50,000 in 2024 to 2025 → 6 April 2026; exactly £50,000 → not yet', () => {
    expect(mtdStart(50001, '2024 to 2025')).toBe('2026-04-06');
    expect(mtdStart(50000, '2024 to 2025')).toBeNull();
    expect(mtdStart(35000, '2025 to 2026')).toBe('2027-04-06');
  });
});

describe('Inheritance Tax, GOV.UK and HMRC examples', () => {
  it('£500,000 estate, £325,000 threshold → 40% of £175,000', () => expect(iht({ estate: 500000 }).tax).toBe(70000));
  it('home £300,000 + £190,000 to children → nothing, £10,000 of nil-rate band unused', () => {
    const x = iht({ estate: 490000, homeToDescendants: 300000 });
    expect(x.tax).toBe(0); expect(x.unusedNrb).toBe(10000);
  });
  it('flat £100,000 + £400,000 to son, £500,000 to husband → £75,000 taxed, £75,000 RNRB to transfer', () => {
    const x = iht({ estate: 1000000, homeToDescendants: 100000, exempt: 500000 });
    expect(x.chargeable).toBe(75000); expect(x.unusedRnrb).toBe(75000);
  });
  it('gifts of £100,000 use the nil-rate band first → £50,000 taxed in the estate', () => expect(iht({ estate: 450000, homeToDescendants: 200000, gifts: 100000 }).chargeable).toBe(50000));
  it('taper: £2,100,000 estate, 2018 to 2019 band £125,000 → £75,000', () => {
    expect(iht({ estate: 2100000, homeToDescendants: 450000 }, { ...ihtParams(), residence_nil_rate_band: 125000 }).rnrb).toBe(75000);
    expect(iht({ estate: 2250000, homeToDescendants: 450000 }, { ...ihtParams(), residence_nil_rate_band: 125000 }).rnrb).toBe(0);
  });
  it('a couple passing the home to children: £1m before tax', () => expect(iht({ estate: 1000000, homeToDescendants: 400000, transferredNrb: 1, transferredRnrb: 1 }).tax).toBe(0));
  it('pension pot counts only for deaths from 6 April 2027', () => {
    expect(iht({ estate: 400000, pension: 200000 }).tax).toBe(30000);
    expect(iht({ estate: 400000, pension: 200000, deathFromApril2027: true }).tax).toBe(110000);
  });
  it('Sally: £325,000 to sister 4 years before, £100,000 to friend 3 years before → £32,000; estate £400,000 → £160,000', () => {
    expect(giftTax(325000, 4.17, 0).tax).toBe(0);
    expect(giftTax(100000, 3, 325000).tax).toBe(32000);
    expect(iht({ estate: 400000, gifts: 425000 }).tax).toBe(160000);
  });
  it('taper relief table', () => {
    expect([2.9, 3, 4, 5, 6, 7].map(giftRate)).toEqual([0.4, 0.32, 0.24, 0.16, 0.08, 0]);
  });
});

describe('dividends at the 2025 to 2026 rates (for comparisons)', () => {
  it('£2,500 above the allowance at 8.75% → £218.75', () => expect(dividendTax({ otherIncome: 29570, dividends: 3000, rates: P.wealth.dividends.previous_rates }).dividendTax).toBe(218.75));
});

describe('more HMRC cases', () => {
  it('Brian, second year: £2,000 brought forward → credit £3,400, tax £9,000', () => {
    const b = rentalTax({ rent: 24000, expenses: 2000, financeCosts: 15000, otherIncome: 36000, broughtForward: 2000 }, S24_TEST_PARAMS);
    expect(b.credit).toBe(3400); expect(b.totalTax).toBe(9000);
  });
  it('RNRB with gifts of £700,000: estate £750,000, home £500,000 → £575,000 chargeable', () => expect(iht({ estate: 750000, homeToDescendants: 500000, gifts: 700000 }).chargeable).toBe(575000));
});
