import { CwResult } from '../lib/physics';

export function ResultCards({ result }: { result: CwResult }) {
  const card = (t: string, v: string) => <div className="bg-white rounded-xl shadow p-4"><p className="text-sm text-slate-500">{t}</p><p className="text-xl font-bold">{v}</p></div>;
  return (
    <section className="space-y-3">
      <div className="bg-emerald-50 border border-emerald-300 rounded-xl p-5">
        <p className="text-sm">Berechneter Luftwiderstandsbeiwert</p>
        <p className="text-4xl font-extrabold">c_w = {result.bestCw.toFixed(4)}</p>
        <p className="mt-1">Messqualität: <strong>{result.quality}</strong></p>
      </div>
      <div className="grid md:grid-cols-3 gap-3">
        {card('Durchschnittszeit Messung', `${result.measuredAvg.toFixed(4)} s`)}
        {card('Simulierte Fallzeit', `${result.simulatedTime.toFixed(4)} s`)}
        {card('Abweichung', `${result.absError.toFixed(4)} s`)}
        {card('Querschnittsfläche A', `${result.area.toFixed(6)} m²`)}
        {card('Aufprallgeschwindigkeit', `${result.impactVelocity.toFixed(3)} m/s`)}
        {card('Mittlere Fallgeschwindigkeit', `${result.avgVelocity.toFixed(3)} m/s`)}
        {card('Endbeschleunigung', `${result.endAcceleration.toFixed(3)} m/s²`)}
        {card('Min/Max Messzeit', `${result.minMeasured.toFixed(3)} / ${result.maxMeasured.toFixed(3)} s`)}
        {card('Streuung / Std.-abw.', `${result.spread.toFixed(3)} / ${result.stdDev.toFixed(3)} s`)}
      </div>
      {result.warnings.length>0 && <div className="bg-amber-50 border border-amber-300 rounded-lg p-3"><ul className="list-disc pl-5">{result.warnings.map((w)=><li key={w}>{w}</li>)}</ul></div>}
    </section>
  );
}
