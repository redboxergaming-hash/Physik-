import { SimulationRow } from '../lib/physics';

export function SimulationTable({ rows, showAll, onToggle, dt }: { rows: SimulationRow[]; showAll: boolean; onToggle: () => void; dt: number }) {
  const step = showAll ? 1 : Math.max(1, Math.round(0.02 / dt));
  const display = rows.filter((_, i) => i % step === 0);
  return <section className="bg-white rounded-xl shadow p-4">
    <div className="flex justify-between items-center mb-3"><h3 className="font-semibold">Simulationstabelle</h3><button className="px-3 py-1 rounded bg-slate-200" onClick={onToggle}>Alle Iterationsschritte anzeigen: {showAll ? 'Ein':'Aus'}</button></div>
    <div className="max-h-96 overflow-auto border rounded">
      <table className="w-full text-sm"><thead className="sticky top-0 bg-blue-100"><tr><th className="text-left p-2">t (s)</th><th className="text-right p-2">F_res (N)</th><th className="text-right p-2">a (m/s²)</th><th className="text-right p-2">v (m/s)</th><th className="text-right p-2">y (m)</th></tr></thead><tbody>{display.map((r, i)=><tr key={i} className="border-t"><td className="p-2">{r.t.toFixed(3)}</td><td className="text-right p-2">{r.F_res.toFixed(3)}</td><td className="text-right p-2">{r.a.toFixed(3)}</td><td className="text-right p-2">{r.v.toFixed(3)}</td><td className="text-right p-2">{r.y.toFixed(3)}</td></tr>)}</tbody></table>
    </div>
  </section>;
}
