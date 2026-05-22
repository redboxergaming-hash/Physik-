export type MassUnit = 'g' | 'kg';
export type DiameterUnit = 'cm' | 'm';

export type ExperimentInput = {
  heightM: number;
  massValue: number;
  massUnit: MassUnit;
  diameterValue: number;
  diameterUnit: DiameterUnit;
  rho: number;
  g: number;
  dt: number;
  measuredTimes: number[];
  cwMin: number;
  cwMax: number;
};

export type SimulationRow = { t: number; F_res: number; a: number; v: number; y: number };

export type CwResult = {
  bestCw: number;
  measuredAvg: number;
  simulatedTime: number;
  absError: number;
  area: number;
  impactVelocity: number;
  avgVelocity: number;
  endAcceleration: number;
  quality: 'Sehr gut' | 'Gut' | 'Ungenau';
  rows: SimulationRow[];
  errorCurve: { cw: number; error: number }[];
  minMeasured: number;
  maxMeasured: number;
  stdDev: number;
  spread: number;
  warnings: string[];
};

export function toSI(input: ExperimentInput) {
  const massKg = input.massUnit === 'g' ? input.massValue / 1000 : input.massValue;
  const diameterM = input.diameterUnit === 'cm' ? input.diameterValue / 100 : input.diameterValue;
  const area = Math.PI * (diameterM / 2) ** 2;
  return { massKg, diameterM, area };
}

export function validateInput(input: ExperimentInput): string[] {
  const errors: string[] = [];
  const validTimes = input.measuredTimes.filter((t) => t > 0);
  if (input.heightM <= 0) errors.push('Fallhöhe muss > 0 sein.');
  if (input.massValue <= 0) errors.push('Masse muss > 0 sein.');
  if (input.diameterValue <= 0) errors.push('Durchmesser muss > 0 sein.');
  if (input.dt <= 0) errors.push('dt muss > 0 sein.');
  if (input.rho <= 0) errors.push('Luftdichte rho muss > 0 sein.');
  if (input.g <= 0) errors.push('g muss > 0 sein.');
  if (validTimes.length === 0) errors.push('Mindestens eine gemessene Fallzeit > 0 s eingeben.');
  if (input.cwMin <= 0 || input.cwMax <= 0 || input.cwMin >= input.cwMax) errors.push('c_w-Suchbereich ist ungültig.');
  return errors;
}

export function simulateFall(heightM: number, massKg: number, area: number, rho: number, g: number, cw: number, dt: number) {
  const rows: SimulationRow[] = [];
  let t = 0, v = 0, y = heightM;
  while (y > 0 && t < 120) {
    const F_res = -massKg * g + 0.5 * rho * cw * area * v * v;
    const a = F_res / massKg;
    const vNew = v + a * dt;
    const yNew = y + vNew * dt;
    rows.push({ t, F_res, a, v: vNew, y: yNew });
    t += dt; v = vNew; y = yNew;
  }
  return rows;
}

function mean(arr: number[]) { return arr.reduce((s, v) => s + v, 0) / arr.length; }
function stdDev(arr: number[]) {
  const m = mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}

export function solveCw(input: ExperimentInput): CwResult | null {
  const si = toSI(input);
  const times = input.measuredTimes.filter((t) => t > 0);
  if (!times.length) return null;
  const measuredAvg = mean(times);
  const warnings: string[] = [];
  if (si.massKg < 0.001 || si.massKg > 1) warnings.push('Masse wirkt ungewöhnlich für einen Papierkegel.');
  if (si.diameterM < 0.02 || si.diameterM > 0.5) warnings.push('Durchmesser wirkt ungewöhnlich.');

  const errorCurve: { cw: number; error: number }[] = [];
  let lo = input.cwMin;
  let hi = input.cwMax;
  let best = { cw: lo, err: Number.POSITIVE_INFINITY, rows: [] as SimulationRow[] };

  for (let i = 0; i < 45; i++) {
    const mid = (lo + hi) / 2;
    const rows = simulateFall(input.heightM, si.massKg, si.area, input.rho, input.g, mid, input.dt);
    const tSim = rows[rows.length - 1]?.t ?? Number.POSITIVE_INFINITY;
    const err = Math.abs(tSim - measuredAvg);
    errorCurve.push({ cw: mid, error: err });
    if (err < best.err) best = { cw: mid, err, rows };
    if (tSim < measuredAvg) lo = mid; else hi = mid;
  }

  for (let i = 0; i <= 40; i++) {
    const cw = input.cwMin + ((input.cwMax - input.cwMin) * i) / 40;
    const rows = simulateFall(input.heightM, si.massKg, si.area, input.rho, input.g, cw, input.dt);
    const tSim = rows[rows.length - 1]?.t ?? Number.POSITIVE_INFINITY;
    const err = Math.abs(tSim - measuredAvg);
    errorCurve.push({ cw, error: err });
    if (err < best.err) best = { cw, err, rows };
  }

  const end = best.rows[best.rows.length - 1];
  if (!end || !Number.isFinite(best.err)) return null;

  const simulatedTime = end.t;
  const quality = best.err < 0.02 ? 'Sehr gut' : best.err < 0.05 ? 'Gut' : 'Ungenau';
  if (best.err > 0.3) warnings.push('Keine gute Anpassung im Suchbereich gefunden. Bitte Messwerte prüfen oder Suchbereich erweitern.');

  return {
    bestCw: best.cw,
    measuredAvg,
    simulatedTime,
    absError: best.err,
    area: si.area,
    impactVelocity: end.v,
    avgVelocity: -input.heightM / simulatedTime,
    endAcceleration: end.a,
    quality,
    rows: best.rows,
    errorCurve,
    minMeasured: Math.min(...times),
    maxMeasured: Math.max(...times),
    stdDev: stdDev(times),
    spread: Math.max(...times) - Math.min(...times),
    warnings,
  };
}

export function freeFallNoDragTime(heightM: number, g: number) {
  return Math.sqrt((2 * heightM) / g);
}
