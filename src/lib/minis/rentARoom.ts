import { WP, gbp } from './_wkit';
export default () => ({
  title: 'Property allowance, Rent a Room or expenses',
  cta: 'Full rental income tax calculator',
  inputs: [{ id: 'r', label: 'Rent received in the year', def: 6000, unit: '£', max: 10_000_000 }, { id: 'e', label: 'Expenses', def: 700, unit: '£', max: 10_000_000 }, { id: 'h', label: 'Furnished room in your own home?', def: 0, options: [{ value: '0', label: 'No, a separate let' }, { value: '1', label: 'Yes, a lodger' }] }],
  run: ({ r, e, h }: Record<string, number>) => {
    const A = WP.income_tax.property_allowance, R = WP.income_tax.rent_a_room;
    // HMRC: the property allowance cannot be used on room income under the Rent a Room Scheme,
    // so a lodger compares the scheme with actual expenses, a separate let compares expenses with the allowance.
    const opts: Array<[string, number]> = [['Actual expenses', Math.max(0, r - e)]];
    if (h === 1) opts.push([`Rent a Room (${gbp(R)})`, r <= R ? 0 : r - R]);
    else opts.push([`Property allowance (${gbp(A)})`, Math.max(0, r - A)]);
    const best = opts.reduce((a, b) => (b[1] < a[1] ? b : a));
    return {
      head: ['Lowest taxable profit', gbp(best[1])] as [string, string],
      rows: opts.map(([k, v]) => [k, gbp(v)]) as [string, string][],
      note: `Best option here: ${best[0]}.`,
    };
  },
});
