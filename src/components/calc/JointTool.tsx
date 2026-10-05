/** Buying with someone else: whose situation decides the rate, for up to four buyers. */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import SelectField from '../ui/SelectField';
import { compute, resolveJoint, NATION_LABEL, type Nation, type Buyer } from '../../lib/engine/tax';
import { formatMoney } from '../../lib/format';

const gbp = (n: number) => formatMoney(n, 0);
const blank = (): Buyer => ({ everOwned: false, ownsOther: false, nonResident: false });
export default function JointTool() {
  const [nation, setNation] = useState<Nation>('england');
  const [price, setPrice] = useState(350000);
  const [married, setMarried] = useState(false);
  const [buyers, setBuyers] = useState<Buyer[]>([blank(), { everOwned: true, ownsOther: true, nonResident: false }]);
  const res = useMemo(() => resolveJoint(buyers, married), [buyers, married]);
  const r = useMemo(() => compute({ nation, price, situation: res.situation, nonResident: res.nonResident }), [nation, price, res]);
  const alone = useMemo(() => compute({ nation, price, situation: resolveJoint([buyers[0]], false).situation, nonResident: !!buyers[0].nonResident }), [nation, price, buyers]);
  const upd = (i: number, patch: Partial<Buyer>) => setBuyers((b) => b.map((x, j) => (j === i ? { ...x, ...patch, ...(patch.ownsOther ? { everOwned: true } : {}) } : x)));
  return (
    <div className="not-prose my-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="jt-nation" label="Where is the property?" value={nation} onChange={(v) => setNation(v as Nation)} options={(['england', 'scotland', 'wales'] as Nation[]).map((n) => ({ value: n, label: NATION_LABEL[n] }))} />
        <NumberField id="jt-price" label="Purchase price" value={price} onChange={setPrice} unit="£" max={50_000_000} />
        <Toggle id="jt-married" label="Two buyers married or civil partners, living together?" value={married ? 'y' : 'n'} onChange={(v) => setMarried(v === 'y')} options={[{ value: 'n', label: 'No' }, { value: 'y', label: 'Yes' }]} />
        <Toggle id="jt-count" label="Number of buyers" value={String(buyers.length)} onChange={(v) => setBuyers((b) => { const n = Number(v); return n > b.length ? [...b, ...Array.from({ length: n - b.length }, blank)] : b.slice(0, n); })} options={['2', '3', '4'].map((v) => ({ value: v, label: v }))} />
      </form>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        {buyers.map((b, i) => (
          <fieldset key={i} className="grid gap-y-3 rounded-lg border border-navy-200 p-3">
            <legend className="px-1 text-sm font-semibold text-navy-900">Buyer {i + 1}</legend>
            <Toggle id={`jt-ever-${i}`} label="Has owned a home before?" value={b.everOwned ? 'y' : 'n'} onChange={(v) => upd(i, { everOwned: v === 'y', ...(v === 'n' ? { ownsOther: false } : {}) })} options={[{ value: 'n', label: 'No' }, { value: 'y', label: 'Yes' }]} />
            <Toggle id={`jt-other-${i}`} label="Still owns one after completion?" value={b.ownsOther ? 'y' : 'n'} onChange={(v) => upd(i, { ownsOther: v === 'y' })} options={[{ value: 'n', label: 'No' }, { value: 'y', label: 'Yes' }]} />
            <Toggle id={`jt-nr-${i}`} label="Non-UK resident?" value={b.nonResident ? 'y' : 'n'} onChange={(v) => upd(i, { nonResident: v === 'y' })} options={[{ value: 'n', label: 'No' }, { value: 'y', label: 'Yes' }]} />
          </fieldset>
        ))}
      </div>
      <div aria-live="polite" className="result-card mt-6 rounded-xl border border-accent-200 p-4 sm:p-5" style={{ background: 'rgba(1,33,105,0.06)' }}>
        <p className="text-sm font-medium text-navy-700">{r.taxName} for the whole purchase</p>
        <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{gbp(r.total)}</p>
        <p className="mt-1 text-sm text-navy-700">Rule applied: {r.rule}</p>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-navy-800">{res.reasons.map((x) => <li key={x}>{x}</li>)}</ul>
        {r.notes.map((n) => <p key={n} className="mt-2 text-sm text-navy-700">{n}</p>)}
        <p className="mt-3 text-sm text-navy-800">If buyer 1 bought alone: <span className="tabular-nums font-semibold">{gbp(alone.total)}</span> ({gbp(r.total - alone.total)} {r.total >= alone.total ? 'less' : 'more'}).</p>
      </div>
    </div>
  );
}
