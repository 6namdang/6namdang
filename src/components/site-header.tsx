import Link from "next/link";
import { Frame } from "@/components/frame";
import { SiteNav } from "@/components/site-nav";
import { profile } from "@/lib/profile";

export function SiteHeader() {
  return (
    <header id="top" className="sticky top-0 z-20 bg-white">
      <div className="h-1 bg-navy" />
      <div className="border-b border-line">
        <Frame className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between sm:py-4">
          <Link href="/" className="font-serif text-lg tracking-tight text-ink">
            {profile.name}
          </Link>
          <SiteNav />
        </Frame>
      </div>
    </header>
  );
}
