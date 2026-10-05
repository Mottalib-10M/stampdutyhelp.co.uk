/** Shared tools for the mini-simulators (ignored by the registry: "_" prefix). */
import { formatMoney, formatNumber } from '../format';
import { pct as pctRate } from '../fmt';
import type { Nation, Situation } from '../engine/tax';
export const gbp = (x: number) => formatMoney(x, 0);
export const num = (x: number, d = 0) => formatNumber(x, d);
export const pct = (x: number) => pctRate(x);
export const NATIONS: Nation[] = ['england', 'scotland', 'wales'];
export const nationOptions = [{ value: '0', label: 'England or Northern Ireland' }, { value: '1', label: 'Scotland' }, { value: '2', label: 'Wales' }];
export const SITUATIONS: Situation[] = ['first', 'home', 'additional'];
export const situationOptions = [{ value: '0', label: 'First-time buyer' }, { value: '1', label: 'Only home or moving home' }, { value: '2', label: 'Additional property' }];
export const yesNo = [{ value: '0', label: 'No' }, { value: '1', label: 'Yes' }];
export const rows = (r: Array<[string, string]>) => r;
