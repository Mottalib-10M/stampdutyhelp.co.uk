/** Income Tax on rental profits, 2026 to 2027, with the Section 24 finance-cost credit and the
 *  £1,000 property allowance. Engine: lib/engine/wealth.ts. */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { rentalTax, WP, type Region } from '../../lib/engine/wealth';
import { formatMoney } from '../../lib/format';
import { ResultCard, Shell, Form } from './_wealthUi';

const gbp = (n: number, d = 0) => formatMoney(n, d);
export default function RentalTool() {
  const [rent, setRent] = useState(14400);
  const [exp, setExp] = useState(2400);
  const [fin, setFin] = useState(6000);
  const [other, setOther] = useState(42000);
  const [region, setRegion] = useState<Region>('ruk');
  const [mode, setMode] = useState('0');
  const r = useMemo(() => rentalTax({ rent, expenses: exp, financeCosts: fin, otherIncome: other, region, useAllowance: mode === '1' }), [rent, exp, fin, other, region, mode]);
  const A = WP.income_tax.property_allowance;
  return (
    <Shell>
      <Form>
        <NumberField id="rt-rent" label="Rent received in the tax year" value={rent} onChange={setRent} unit="£" max={10_000_000} />
        <NumberField id="rt-exp" label="Allowable expenses (agent, repairs, insurance…)" value={exp} onChange={setExp} unit="£" max={10_000_000} />
        <NumberField id="rt-fin" label="Mortgage interest and other finance costs" value={fin} onChange={setFin} unit="£" max={10_000_000} />
        <NumberField id="rt-oth" label="Salary, pension and other income" value={other} onChange={setOther} unit="£" max={10_000_000} />
        <SelectField id="rt-reg" label="Where you live" value={region} onChange={(v) => setRegion(v as Region)} options={[{ value: 'ruk', label: 'England, Wales or Northern Ireland' }, { value: 'scotland', label: 'Scotland' }]} />
        <SelectField id="rt-mode" label="Deduct" value={mode} onChange={setMode} options={[{ value: '0', label: 'Actual expenses' }, { value: '1', label: `The ${gbp(A)} property allowance instead` }]} />
      </Form>
      <ResultCard label="Extra Income Tax because of the rent" value={gbp(r.rentalTax, 2)} sub={<>Taxable rental profit {gbp(r.profit)}; your top rate becomes {Math.round(r.marginal * 100)}%.</>}
        rows={[
          ['Tax without the rent', gbp(r.taxBefore, 2)],
          ['Tax with the rental profit added', gbp(r.taxWithRent, 2)],
          [`Finance-cost credit (${Math.round(WP.rental.finance_cost_credit_rate * 100)}%)`, `− ${gbp(r.credit, 2)}`],
          ['Total Income Tax for the year', gbp(r.totalTax, 2)],
          ['Finance costs carried forward', gbp(r.carriedForward)],
        ]}
        note={<>Mortgage interest is not deducted from rent: it earns a {Math.round(WP.rental.finance_cost_credit_rate * 100)}% credit (Section 24). {r.allowanceBetter && mode === '0' ? `The ${gbp(A)} allowance would beat your expenses here. ` : ''}From 6 April 2027 property income gets its own rates in England, Wales and Northern Ireland.</>} />
    </Shell>
  );
}
