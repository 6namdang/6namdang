import { Entry } from "@/components/entry";
import { Frame } from "@/components/frame";
import {
  competencies,
  education,
  experience,
  profile,
  projects,
} from "@/lib/profile";

const facts = [
  { label: "Location", value: profile.location },
  {
    label: "Education",
    value: "B.S. Computer Science, Gannon University",
  },
  { label: "Correspondence", value: profile.email, href: `mailto:${profile.email}` },
] as const;

const contacts = [
  {
    label: "Email",
    href: `mailto:${profile.email}`,
    value: profile.email,
  },
  {
    label: "GitHub",
    href: profile.github,
    value: profile.githubHandle,
  },
  {
    label: "LinkedIn",
    href: profile.linkedin,
    value: profile.linkedinHandle,
  },
  {
    label: "Curriculum vitae",
    href: profile.cvPath,
    value: "Hoang Dang, PDF",
  },
] as const;

function SectionHeading({ id, children }: { id: string; children: string }) {
  return (
    <h2
      id={id}
      className="border-b border-ink pb-3 font-mono text-xs tracking-[0.16em] text-ink uppercase"
    >
      {children}
    </h2>
  );
}

export default function Home() {
  return (
    <main id="content" className="flex-1">
      <Frame className="pt-12 pb-4 sm:pt-16">
        <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">
          MIT CSAIL · Harvard Medical School
        </p>
        <h1 className="mt-4 max-w-[12em] font-serif text-[2rem] leading-[1.15] font-normal tracking-tight text-balance text-ink sm:text-[2.5rem] md:text-[2.75rem]">
          Research software for clinical and laboratory systems.
        </h1>
        <div className="mt-6 max-w-[40rem] space-y-4 text-base leading-7 text-ink">
          <p>
            I am a research assistant in the Kellis Lab at MIT CSAIL and a
            research scholar at the Spaulding Neuromodulation Center, Harvard
            Medical School. I build systems for hospital data, single-cell
            sequencing, and longitudinal clinical studies.
          </p>
          <p>
            Earlier contract work covered computer vision for cognitive-load
            estimation at Lockheed Martin, and monitoring APIs and operator
            dashboards at E3.
          </p>
        </div>
        <dl className="mt-10 grid divide-y divide-line border-y border-line md:grid-cols-3 md:divide-x md:divide-y-0">
          {facts.map((fact) => (
            <div key={fact.label} className="py-4 md:px-6 md:py-5 md:first:pl-0 md:last:pr-0">
              <dt className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                {fact.label}
              </dt>
              <dd className="mt-1.5 text-sm leading-6 text-ink">
                {"href" in fact ? (
                  <a
                    href={fact.href}
                    className="text-navy underline underline-offset-4"
                  >
                    {fact.value}
                  </a>
                ) : (
                  fact.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Frame>

      <Frame className="pt-14 pb-4 sm:pt-20">
        <section id="experience" aria-labelledby="experience-heading">
          <SectionHeading id="experience-heading">Experience</SectionHeading>
          {experience.map((role) => (
            <Entry key={role.heading} {...role} />
          ))}
        </section>
      </Frame>

      <Frame className="pt-14 pb-4 sm:pt-20">
        <section id="projects" aria-labelledby="projects-heading">
          <SectionHeading id="projects-heading">Projects</SectionHeading>
          {projects.map((project) => (
            <Entry key={project.heading} {...project} />
          ))}
        </section>
      </Frame>

      <Frame className="pt-14 pb-4 sm:pt-20">
        <section id="background" aria-labelledby="background-heading">
          <SectionHeading id="background-heading">Background</SectionHeading>
          <Entry {...education} />
          <dl className="border-t border-line">
            {competencies.map((item) => (
              <div
                key={item.label}
                className="grid gap-2 border-b border-line py-5 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12"
              >
                <dt className="font-mono text-xs tracking-[0.14em] text-muted uppercase md:pt-1">
                  {item.label}
                </dt>
                <dd className="max-w-[40rem] text-base leading-7 text-ink">
                  {item.value}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </Frame>

      <Frame className="pt-14 pb-16 sm:pt-20 sm:pb-24">
        <section id="contact" aria-labelledby="contact-heading">
          <SectionHeading id="contact-heading">Contact</SectionHeading>
          <ul className="border-b border-line">
            {contacts.map((item) => (
              <li
                key={item.label}
                className="grid gap-1 border-t border-line py-4 sm:grid-cols-[11rem_minmax(0,1fr)] sm:gap-12 sm:py-5"
              >
                <span className="font-mono text-xs tracking-[0.14em] text-muted uppercase sm:pt-1">
                  {item.label}
                </span>
                <a
                  href={item.href}
                  className="text-navy underline underline-offset-4"
                  {...(item.href.startsWith("http")
                    ? { rel: "noopener noreferrer" }
                    : {})}
                >
                  {item.value}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </Frame>
    </main>
  );
}
