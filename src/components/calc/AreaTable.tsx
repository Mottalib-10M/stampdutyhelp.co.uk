/** Every local authority of the UK House Price Index, with the tax on its average price for the
 *  chosen buyer. Data: data/hpi.json (scripts/data/build-hpi.py). Sorting and filtering in the browser. */
import { useMemo, useState } from 'react';
import SelectField from '../ui/SelectField';
import { compute, TAX_SHORT, type Situation } from '../../lib/engine/tax';
import { HPI, taxNation } from '../../lib/hpi';
import { formatMoney } from '../../lib/format';
import { pct } from '../../lib/fmt';

const gbp = (n: number) => formatMoney(n, 0);
type Sort = 'name' | 'price' | 'tax';
const PRICE_FIELD: Record<string, { label: string; field: 'avg' | 'ftb' | 'mover' }> = {
  avg: { label: 'All buyers (average price)', field: 'avg' }, ftb: { label: 'First-time buyers (their average price)', field: 'ftb' }, mover: { label: 'Home movers (their average price)', field: 'mover' },
};

export default function AreaTable() {
  const [nation, setNation] = useState('all');
  const [basis, setBasis] = useState('avg');
  const [situation, setSituation] = useState<Situation>('home');
  const [sort, setSort] = useState<Sort>('tax');
  const [q, setQ] = useState('');
  const rows = useMemo(() => Object.entries(HPI.regions).filter(([, r]) => r.level === 'la')
    .filter(([, r]) => nation === 'all' || r.nation === nation)
    .filter(([, r]) => !q || r.name.toLowerCase().includes(q.toLowerCase()))
    .map(([k, r]) => {
      const price = (r[PRICE_FIELD[basis].field] ?? r.avg) as number;
      const n = taxNation(r);
      const sit: Situation = basis === 'ftb' && situation !== 'additional' ? 'first' : situation;
      const res = compute({ nation: n, price, situation: sit });
      return { k, name: r.name, nation: n, ni: r.nation === 'ni', price, tax: res.total, rate: res.effectiveRate, fallback: r[PRICE_FIELD[basis].field] == null };
    })
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name) : sort === 'price' ? b.price - a.price : b.tax - a.tax), [nation, basis, situation, sort, q]);
  return (
    <div className="not-prose my-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        <SelectField id="area-nation" label="Nation" value={nation} onChange={setNation} options={[{ value: 'all', label: 'Whole UK' }, { value: 'england', label: 'England' }, { value: 'ni', label: 'Northern Ireland' }, { value: 'scotland', label: 'Scotland' }, { value: 'wales', label: 'Wales' }]} />
        <SelectField id="area-basis" label="Price used" value={basis} onChange={setBasis} options={Object.entries(PRICE_FIELD).map(([v, o]) => ({ value: v, label: o.label }))} />
        <SelectField id="area-sit" label="Buyer" value={situation} onChange={(v) => setSituation(v as Situation)} options={[{ value: 'home', label: 'Standard rates (one home)' }, { value: 'additional', label: 'Additional property' }]} help={basis === 'ftb' && situation !== 'additional' ? 'First-time buyer relief applied where it exists.' : undefined} />
        <div className="grid grid-rows-subgrid row-span-3 content-start gap-y-0">
          <label htmlFor="area-q" className="mb-1 block text-sm font-medium text-navy-700">Find an area</label>
          <input id="area-q" type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="e.g. Leeds" className="h-12 w-full rounded-lg border border-navy-300 bg-white px-3 text-navy-900 focus:border-accent-500 focus:outline-none focus:ring-2 focus:ring-accent-500/20" />
        </div>
      </form>
      <p className="mt-4 text-sm text-navy-700">{rows.length} local authorities · sort by{' '}
        {(['tax', 'price', 'name'] as Sort[]).map((s) => <button key={s} type="button" onClick={() => setSort(s)} aria-pressed={sort === s} className={`mx-1 rounded px-2 py-0.5 ${sort === s ? 'bg-accent-600 text-white' : 'border border-navy-300 text-navy-800'}`}>{s === 'tax' ? 'tax' : s === 'price' ? 'price' : 'name'}</button>)}
      </p>
      <div className="mt-3 max-h-[36rem] overflow-auto">
        <table className="w-full text-sm">
          <caption className="sr-only">Tax on the average price by local authority</caption>
          <thead className="sticky top-0 bg-white"><tr className="text-left text-xs uppercase tracking-wide text-navy-600"><th scope="col" className="py-2 pr-2">Area</th><th scope="col" className="py-2 pr-2">Tax</th><th scope="col" className="py-2 text-right">Average price</th><th scope="col" className="py-2 text-right">Tax due</th><th scope="col" className="py-2 text-right">Rate</th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.k} className="border-t border-navy-100">
                <td className="py-1.5 pr-2 text-navy-900">{r.name}{r.fallback && <span className="text-navy-600"> *</span>}</td>
                <td className="py-1.5 pr-2 text-navy-700">{TAX_SHORT[r.nation]}{r.ni ? ' (NI)' : ''}</td>
                <td className="tabular-nums py-1.5 text-right text-navy-800">{gbp(r.price)}</td>
                <td className="tabular-nums py-1.5 text-right font-semibold text-navy-900">{gbp(r.tax)}</td>
                <td className="tabular-nums py-1.5 text-right text-navy-700">{pct(r.rate)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-navy-600">* No separate first-time buyer or mover price is published for this area (Northern Ireland districts): the all-buyer average is used.</p>
    </div>
  );
}
