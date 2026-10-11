import { rentalTax, incomeTax } from '../engine/wealth';
import { gbp } from './_wkit';
export default () => ({
  title: 'What Section 24 costs you',
  cta: 'Full rental income tax calculator',
  inputs: [{ id: 'r', label: 'Rent less expenses (before interest)', def: 18000, unit: '£', max: 10_000_000 }, { id: 'f', label: 'Mortgage interest', def: 9000, unit: '£', max: 10_000_000 }, { id: 'o', label: 'Salary and other income', def: 45000, unit: '£', max: 10_000_000 }],
  run: ({ r, f, o }: Record<string, number>) => {
    const now = rentalTax({ rent: r, expenses: 0, financeCosts: f, otherIncome: o });
    const old = incomeTax(o + Math.max(0, r - f)).tax - incomeTax(o).tax;
    return {
      head: ['Extra tax compared with deducting interest', gbp(Math.max(0, now.rentalTax - old), 2)] as [string, string],
      rows: [['Tax on the rent today', gbp(now.rentalTax, 2)], ['If interest were still deducted', gbp(old, 2)], ['Finance-cost credit', gbp(now.credit, 2)]] as [string, string][],
    };
  },
});
