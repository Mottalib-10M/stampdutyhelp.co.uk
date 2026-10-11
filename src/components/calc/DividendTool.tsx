/** Dividend tax, 2026 to 2027: £500 allowance, 10.75%, 35.75% and 39.35%. Engine: lib/engine/wealth.ts. */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { dividendTax, WP, type Region } from '../../lib/engine/wealth';
import { formatMoney } from '../../lib/format';
import { ResultCard, Shell, Form } from './_wealthUi';

const gbp = (n: number, d = 0) => formatMoney(n, d);
const pct = (x: number) => `${Math.round(x * 10000) / 100}%`;
export default function DividendTool() {
  const [other, setOther] = useState(30000);
  const [div, setDiv] = useState(8000);
  const [region, setRegion] = useState<Region>('ruk');
  const r = useMemo(() => dividendTax({ otherIncome: other, dividends: div, region }), [other, div, region]);
  const D = WP.dividends;
  const rows: Array<[string, string]> = [['Dividend allowance used', gbp(r.allowanceUsed)]];
  r.slices.forEach((s) => rows.push([`${gbp(s.amount)} at ${pct(s.rate)}`, gbp(s.tax, 2)]));
  rows.push(['Income Tax on your other income', gbp(r.otherTax, 2)], ['Total Income Tax for the year', gbp(r.total, 2)]);
  return (
    <Shell>
      <Form>
        <NumberField id="dv-oth" label="Salary, pension and other income" value={other} onChange={setOther} unit="£" max={10_000_000} />
        <NumberField id="dv-div" label="Dividends received in the tax year" value={div} onChange={setDiv} unit="£" max={10_000_000} />
        <SelectField id="dv-reg" label="Where you live" value={region} onChange={(v) => setRegion(v as Region)} options={[{ value: 'ruk', label: 'England, Wales or Northern Ireland' }, { value: 'scotland', label: 'Scotland' }]} />
      </Form>
      <ResultCard label="Tax on your dividends" value={gbp(r.dividendTax, 2)} sub={<>Top band reached: {r.band}. Rates {pct(D.ordinary_rate)}, {pct(D.upper_rate)} and {pct(D.additional_rate)} above the {gbp(D.allowance)} allowance.</>}
        rows={rows}
        note={<>Dividends in an ISA are tax-free and are left out. Scottish rates apply to wages and pensions only; dividends use the UK bands everywhere. Savings interest is not modelled.</>} />
    </Shell>
  );
}
