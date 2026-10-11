import { cgt } from '../engine/wealth';
import { gbp, pc, PA, WP } from './_wkit';
export default () => ({
  title: 'Which CGT rate applies to your gain',
  cta: 'Full Capital Gains Tax calculator',
  inputs: [{ id: 'g', label: 'Taxable gain this tax year', def: 40000, unit: '£', max: 100_000_000 }, { id: 'i', label: 'Income before the Personal Allowance', def: 38000, unit: '£', max: 10_000_000 }],
  run: ({ g, i }: Record<string, number>) => {
    const r = cgt({ gains: g, taxableIncome: Math.max(0, i - PA) });
    return {
      head: ['Capital Gains Tax, 2026 to 2027', gbp(r.tax)] as [string, string],
      rows: [[`At ${pc(WP.cgt.rate_lower)}`, gbp(r.atLower)], [`At ${pc(WP.cgt.rate_higher)}`, gbp(r.atHigher)], ['Allowance deducted', gbp(r.aea)], ['Average rate on the gain', g ? pc(r.tax / g) : '0%']] as [string, string][],
    };
  },
});
