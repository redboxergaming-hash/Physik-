# Methode der kleinen Schritte – Freier Fall mit Luftwiderstand

Diese Web-App ersetzt das Excel-Arbeitsblatt durch eine interaktive Simulation für den Physikversuch.

## Tech-Stack
- React
- TypeScript
- Vite
- Recharts
- Reines Frontend (kein Backend)

## Features
- Parametereingabe (dt, m, A, c_w, rho, y0, v0, Dauer)
- Numerische Berechnung mit kleinen Zeitschritten
- Ergebnis-Karten (v, y, a, F, max v, Zeitpunkt max v)
- Vergleich mit freiem Fall ohne Luftwiderstand
- Tabelle mit optional "Alle Werte anzeigen"
- Diagramme: t-v und t-y
- CSV exportieren / Daten kopieren / JSON exportieren

## Lokal starten
```bash
npm install
npm run dev
```

## Für Netlify
Build-Befehl:
```bash
npm run build
```
Publish directory:
```bash
dist
```
