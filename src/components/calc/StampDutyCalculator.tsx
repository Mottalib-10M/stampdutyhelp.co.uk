/**
 * The calculator: one form, three tax regimes (SDLT, LBTT + ADS, LTT main and higher rates).
 * First render = the build defaults (RECETTE §17.5); the shared link is applied in useEffect.
 * Every rate comes from the engine (lib/engine/tax.ts), which reads params-2026.json.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import { compute, compareNations, refundWindowEnd, RETURN_DAYS, NATION_LABEL, TAX_SHORT, type Nation, type Situation, type Input } from '../../lib/engine/tax';
import { P } from '../../lib/engine/params';
import { formatMoney } from '../../lib/format';
import { pct } from '../../lib/fmt';
import { readParams, num, str, updateURL } from '../../lib/url-state';

interface Props {
  nation?: Nation; lockNation?: boolean; situation?: Situation; price?: number; company?: boolean; nonResident?: boolean;
  kind?: 'residential' | 'nonresidential'; methodHref?: string; idPrefix?: string;
}
const gbp = (n: number, d = 0) => formatMoney(n, d);
const NATIONS: Nation[] = ['england', 'scotland', 'wales'];
const SHORT: Record<Nation, string> = { england: 'Eng. & NI', scotland: 'Scotland', wales: 'Wales' };
const SIT_LABEL: Record<Situation, string> = { first: 'First-time buyer (all buyers)', home: 'Only home, or moving home', additional: 'Additional property' };
const SIT_HELP: Record<Situation, string> = {
  first: 'Nobody buying has ever owned a home, anywhere in the world.',
  home: 'You will own one home at the end of completion day.',
  additional: 'Second home, buy-to-let, or old home not sold by completion.',
};
const BAR = ['#012169', '#2f4a8a', '#5a73ad', '#8a9cc8', '#b4c0dd', '#c8102e', '#e0526a'];

export default function StampDutyCalculator(p: Props) {
  const id = p.idPrefix ?? 'sd';
  const [nation, setNation] = useState<Nation>(p.nation ?? 'england');
  const [price, setPrice] = useState<number>(p.price ?? 300000);
  const [situation, setSituation] = useState<Situation>(p.situation ?? 'home');
  const [company, setCompany] = useState<boolean>(!!p.company);
  const [relief, setRelief] = useState<boolean>(false);
  const [nonRes, setNonRes] = useState<boolean>(!!p.nonResident);
  const [kind, setKind] = useState<'residential' | 'nonresidential'>(p.kind ?? 'residential');
  const [copied, setCopied] = useState(false);
  const [today, setToday] = useState<string>(__BUILD_DAY__);

  useEffect(() => {
    setToday(new Date().toISOString().slice(0, 10));
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    if (!p.lockNation) { const n = str(u, 'n', ''); if (NATIONS.includes(n as Nation)) setNation(n as Nation); }
    setPrice(Math.min(50_000_000, Math.max(0, num(u, 'p', p.price ?? 300000))));
    const s = str(u, 's', ''); if (['first', 'home', 'additional'].includes(s)) setSituation(s as Situation);
    setCompany(str(u, 'c', '') === '1'); setRelief(str(u, 'r', '') === '1'); setNonRes(str(u, 'nr', '') === '1');
    if (str(u, 'k', '') === 'nr') setKind('nonresidential');
  }, []);

  const input: Input = { nation, price, situation: company ? 'home' : situation, company, companyRelief: relief, nonResident: nonRes, kind };
  const r = useMemo(() => compute(input), [nation, price, situation, company, relief, nonRes, kind]);
  const others = useMemo(() => compareNations({ ...input }), [price, situation, company, relief, nonRes, kind]);
  useEffect(() => { updateURL({ n: p.lockNation ? undefined : nation, p: price, s: situation, c: company ? 1 : undefined, r: relief ? 1 : undefined, nr: nonRes ? 1 : undefined, k: kind === 'nonresidential' ? 'nr' : undefined }); },
    [nation, price, situation, company, relief, nonRes, kind]);

  const visible = r.bands.filter((b) => b.taxable > 0);
  const maxTax = Math.max(1, ...visible.map((b) => b.tax));
  const share = () => { try { navigator.clipboard?.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard refused */ } };
  const copyText = () => { try { navigator.clipboard?.writeText(`${r.taxName} on ${gbp(price)}: ${gbp(r.total)} (${pct(r.effectiveRate)} effective)`); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { /* clipboard refused */ } };

  return (
    <div className="not-prose rechner my-6 rounded-xl border border-navy-200 bg-white p-4 sm:p-6" data-chrome>
      <form className="grid gap-x-5 gap-y-4 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
        {!p.lockNation && (
          <Toggle id={`${id}-nation`} label="Where is the property?" className="sm:col-span-2" value={nation} onChange={(v) => setNation(v as Nation)}
            options={NATIONS.map((n) => ({ value: n, label: SHORT[n] }))} />
        )}
        <NumberField id={`${id}-price`} label={kind === 'nonresidential' ? 'Price or premium' : 'Purchase price'} value={price} onChange={setPrice} unit="£" max={50_000_000}
          help="The price agreed with the seller, before any fees." />
        <SelectField id={`${id}-situation`} label="Your situation" value={company ? 'home' : situation} onChange={(v) => setSituation(v as Situation)}
          options={(['first', 'home', 'additional'] as Situation[]).map((s) => ({ value: s, label: SIT_LABEL[s] }))}
          help={company ? 'A company is never a first-time buyer.' : SIT_HELP[situation]} />
        <Toggle id={`${id}-buyer`} label="Who is buying?" value={company ? 'co' : 'me'} onChange={(v) => setCompany(v === 'co')}
          options={[{ value: 'me', label: 'A person' }, { value: 'co', label: 'A company' }]} />
        <Toggle id={`${id}-nr`} label="Any buyer non-UK resident?" value={nonRes ? 'y' : 'n'} onChange={(v) => setNonRes(v === 'y')}
          options={[{ value: 'n', label: 'No' }, { value: 'y', label: 'Yes' }]} />
      </form>
      <details className="mt-4 text-sm">
        <summary className="cursor-pointer font-medium text-navy-700">More options: commercial property, company relief</summary>
        <div className="mt-3 grid gap-x-5 gap-y-4 sm:grid-cols-2">
          <Toggle id={`${id}-kind`} label="Property (mixed use counts as commercial)" value={kind} onChange={(v) => setKind(v as 'residential' | 'nonresidential')}
            options={[{ value: 'residential', label: 'Residential' }, { value: 'nonresidential', label: 'Commercial' }]} />
          <Toggle id={`${id}-relief`} label="Company letting or developing it?" value={relief ? 'y' : 'n'} onChange={(v) => setRelief(v === 'y')}
            options={[{ value: 'n', label: 'No' }, { value: 'y', label: 'Yes' }]} />
        </div>
      </details>

      <div aria-live="polite" className="result-card mt-6 rounded-xl border border-accent-200 p-4 sm:p-5" style={{ background: 'rgba(1,33,105,0.06)' }}>
        <p className="text-sm font-medium text-navy-700">{r.taxName} · {NATION_LABEL[nation]}</p>
        <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{gbp(r.total)}</p>
        <p className="mt-1 text-sm text-navy-700">{pct(r.effectiveRate)} of {gbp(price)} · rule applied: {r.rule}</p>
        {visible.length > 0 && (
          <table className="mt-4 w-full text-sm">
            <caption className="sr-only">Tax band by band</caption>
            <thead><tr className="text-left text-xs uppercase tracking-wide text-navy-600"><th scope="col" className="pb-1 font-semibold">Portion</th><th scope="col" className="pb-1 text-right font-semibold">Rate</th><th scope="col" className="pb-1 text-right font-semibold">Tax</th></tr></thead>
            <tbody>
              {visible.map((b, i) => (
                <tr key={i} className="border-t border-navy-200 align-top">
                  <td className="py-1.5 pr-2 text-navy-800">
                    {b.to === null && b.from === 0 && r.bands.length > 1 ? 'Whole price (supplement)' : `${gbp(b.from)} to ${b.to === null ? 'top' : gbp(b.to)}`}
                    <span className="mt-1 block h-1.5 rounded" style={{ width: `${Math.max(2, (b.tax / maxTax) * 100)}%`, background: BAR[i % BAR.length] }} aria-hidden="true" />
                  </td>
                  <td className="tabular-nums py-1.5 text-right text-navy-800">{pct(b.rate)}</td>
                  <td className="tabular-nums py-1.5 text-right text-navy-900">{gbp(b.tax)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <dl className="mt-3 grid gap-1 text-sm">
          {r.surcharge > 0 && <div className="flex justify-between gap-3"><dt className="text-navy-700">{nation === 'scotland' ? 'of which Additional Dwelling Supplement' : 'of which additional-property surcharge'}</dt><dd className="tabular-nums text-navy-900">{gbp(r.surcharge)}</dd></div>}
          {r.nonResidentSurcharge > 0 && <div className="flex justify-between gap-3"><dt className="text-navy-700">of which non-resident surcharge</dt><dd className="tabular-nums text-navy-900">{gbp(r.nonResidentSurcharge)}</dd></div>}
          {r.ftbSaving > 0 && <div className="flex justify-between gap-3"><dt className="text-navy-700">First-time buyer relief saves</dt><dd className="tabular-nums text-navy-900">{gbp(r.ftbSaving)}</dd></div>}
          {r.refundable > 0 && <div className="flex justify-between gap-3"><dt className="text-navy-700">Reclaimable if your old main home sells by {new Date(`${refundWindowEnd(today, nation)}T00:00:00Z`).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' })} (for completion today)</dt><dd className="tabular-nums text-navy-900">{gbp(r.refundable)}</dd></div>}
        </dl>
        {r.notes.map((n) => <p key={n} className="mt-2 text-sm text-navy-700">{n}</p>)}
        <p className="mt-3 text-xs text-navy-600">Return and payment due within {RETURN_DAYS[nation]} days of completion. {nation === 'england' && nonRes ? `Non-resident means fewer than ${P.sdlt.non_resident_days} days in the UK in the 12 months before completion.` : ''}</p>

        <div className="mt-4 border-t border-navy-200 pt-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-navy-600">Same purchase elsewhere in the UK</p>
          <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
            {NATIONS.map((n) => (
              <button type="button" key={n} onClick={() => !p.lockNation && setNation(n)} disabled={p.lockNation}
                className={`rounded-lg border px-2 py-2 text-left ${n === nation ? 'border-accent-600 bg-white' : 'border-navy-200 bg-white/60 hover:border-accent-300'}`}>
                <span className="block text-xs text-navy-600">{TAX_SHORT[n]} · {SHORT[n]}</span>
                <span className="tabular-nums block font-semibold text-navy-900">{gbp(others[n].total)}</span>
              </button>
            ))}
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <button type="button" onClick={copyText} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Copy result</button>
          <button type="button" onClick={share} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Copy share link</button>
          <button type="button" onClick={() => window.print()} className="rounded-lg border border-navy-300 bg-white px-3 py-1.5 font-medium text-navy-800 hover:bg-navy-50">Print</button>
          {copied && <span role="status" className="self-center text-navy-700">Copied</span>}
          {p.methodHref && <a href={p.methodHref} className="self-center font-medium text-accent-700 hover:underline">How this is calculated</a>}
        </div>
      </div>
    </div>
  );
}
