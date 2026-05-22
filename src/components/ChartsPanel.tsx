import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { CwResult } from '../lib/physics';

export function ChartsPanel({ result }: { result: CwResult }) {
  return <section className="grid lg:grid-cols-3 gap-3">
    <div className="bg-white rounded-xl shadow p-3 lg:col-span-1"><h3 className="font-semibold mb-2">t-y-Diagramm</h3><ResponsiveContainer width="100%" height={260}><LineChart data={result.rows}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="t" unit=" s"/><YAxis unit=" m"/><Tooltip/><Line dataKey="y" stroke="#0ea5e9" dot={false}/></LineChart></ResponsiveContainer></div>
    <div className="bg-white rounded-xl shadow p-3 lg:col-span-1"><h3 className="font-semibold mb-2">t-v-Diagramm</h3><ResponsiveContainer width="100%" height={260}><LineChart data={result.rows}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="t" unit=" s"/><YAxis unit=" m/s"/><Tooltip/><Line dataKey="v" stroke="#6366f1" dot={false}/></LineChart></ResponsiveContainer></div>
    <div className="bg-white rounded-xl shadow p-3 lg:col-span-1"><h3 className="font-semibold mb-2">Fehlerkurve c_w → Abweichung</h3><ResponsiveContainer width="100%" height={260}><LineChart data={result.errorCurve}><CartesianGrid strokeDasharray="3 3"/><XAxis dataKey="cw"/><YAxis unit=" s"/><Tooltip/><Line dataKey="error" stroke="#f97316" dot={false}/></LineChart></ResponsiveContainer></div>
  </section>;
}
