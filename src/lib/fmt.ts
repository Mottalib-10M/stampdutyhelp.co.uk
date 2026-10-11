/** Formatters with no dependency on routes (safe to import from page files and the engine side). */
import { formatMoney, formatNumber } from './format';
export const gbp = (n: number, d = 0) => formatMoney(n, d);
/** Rate as written by the authorities: 5%, 7.5%, 12.5%. */
export const pct = (x: number) => {
  const v = Math.round(x * 10000) / 100;
  // 5%, 7.5%, and two decimals only when the rate has them (dividend rates of 10.75% and 35.75%).
  return `${formatNumber(v, Number.isInteger(v) ? 0 : Number.isInteger(Math.round(v * 10) / 10) && Math.abs(v * 10 - Math.round(v * 10)) < 1e-9 ? 1 : 2)}%`;
};
