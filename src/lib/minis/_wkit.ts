/** Shared tools for the minis of the taxes after the purchase ("_" prefix: ignored by the registry). */
import { formatMoney } from '../format';
import { WP } from '../engine/wealth';
export const gbp = (x: number, d = 0) => formatMoney(x, d);
export const pc = (x: number) => `${Math.round(x * 10000) / 100}%`;
export const PA = WP.income_tax.personal_allowance;
export const regionOptions = [{ value: '0', label: 'England, Wales or NI' }, { value: '1', label: 'Scotland' }];
export const region = (n: number) => (n === 1 ? 'scotland' : 'ruk') as 'ruk' | 'scotland';
export { WP };
