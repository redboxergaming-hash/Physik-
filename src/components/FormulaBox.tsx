export function FormulaBox() {
  return (
    <section className="bg-white rounded-xl shadow p-4 space-y-2">
      <h3 className="text-lg font-semibold">Formeln (Methode der kleinen Schritte)</h3>
      <p>F_G = m · g, F_L = 0.5 · rho · c_w · A · v²</p>
      <p>F_res = -m · g + 0.5 · rho · c_w · A · v², a = F_res / m</p>
      <p>t_neu = t_alt + dt, v_neu = v_alt + a · dt, y_neu = y_alt + v_neu · dt</p>
      <p className="text-sm text-slate-600">Hinweis: Nach unten ist negativ (v &lt; 0), der Boden ist bei y ≤ 0 erreicht.</p>
    </section>
  );
}
