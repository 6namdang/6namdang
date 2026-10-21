"use client";

import { useEffect, useId, useRef, useState } from "react";
import { morphAmount, paintChord, paintDisease, paintEmbedding, paintField } from "@/components/atlas-paint";
import { createAtlas, diseases, mixSnapshot, pathways, programs } from "@/lib/atlas";

type FigureKind = "disease" | "chord" | "embedding" | "field";

const figures: { id: FigureKind; label: string }[] = [
  { id: "disease", label: "Disease" },
  { id: "chord", label: "Chord" },
  { id: "embedding", label: "Embedding" },
  { id: "field", label: "Field" },
];

const hold = 2600;
const duration = 2200;

export function AtlasBoard() {
  const headingId = useId();
  const surface = useRef<HTMLDivElement>(null);
  const svg = useRef<SVGSVGElement>(null);
  const canvas = useRef<HTMLCanvasElement>(null);
  const [kind, setKind] = useState<FigureKind>("disease");
  const [paused, setPaused] = useState(false);
  const [still, setStill] = useState(false);
  const kindRef = useRef<FigureKind>("disease");
  const controls = useRef({ toggle() {}, redraw() {}, paint() {} });

  useEffect(() => {
    const node = surface.current;
    const chordNode = svg.current;
    const canvasNode = canvas.current;
    if (!node || !chordNode || !canvasNode) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const reduced = media.matches;
    setStill(reduced);

    const widthOf = () => Math.max(320, Math.floor(node.clientWidth));
    const loop = {
      seed: 2,
      from: createAtlas(1),
      to: createAtlas(2),
      origin: performance.now(),
    };
    let elapsedHeld = 0;
    let pausedNow = reduced;
    let frame = 0;

    function amount(now: number) {
      const elapsed = pausedNow ? elapsedHeld : now - loop.origin;
      return morphAmount(elapsed, hold, duration);
    }

    function advance(now: number) {
      let elapsed = now - loop.origin;
      if (elapsed >= hold + duration) {
        const steps = Math.floor(elapsed / (hold + duration));
        loop.seed += steps;
        loop.origin += steps * (hold + duration);
        loop.to = createAtlas(loop.seed);
        loop.from = createAtlas(loop.seed - 1);
        elapsed = now - loop.origin;
      }
      return elapsed;
    }

    function paint(now: number) {
      const width = widthOf();
      const t = amount(now);
      const current = kindRef.current;
      if (current === "chord") {
        paintChord(chordNode!, loop.from.matrix, loop.to.matrix, t, width);
        return;
      }
      if (current === "embedding") {
        paintEmbedding(canvasNode!, loop.from.points, loop.to.points, t, width);
        return;
      }
      if (current === "field") {
        paintField(canvasNode!, loop.from.bars, loop.to.bars, t, width);
        return;
      }
      paintDisease(canvasNode!, loop.from.cases, loop.to.cases, t, width);
    }

    function tick(now: number) {
      if (!pausedNow) advance(now);
      paint(now);
      frame = window.requestAnimationFrame(tick);
    }

    controls.current.toggle = () => {
      if (reduced) return;
      if (pausedNow) {
        pausedNow = false;
        loop.origin = performance.now() - elapsedHeld;
        setPaused(false);
        frame = window.requestAnimationFrame(tick);
        return;
      }
      elapsedHeld = performance.now() - loop.origin;
      pausedNow = true;
      setPaused(true);
      window.cancelAnimationFrame(frame);
    };

    controls.current.paint = () => {
      paint(performance.now());
    };

    controls.current.redraw = () => {
      const now = performance.now();
      const t = amount(now);
      const mixed = mixSnapshot(loop.from, loop.to, t);
      loop.seed += 1;
      loop.from = pausedNow || reduced ? createAtlas(loop.seed) : mixed;
      loop.to = pausedNow || reduced ? loop.from : createAtlas(loop.seed);
      if (pausedNow || reduced) {
        elapsedHeld = 0;
        loop.origin = now;
        paint(now);
        return;
      }
      loop.origin = now - hold;
      elapsedHeld = hold;
    };

    const observer = new ResizeObserver(() => {
      paint(performance.now());
    });
    observer.observe(node);
    paint(performance.now());
    if (!reduced) frame = window.requestAnimationFrame(tick);

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, []);

  const title =
    kind === "disease"
      ? "Disease"
      : kind === "chord"
        ? "Pathway chord"
        : kind === "embedding"
          ? "Cell embedding"
          : "Spatial field";

  return (
    <div>
      <div role="tablist" aria-label="Atlas figures" className="flex gap-6 border-b border-line">
        {figures.map((item) => {
          const selected = kind === item.id;
          return (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-controls="atlas-figure"
              className={`-mb-px border-b-2 pb-2 text-sm ${
                selected ? "border-navy text-ink" : "border-transparent text-muted hover:text-navy"
              }`}
              onClick={() => {
                kindRef.current = item.id;
                setKind(item.id);
                controls.current.paint();
              }}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-3">
        {still ? null : (
          <button
            type="button"
            aria-pressed={paused}
            className="border border-navy px-3 py-1.5 text-sm text-navy hover:bg-navy hover:text-white"
            onClick={() => controls.current.toggle()}
          >
            {paused ? "Play" : "Pause"}
          </button>
        )}
        <button
          type="button"
          className="border border-navy px-3 py-1.5 text-sm text-navy hover:bg-navy hover:text-white"
          onClick={() => controls.current.redraw()}
        >
          Another draw
        </button>
      </div>

      <div ref={surface} id="atlas-figure" role="tabpanel" className="mt-4">
        <h2 id={headingId} className="font-serif text-xl text-ink">
          {title}
        </h2>
        <svg
          ref={svg}
          role="img"
          aria-labelledby={headingId}
          className={kind === "chord" ? "mx-auto mt-4 block max-w-full" : "hidden"}
        />
        <canvas
          ref={canvas}
          role="img"
          aria-labelledby={headingId}
          className={kind === "chord" ? "hidden" : "mx-auto mt-4 block max-w-full"}
        />
      </div>

      {kind === "disease" ? (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {diseases.map((disease) => (
            <li key={disease.name}>
              <span
                className="mr-2 inline-block size-2.5 align-middle"
                style={{ backgroundColor: disease.color }}
              />
              {disease.name}
            </li>
          ))}
        </ul>
      ) : null}

      {kind === "chord" ? (
        <ul className="mt-4 grid gap-x-8 gap-y-1 text-sm sm:grid-cols-2 lg:grid-cols-3">
          {pathways.map((pathway) => (
            <li key={pathway.name}>
              <span
                className="mr-2 inline-block size-2.5 align-middle"
                style={{ backgroundColor: pathway.color }}
              />
              {pathway.name}
              <span className="text-muted"> {pathway.genes.join(" ")}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {kind === "field" ? (
        <ul className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
          {programs.map((program) => (
            <li key={program.name}>
              <span
                className="mr-2 inline-block size-2.5 align-middle"
                style={{ backgroundColor: `hsl(${program.hue} 64% 48%)` }}
              />
              {program.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
