/** Formatters with no dependency on routes (safe to import from page files and the engine side). */
import { formatMoney, formatNumber } from './format';
export const gbp = (n: number, d = 0) => formatMoney(n, d);
/** Rate as written by the authorities: 5%, 7.5%, 12.5%. */
export const pct = (x: number) => `${formatNumber(Math.round(x * 10000) / 100, Number.isInteger(Math.round(x * 1000) / 10) ? 0 : 1)}%`;
