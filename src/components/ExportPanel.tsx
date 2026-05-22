import { CwResult, ExperimentInput, toSI } from '../lib/physics';

function toCsv(result: CwResult) {
  return ['t,F_res,a,v,y', ...result.rows.map(r => `${r.t},${r.F_res},${r.a},${r.v},${r.y}`)].join('\n');
}

export function ExportPanel({ input, result }: { input: ExperimentInput; result: CwResult }) {
  const { massKg, diameterM } = toSI(input);
  const download = (name: string, text: string, type: string) => {
    const blob = new Blob([text], { type });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = name;
    a.click();
    URL.revokeObjectURL(a.href);
  };
  const report = `Bei einer Fallhöhe von ${input.heightM.toFixed(3)} m, einer Masse von ${(massKg*1000).toFixed(2)} g, einem Durchmesser von ${(diameterM*100).toFixed(2)} cm und einer durchschnittlichen Fallzeit von ${result.measuredAvg.toFixed(3)} s ergibt sich durch numerische Anpassung mit der Methode der kleinen Schritte ein Luftwiderstandsbeiwert von c_w = ${result.bestCw.toFixed(4)}. Die simulierte Fallzeit beträgt ${result.simulatedTime.toFixed(3)} s und weicht damit um ${result.absError.toFixed(3)} s von der Messung ab.`;
  return <section className="bg-white rounded-xl shadow p-4"><h3 className="font-semibold mb-3">Exportbereich</h3><div className="flex flex-wrap gap-2"><button className="px-3 py-2 rounded bg-blue-600 text-white" onClick={()=>download('simulation.csv', toCsv(result), 'text/csv')}>CSV exportieren</button><button className="px-3 py-2 rounded bg-slate-200" onClick={()=>navigator.clipboard.writeText(JSON.stringify(input, null, 2))}>Messdaten kopieren</button><button className="px-3 py-2 rounded bg-slate-200" onClick={()=>navigator.clipboard.writeText(report)}>Ergebnisbericht kopieren</button></div></section>;
}
