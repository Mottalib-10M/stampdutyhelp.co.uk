/** Reference cases: every worked example published by HMRC, Revenue Scotland and the Welsh Revenue
 *  Authority (read on 2026-10-05), then the boundaries of each rule (RECETTE §17.4, points 4 and 5). */
import { describe, it, expect } from 'vitest';
import { compute, banded, compareNations, resolveJoint, sharedOwnership, staircasingTax, transferConsideration, sdltPrevious, refundWindowEnd, addDays } from './tax';
import { P } from './params';

const E = (price: number, situation: 'first' | 'home' | 'additional' = 'home', extra = {}) => compute({ nation: 'england', price, situation, ...extra });
const S = (price: number, situation: 'first' | 'home' | 'additional' = 'home', extra = {}) => compute({ nation: 'scotland', price, situation, ...extra });
const W = (price: number, situation: 'first' | 'home' | 'additional' = 'home', extra = {}) => compute({ nation: 'wales', price, situation, ...extra });

describe('SDLT, GOV.UK worked examples', () => {
  it('£295,000 home → £4,750 (residential rates page)', () => expect(E(295000).total).toBe(4750));
  it('£500,000 first-time buyer → £10,000', () => expect(E(500000, 'first').total).toBe(10000));
  it('£300,000 additional property → £20,000 (higher rates guidance)', () => expect(E(300000, 'additional').total).toBe(20000));
  it('£275,000 non-residential → £3,250', () => expect(E(275000, 'home', { kind: 'nonresidential' }).total).toBe(3250));
  it('shared ownership, market value £280,000 → £4,000', () => expect(sharedOwnership(280000, 140000, false).marketValueElection).toBe(4000));
  it('shared ownership FTB, market value £450,000 → £7,500 (SDLTM29880)', () => expect(sharedOwnership(450000, 225000, true).marketValueElection).toBe(7500));
  it('shared ownership FTB in stages, £180,000 share of £450,000 → £0 (SDLTM29885)', () => expect(sharedOwnership(450000, 180000, true).stages).toBe(0));
  it('staircasing: £260,000 paid → £3,000, share of £65,000 → £750', () => {
    expect(banded(260000, P.sdlt.residential).tax).toBe(3000);
    expect(staircasingTax(260000, 65000)).toBe(750);
  });
});

describe('SDLT, Budget 2025 rate table (Annex A)', () => {
  it('rates by column at £1,000,000', () => {
    // 0 + 2% of 125k + 5% of 675k + 10% of 75k
    expect(E(1000000).total).toBe(2500 + 33750 + 7500);
    expect(E(1000000, 'home', { nonResident: true }).total).toBe(2500 + 33750 + 7500 + 20000);
    expect(E(1000000, 'additional').total).toBe(2500 + 33750 + 7500 + 50000);
    expect(E(1000000, 'additional', { nonResident: true }).total).toBe(2500 + 33750 + 7500 + 70000);
  });
  it('top band 12% above £1.5m', () => expect(E(2000000).total).toBe(2500 + 33750 + 57500 + 60000));
  it('surcharge and non-resident parts are split', () => {
    const r = E(1000000, 'additional', { nonResident: true });
    expect(r.surcharge).toBe(50000);
    expect(r.nonResidentSurcharge).toBe(20000);
    expect(r.refundable).toBe(50000);
  });
});

describe('SDLT boundaries', () => {
  it('nil band to £125,000', () => { expect(E(125000).total).toBe(0); expect(E(125001).total).toBe(0); expect(E(125100).total).toBe(2); });
  it('FTB nil to £300,000, relief lost above £500,000', () => {
    expect(E(300000, 'first').total).toBe(0);
    expect(E(500001, 'first').total).toBe(E(500001).total);
    expect(E(500001, 'first').notes.length).toBe(1);
  });
  it('FTB saving equals standard minus relief', () => expect(E(400000, 'first').ftbSaving).toBe(E(400000).total - E(400000, 'first').total));
  it('FTB non-resident pays relief rates plus 2 points', () => expect(E(400000, 'first', { nonResident: true }).total).toBe(5000 + 8000));
  it('higher rates start at £40,000', () => { expect(E(39999, 'additional').total).toBe(0); expect(E(40000, 'additional').total).toBe(2000); });
  it('company: 17% of the whole price above £500,000', () => {
    expect(E(600000, 'home', { company: true }).total).toBe(102000);
    expect(E(600000, 'home', { company: true, nonResident: true }).total).toBe(114000);
  });
  it('company at £500,000 or with relief pays higher rates', () => {
    expect(E(500000, 'home', { company: true }).total).toBe(E(500000, 'additional').total);
    expect(E(600000, 'home', { company: true, companyRelief: true }).total).toBe(E(600000, 'additional').total);
    expect(E(600000, 'home', { company: true, companyRelief: true }).refundable).toBe(0);
  });
  it('rates before 1 April 2025', () => {
    expect(sdltPrevious(295000, 'home')).toBe(2250);
    expect(sdltPrevious(500000, 'first')).toBe(3750);
    expect(sdltPrevious(300000, 'additional', 0.03)).toBe(11500);
  });
});

describe('LBTT, Revenue Scotland worked examples', () => {
  it('£135,000 → nil', () => expect(S(135000).total).toBe(0));
  it('£235,000 → £1,800', () => expect(S(235000).total).toBe(1800));
  it('£875,000 → £63,350', () => expect(S(875000).total).toBe(63350));
  it('FTB saves at most £600', () => {
    expect(S(175000, 'first').total).toBe(0);
    expect(S(400000).total - S(400000, 'first').total).toBe(600);
    expect(S(160000).total - S(160000, 'first').total).toBe(300);
  });
  it('ADS is 8% of the whole price on top of LBTT', () => {
    const r = S(300000, 'additional');
    expect(r.total).toBe(S(300000).total + 24000);
    expect(r.refundable).toBe(24000);
  });
  it('ADS starts at £40,000', () => { expect(S(39999, 'additional').total).toBe(0); expect(S(40000, 'additional').total).toBe(3200); });
  it('companies pay ADS on their first dwelling, no refund route', () => { expect(S(200000, 'home', { company: true }).total).toBe(S(200000).total + 16000); expect(S(200000, 'home', { company: true }).refundable).toBe(0); });
  it('no non-resident surcharge', () => expect(S(400000, 'home', { nonResident: true }).total).toBe(S(400000).total));
  it('non-residential bands', () => expect(S(465000, 'home', { kind: 'nonresidential' }).total).toBe(1000 + 10750));
});

describe('LTT, Welsh Revenue Authority worked examples', () => {
  it('£280,000 main rates → £3,300', () => expect(W(280000).total).toBe(3300));
  it('£260,000 second home → £15,950', () => expect(W(260000, 'additional').total).toBe(15950));
  it('refund equals higher minus main', () => expect(W(260000, 'additional').refundable).toBe(15950 - W(260000).total));
  it('no first-time buyer relief', () => { expect(W(300000, 'first').total).toBe(W(300000).total); expect(W(300000, 'first').notes.length).toBe(1); });
  it('higher rates start at £40,000', () => { expect(W(39999, 'additional').total).toBe(0); expect(W(40000, 'additional').total).toBe(2000); });
  it('top bands', () => expect(W(2000000).total).toBe(0 + 10500 + 26250 + 75000 + 60000));
  it('non-residential bands', () => expect(W(1200000, 'home', { kind: 'nonresidential' }).total).toBe(250 + 37500 + 12000));
});

describe('comparison, joint buyers, transfers, dates', () => {
  it('compares the three nations at £250,000', () => {
    const c = compareNations({ price: 250000, situation: 'home' });
    expect([c.england.total, c.scotland.total, c.wales.total]).toEqual([2500, 2100, 1500]);
  });
  it('one owner among joint buyers triggers the surcharge for all', () => {
    expect(resolveJoint([{ everOwned: false, ownsOther: false }, { everOwned: true, ownsOther: true }], false).situation).toBe('additional');
    expect(resolveJoint([{ everOwned: false, ownsOther: false }, { everOwned: true, ownsOther: false }], false).situation).toBe('home');
    expect(resolveJoint([{ everOwned: false, ownsOther: false }, { everOwned: false, ownsOther: false }], false).situation).toBe('first');
  });
  it('non-resident spouse of a UK resident is treated as resident', () => {
    expect(resolveJoint([{ everOwned: false, ownsOther: false, nonResident: true }, { everOwned: false, ownsOther: false }], true).nonResident).toBe(false);
    expect(resolveJoint([{ everOwned: false, ownsOther: false, nonResident: true }, { everOwned: false, ownsOther: false }], false).nonResident).toBe(true);
  });
  it('transfer of equity: cash plus share of the mortgage', () => expect(transferConsideration(20000, 200000, 0.5)).toBe(120000));
  it('refund window and return deadline', () => {
    expect(refundWindowEnd('2026-10-05', 'england')).toBe('2029-10-05');
    expect(refundWindowEnd('2026-10-05', 'scotland')).toBe('2029-10-05');
    expect(addDays('2026-10-05', 14)).toBe('2026-10-19');
  });
});
