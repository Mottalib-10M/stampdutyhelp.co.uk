/** Transfer of equity: tax on the cash paid plus the share of the mortgage taken over. */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { compute, transferConsideration, NATION_LABEL, type Nation, type Situation } from '../../lib/engine/tax';
import { formatMoney } from '../../lib/format';

const gbp = (n: number) => formatMoney(n, 0);
export default function TransferTool() {
  const [nation, setNation] = useState<Nation>('england');
  const [cash, setCash] = useState(0);
  const [mortgage, setMortgage] = useState(240000);
  const [share, setShare] = useState(50);
  const [sit, setSit] = useState<Situation>('home');
  const consideration = transferConsideration(cash, mortgage, share / 100);
  const r = useMemo(() => compute({ nation, price: consideration, situation: sit }), [nation, consideration, sit]);
  return (
    <div className="not-prose my-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="tf-nation" label="Where is the property?" value={nation} onChange={(v) => setNation(v as Nation)} options={(['england', 'scotland', 'wales'] as Nation[]).map((n) => ({ value: n, label: NATION_LABEL[n] }))} />
        <NumberField id="tf-mortgage" label="Outstanding mortgage" value={mortgage} onChange={setMortgage} unit="£" max={50_000_000} />
        <NumberField id="tf-share" label="Share of the property you take on" value={share} onChange={setShare} unit="%" max={100} />
        <NumberField id="tf-cash" label="Cash paid to the other owner" value={cash} onChange={setCash} unit="£" max={50_000_000} />
        <SelectField id="tf-sit" label="Your situation after the transfer" value={sit} onChange={(v) => setSit(v as Situation)} options={[{ value: 'home', label: 'This is my only home' }, { value: 'additional', label: 'I own another home too' }]} help="Transfers between spouses or civil partners are outside the surcharge." />
      </form>
      <div aria-live="polite" className="result-card mt-6 rounded-xl border border-accent-200 p-4 sm:p-5" style={{ background: 'rgba(1,33,105,0.06)' }}>
        <p className="text-sm font-medium text-navy-700">Chargeable consideration {gbp(consideration)} · {r.taxName}</p>
        <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{gbp(r.total)}</p>
        <p className="mt-1 text-sm text-navy-700">Rule applied: {r.rule}</p>
        {r.notes.map((n) => <p key={n} className="mt-2 text-sm text-navy-700">{n}</p>)}
        <p className="mt-2 text-xs text-navy-600">No tax and no return when nothing is paid and no mortgage is taken on, or when the transfer follows a divorce or dissolution order.</p>
      </div>
    </div>
  );
}
