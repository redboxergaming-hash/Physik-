import { useMemo, useState } from 'react';
import { ChartsPanel } from './components/ChartsPanel';
import { ExportPanel } from './components/ExportPanel';
import { FormulaBox } from './components/FormulaBox';
import { InputPanel } from './components/InputPanel';
import { ResultCards } from './components/ResultCards';
import { SimulationTable } from './components/SimulationTable';
import { ExperimentInput, freeFallNoDragTime, solveCw, validateInput } from './lib/physics';

const defaults: ExperimentInput = {
  heightM: 2,
  massValue: 3.2,
  massUnit: 'g',
  diameterValue: 12,
  diameterUnit: 'cm',
  rho: 1.23,
  g: 9.81,
  dt: 0.001,
  measuredTimes: [1.28, 1.31, 1.26, 1.33, 1.29],
  cwMin: 0.01,
  cwMax: 5,
};

export function App() {
  const [input, setInput] = useState<ExperimentInput>(defaults);
  const [errors, setErrors] = useState<string[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [result, setResult] = useState(() => solveCw(defaults));

  const freeFallTime = useMemo(() => freeFallNoDragTime(input.heightM, input.g), [input.heightM, input.g]);

  const run = () => {
    const v = validateInput(input);
    setErrors(v);
    if (v.length) return;
    setResult(solveCw(input));
  };

  return (
    <main className="max-w-6xl mx-auto p-4 space-y-4">
      <header className="space-y-1">
        <h1 className="text-3xl font-bold">c_w-Wert eines Papierkegels bestimmen</h1>
        <p className="text-slate-600">Aus Messdaten mit der Methode der kleinen Schritte</p>
      </header>
      <section className="bg-white rounded-xl shadow p-4 text-slate-700">
        Ein Papierkegel wird aus bekannter Höhe ohne Anfangsgeschwindigkeit fallen gelassen. Die App passt den c_w-Wert so an, dass simulierte und gemessene Fallzeit möglichst gut übereinstimmen.
      </section>

      <FormulaBox />
      <InputPanel input={input} setInput={setInput} onRun={run} errors={errors} />

      {result && (
        <>
          <ResultCards result={result} />
          <ChartsPanel result={result} />
          <SimulationTable rows={result.rows} showAll={showAll} onToggle={() => setShowAll((s) => !s)} dt={input.dt} />
          <section className="bg-white rounded-xl shadow p-4 space-y-2">
            <h3 className="font-semibold">Vergleich mit freiem Fall ohne Luftwiderstand</h3>
            <p>Fallzeit ohne Luftwiderstand: <strong>{freeFallTime.toFixed(3)} s</strong></p>
            <p>Gemessene Durchschnittsfallzeit: <strong>{result.measuredAvg.toFixed(3)} s</strong></p>
            <p>Unterschied: <strong>{(result.measuredAvg - freeFallTime).toFixed(3)} s</strong></p>
            <p className="text-slate-600">Der Papierkegel fällt deutlich langsamer, weil Luftwiderstand die Beschleunigung stark reduziert.</p>
          </section>
          <section className="bg-indigo-50 border border-indigo-200 rounded-xl p-4 text-sm text-slate-700">
            <h4 className="font-semibold mb-1">Hinweise zur Messqualität</h4>
            <ul className="list-disc pl-5 space-y-1">
              <li>Mehrfachmessungen verbessern die Genauigkeit.</li>
              <li>Reaktionszeit beim Stoppen kann die Messung verfälschen.</li>
              <li>Der Kegel muss ohne Anfangsgeschwindigkeit fallen gelassen werden.</li>
              <li>Der Durchmesser der Öffnung muss möglichst genau gemessen werden.</li>
              <li>Der Kegel sollte immer gleich ausgerichtet fallen.</li>
            </ul>
          </section>
          <ExportPanel input={input} result={result} />
        </>
      )}
    </main>
  );
}
