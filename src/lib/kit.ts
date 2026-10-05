/**
 * What a page file needs to write figures into its title, description, answer block and FAQ
 * without typing a single rate (RECETTE §17.4, point 7): the parameters, the engine and the formatters.
 *   import { P, gbp, pct, t } from '../../lib/kit';
 *   title: `Stamp Duty First-Time Buyer Relief 2026: ${gbp(P.sdlt.first_time_buyer[0][0]!)} Rule`
 */
import { P } from './engine/params';
import { compute, sdltPrevious, type Nation, type Situation, type Input } from './engine/tax';
import { gbp, pct } from './fmt';
import { place } from './hpi';
export { P, compute, sdltPrevious, gbp, pct, place };
/** Total tax for a nation, price and situation. */
export const t = (nation: Nation, price: number, situation: Situation = 'home', extra: Partial<Input> = {}) => compute({ nation, price, situation, ...extra }).total;
/** Upper limit of band i of a band table. */
export const top = (bands: Array<[number | null, number]>, i: number) => bands[i][0] as number;
