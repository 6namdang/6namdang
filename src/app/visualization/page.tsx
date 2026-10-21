import type { Metadata } from "next";
import { AtlasBoard } from "@/components/atlas-board";
import { Frame } from "@/components/frame";

export const metadata: Metadata = {
  title: "Visualization",
  description: "Large D3 figures, including a world map of disease.",
};

export default function VisualizationPage() {
  return (
    <main id="content" className="flex-1">
      <Frame className="pt-12 pb-20 sm:pt-16">
        <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">Atlas</p>
        <h1 className="mt-4 max-w-[16em] font-serif text-[2rem] leading-[1.15] font-normal tracking-tight text-ink sm:text-[2.5rem]">
          Figures.
        </h1>
        <div className="mt-10">
          <AtlasBoard />
        </div>
      </Frame>
    </main>
  );
}
