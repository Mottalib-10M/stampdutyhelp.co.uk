import { definePage } from '../../lib/page-types';
import { P, gbp, pct } from '../../lib/kit';
import { iht, ihtParams } from '../../lib/engine/wealth';

const I = P.wealth.iht;
const gone = I.taper_threshold + I.residence_nil_rate_band / I.taper_ratio;
const ex = iht({ estate: 2100000, homeToDescendants: 450000 });

export default definePage({
  id: 'residence-nil-rate-band',
  group: 'inheritance',
  order: 40,
  slug: 'residence-nil-rate-band',
  nav: 'Residence nil-rate band',
  card: `Up to ${gbp(I.residence_nil_rate_band)} more when the home goes to children, lost gradually between ${gbp(I.taper_threshold)} and ${gbp(gone)}.`,
  title: `Residence Nil-Rate Band 2026: ${gbp(I.residence_nil_rate_band)} and the Taper`,
  description: `Residence nil-rate band in 2026: up to ${gbp(I.residence_nil_rate_band)} when a home passes to children, tapered above ${gbp(I.taper_threshold)}. A ${gbp(2100000)} estate keeps ${gbp(ex.rnrb)} of the band.`,
  h1: 'The residence nil-rate band: the extra allowance for the family home',
  intro: 'A second tax-free band that only exists when a home goes to direct descendants, and fades away on large estates.',
  resume: `The residence nil-rate band adds up to ${gbp(I.residence_nil_rate_band)} to the ${gbp(I.nil_rate_band)} Inheritance Tax threshold when a home, or a share of one, passes on death to their children, grandchildren or other direct descendants. It has been ${gbp(I.residence_nil_rate_band)} since 6 April 2020 and HMRC’s table keeps it there until 5 April 2030. It can never exceed the value of the home itself, and any part the home does not use cannot be set against savings, though it can pass to a surviving spouse. Estates worth more than ${gbp(I.taper_threshold)}, measured before exemptions and reliefs, lose ${gbp(1)} of the band for every ${gbp(1 / I.taper_ratio)} above that line, so a single person’s band disappears at ${gbp(gone)}. On a ${gbp(2100000)} estate with a ${gbp(450000)} house left to the children, only ${gbp(ex.rnrb)} of the band survives the taper.`,
  faqs: [
    { q: 'Does the residence band apply if the house is sold before probate and the children get the money?', a: 'Yes. HMRC accepts that the home does not have to end up in the descendants’ hands: if the executor sells it during the administration and passes the proceeds to the children, the estate still qualifies. The children are equally free to sell the house the day after they inherit it. What matters is that they became entitled to it on the death.' },
    { q: 'My will says my grandchildren inherit the house at 25. Does that still qualify?', a: 'Probably not. HMRC requires the descendants to become entitled to the home when the person dies. A condition such as reaching a certain age means the property is held in a trust in the meantime, and the residence band then does not apply. A deed of variation signed after the death can sometimes rearrange the gift so that it qualifies.' },
    { q: 'My aunt left me her house. Do I get the residence band?', a: `No. HMRC’s list of direct descendants covers children, stepchildren, adopted and fostered children, grandchildren and their spouses, but excludes nephews, nieces and siblings. Your aunt’s estate keeps its ${gbp(I.nil_rate_band)} nil-rate band, and anything above it, house included, is taxed at ${pct(I.rate)}.` },
    { q: 'If the estate is above £2 million, is it worth giving assets away to get under the taper?', a: `It can be, because the taper is measured on the estate at death. Gifts made more than ${I.gift_years} years before death are outside it, and gifts to a spouse reduce the giver’s estate, though they raise the survivor’s. Gifts within the ${I.gift_years} years still use the nil-rate band. Take advice before acting: a gift you keep benefiting from counts as never made.` },
  ],
  mini: 'rnrbTaper',
  miniHref: 'inheritance-tax-calculator',
  related: ['inheritance-tax-threshold', 'inheritance-tax-calculator', 'inheritance-tax', 'inheritance-tax-gifts', 'inherited-property-stamp-duty'],
  sources: ['govRnrb', 'govIhtThresholds', 'govIht'],
  body: (h) => {
    const old = (rnrb: number) => ({ ...ihtParams(), residence_nil_rate_band: rnrb });
    const hist = (I.rnrb_history as Array<[string, number]>).map(([y, v]) => [y, h.gbp(v)]);
    const taperRows = [2000000, 2100000, 2200000, 2300000, 2350000, 2500000].map((e) => { const r = iht({ estate: e, homeToDescendants: 600000 }); return [h.gbp(e), h.gbp(r.taper), h.gbp(r.rnrb), h.gbp(r.tax)]; });
    return `
<h2>Three conditions</h2>
<p>The band is not a relief on the house; it is an addition to the threshold that the house unlocks. HMRC sets three conditions. The estate must include a home, or a share of one. That home must pass to direct descendants, either named in the will or as part of the residue left after specific legacies, or through a deed of variation signed after the death, and they must become entitled to it on the death rather than at a later age. And the band claimed is the lower of the maximum available and the value of the home passing to those descendants.</p>
<p>Direct descendants are children, grandchildren and further lineal descendants, a stepchild whose parent is or was the person’s spouse or civil partner, adopted children, children fostered at any time, and children the person was guardian of before they turned 18. The spouse or civil partner of any of them also counts, including a widowed son-in-law. Nephews, nieces and siblings do not.</p>
<h2>HMRC’s examples, recalculated</h2>
<p>Each worked example in HMRC’s guidance runs through this site’s engine with the band of the year HMRC used. A man who died in 2020 to 2021 leaving a home worth ${h.gbp(300000)} and ${h.gbp(190000)} of other assets to his children owed nothing: the band of ${h.gbp(iht({ estate: 490000, homeToDescendants: 300000 }).rnrb)} came off first, the nil-rate band covered the remaining ${h.gbp(490000 - I.residence_nil_rate_band)}, and ${h.gbp(iht({ estate: 490000, homeToDescendants: 300000 }).unusedNrb)} of nil-rate band was left for his wife. A woman who left a flat worth ${h.gbp(100000)} to her son could use only ${h.gbp(100000)} of band, because the band never exceeds the home; the other ${h.gbp(iht({ estate: 1000000, homeToDescendants: 100000, exempt: 500000 }).unusedRnrb)} passed to her husband’s estate.</p>
<p>The taper example dates from 2018 to 2019, when the band was ${h.gbp(125000)}. An estate of ${h.gbp(2100000)}, including a ${h.gbp(450000)} home left to the children, was ${h.gbp(100000)} over the threshold, which removed ${h.gbp(100000 * I.taper_ratio)}: the band fell to ${h.gbp(iht({ estate: 2100000, homeToDescendants: 450000 }, old(125000)).rnrb)}. With today’s band the same estate keeps ${h.gbp(ex.rnrb)}.</p>
<h2>The taper in figures</h2>
${h.table(['Estate before exemptions', 'Taper', 'Band left', 'Inheritance Tax'], taperRows, `Single person, ${h.gbp(600000)} home left to the children`, ['r', 'r', 'r', 'r'])}
<p>The value tested for the taper is the whole estate less debts, before taking off the spouse exemption or Business and Agricultural Relief. A widow whose estate passes partly to a new partner and partly to the children can therefore lose band she would never have used anyway. Between ${h.gbp(I.taper_threshold)} and ${h.gbp(gone)}, each extra ${h.gbp(100)} of estate costs ${h.gbp(100 * I.rate)} of tax on itself and removes ${h.gbp(100 * I.taper_ratio)} of band, which costs another ${h.gbp(100 * I.taper_ratio * I.rate)}: an effective ${h.pct(I.rate * (1 + I.taper_ratio))} on that slice.</p>
<h2>Passing the band to a surviving spouse</h2>
<p>Whatever percentage of the band the first spouse did not use transfers to the survivor’s estate, applied to the band in force at the second death. If the first estate went entirely to the survivor, nothing was used and the survivor can claim double. If it was above ${h.gbp(I.taper_threshold)}, its own taper reduces the transferable share, even if no band was claimed. In HMRC’s example a man left a ${h.gbp(450000)} home to his wife and the rest of a ${h.gbp(2100000)} estate to the children; his taper cut the potential band to ${h.gbp(75000)} of ${h.gbp(125000)}, so only ${h.pct(75000 / 125000)} could pass to his wife.</p>
<h2>How the band has grown</h2>
${h.table(['Tax year', 'Maximum residence band'], hist, 'Residence nil-rate band since its introduction on 6 April 2017', ['l', 'r'])}
<p>Downsizing does not have to lose the band. Someone who sold a home or moved into a smaller one can keep some of the band when other assets go to descendants; HMRC’s online calculator has a route for downsizing and asks for the figures of the IHT400 account and its IHT435 schedule.</p>
<h2>A home split between relatives</h2>
<p>When a house goes partly to a descendant and partly to someone else, only the descendant’s share counts. HMRC’s example is a woman whose ${h.gbp(500000)} home was left half to her stepson and half to her nephew. The stepson’s half, worth ${h.gbp(250000)}, is the value tested, and the band is the lower of that and the maximum: ${h.gbp(iht({ estate: 500000, homeToDescendants: 250000 }).rnrb)} with today’s figures. The nephew’s half still counts in the estate but brings no band with it. The same proportion applies when the house falls into the residue shared between several people: each is treated as inheriting a slice of the home, and only the slices that reach direct descendants unlock the band.</p>
<h2>Why large lifetime gifts do not touch it</h2>
<p>Gifts made in the ${I.gift_years} years before death are set against the ordinary nil-rate band, never against the residence band. HMRC illustrates this with a grandfather who gave ${h.gbp(700000)} to grandchildren and a nephew in his last years, then left a ${h.gbp(500000)} house and ${h.gbp(250000)} of savings to a granddaughter. The gifts used up all of his ${h.gbp(I.nil_rate_band)} band, and tax was due on ${h.gbp(700000 - I.nil_rate_band)} of them. Yet the estate still deducted ${h.gbp(iht({ estate: 750000, homeToDescendants: 500000, gifts: 700000 }).rnrb)} of residence band before tax, leaving ${h.gbp(iht({ estate: 750000, homeToDescendants: 500000, gifts: 700000 }).chargeable)} chargeable. Families who help children onto the property ladder early do not, for that reason alone, lose the allowance on the house left at the end.</p>
<h2>Where it meets the purchase taxes</h2>
<p>Children who inherit the family home and already own a house of their own face a choice: sell, let or move in. Selling soon after the death usually means little ${h.a('capital-gains-tax-on-property', 'Capital Gains Tax')}, because the gain is measured from the probate value. Keeping a share while buying a home of their own can trigger the ${h.a('inherited-property-stamp-duty', 'stamp duty surcharge')} unless the inherited share is small enough to be ignored for ${h.P.sdlt.inherited_years} years.</p>`;
  },
});
