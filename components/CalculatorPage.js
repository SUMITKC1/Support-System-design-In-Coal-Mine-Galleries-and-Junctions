"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  buildReferenceRows,
  calculateAchievedFoS,
  calculateEffectiveCapacityKN,
  calculateRockLoadCMRI,
  calculateRockLoadSimplified,
  calculateSpacing,
  calculateSupportDensity,
  convertKNtoTonnes,
  roundValue,
} from "../lib/calculations";

const initialForm = {
  rmr: "60",
  roofThickness: "3",
  gallerySpan: "5",
  rockUnitWeight: "2.35",
  boltCapacity: "90",
  fos: "1.5",
  boltEfficiency: "0.9",
  plateEfficiency: "0.9",
  gridSpacing: "",
  location: "1.3",
};

const HISTORY_STORAGE_KEY = "supportCalc.history.v1";
const HISTORY_MAX_ITEMS = 200;

function safeParseJSON(value, fallback) {
  try {
    const parsed = JSON.parse(value);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function downloadTextFile(filename, content, mimeType = "text/plain;charset=utf-8") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function drawArrow(ctx, x1, y1, x2, y2) {
  const headLength = 8;
  const angle = Math.atan2(y2 - y1, x2 - x1);
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLength * Math.cos(angle - Math.PI / 6), y2 - headLength * Math.sin(angle - Math.PI / 6));
  ctx.moveTo(x2, y2);
  ctx.lineTo(x2 - headLength * Math.cos(angle + Math.PI / 6), y2 - headLength * Math.sin(angle + Math.PI / 6));
  ctx.stroke();
}

function drawLabelBox(ctx, text, x, y) {
  const paddingX = 6;
  const paddingY = 4;
  ctx.font = "12px Arial";
  const textWidth = ctx.measureText(text).width;
  const boxWidth = textWidth + paddingX * 2;
  const boxHeight = 20;

  ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
  ctx.fillRect(x, y - boxHeight + 4, boxWidth, boxHeight);
  ctx.strokeStyle = "#9aa0a6";
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y - boxHeight + 4, boxWidth, boxHeight);

  ctx.fillStyle = "#1f4e79";
  ctx.fillText(text, x + paddingX, y);
}

function LineChart({ title, xLabel, yLabel, data, yKey, color }) {
  if (!data?.length) return null;

  const width = 520;
  const height = 280;
  const margin = { top: 24, right: 24, bottom: 48, left: 56 };
  const plotWidth = width - margin.left - margin.right;
  const plotHeight = height - margin.top - margin.bottom;

  const xMin = Math.min(...data.map((d) => d.rmr));
  const xMax = Math.max(...data.map((d) => d.rmr));
  const yMin = 0;
  const yMaxRaw = Math.max(...data.map((d) => d[yKey]));
  const yMax = yMaxRaw <= 0 ? 1 : yMaxRaw * 1.1;

  const xToPx = (x) => margin.left + ((x - xMin) / (xMax - xMin || 1)) * plotWidth;
  const yToPx = (y) => margin.top + (1 - (y - yMin) / (yMax - yMin || 1)) * plotHeight;

  const pathData = data
    .map((point, index) => `${index === 0 ? "M" : "L"} ${xToPx(point.rmr).toFixed(2)} ${yToPx(point[yKey]).toFixed(2)}`)
    .join(" ");

  const yTicks = 5;
  const xTicks = data.map((d) => d.rmr);

  return (
    <div className="chart-card">
      <h5>{title}</h5>
      <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={title}>
        <rect x="0" y="0" width={width} height={height} fill="transparent" />

        {[...Array(yTicks + 1)].map((_, i) => {
          const yValue = (yMax / yTicks) * i;
          const y = yToPx(yValue);
          return (
            <g key={i}>
              <line x1={margin.left} y1={y} x2={width - margin.right} y2={y} stroke="#d8d8d8" strokeWidth="1" />
              <text x={margin.left - 8} y={y + 4} textAnchor="end" fontSize="10" fill="#777">
                {roundValue(yValue, 2)}
              </text>
            </g>
          );
        })}

        <line x1={margin.left} y1={margin.top} x2={margin.left} y2={height - margin.bottom} stroke="#666" strokeWidth="1.2" />
        <line
          x1={margin.left}
          y1={height - margin.bottom}
          x2={width - margin.right}
          y2={height - margin.bottom}
          stroke="#666"
          strokeWidth="1.2"
        />

        {xTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={xToPx(tick)}
              y1={height - margin.bottom}
              x2={xToPx(tick)}
              y2={height - margin.bottom + 5}
              stroke="#666"
              strokeWidth="1"
            />
            <text x={xToPx(tick)} y={height - margin.bottom + 18} textAnchor="middle" fontSize="11" fill="#777">
              {tick}
            </text>
          </g>
        ))}

        <path d={pathData} fill="none" stroke={color} strokeWidth="2.5" />
        {data.map((point) => (
          <circle key={`${yKey}-${point.rmr}`} cx={xToPx(point.rmr)} cy={yToPx(point[yKey])} r="3.5" fill={color} />
        ))}

        <text x={width / 2} y={height - 10} textAnchor="middle" fontSize="12" fill="#555">
          {xLabel}
        </text>
        <text
          x={14}
          y={height / 2}
          textAnchor="middle"
          fontSize="12"
          fill="#555"
          transform={`rotate(-90 14 ${height / 2})`}
        >
          {yLabel}
        </text>
      </svg>
    </div>
  );
}

export function CalculatorPage() {
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [results, setResults] = useState(null);
  const [history, setHistory] = useState([]);
  const [seriesConfig, setSeriesConfig] = useState({
    variable: "rmr",
    start: "30",
    end: "80",
    step: "10",
  });
  const canvasRef = useRef(null);

  useEffect(() => {
    const raw = window.localStorage.getItem(HISTORY_STORAGE_KEY);
    const parsed = raw ? safeParseJSON(raw, []) : [];
    setHistory(Array.isArray(parsed) ? parsed : []);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history.slice(0, HISTORY_MAX_ITEMS)));
  }, [history]);

  const validate = () => {
    const nextErrors = {};
    const asNum = (v) => Number.parseFloat(v);
    const requiredPositive = [
      ["roofThickness", "Roof Thickness"],
      ["gallerySpan", "Gallery span"],
      ["rockUnitWeight", "Rock unit weight"],
      ["boltCapacity", "Bolt Capacity"],
    ];

    const rmr = asNum(form.rmr);
    if (Number.isNaN(rmr) || rmr < 0 || rmr > 100) nextErrors.rmr = "RMR must be between 0 and 100";

    requiredPositive.forEach(([key, label]) => {
      const value = asNum(form[key]);
      if (Number.isNaN(value) || value <= 0) nextErrors[key] = `${label} must be greater than 0`;
    });

    const fos = asNum(form.fos);
    if (Number.isNaN(fos) || fos <= 1) nextErrors.fos = "Factor of Safety must be greater than 1";

    const boltEfficiency = asNum(form.boltEfficiency);
    if (Number.isNaN(boltEfficiency) || boltEfficiency <= 0 || boltEfficiency > 1) {
      nextErrors.boltEfficiency = "Bolt efficiency must be between 0 and 1";
    }

    const plateEfficiency = asNum(form.plateEfficiency);
    if (Number.isNaN(plateEfficiency) || plateEfficiency <= 0 || plateEfficiency > 1) {
      nextErrors.plateEfficiency = "Plate efficiency must be between 0 and 1";
    }

    const location = asNum(form.location);
    if (Number.isNaN(location) || location < 1) nextErrors.location = "Location factor must be >= 1";

    if (form.gridSpacing !== "") {
      const gridSpacing = asNum(form.gridSpacing);
      if (Number.isNaN(gridSpacing) || gridSpacing <= 0) {
        nextErrors.gridSpacing = "Grid spacing must be greater than 0";
      }
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!validate()) return;

    const rmr = Number.parseFloat(form.rmr);
    const roofThickness = Number.parseFloat(form.roofThickness);
    const gallerySpan = Number.parseFloat(form.gallerySpan);
    const rockUnitWeight = Number.parseFloat(form.rockUnitWeight);
    const boltCapacity = Number.parseFloat(form.boltCapacity);
    const fos = Number.parseFloat(form.fos);
    const boltEfficiency = Number.parseFloat(form.boltEfficiency);
    const plateEfficiency = Number.parseFloat(form.plateEfficiency);
    const jf = Number.parseFloat(form.location);
    const hasProposedGrid = form.gridSpacing !== "" && !Number.isNaN(Number.parseFloat(form.gridSpacing));
    const proposedGridSpacing = hasProposedGrid ? Number.parseFloat(form.gridSpacing) : null;

    const rockLoadCMRI = calculateRockLoadCMRI(rmr, rockUnitWeight, gallerySpan);
    const rockLoadSimple = calculateRockLoadSimplified(rmr, roofThickness);
    const effectiveCapacityKN = calculateEffectiveCapacityKN(boltCapacity, boltEfficiency, plateEfficiency);
    const effectiveCapacityT = convertKNtoTonnes(effectiveCapacityKN);
    const spacing = calculateSpacing(effectiveCapacityT, rockLoadCMRI, fos, jf);
    const supportDensity = calculateSupportDensity(effectiveCapacityT, spacing);
    const supportDensityProposed = hasProposedGrid
      ? calculateSupportDensity(effectiveCapacityT, proposedGridSpacing)
      : null;
    const achievedFoS = hasProposedGrid
      ? calculateAchievedFoS(effectiveCapacityT, rockLoadCMRI, jf, proposedGridSpacing)
      : null;
    const spacingAdequacy = hasProposedGrid ? (proposedGridSpacing <= spacing ? "Adequate" : "Not adequate") : "Not provided";
    const referenceRows = buildReferenceRows(rockUnitWeight, gallerySpan, effectiveCapacityT, fos);
    const diagramSpacing = hasProposedGrid ? proposedGridSpacing : spacing;

    const run = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      createdAt: new Date().toISOString(),
      inputs: {
        rmr,
        roofThickness,
        gallerySpan,
        rockUnitWeight,
        boltCapacity,
        fos,
        boltEfficiency,
        plateEfficiency,
        jf,
        proposedGridSpacing,
      },
      outputs: {
        rockLoadCMRI,
        rockLoadSimple,
        effectiveCapacityKN,
        effectiveCapacityT,
        spacing,
        supportDensity,
        achievedFoS,
        spacingAdequacy,
      },
    };

    setResults({
      rockLoadCMRI,
      rockLoadSimple,
      effectiveCapacityKN,
      effectiveCapacityT,
      spacing,
      proposedGridSpacing,
      supportDensity,
      supportDensityProposed,
      achievedFoS,
      spacingAdequacy,
      referenceRows,
      diagramSpacing,
      hasProposedGrid,
    });

    setHistory((prev) => [run, ...prev].slice(0, HISTORY_MAX_ITEMS));
  };

  useEffect(() => {
    if (!results || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    const displaySpacing = results.diagramSpacing;

    ctx.clearRect(0, 0, width, height);
    ctx.fillStyle = "#f7f7f7";
    ctx.fillRect(0, 0, width, height);

    const cols = 5;
    const rows = 4;
    const left = 120;
    const right = 30;
    const top = 55;
    const bottom = 70;

    // Visual pitch scales directly with engineering spacing.
    // This makes spacing changes immediately obvious when user inputs change.
    const desiredPitch = 26 + displaySpacing * 24;
    const maxPitchX = (width - left - right) / (cols - 1);
    const maxPitchY = (height - top - bottom) / (rows - 1);
    const dx = Math.max(26, Math.min(desiredPitch, maxPitchX, maxPitchY));
    const dy = dx;

    ctx.strokeStyle = "#b0b0b0";
    ctx.lineWidth = 1;
    for (let r = 0; r < rows; r += 1) {
      const y = top + r * dy;
      ctx.beginPath();
      ctx.moveTo(left, y);
      ctx.lineTo(left + (cols - 1) * dx, y);
      ctx.stroke();
    }
    for (let c = 0; c < cols; c += 1) {
      const x = left + c * dx;
      ctx.beginPath();
      ctx.moveTo(x, top);
      ctx.lineTo(x, top + (rows - 1) * dy);
      ctx.stroke();
    }

    ctx.fillStyle = "#333";
    for (let r = 0; r < rows; r += 1) {
      for (let c = 0; c < cols; c += 1) {
        const x = left + c * dx;
        const y = top + r * dy;
        ctx.beginPath();
        ctx.arc(x, y, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.strokeStyle = "#1f4e79";
    ctx.fillStyle = "#1f4e79";
    ctx.lineWidth = 2;
    const xStart = left;
    const xEnd = left + dx;
    const ySpacing = top + (rows - 1) * dy + 30;
    drawArrow(ctx, xStart, ySpacing, xEnd, ySpacing);
    drawArrow(ctx, xEnd, ySpacing, xStart, ySpacing);
    drawLabelBox(ctx, `Spacing = ${roundValue(displaySpacing, 4)} m`, xStart + 4, ySpacing - 8);

    const yStart = top;
    const yEnd = top + dy;
    const xSpacingVertical = left - 28;
    drawArrow(ctx, xSpacingVertical, yStart, xSpacingVertical, yEnd);
    drawArrow(ctx, xSpacingVertical, yEnd, xSpacingVertical, yStart);
    drawLabelBox(ctx, `Spacing = ${roundValue(displaySpacing, 4)} m`, xSpacingVertical + 12, yStart + dy / 2 + 4);

    const pxPerMeter = dx / Math.max(displaySpacing, 0.0001);
    drawLabelBox(ctx, `Visual scale: 1 m ≈ ${roundValue(pxPerMeter, 1)} px`, width - 208, height - 12);
  }, [results]);

  const setField = (key) => (event) => {
    setForm((prev) => ({ ...prev, [key]: event.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const setSeriesField = (key) => (event) => {
    setSeriesConfig((prev) => ({ ...prev, [key]: event.target.value }));
  };

  const buildSeriesRows = () => {
    if (!results) return [];
    const start = Number.parseFloat(seriesConfig.start);
    const end = Number.parseFloat(seriesConfig.end);
    const step = Number.parseFloat(seriesConfig.step);
    if ([start, end, step].some(Number.isNaN) || step <= 0 || end < start) {
      return results.referenceRows.map((row) => ({
        x: row.rmr,
        rockLoad: row.rockLoad,
        spacing: row.spacing,
      }));
    }

    const rows = [];
    for (let x = start; x <= end + 1e-9; x += step) {
      const rmr = seriesConfig.variable === "rmr" ? x : Number.parseFloat(form.rmr);
      const gamma = seriesConfig.variable === "gamma" ? x : Number.parseFloat(form.rockUnitWeight);
      const span = seriesConfig.variable === "span" ? x : Number.parseFloat(form.gallerySpan);

      const rockLoad = calculateRockLoadCMRI(rmr, gamma, span);
      const spacing = calculateSpacing(results.effectiveCapacityT, rockLoad, Number.parseFloat(form.fos), Number.parseFloat(form.location));
      rows.push({ x, rockLoad, spacing });
    }
    return rows;
  };

  const seriesRows = useMemo(
    () => buildSeriesRows(),
    // results contains the computed capacity/spacing + reference rows; seriesConfig and form influence series
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [results, seriesConfig, form]
  );
  const variableLabel =
    seriesConfig.variable === "rmr" ? "RMR" : seriesConfig.variable === "gamma" ? "Rock unit weight gamma (t/m^3)" : "Gallery span B (m)";

  return (
    <>
      <section className="hero-section">
        <div className="container">
          <h1>Designing Roof Bolt Support for Underground Coal Mine Galleries and Junctions</h1>
          <p className="hero-description">
            A computational tool designed to assist engineers in determining optimal rock support parameters for
            underground excavations.
          </p>
        </div>
      </section>

      <section className="about-preview-section">
        <div className="container">
          <div className="card about-preview-card">
            <h2>About the Project</h2>
            <p>
              This semi-empirical calculator connects RMR/Q based understanding with practical support spacing and
              density checks to provide field-friendly design guidance.
            </p>
            <Link href="/about" className="btn-read-more">
              Read More
            </Link>
          </div>
        </div>
      </section>

      <section className="calculator-section">
        <div className="container">
          <h2>Support Design Calculator</h2>
          <div className="card input-card">
            <form onSubmit={onSubmit}>
              <div className="input-grid">
                <Input label="RMR (0-100)" value={form.rmr} onChange={setField("rmr")} error={errors.rmr} />
                <Input
                  label="Roof Thickness t (m)"
                  value={form.roofThickness}
                  onChange={setField("roofThickness")}
                  error={errors.roofThickness}
                />
                <Input
                  label="Gallery span B (m)"
                  value={form.gallerySpan}
                  onChange={setField("gallerySpan")}
                  error={errors.gallerySpan}
                />
                <Input
                  label="Rock unit weight gamma (t/m^3)"
                  value={form.rockUnitWeight}
                  onChange={setField("rockUnitWeight")}
                  error={errors.rockUnitWeight}
                />
                <Input
                  label="Bolt Capacity Cb (kN)"
                  value={form.boltCapacity}
                  onChange={setField("boltCapacity")}
                  error={errors.boltCapacity}
                />
                <Input label="Factor of Safety (FoS)" value={form.fos} onChange={setField("fos")} error={errors.fos} />
                <Input
                  label="Bolt efficiency (eta_b)"
                  value={form.boltEfficiency}
                  onChange={setField("boltEfficiency")}
                  error={errors.boltEfficiency}
                />
                <Input
                  label="Plate efficiency (eta_p)"
                  value={form.plateEfficiency}
                  onChange={setField("plateEfficiency")}
                  error={errors.plateEfficiency}
                />
                <Input
                  label="Proposed grid spacing Sg (m)"
                  value={form.gridSpacing}
                  onChange={setField("gridSpacing")}
                  error={errors.gridSpacing}
                  placeholder="Optional"
                />
              </div>
              <div className="input-group full-width">
                <label htmlFor="location">Location</label>
                <select id="location" value={form.location} onChange={setField("location")}>
                  <option value="1.0">Gallery (Jf = 1.0)</option>
                  <option value="1.3">Junction (Jf = 1.3)</option>
                  <option value="1.5">Junction - stricter (Jf = 1.5)</option>
                </select>
                <span className="error-message">{errors.location}</span>
              </div>
              <button type="submit" className="btn-check">
                Check
              </button>
            </form>
          </div>

          {results && (
            <div className="card results-card visible">
              <h3>Results</h3>

              <div className="summary-grid">
                <div className="summary-card">
                  <h4>Input</h4>
                  <div className="table-wrap">
                    <table className="reference-table compact-table">
                      <thead>
                        <tr>
                          <th>Parameter</th>
                          <th>Value (with unit)</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>RMR</td><td>{form.rmr}</td></tr>
                        <tr><td>Roof thickness (t)</td><td>{form.roofThickness} m</td></tr>
                        <tr><td>Gallery span (B)</td><td>{form.gallerySpan} m</td></tr>
                        <tr><td>Rock unit weight (gamma)</td><td>{form.rockUnitWeight} t/m^3</td></tr>
                        <tr><td>Bolt nominal capacity (Cb)</td><td>{form.boltCapacity} kN</td></tr>
                        <tr><td>Bolt efficiency (eta_b)</td><td>{form.boltEfficiency}</td></tr>
                        <tr><td>Plate efficiency (eta_p)</td><td>{form.plateEfficiency}</td></tr>
                        <tr><td>Factor of safety (Fs)</td><td>{form.fos}</td></tr>
                        <tr><td>Junction factor (Jf)</td><td>{form.location}</td></tr>
                        <tr><td>Panel area</td><td>16 m^2</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="summary-card">
                  <h4>Output (Dynamic)</h4>
                  <div className="table-wrap">
                    <table className="reference-table compact-table">
                      <thead>
                        <tr>
                          <th>Result Item</th>
                          <th>Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr><td>RL_simplified (t/m^2)</td><td>{roundValue(results.rockLoadSimple, 4)}</td></tr>
                        <tr><td>Pr_CMRI (t/m^2)</td><td>{roundValue(results.rockLoadCMRI, 4)}</td></tr>
                        <tr><td>C_eff (kN)</td><td>{roundValue(results.effectiveCapacityKN, 3)}</td></tr>
                        <tr><td>Suggested Spacing S (m)</td><td>{roundValue(results.spacing, 4)}</td></tr>
                        <tr><td>Support Density (t/m^2)</td><td>{roundValue(results.supportDensity, 4)}</td></tr>
                        <tr><td>Achieved Fs at S (design)</td><td>{roundValue(calculateAchievedFoS(results.effectiveCapacityT, results.rockLoadCMRI, Number.parseFloat(form.location), results.spacing), 4)}</td></tr>
                        <tr><td>Pr_junction (t/m^2)</td><td>{roundValue(results.rockLoadCMRI * Number.parseFloat(form.location), 4)}</td></tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="grid-diagram-block">
                <h4>Grid Pattern Diagram</h4>
                <p className="grid-diagram-note">
                  Dots represent bolt points in a square pattern. Row-to-row distance is shown as spacing.
                </p>
                <div className="grid-diagram-meta">
                  <span>
                    Spacing: <strong>{roundValue(results.diagramSpacing, 4)}</strong> m
                  </span>
                  <span>
                    Row spacing: <strong>{roundValue(results.diagramSpacing, 4)}</strong> m
                  </span>
                  <span>
                    Gap vs design S:{" "}
                    <strong>{roundValue((results.diagramSpacing / Math.max(results.spacing, 0.0001)) * 100, 1)}%</strong>
                  </span>
                </div>
                <div className="grid-diagram-wrap">
                  <canvas ref={canvasRef} id="grid-diagram-canvas" width="620" height="320" />
                </div>
              </div>

              <div className="reference-block">
                <h4>Variable Table & Graph Data</h4>
                <div className="series-controls">
                  <div className="input-group">
                    <label>Variable</label>
                    <select value={seriesConfig.variable} onChange={setSeriesField("variable")}>
                      <option value="rmr">RMR</option>
                      <option value="gamma">Rock unit weight gamma</option>
                      <option value="span">Gallery span B</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>Start</label>
                    <input type="number" value={seriesConfig.start} onChange={setSeriesField("start")} />
                  </div>
                  <div className="input-group">
                    <label>End</label>
                    <input type="number" value={seriesConfig.end} onChange={setSeriesField("end")} />
                  </div>
                  <div className="input-group">
                    <label>Step</label>
                    <input type="number" value={seriesConfig.step} onChange={setSeriesField("step")} />
                  </div>
                </div>
                <div className="table-wrap">
                  <table className="reference-table">
                    <thead>
                      <tr>
                        <th>{variableLabel}</th>
                        <th>Rock Load (t/m^2)</th>
                        <th>Spacing (m)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seriesRows.map((row) => (
                        <tr key={row.x}>
                          <td>{roundValue(row.x, 4)}</td>
                          <td>{roundValue(row.rockLoad, 4)}</td>
                          <td>{roundValue(row.spacing, 6)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="charts-block">
                <h4>Design Graphs</h4>
                <div className="charts-grid">
                  <LineChart
                    title={`${variableLabel} vs Rock Load`}
                    xLabel={variableLabel}
                    yLabel="Rock Load (t/m^2)"
                    data={seriesRows.map((row) => ({ rmr: row.x, rockLoad: row.rockLoad }))}
                    yKey="rockLoad"
                    color="#d64545"
                  />
                  <LineChart
                    title={`${variableLabel} vs Spacing`}
                    xLabel={variableLabel}
                    yLabel="Spacing (m)"
                    data={seriesRows.map((row) => ({ rmr: row.x, spacing: row.spacing }))}
                    yKey="spacing"
                    color="#2c6fb7"
                  />
                </div>
              </div>

              <div className="history-block">
                <div className="history-header">
                  <h4>Local Run History</h4>
                  <div className="history-actions">
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        const headers = [
                          "time",
                          "rmr",
                          "t_m",
                          "B_m",
                          "gamma_t_per_m3",
                          "Cb_kN",
                          "eta_b",
                          "eta_p",
                          "Fs",
                          "Jf",
                          "Pr_CMRI_t_per_m2",
                          "RL_simplified_t_per_m2",
                          "C_eff_kN",
                          "S_m",
                          "supportDensity_t_per_m2",
                          "proposedGridSpacing_m",
                          "achievedFoS_at_proposed",
                          "adequacy",
                        ];

                        const rows = history.map((h) => [
                          h.createdAt,
                          h.inputs.rmr,
                          h.inputs.roofThickness,
                          h.inputs.gallerySpan,
                          h.inputs.rockUnitWeight,
                          h.inputs.boltCapacity,
                          h.inputs.boltEfficiency,
                          h.inputs.plateEfficiency,
                          h.inputs.fos,
                          h.inputs.jf,
                          h.outputs.rockLoadCMRI,
                          h.outputs.rockLoadSimple,
                          h.outputs.effectiveCapacityKN,
                          h.outputs.spacing,
                          h.outputs.supportDensity,
                          h.inputs.proposedGridSpacing ?? "",
                          h.outputs.achievedFoS ?? "",
                          h.outputs.spacingAdequacy,
                        ]);

                        const csv = [headers.join(","), ...rows.map((r) => r.map((v) => `"${String(v).replaceAll('"', '""')}"`).join(","))].join(
                          "\n"
                        );
                        downloadTextFile("support-calculator-history.csv", csv, "text/csv;charset=utf-8");
                      }}
                      disabled={history.length === 0}
                    >
                      Export CSV
                    </button>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => {
                        window.localStorage.removeItem(HISTORY_STORAGE_KEY);
                        setHistory([]);
                      }}
                      disabled={history.length === 0}
                    >
                      Clear
                    </button>
                  </div>
                </div>

                <div className="table-wrap">
                  <table className="reference-table compact-table">
                    <thead>
                      <tr>
                        <th>Time</th>
                        <th>RMR</th>
                        <th>Pr (t/m^2)</th>
                        <th>S (m)</th>
                        <th>Fs</th>
                        <th>Jf</th>
                        <th>Proposed Sg</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {history.length === 0 ? (
                        <tr>
                          <td colSpan={8}>No runs yet. Click “Check” to record a run locally.</td>
                        </tr>
                      ) : (
                        history.slice(0, 15).map((h) => (
                          <tr key={h.id}>
                            <td>{new Date(h.createdAt).toLocaleString()}</td>
                            <td>{roundValue(h.inputs.rmr, 1)}</td>
                            <td>{roundValue(h.outputs.rockLoadCMRI, 4)}</td>
                            <td>{roundValue(h.outputs.spacing, 4)}</td>
                            <td>{roundValue(h.inputs.fos, 2)}</td>
                            <td>{roundValue(h.inputs.jf, 2)}</td>
                            <td>{h.inputs.proposedGridSpacing == null ? "-" : roundValue(h.inputs.proposedGridSpacing, 3)}</td>
                            <td>{h.outputs.spacingAdequacy}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
                {history.length > 15 && <p className="history-note">Showing latest 15 runs. Export CSV for full history.</p>}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

function Input({ label, value, onChange, error, placeholder }) {
  return (
    <div className="input-group">
      <label>{label}</label>
      <input type="number" value={value} onChange={onChange} placeholder={placeholder} />
      <span className="error-message">{error}</span>
    </div>
  );
}

