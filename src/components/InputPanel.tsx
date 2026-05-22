import { DiameterUnit, ExperimentInput, MassUnit, toSI } from '../lib/physics';

type Props = { input: ExperimentInput; setInput: (u: ExperimentInput) => void; onRun: () => void; errors: string[] };

export function InputPanel({ input, setInput, onRun, errors }: Props) {
  const { area } = toSI(input);
  const set = <K extends keyof ExperimentInput>(k: K, v: ExperimentInput[K]) => setInput({ ...input, [k]: v });
  return (
    <section className="bg-white rounded-xl shadow p-4 space-y-4">
      <h3 className="text-lg font-semibold">Messdaten des Papierkegels</h3>
      <div className="grid md:grid-cols-3 gap-3">
        <label>Fallhöhe h (m)<input className="input" type="number" value={input.heightM} onChange={(e)=>set('heightM', Number(e.target.value))}/></label>
        <label>Masse<input className="input" type="number" value={input.massValue} onChange={(e)=>set('massValue', Number(e.target.value))}/></label>
        <label>Masseneinheit<select className="input" value={input.massUnit} onChange={(e)=>set('massUnit', e.target.value as MassUnit)}><option value="g">g</option><option value="kg">kg</option></select></label>
        <label>Durchmesser d<input className="input" type="number" value={input.diameterValue} onChange={(e)=>set('diameterValue', Number(e.target.value))}/></label>
        <label>Durchmesser-Einheit<select className="input" value={input.diameterUnit} onChange={(e)=>set('diameterUnit', e.target.value as DiameterUnit)}><option value="cm">cm</option><option value="m">m</option></select></label>
        <label>Fläche A (m²)<input className="input bg-slate-100" readOnly value={area.toFixed(6)}/></label>
        <label>rho (kg/m³)<input className="input" type="number" value={input.rho} onChange={(e)=>set('rho', Number(e.target.value))}/></label>
        <label>g (m/s²)<input className="input" type="number" value={input.g} onChange={(e)=>set('g', Number(e.target.value))}/></label>
        <label>dt (s)<input className="input" type="number" value={input.dt} onChange={(e)=>set('dt', Number(e.target.value))}/></label>
      </div>
      <div className="grid md:grid-cols-5 gap-3">
        {input.measuredTimes.map((t, i)=><label key={i}>Messung {i+1} (s)<input className="input" type="number" value={t || ''} onChange={(e)=>{
          const next=[...input.measuredTimes]; next[i]=Number(e.target.value); set('measuredTimes', next);
        }}/></label>)}
      </div>
      <div className="grid md:grid-cols-2 gap-3">
        <label>c_w min<input className="input" type="number" value={input.cwMin} onChange={(e)=>set('cwMin', Number(e.target.value))}/></label>
        <label>c_w max<input className="input" type="number" value={input.cwMax} onChange={(e)=>set('cwMax', Number(e.target.value))}/></label>
      </div>
      {errors.length>0 && <ul className="text-red-600 list-disc pl-6">{errors.map((e)=><li key={e}>{e}</li>)}</ul>}
      <button className="px-4 py-2 rounded bg-blue-600 text-white" onClick={onRun}>c_w-Wert berechnen</button>
    </section>
  );
}
