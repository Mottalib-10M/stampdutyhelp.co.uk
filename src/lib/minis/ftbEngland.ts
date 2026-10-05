import { compute, sdltPrevious } from '../engine/tax';
import { gbp } from './_kit';
export default () => ({
  title: 'First-time buyer relief on your price',
  cta: 'Full calculator with every situation',
  inputs: [{ id: 'p', label: 'Purchase price', def: 350000, unit: '£', max: 50_000_000 }],
  run: ({ p }: Record<string, number>) => {
    const ftb = compute({ nation: 'england', price: p, situation: 'first' });
    const std = compute({ nation: 'england', price: p, situation: 'home' });
    return {
      head: ['SDLT for a first-time buyer, England or NI', gbp(ftb.total)] as [string, string],
      rows: [
        ['Without the relief', gbp(std.total)],
        ['Relief saves', gbp(ftb.ftbSaving)],
        ['Under the rates before 1 April 2025', gbp(sdltPrevious(p, 'first'))],
        ['Same buyer in Scotland / Wales', `${gbp(compute({ nation: 'scotland', price: p, situation: 'first' }).total)} / ${gbp(compute({ nation: 'wales', price: p, situation: 'first' }).total)}`],
      ] as [string, string][],
      note: ftb.notes[0],
    };
  },
});
