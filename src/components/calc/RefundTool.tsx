/** Surcharge refund: how much comes back and by when, in each nation. */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import { compute, refundWindowEnd, NATION_LABEL, type Nation } from '../../lib/engine/tax';
import { P } from '../../lib/engine/params';
import { formatMoney, displayDate } from '../../lib/format';

const gbp = (n: number) => formatMoney(n, 0);
const d = (iso: string) => displayDate(iso, 'en-GB');
const addMonths = (iso: string, m: number) => { const x = new Date(`${iso}T00:00:00Z`); x.setUTCMonth(x.getUTCMonth() + m); return x.toISOString().slice(0, 10); };
export default function RefundTool({ nation: initial = 'england' }: { nation?: Nation }) {
  const [nation, setNation] = useState<Nation>(initial);
  const [price, setPrice] = useState(400000);
  const [completion, setCompletion] = useState<string>(__BUILD_DAY__);
  useEffect(() => { setCompletion(new Date().toISOString().slice(0, 10)); }, []);
  const r = useMemo(() => compute({ nation, price, situation: 'additional' }), [nation, price]);
  const end = refundWindowEnd(completion, nation);
  const claim = nation === 'england'
    ? `within ${P.sdlt.refund_claim_months} months of the sale, or of the return’s filing date if that is later`
    : nation === 'scotland'
      ? `by amending the LBTT return within ${P.lbtt.amend_months} months of its filing date, or later by an overpayment claim within ${P.lbtt.overpayment_claim_years} years of the return’s due date`
      : `by amending the LTT return within ${P.ltt.amend_months} months of its filing date, or later by a claim within ${P.ltt.refund_claim_years} years of the day after the filing date`;
  return (
    <div className="not-prose my-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="rf-nation" label="Where did you buy?" value={nation} onChange={(v) => setNation(v as Nation)} options={(['england', 'scotland', 'wales'] as Nation[]).map((n) => ({ value: n, label: NATION_LABEL[n] }))} />
        <NumberField id="rf-price" label="Price of the new home" value={price} onChange={setPrice} unit="£" max={50_000_000} />
        <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
          <label htmlFor="rf-date" className="mb-1 block text-sm font-medium text-navy-700">Completion date of the new home</label>
          <input id="rf-date" type="date" value={completion} onChange={(e) => e.target.value && setCompletion(e.target.value)} className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900" />
        </div>
      </form>
      <div aria-live="polite" className="result-card mt-6 rounded-xl border border-accent-200 p-4 sm:p-5" style={{ background: 'rgba(1,33,105,0.06)' }}>
        <p className="text-sm font-medium text-navy-700">Surcharge you can get back</p>
        <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{gbp(r.refundable)}</p>
        <p className="mt-1 text-sm text-navy-700">Paid {gbp(r.total)} instead of {gbp(r.mainTax)} at main rates.</p>
        <dl className="mt-3 grid gap-1 text-sm">
          <div className="flex justify-between gap-3"><dt className="text-navy-700">Sell the old main home by</dt><dd className="font-semibold text-navy-900">{d(end)}</dd></div>
          <div className="flex justify-between gap-3"><dt className="text-navy-700">Then claim</dt><dd className="text-right text-navy-900">{claim}</dd></div>
          {nation === 'england' && <div className="flex justify-between gap-3"><dt className="text-navy-700">If it sells on the last day, claim by</dt><dd className="text-navy-900">{d(addMonths(end, P.sdlt.refund_claim_months))}</dd></div>}
        </dl>
      </div>
    </div>
  );
}
