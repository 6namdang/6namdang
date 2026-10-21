import type { Entry as EntryData } from "@/lib/profile";

export function Entry({
  period,
  place,
  heading,
  subheading,
  detail,
  note,
  paragraphs,
  links,
}: EntryData) {
  return (
    <article className="grid gap-3 border-t border-line py-8 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-x-12 md:gap-y-1">
      <div className="font-mono text-xs leading-5 tracking-wide text-muted md:pt-1">
        <p>{period}</p>
        <p>{place}</p>
      </div>
      <div>
        {note ? (
          <p className="mb-2 font-mono text-xs tracking-[0.14em] text-navy uppercase">
            {note}
          </p>
        ) : null}
        <h3 className="font-serif text-xl leading-snug text-ink sm:text-[1.35rem]">
          {heading}
        </h3>
        <p className="mt-1 text-sm leading-6 text-muted">{subheading}</p>
        {detail ? (
          <p className="mt-1 text-sm leading-6 text-ink">{detail}</p>
        ) : null}
        {paragraphs.length > 0 ? (
          <div className="mt-4 max-w-[40rem] space-y-3 text-base leading-7 text-ink">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}
        {links && links.length > 0 ? (
          <ul className="mt-4 space-y-1">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="text-sm text-navy underline underline-offset-4"
                  rel="noopener noreferrer"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
    </article>
  );
}
