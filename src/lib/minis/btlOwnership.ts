import { compute } from '../engine/tax';
import { gbp, nationOptions, NATIONS } from './_kit';
/** Buy-to-let: the same rental flat bought by a first-time landlord, a homeowner and a limited company. */
export default () => ({
  title: 'Buy-to-let: who pays what on your price',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Price of the rental property', def: 220000, unit: '£', max: 50_000_000 },
    { id: 'n', label: 'Where is it?', def: 0, options: nationOptions },
  ],
  run: ({ p, n }: Record<string, number>) => {
    const nation = NATIONS[n] ?? 'england';
    const owner = compute({ nation, price: p, situation: 'additional' });
    const noHome = compute({ nation, price: p, situation: 'home' });
    const company = compute({ nation, price: p, situation: 'additional', company: true, companyRelief: true });
    return {
      head: [`${owner.taxName} for a landlord who owns a home`, gbp(owner.total)] as [string, string],
      rows: [
        ['Of which surcharge (not refundable on a rental)', gbp(owner.surcharge)],
        ['Landlord who owns no other dwelling', gbp(noHome.total)],
        ['Limited company letting the property', gbp(company.total)],
      ] as [string, string][],
      note: company.rule,
    };
  },
});
