import { useMemo, useState } from 'react';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  defaultParams,
  freeFallNoDrag,
  runSimulation,
  SimulationParams,
  toCsv,
  validateParams,
} from './lib/simulation';

function formatNum(value: number, digits = 3) {
  return value.toFixed(digits);
}

export function App() {
  const [params, setParams] = useState<SimulationParams>(defaultParams);
  const [showAll, setShowAll] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [rows, setRows] = useState(() => runSimulation(defaultParams));

  const last = rows[rows.length - 1];
  const maxV = useMemo(
    () => rows.reduce((acc, cur) => (Math.abs(cur.v) > Math.abs(acc.v) ? cur : acc), rows[0]),
    [rows],
  );

  const comparedTime = Math.min(5, params.duration);
  const freeFall = freeFallNoDrag(params.y0, comparedTime);

  const displayRows = useMemo(() => {
    if (showAll) return rows;
    const step = Math.max(1, Math.round(0.1 / params.dt));
    return rows.filter((_, idx) => idx % step === 0);
  }, [rows, showAll, params.dt]);

  const onChange = (key: keyof SimulationParams, value: string) => {
    const parsed = Number(value);
    setParams((prev) => ({ ...prev, [key]: parsed }));
  };

  const handleSimulate = () => {
    const validation = validateParams(params);
    setErrors(validation);
    if (validation.length > 0) return;
    setRows(runSimulation(params));
  };

  const restoreDefaults = () => {
    setParams(defaultParams);
    setErrors([]);
    setRows(runSimulation(defaultParams));
  };

  const download = (name: string, content: string, mime: string) => {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="container">
      <h1>Methode der kleinen Schritte – Freier Fall mit Luftwiderstand</h1>

      <section className="card hint">
        Die Bewegung wird in sehr kleine Zeitschritte zerlegt. In jedem Schritt werden Kraft, Beschleunigung,
        Geschwindigkeit und Höhe neu berechnet.
      </section>

      <section className="card">
        <div className="input-grid">
          {([
            ['dt', 'Zeitschritt dt (s)'],
            ['m', 'Masse m (kg)'],
            ['A', 'Querschnittsfläche A (m²)'],
            ['c_w', 'Luftwiderstandsbeiwert c_w'],
            ['rho', 'Luftdichte rho (kg/m³)'],
            ['y0', 'Starthöhe y0 (m)'],
            ['v0', 'Startgeschwindigkeit v0 (m/s)'],
            ['duration', 'Simulationsdauer (s)'],
          ] as [keyof SimulationParams, string][]).map(([key, label]) => (
            <label key={key}>
              <span>{label}</span>
              <input
                type="number"
                step="any"
                value={params[key]}
                onChange={(e) => onChange(key, e.target.value)}
              />
            </label>
          ))}
        </div>
        {errors.length > 0 && (
          <ul className="errors">
            {errors.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        )}
        <div className="btn-row">
          <button onClick={handleSimulate}>Simulation berechnen</button>
          <button className="secondary" onClick={restoreDefaults}>Standardwerte laden</button>
          <button className="secondary" onClick={() => download('simulation.csv', toCsv(rows), 'text/csv')}>CSV exportieren</button>
          <button className="secondary" onClick={() => navigator.clipboard.writeText(toCsv(rows))}>Daten kopieren</button>
          <button className="secondary" onClick={() => download('simulation.json', JSON.stringify(rows, null, 2), 'application/json')}>Als JSON exportieren</button>
          <button className="secondary" onClick={() => setShowAll((s) => !s)}>
            Alle Werte anzeigen: {showAll ? 'Ein' : 'Aus'}
          </button>
        </div>
      </section>

      <section className="kpi-grid">
        {[
          ['Geschwindigkeit nach Ende', `${formatNum(last.v)} m/s`],
          ['Höhe nach Ende', `${formatNum(last.y)} m`],
          ['Beschleunigung nach Ende', `${formatNum(last.a)} m/s²`],
          ['Resultierende Kraft nach Ende', `${formatNum(last.F)} N`],
          ['Maximale Geschwindigkeit |v|', `${formatNum(maxV.v)} m/s`],
          ['Zeitpunkt max. Geschwindigkeit', `${formatNum(maxV.t, 2)} s`],
        ].map(([name, value]) => (
          <article key={name} className="card kpi">
            <h3>{name}</h3>
            <strong>{value}</strong>
          </article>
        ))}
      </section>

      <section className="card">
        <h2>Vergleich mit freiem Fall ohne Luftwiderstand</h2>
        <p>
          v({comparedTime}s) ohne Luftwiderstand: <strong>{formatNum(freeFall.v)} m/s</strong> · y({comparedTime}s):{' '}
          <strong>{formatNum(freeFall.y)} m</strong>
        </p>
        <p>
          Bewertung:{' '}
          <strong>
            {Math.abs(freeFall.v - last.v) > 3
              ? 'Der Luftwiderstand ist nach 5 Sekunden bereits deutlich bemerkbar.'
              : 'Der Effekt ist nach 5 Sekunden noch klein bis moderat.'}
          </strong>
        </p>
      </section>

      <section className="charts">
        <article className="card chart-card">
          <h2>t-v-Diagramm</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="t" unit=" s" />
              <YAxis unit=" m/s" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="v" stroke="#305ce5" dot={false} name="Geschwindigkeit v(t)" />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <article className="card chart-card">
          <h2>t-y-Diagramm</h2>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={rows}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="t" unit=" s" />
              <YAxis unit=" m" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="y" stroke="#00a38f" dot={false} name="Höhe y(t)" />
            </LineChart>
          </ResponsiveContainer>
        </article>
      </section>

      <section className="card table-card">
        <h2>Wertetabelle</h2>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>t in s</th>
                <th>F in N</th>
                <th>a in m/s²</th>
                <th>v in m/s</th>
                <th>y in m</th>
              </tr>
            </thead>
            <tbody>
              {displayRows.map((r, i) => (
                <tr key={`${r.t}-${i}`}>
                  <td>{formatNum(r.t, 2)}</td>
                  <td>{formatNum(r.F, 2)}</td>
                  <td>{formatNum(r.a, 3)}</td>
                  <td>{formatNum(r.v, 3)}</td>
                  <td>{formatNum(r.y, 3)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}
