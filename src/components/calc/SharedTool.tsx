/** Shared ownership in England and Northern Ireland: market value election against paying in stages. */
import { useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import Toggle from '../ui/Toggle';
import { sharedOwnership, staircasingTax } from '../../lib/engine/tax';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';

const gbp = (n: number) => formatMoney(n, 0);
export default function SharedTool() {
  const [mv, setMv] = useState(300000);
  const [share, setShare] = useState(40);
  const [ftb, setFtb] = useState(true);
  const sharePrice = Math.round((mv * Math.min(100, Math.max(0, share))) / 100);
  const r = useMemo(() => sharedOwnership(mv, sharePrice, ftb), [mv, sharePrice, ftb]);
  const last = Math.round(mv * 0.25);
  const stair = staircasingTax(sharePrice + Math.round(mv * 0.2) + last, last);
  const best = r.stages <= r.marketValueElection ? 'stages' : 'election';
  return (
    <div className="not-prose my-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <NumberField id="so-mv" label="Full market value" value={mv} onChange={setMv} unit="£" max={10_000_000} help="As stated in the shared ownership lease." />
        <NumberField id="so-share" label="Share you buy now" value={share} onChange={setShare} unit="%" max={100} />
        <Toggle id="so-ftb" label="Every buyer a first-time buyer?" value={ftb ? 'y' : 'n'} onChange={(v) => setFtb(v === 'y')} options={[{ value: 'n', label: 'No' }, { value: 'y', label: 'Yes' }]} />
      </form>
      <div aria-live="polite" className="result-card mt-6 rounded-xl border border-accent-200 p-4 sm:p-5" style={{ background: 'rgba(1,33,105,0.06)' }}>
        <p className="text-sm font-medium text-navy-700">SDLT now, for a {share}% share costing {gbp(sharePrice)}</p>
        <div className="mt-2 grid gap-3 sm:grid-cols-2">
          <div className={`rounded-lg border bg-white p-3 ${best === 'election' ? 'border-accent-600' : 'border-navy-200'}`}><p className="text-xs uppercase tracking-wide text-navy-600">Market value election</p><p className="tabular-nums text-3xl font-bold text-navy-900">{gbp(r.marketValueElection)}</p><p className="text-sm text-navy-700">Paid once on {gbp(mv)}; nothing more when you buy further shares.</p></div>
          <div className={`rounded-lg border bg-white p-3 ${best === 'stages' ? 'border-accent-600' : 'border-navy-200'}`}><p className="text-xs uppercase tracking-wide text-navy-600">Paying in stages</p><p className="tabular-nums text-3xl font-bold text-navy-900">{gbp(r.stages)}</p><p className="text-sm text-navy-700">On the share price only; tax may fall due again once you own more than {Math.round(P.sdlt.shared_ownership_staircasing_return_share * 100)}%.</p></div>
        </div>
        <p className="mt-3 text-sm text-navy-800">{r.ftbApplies ? `First-time buyer rates apply: the market value is ${gbp(P.sdlt.first_time_buyer_max_price)} or less.` : ftb ? `Market value above ${gbp(P.sdlt.first_time_buyer_max_price)}: first-time buyer rates are not available.` : 'Standard rates applied.'}</p>
        <p className="mt-2 text-sm text-navy-800">Example of a later step in stages: a final 25% share ({gbp(last)}) bought after a further 20% would cost about <span className="tabular-nums font-semibold">{gbp(stair)}</span> at today’s standard rates.</p>
        <p className="mt-2 text-xs text-navy-600">Rent under the lease is left out: with first-time buyer relief no tax is due on it; otherwise SDLT on rent is 1% of its net present value above {gbp(P.sdlt.lease_npv_residential_threshold)}.</p>
      </div>
    </div>
  );
}
