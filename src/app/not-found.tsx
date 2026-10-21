import type { Metadata } from "next";
import Link from "next/link";
import { Frame } from "@/components/frame";

export const metadata: Metadata = {
  title: "Page not found",
};

export default function NotFound() {
  return (
    <main id="content" className="flex-1">
      <Frame className="py-20 sm:py-28">
        <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
          404
        </p>
        <h1 className="mt-4 font-serif text-3xl leading-tight font-normal text-ink sm:text-4xl">
          Page not found
        </h1>
        <p className="mt-4 max-w-[40rem] text-base leading-7 text-ink">
          That address is not on this site.
        </p>
        <p className="mt-8">
          <Link href="/" className="text-navy underline underline-offset-4">
            Return to the index
          </Link>
        </p>
      </Frame>
    </main>
  );
}
