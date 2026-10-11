/** Capital Gains Tax on a property or other asset, 2026 to 2027: gain, Private Residence Relief,
 *  allowance, 18% and 24% slices, 60-day deadline. Engine: lib/engine/wealth.ts. */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { cgt, propertyGain, WP } from '../../lib/engine/wealth';
import { formatMoney } from '../../lib/format';
import { ResultCard, Shell, Form } from './_wealthUi';

const gbp = (n: number) => formatMoney(n, 0);
const pct = (x: number) => `${Math.round(x * 1000) / 10}%`;
export default function CgtTool({ mode = 'property' }: { mode?: 'property' | 'any' }) {
  const [sale, setSale] = useState(325000);
  const [purchase, setPurchase] = useState(210000);
  const [costs, setCosts] = useState(9000);
  const [improve, setImprove] = useState(0);
  const [share, setShare] = useState('1');
  const [income, setIncome] = useState(35000);
  const [owned, setOwned] = useState(120);
  const [lived, setLived] = useState(0);
  const [other, setOther] = useState('0');
  const g = useMemo(() => propertyGain({ sale, purchase, buyingCosts: costs, improvements: improve, share: Number(share), monthsOwned: owned, monthsLived: lived }), [sale, purchase, costs, improve, share, owned, lived]);
  const taxableIncome = Math.max(0, income - WP.income_tax.personal_allowance);
  const r = useMemo(() => cgt({ gains: g.chargeable, taxableIncome, aea: other === '1' ? 0 : WP.cgt.annual_exempt_amount }), [g.chargeable, taxableIncome, other]);
  return (
    <Shell>
      <Form>
        <NumberField id="cg-sale" label={mode === 'property' ? 'Sale price of the property' : 'Sale price or value when disposed of'} value={sale} onChange={setSale} unit="£" max={50_000_000} />
        <NumberField id="cg-buy" label="Price paid (or value when inherited)" value={purchase} onChange={setPurchase} unit="£" max={50_000_000} />
        <NumberField id="cg-costs" label="Buying and selling costs (stamp duty, legal, agent)" value={costs} onChange={setCosts} unit="£" max={5_000_000} />
        <NumberField id="cg-impr" label="Improvements (not repairs)" value={improve} onChange={setImprove} unit="£" max={10_000_000} />
        <SelectField id="cg-share" label="Your share" value={share} onChange={setShare} options={[{ value: '1', label: 'All of it' }, { value: '0.5', label: 'Half (joint owners)' }, { value: '0.25', label: 'A quarter' }]} />
        <NumberField id="cg-inc" label="Your income in the tax year of the sale" value={income} onChange={setIncome} unit="£" max={10_000_000} help="Salary, pension, rental profit: before the Personal Allowance" />
        {mode === 'property' && <NumberField id="cg-own" label="Months you owned it" value={owned} onChange={setOwned} unit="months" max={1200} />}
        {mode === 'property' && <NumberField id="cg-live" label="Months it was your main home" value={lived} onChange={setLived} unit="months" max={1200} help="0 for a buy-to-let or second home never lived in" />}
        <SelectField id="cg-other" label="Allowance already used on other gains this year?" value={other} onChange={setOther} options={[{ value: '0', label: 'No' }, { value: '1', label: 'Yes, used elsewhere' }]} />
      </Form>
      <ResultCard label="Capital Gains Tax to pay" value={gbp(r.tax)} sub={<>On a gain of {gbp(g.gain)}{g.prr ? <>, of which {gbp(g.prr)} covered by Private Residence Relief ({pct(g.prrShare)})</> : null}.</>}
        rows={[
          ['Chargeable gain', gbp(g.chargeable)],
          ['Annual exempt amount used', gbp(r.aea)],
          [`Taxed at ${pct(WP.cgt.rate_lower)}`, gbp(r.atLower)],
          [`Taxed at ${pct(WP.cgt.rate_higher)}`, gbp(r.atHigher)],
          ['Average rate on the chargeable gain', g.chargeable ? pct(r.tax / g.chargeable) : '0%'],
        ]}
        note={<>Tax year 6 April 2026 to 5 April 2027. A UK home sold at a gain with tax due must be reported and paid within {WP.cgt.report_days_residential} days of completion. Losses, other reliefs and gifts between spouses are not modelled here.</>} />
    </Shell>
  );
}
