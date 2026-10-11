import { dividendTax } from '../engine/wealth';
import { gbp, WP } from './_wkit';
export default () => ({
  title: 'Tax on your dividends this year',
  cta: 'Full dividend tax calculator',
  inputs: [{ id: 'd', label: 'Dividends', def: 6000, unit: '£', max: 10_000_000 }, { id: 'o', label: 'Salary and other income', def: 45000, unit: '£', max: 10_000_000 }],
  run: ({ d, o }: Record<string, number>) => {
    const r = dividendTax({ otherIncome: o, dividends: d });
    const old = dividendTax({ otherIncome: o, dividends: d, rates: WP.dividends.previous_rates }).dividendTax;
    return {
      head: ['Dividend tax, 2026 to 2027', gbp(r.dividendTax, 2)] as [string, string],
      rows: [['Tax-free (allowance)', gbp(r.allowanceUsed)], ['Top band reached', r.band], ['Same dividends at 2025 to 2026 rates', gbp(old, 2)]] as [string, string][],
    };
  },
});
