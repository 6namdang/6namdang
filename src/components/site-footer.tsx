import { Frame } from "@/components/frame";
import { copyrightYear, profile } from "@/lib/profile";

export function SiteFooter() {
  return (
    <footer className="border-t border-line">
      <Frame className="flex flex-col gap-2 py-6 text-sm text-muted sm:flex-row sm:items-baseline sm:justify-between">
        <p>
          © {copyrightYear} {profile.name}
        </p>
        <p>
          <a
            href={`mailto:${profile.email}`}
            className="text-navy underline underline-offset-4"
          >
            {profile.email}
          </a>
          <span aria-hidden="true"> · </span>
          {profile.location}
        </p>
      </Frame>
    </footer>
  );
}
