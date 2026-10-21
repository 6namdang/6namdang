import { arc, chord, geoEquirectangular, geoGraticule, geoPath, ribbon, scaleLinear, select } from "d3";
import { feature } from "topojson-client";
import type { GeometryCollection, Topology } from "topojson-specification";
import worldAtlas from "world-atlas/countries-110m.json";
import {
  diseases,
  geneColors,
  geneNames,
  mixMatrix,
  type AtlasSnapshot,
} from "@/lib/atlas";

const ink = "#1a1d21";
const muted = "#3f4754";
const grid = "#e6eaee";
const sans = "IBM Plex Sans, Helvetica Neue, Arial, sans-serif";

const topology = worldAtlas as unknown as Topology<{
  countries: GeometryCollection;
}>;
const countries = feature(topology, topology.objects.countries);

const geneScale = scaleLinear<string>()
  .domain([280, 980])
  .range(["#d5e7f6", "#14365c"])
  .clamp(true);

type ChordGroup = {
  index: number;
  startAngle: number;
  endAngle: number;
  value: number;
};

function ease(amount: number) {
  return amount < 0.5 ? 2 * amount * amount : 1 - ((-2 * amount + 2) ** 2) / 2;
}

export function morphAmount(elapsed: number, hold: number, duration: number) {
  if (elapsed <= hold) return 0;
  return ease(Math.min(1, (elapsed - hold) / duration));
}

function fitCanvas(canvas: HTMLCanvasElement, width: number, height: number) {
  const ratio = Math.min(window.devicePixelRatio || 1, 2);
  const bitmapWidth = Math.floor(width * ratio);
  const bitmapHeight = Math.floor(height * ratio);
  if (canvas.width !== bitmapWidth || canvas.height !== bitmapHeight) {
    canvas.width = bitmapWidth;
    canvas.height = bitmapHeight;
  }
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const context = canvas.getContext("2d");
  if (!context) return null;
  context.setTransform(ratio, 0, 0, ratio, 0, 0);
  return context;
}

export function paintChord(svg: SVGSVGElement, from: number[][], to: number[][], t: number, width: number) {
  const size = Math.min(Math.max(width, 320), 820);
  const showLabels = size >= 560;
  const outer = size / 2 - (showLabels ? 78 : 14);
  const inner = outer - Math.max(12, outer * 0.055);
  const root = select(svg);
  svg.setAttribute("viewBox", `0 0 ${size} ${size}`);
  svg.style.width = `${size}px`;
  svg.style.height = `${size}px`;

  if (svg.dataset.size !== String(size)) {
    svg.dataset.size = String(size);
    root.selectAll("*").remove();
    const plot = root.append("g").attr("class", "plot");
    plot.append("g").attr("class", "ribbons").style("mix-blend-mode", "multiply");
    plot.append("g").attr("class", "arcs");
    plot.append("g").attr("class", "labels");
  }

  root.select<SVGGElement>(".plot").attr("transform", `translate(${size / 2},${size / 2})`);
  const matrix = mixMatrix(from, to, t);
  const laid = chord().padAngle(0.014)(matrix);
  const ribbonPath = ribbon().radius(inner) as unknown as (
    datum: (typeof laid)[number],
  ) => string | null;
  const arcPath = arc<ChordGroup>().innerRadius(inner).outerRadius(outer);
  const plot = root.select<SVGGElement>(".plot");

  plot
    .select<SVGGElement>(".ribbons")
    .selectAll<SVGPathElement, (typeof laid)[number]>("path")
    .data(laid, (edge) => {
      const left = edge.source.index;
      const right = edge.target.index;
      return left < right ? `${left}-${right}` : `${right}-${left}`;
    })
    .join("path")
    .attr("d", (edge) => ribbonPath(edge))
    .attr("fill", (edge) => geneColors[Math.min(edge.source.index, edge.target.index)])
    .attr("fill-opacity", (edge) => {
      const value = (edge.source.value + edge.target.value) / 2;
      return Math.max(0, Math.min(0.72, (value - 0.05) / 0.35));
    })
    .attr("stroke", "none");

  plot
    .select<SVGGElement>(".arcs")
    .selectAll<SVGPathElement, ChordGroup>("path")
    .data(laid.groups, (group) => group.index)
    .join((enter) =>
      enter.append("path").call((entered) => {
        entered.append("title").text((group) => geneNames[group.index]);
      }),
    )
    .attr("d", arcPath)
    .attr("fill", (group) => geneColors[group.index])
    .attr("stroke", "#ffffff")
    .attr("stroke-width", 1);

  plot
    .select<SVGGElement>(".labels")
    .selectAll<SVGTextElement, ChordGroup>("text")
    .data(showLabels ? laid.groups : [], (group) => group.index)
    .join("text")
    .text((group) => geneNames[group.index])
    .attr("font-size", 11)
    .attr("font-family", sans)
    .attr("fill", ink)
    .attr("dy", "0.32em")
    .attr("transform", (group) => {
      const angle = (group.startAngle + group.endAngle) / 2;
      const turn = (angle * 180) / Math.PI - 90;
      const flip = angle > Math.PI;
      return `rotate(${turn}) translate(${outer + 7})${flip ? " rotate(180)" : ""}`;
    })
    .attr("text-anchor", (group) =>
      (group.startAngle + group.endAngle) / 2 > Math.PI ? "end" : "start",
    );
}

export function paintEmbedding(
  canvas: HTMLCanvasElement,
  from: AtlasSnapshot["points"],
  to: AtlasSnapshot["points"],
  t: number,
  width: number,
) {
  const plotWidth = Math.min(Math.max(width, 320), 960);
  const plotHeight = Math.round(plotWidth * 0.72);
  const context = fitCanvas(canvas, plotWidth, plotHeight);
  if (!context) return;
  context.clearRect(0, 0, plotWidth, plotHeight);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, plotWidth, plotHeight);

  const margin = { top: 28, right: 92, bottom: 42, left: 52 };
  const xScale = scaleLinear()
    .domain([-1.25, 1.25])
    .range([margin.left, plotWidth - margin.right]);
  const yScale = scaleLinear()
    .domain([-1.25, 1.25])
    .range([plotHeight - margin.bottom, margin.top]);

  context.strokeStyle = grid;
  context.lineWidth = 1;
  context.font = `11px ${sans}`;
  context.fillStyle = muted;
  context.textAlign = "center";
  context.textBaseline = "middle";
  for (const tick of [-1, -0.5, 0, 0.5, 1]) {
    const x = xScale(tick);
    const y = yScale(tick);
    context.beginPath();
    context.moveTo(x, margin.top);
    context.lineTo(x, plotHeight - margin.bottom);
    context.moveTo(margin.left, y);
    context.lineTo(plotWidth - margin.right, y);
    context.stroke();
    context.fillText(tick.toFixed(1), x, plotHeight - margin.bottom + 14);
    context.textAlign = "right";
    context.fillText(tick.toFixed(1), margin.left - 8, y);
    context.textAlign = "center";
  }

  const radius = Math.max(1.45, plotWidth / 420);
  context.save();
  context.globalAlpha = 0.82;
  for (let index = 0; index < from.length; index += 1) {
    const start = from[index];
    const end = to[index];
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t;
    const gene = start.gene + (end.gene - start.gene) * t;
    context.fillStyle = geneScale(gene);
    context.beginPath();
    context.arc(xScale(x), yScale(y), radius, 0, Math.PI * 2);
    context.fill();
  }
  context.restore();

  context.fillStyle = muted;
  context.textAlign = "center";
  context.font = `12px ${sans}`;
  context.fillText("embedding 1", (margin.left + plotWidth - margin.right) / 2, plotHeight - 12);
  context.save();
  context.translate(16, (margin.top + plotHeight - margin.bottom) / 2);
  context.rotate(-Math.PI / 2);
  context.fillText("embedding 2", 0, 0);
  context.restore();

  const legendX = plotWidth - 70;
  const legendTop = margin.top + 12;
  const legendHeight = plotHeight - margin.top - margin.bottom - 28;
  for (let step = 0; step < legendHeight; step += 1) {
    const gene = 980 - (step / legendHeight) * 700;
    context.fillStyle = geneScale(gene);
    context.fillRect(legendX, legendTop + step, 12, 1);
  }
  context.fillStyle = muted;
  context.textAlign = "left";
  context.textBaseline = "alphabetic";
  context.font = `12px ${sans}`;
  context.fillText("gene", legendX, legendTop - 8);
  for (const value of [900, 600, 300]) {
    const y = legendTop + ((980 - value) / 700) * legendHeight;
    context.fillText(String(value), legendX + 18, y + 4);
  }
}

export function paintDisease(
  canvas: HTMLCanvasElement,
  from: AtlasSnapshot["cases"],
  to: AtlasSnapshot["cases"],
  t: number,
  width: number,
) {
  const plotWidth = Math.min(Math.max(width, 320), 960);
  const plotHeight = Math.round(plotWidth * 0.54);
  const context = fitCanvas(canvas, plotWidth, plotHeight);
  if (!context) return;
  context.clearRect(0, 0, plotWidth, plotHeight);
  context.fillStyle = "#f7f8f9";
  context.fillRect(0, 0, plotWidth, plotHeight);

  const projection = geoEquirectangular().fitExtent(
    [
      [6, 6],
      [plotWidth - 6, plotHeight - 6],
    ],
    countries,
  );
  const draw = geoPath(projection, context) as unknown as (shape: object) => void;
  context.beginPath();
  draw(geoGraticule()());
  context.strokeStyle = "#e6eaee";
  context.lineWidth = 0.5;
  context.stroke();
  context.beginPath();
  draw(countries);
  context.fillStyle = "#f3f5f7";
  context.fill();
  context.lineWidth = 0.6;
  context.strokeStyle = "#d5d9de";
  context.stroke();

  const radius = Math.max(1.15, plotWidth / 620);
  const marks = diseases.map(() => new Path2D());
  for (let index = 0; index < from.length; index += 1) {
    const start = from[index];
    const end = to[index];
    const projected = projection([
      start.lon + (end.lon - start.lon) * t,
      start.lat + (end.lat - start.lat) * t,
    ]);
    if (!projected) continue;
    const mark = marks[start.disease];
    mark.moveTo(projected[0] + radius, projected[1]);
    mark.arc(projected[0], projected[1], radius, 0, Math.PI * 2);
  }
  context.globalAlpha = 0.72;
  for (let index = 0; index < diseases.length; index += 1) {
    context.fillStyle = diseases[index].color;
    context.fill(marks[index]);
  }
  context.globalAlpha = 1;
}

export function paintField(
  canvas: HTMLCanvasElement,
  from: AtlasSnapshot["bars"],
  to: AtlasSnapshot["bars"],
  t: number,
  width: number,
) {
  const plotWidth = Math.min(Math.max(width, 320), 960);
  const plotHeight = Math.round(plotWidth * 0.7);
  const context = fitCanvas(canvas, plotWidth, plotHeight);
  if (!context) return;
  context.clearRect(0, 0, plotWidth, plotHeight);
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, plotWidth, plotHeight);

  const pad = 10;
  const order = from.map((_, index) => index);
  order.sort((left, right) => {
    const yLeft = from[left].y + (to[left].y - from[left].y) * t;
    const yRight = from[right].y + (to[right].y - from[right].y) * t;
    return yLeft - yRight;
  });

  for (const index of order) {
    const start = from[index];
    const end = to[index];
    const x = start.x + (end.x - start.x) * t;
    const y = start.y + (end.y - start.y) * t;
    const w = start.w + (end.w - start.w) * t;
    const h = start.h + (end.h - start.h) * t;
    const hue = start.hue + (end.hue - start.hue) * t;
    const light = start.light + (end.light - start.light) * t;
    const sat = start.sat + (end.sat - start.sat) * t;
    const screenW = (w / 100) * (plotWidth - pad * 2);
    const screenH = Math.max(2.5, (h / 100) * (plotHeight - pad * 2));
    const screenX = pad + (x / 100) * (plotWidth - pad * 2);
    const screenY = pad + (y / 100) * (plotHeight - pad * 2);
    context.fillStyle = `hsl(${hue} ${sat}% ${light}%)`;
    context.fillRect(screenX - screenW / 2, screenY - screenH / 2, screenW, screenH);
  }
}
