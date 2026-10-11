import { iht } from '../engine/wealth';
import { gbp } from './_wkit';
export default () => ({
  title: 'What the pension pot adds from April 2027',
  cta: 'Full Inheritance Tax calculator',
  inputs: [{ id: 'e', label: 'Estate without the pension', def: 450000, unit: '£', max: 500_000_000 }, { id: 'p', label: 'Unused pension pot', def: 250000, unit: '£', max: 100_000_000 }],
  run: ({ e, p }: Record<string, number>) => {
    const before = iht({ estate: e, pension: p });
    const after = iht({ estate: e, pension: p, deathFromApril2027: true });
    return {
      head: ['Extra Inheritance Tax from the pension', gbp(after.tax - before.tax)] as [string, string],
      rows: [['Death before 6 April 2027', gbp(before.tax)], ['Death from 6 April 2027', gbp(after.tax)]] as [string, string][],
      note: 'Single person, no home left to children. Death-in-service benefits stay outside the estate.',
    };
  },
});
