/** Inheritance Tax on an estate: nil-rate band, residence nil-rate band and taper, transfers from a
 *  late spouse, gifts in the last 7 years, pensions from 6 April 2027. Engine: lib/engine/wealth.ts. */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { iht, WP } from '../../lib/engine/wealth';
import { formatMoney } from '../../lib/format';
import { ResultCard, Shell, Form } from './_wealthUi';

const gbp = (n: number) => formatMoney(n, 0);
export default function IhtTool() {
  const [estate, setEstate] = useState(750000);
  const [home, setHome] = useState(450000);
  const [exempt, setExempt] = useState(0);
  const [gifts, setGifts] = useState(0);
  const [spouse, setSpouse] = useState('0');
  const [pension, setPension] = useState(0);
  const [when, setWhen] = useState('0');
  const r = useMemo(() => iht({ estate, homeToDescendants: home, exempt, gifts, transferredNrb: Number(spouse), transferredRnrb: Number(spouse), pension, deathFromApril2027: when === '1' }), [estate, home, exempt, gifts, spouse, pension, when]);
  return (
    <Shell>
      <Form>
        <NumberField id="ih-est" label="Estate: everything owned, less debts" value={estate} onChange={setEstate} unit="£" max={500_000_000} />
        <NumberField id="ih-home" label="Home (or share) left to children or grandchildren" value={home} onChange={setHome} unit="£" max={100_000_000} />
        <NumberField id="ih-ex" label="Left to a spouse, civil partner or charity" value={exempt} onChange={setExempt} unit="£" max={500_000_000} />
        <NumberField id="ih-gift" label={`Gifts in the last ${WP.iht.gift_years} years, after exemptions`} value={gifts} onChange={setGifts} unit="£" max={100_000_000} />
        <SelectField id="ih-sp" label="Widowed, with the late spouse’s bands unused?" value={spouse} onChange={setSpouse} options={[{ value: '0', label: 'No, or not applicable' }, { value: '0.5', label: 'Half unused' }, { value: '1', label: 'Yes, fully unused' }]} />
        <SelectField id="ih-when" label="Date of death" value={when} onChange={setWhen} options={[{ value: '0', label: 'Before 6 April 2027' }, { value: '1', label: 'On or after 6 April 2027' }]} />
        <NumberField id="ih-pen" label="Unused pension pot" value={pension} onChange={setPension} unit="£" max={100_000_000} help="Counted from 6 April 2027 only" />
      </Form>
      <ResultCard label="Inheritance Tax on the estate" value={gbp(r.tax)} sub={<>Taxed at {Math.round(WP.iht.rate * 100)}% on {gbp(r.chargeable)}.</>}
        rows={[
          ['Nil-rate band available', gbp(r.nrb)],
          ['Of which used by gifts', gbp(r.nrb - r.nrbLeftForEstate)],
          ['Residence nil-rate band applied', gbp(r.rnrb)],
          [`Lost to the taper above ${gbp(WP.iht.taper_threshold)}`, gbp(r.taper)],
          ['Pension counted in the estate', gbp(r.pensionIncluded)],
          ['Unused bands passing to a surviving spouse', gbp(r.unusedNrb + r.unusedRnrb)],
        ]}
        note={<>Due within {WP.iht.pay_months} months of the end of the month of death. Gifts above the nil-rate band are taxed on the person who received them, with taper relief; Business and Agricultural Relief and the {Math.round(WP.iht.charity_rate * 100)}% charity rate are not modelled.</>} />
    </Shell>
  );
}
