import { definePage } from '../../lib/page-types';
import { P, gbp, pct, t, top, place } from '../../lib/kit';
import { monthLabel } from '../../lib/hpi';
import { typesTable } from '../../lib/city';

const R = place('birmingham');
const M = monthLabel();
const S = P.sdlt;
const flat = R.flat as number, ter = R.terraced as number, semi = R.semi as number, det = R.detached as number;

export default definePage({
  id: 'stamp-duty-birmingham',
  group: 'places',
  order: 420,
  slug: 'stamp-duty-birmingham',
  place: 'birmingham',
  nav: 'Birmingham',
  card: `Average ${gbp(R.avg)}: ${gbp(t('england', R.avg))} of SDLT; a landlord pays ${gbp(t('england', flat, 'additional'))} on the average flat.`,
  title: `Stamp Duty Birmingham 2026: ${gbp(t('england', R.avg))} on a ${gbp(R.avg)} Home`,
  description: `Stamp duty in Birmingham in 2026: ${gbp(t('england', R.avg))} on the ${gbp(R.avg)} average home (UK HPI, ${M}), nothing for the typical first-time buyer, the cost of moving up.`,
  h1: 'Stamp duty in Birmingham',
  intro: 'Cheap flats, mid-priced family houses: in Birmingham the tax depends above all on whether you already own a home.',
  resume: `A home in Birmingham sold for ${gbp(R.avg)} on average in ${M}, on the UK House Price Index, and a buyer who will own only that home pays ${gbp(t('england', R.avg))} of Stamp Duty Land Tax, all of it from the ${pct(S.residential[1][1])} band between ${gbp(top(S.residential, 0) + 1)} and ${gbp(top(S.residential, 1))}. The average first-time buyer paid ${gbp(R.ftb as number)}, comfortably inside the nil band of first-time buyer relief, so a typical first purchase in the city carries no tax. The picture changes for anyone who already owns a home: the average flat, at ${gbp(flat)}, costs ${gbp(t('england', flat))} for an owner-occupier but ${gbp(t('england', flat, 'additional'))} for a landlord, because the ${pct(S.higher_rates_surcharge)} surcharge starts from the first pound above ${gbp(S.higher_rates_min_price)}. A family trading a terrace for a semi pays ${gbp(t('england', semi))} on the average semi-detached price, provided the old house is sold by completion.`,
  faqs: [
    { q: 'How much stamp duty is there on a typical Birmingham terrace?', a: `At the ${gbp(ter)} average terraced price, ${gbp(t('england', ter))} for a buyer replacing their home or buying their only home, nothing for a first-time buyer, and ${gbp(t('england', ter, 'additional'))} for someone adding it to a home they keep. The whole standard bill comes from the ${pct(S.residential[1][1])} band, because the price stays under ${gbp(top(S.residential, 1))}.` },
    { q: 'Why does a cheap flat in Birmingham still cost a landlord thousands in stamp duty?', a: `Because the higher rates add ${pct(S.higher_rates_surcharge)} to every band, including the nil band. On the ${gbp(flat)} average flat an owner-occupier pays ${gbp(t('england', flat))}, while a landlord pays ${pct(S.higher_rates_surcharge)} of the first ${gbp(top(S.residential, 0))} plus the surcharged rate on the rest: ${gbp(t('england', flat, 'additional'))} in all. Only purchases under ${gbp(S.higher_rates_min_price)} escape the surcharge.` },
    { q: 'We are moving from a semi to a detached house in Birmingham. What will the move cost in tax?', a: `On the ${gbp(det)} average detached price, ${gbp(t('england', det))}, of which most comes from the ${pct(S.residential[2][1])} band above ${gbp(top(S.residential, 1))}. If your semi has not sold by completion day, you pay ${gbp(t('england', det, 'additional'))} instead and claim back ${gbp(t('england', det, 'additional') - t('england', det))} once it sells within ${S.replace_main_residence_years} years.` },
  ],
  tool: 'calc',
  toolProps: { lockNation: true },
  related: ['stamp-duty-manchester', 'stamp-duty-leeds', 'buy-to-let-stamp-duty', 'stamp-duty-moving-home', 'stamp-duty-on-250000', 'stamp-duty-by-area'],
  sources: ['ukhpi', 'govSdltRates', 'govSdltHigher'],
  body: (h) => `
<h2>What each kind of Birmingham home costs in tax</h2>
${typesTable(h, R)}
<p>Every average except the detached house sits below ${h.gbp(top(S.residential, 1))}, which keeps the standard bill modest: ${h.pct(S.residential[1][1])} of whatever lies above ${h.gbp(top(S.residential, 0))}. The detached average, ${h.gbp(det)}, is the only one to reach the ${h.pct(S.residential[2][1])} band. Prices rose ${h.num(R.change ?? 0, 1)}% over the year to ${M}; on the average home, a rise of that size changes the tax by a few dozen pounds, not more.</p>
<h2>The landlord’s bill</h2>
<p>On cheap homes the surcharge is out of proportion to the standard tax. Compare the columns for the average flat: ${h.gbp(h.t('england', flat))} against ${h.gbp(h.t('england', flat, 'additional'))}, almost ${h.num(h.t('england', flat, 'additional') / Math.max(1, h.t('england', flat)), 0)} times as much. A first-time buyer who buys a flat to let gets no relief either, because the relief requires the buyer to live in the home, though without another home the surcharge does not apply. Buying through a company changes nothing below ${h.gbp(S.corporate_flat_threshold)}: the company pays the same higher rates. The ${h.a('buy-to-let-stamp-duty', 'buy-to-let guide')} sets the options side by side.</p>
<h2>Moving up a rung</h2>
<p>The typical move in the city is from a terrace or flat to a semi. The tax on the new home depends only on its price, not on the gain: ${h.gbp(h.t('england', semi))} on the average semi, ${h.gbp(h.t('england', det))} on the average detached house. The trap is timing. Complete before the old home is sold and the purchase is treated as an additional dwelling for a while, which means paying ${h.gbp(h.t('england', semi, 'additional') - h.t('england', semi))} more on the semi up front and reclaiming it later through the ${h.a('stamp-duty-surcharge-refund', 'refund calculator')} procedure.</p>`,
});
