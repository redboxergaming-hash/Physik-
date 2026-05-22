export type SimulationParams = {
  dt: number;
  m: number;
  A: number;
  c_w: number;
  rho: number;
  y0: number;
  v0: number;
  duration: number;
};

export type SimulationRow = {
  t: number;
  F: number;
  a: number;
  v: number;
  y: number;
};

export const G = 9.81;

export const defaultParams: SimulationParams = {
  dt: 0.01,
  m: 100,
  A: 1,
  c_w: 0.5,
  rho: 1.23,
  y0: 3000,
  v0: 0,
  duration: 5,
};

export function validateParams(p: SimulationParams): string[] {
  const errors: string[] = [];
  if (p.dt <= 0) errors.push('dt muss größer als 0 sein.');
  if (p.m <= 0) errors.push('Masse m muss größer als 0 sein.');
  if (p.A <= 0) errors.push('Querschnittsfläche A muss größer als 0 sein.');
  if (p.c_w <= 0) errors.push('c_w muss größer als 0 sein.');
  if (p.rho <= 0) errors.push('Luftdichte rho muss größer als 0 sein.');
  if (p.y0 < 0) errors.push('Starthöhe y0 darf nicht negativ sein.');
  if (p.duration <= 0) errors.push('Simulationsdauer muss größer als 0 sein.');
  return errors;
}

export function runSimulation(p: SimulationParams): SimulationRow[] {
  const rows: SimulationRow[] = [];

  let t = 0;
  let v = p.v0;
  let y = p.y0;

  while (t <= p.duration + 1e-12 && y > 0) {
    // F_res = -m * g + 0.5 * rho * c_w * A * v²
    const F = -p.m * G + 0.5 * p.rho * p.c_w * p.A * v * v;
    // a = F_res / m
    const a = F / p.m;
    // v_neu = v_alt + a_neu * dt
    const vNext = v + a * p.dt;
    // y_neu = y_alt + v_neu * dt
    const yNext = y + vNext * p.dt;

    rows.push({ t, F, a, v: vNext, y: yNext });

    t += p.dt;
    v = vNext;
    y = yNext;
  }

  return rows;
}

export function freeFallNoDrag(y0: number, t: number) {
  return {
    v: -G * t,
    y: y0 - 0.5 * G * t * t,
  };
}

export function toCsv(rows: SimulationRow[]): string {
  const head = 't,F,a,v,y';
  const body = rows.map((r) => `${r.t},${r.F},${r.a},${r.v},${r.y}`).join('\n');
  return `${head}\n${body}`;
}
