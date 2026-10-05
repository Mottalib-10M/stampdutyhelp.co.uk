import { compute } from '../engine/tax';
import { gbp, yesNo } from './_kit';
export default () => ({
  title: 'SDLT when a company buys a home',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'p', label: 'Price of the dwelling', def: 650000, unit: '£', max: 50_000_000 },
    { id: 'r', label: 'Does a relief apply (letting, development, trading)?', def: 0, options: yesNo },
  ],
  run: ({ p, r }: Record<string, number>) => {
    const co = compute({ nation: 'england', price: p, situation: 'home', company: true, companyRelief: r === 1 });
    const other = compute({ nation: 'england', price: p, situation: 'home', company: true, companyRelief: r !== 1 });
    return {
      head: ['SDLT payable by the company', gbp(co.total)] as [string, string],
      rows: [
        [r === 1 ? 'Without the relief' : 'With a relief', gbp(other.total)],
        ['Same home bought by an individual as a sole home', gbp(co.mainTax)],
        ['Company in Scotland / Wales', `${gbp(compute({ nation: 'scotland', price: p, situation: 'home', company: true }).total)} / ${gbp(compute({ nation: 'wales', price: p, situation: 'home', company: true }).total)}`],
      ] as [string, string][],
      note: co.rule,
    };
  },
});
