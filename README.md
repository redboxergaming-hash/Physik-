# c_w-Wert eines Papierkegels bestimmen

Web-App für den Schulversuch zur experimentellen Bestimmung des Luftwiderstandsbeiwerts `c_w` eines Papierkegels über die Methode der kleinen Schritte.

## Stack
- React + TypeScript + Vite
- Tailwind CSS
- Recharts

## Funktionen
- Eingabe echter Messdaten (Fallhöhe, Masse, Durchmesser, mehrere Fallzeiten)
- Umrechnung von g→kg und cm→m
- Automatische Flächenberechnung `A = π(d/2)^2`
- Numerische Simulation mit Luftwiderstand und Iteration pro `dt`
- Automatische c_w-Suche im Bereich `0.01 .. 5.0` (Binärsuche + Rasterprüfung)
- Statistik der Messzeiten (Mittelwert, Min, Max, Streuung, Standardabweichung)
- Ergebnisbewertung (Sehr gut / Gut / Ungenau)
- Diagramme: `t-y`, `t-v`, Fehlerkurve `c_w -> |Δt|`
- Simulationstabelle inkl. Toggle für alle Iterationen
- Export: CSV, Messdaten kopieren, Ergebnisbericht kopieren

## Entwicklung
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
npm run preview
```

## Netlify
- Build command: `npm run build`
- Publish directory: `dist`
