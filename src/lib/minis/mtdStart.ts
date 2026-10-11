import { mtdStart } from '../engine/wealth';
import { gbp, WP } from './_wkit';
import { displayDate } from '../format';
const years = WP.rental.mtd.map(([, , y]) => y) as Array<'2024 to 2025' | '2025 to 2026' | '2026 to 2027'>;
export default () => ({
  title: 'When Making Tax Digital starts for you',
  cta: 'Rental income tax calculator',
  inputs: [{ id: 'q', label: 'Gross rent plus self-employed turnover', def: 42000, unit: '£', max: 100_000_000 }, { id: 'y', label: 'Tax year of that income', def: 1, options: years.map((y, i) => ({ value: String(i), label: y })) }],
  run: ({ q, y }: Record<string, number>) => {
    const start = mtdStart(q, years[y]);
    return {
      head: ['Start using MTD for Income Tax', start ? displayDate(start, 'en-GB') : 'Not from this year’s income'] as [string, string],
      rows: WP.rental.mtd.map(([d, t, yy]) => [`Over ${gbp(t as number)} in ${yy}`, displayDate(d as string, 'en-GB')]) as [string, string][],
      note: 'Qualifying income is gross: rent and turnover before expenses, for each owner’s share.',
    };
  },
});
