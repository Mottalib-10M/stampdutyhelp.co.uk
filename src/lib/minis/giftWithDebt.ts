import { compute } from '../engine/tax';
import { gbp, nationOptions, NATIONS } from './_kit';
/** Exemptions: a gift is exempt only while no debt passes with it. Tax on the mortgage taken over. */
export default () => ({
  title: 'A gift that carries a mortgage: is it still exempt?',
  cta: 'Full calculator with every situation',
  inputs: [
    { id: 'm', label: 'Mortgage debt you take over', def: 180000, unit: '£', max: 50_000_000 },
    { id: 'n', label: 'Where is the property?', def: 0, options: nationOptions },
  ],
  run: ({ m, n }: Record<string, number>) => {
    const nation = NATIONS[n] ?? 'england';
    const r = compute({ nation, price: m, situation: 'home' });
    const add = compute({ nation, price: m, situation: 'additional' });
    return {
      head: [`${r.taxName} on the “gift”`, gbp(r.total)] as [string, string],
      rows: [
        ['Chargeable consideration (the debt)', gbp(m)],
        ['If you keep another home', gbp(add.total)],
        ['Same gift with no debt passing', gbp(0)],
      ] as [string, string][],
      note: m > 0 ? 'Taking over debt is consideration: the gift is taxed as a purchase at that price.' : 'No consideration: an outright gift carries no tax.',
    };
  },
});
