export const copyrightYear = 2026;

export const profile = {
  name: "Hoang Dang",
  location: "Boston, MA",
  email: "hnd@mit.edu",
  github: "https://github.com/6namdang",
  githubHandle: "github.com/6namdang",
  linkedin: "https://www.linkedin.com/in/dang004",
  linkedinHandle: "linkedin.com/in/dang004",
  cvPath: "/Hoang-Dang-CV.pdf",
} as const;

export type LinkItem = {
  label: string;
  href: string;
};

export type Entry = {
  period: string;
  place: string;
  heading: string;
  subheading: string;
  detail?: string;
  note?: string;
  paragraphs: readonly string[];
  links?: readonly LinkItem[];
};

export const experience: readonly Entry[] = [
  {
    period: "December 2025 — Present",
    place: "Boston, MA",
    heading: "MIT Computer Science and Artificial Intelligence Laboratory",
    subheading: "Kellis Lab · Research Assistant",
    detail: "Advisor: Manolis Kellis",
    paragraphs: [
      "Leading integration of the Mantis4Hospital vertical, including an ontology-based knowledge graph that maps electronic health record codes and insurance claims. The mapping is credited with a 20% increase in revenue.",
      "Built MantisFlybase, a single-cell RNA-sequencing platform for integrating FlyBase data.",
      "Designed security dashboards and performance frameworks that detect issues across the platform, reducing security cost by 55%.",
    ],
  },
  {
    period: "March 2026 — Present",
    place: "Boston, MA",
    heading: "Spaulding Neuromodulation Center",
    subheading: "Harvard Medical School · Research Scholar",
    detail: "Advisor: Kevin Pacheco-Barrios",
    paragraphs: [
      "Built Valor and Integral, mobile platforms for continuous monitoring and longitudinal research of outcomes in more than 40 concussion and burn-injury patients across three clinical sites.",
      "Ecological momentary assessment tooling on those platforms captured 40 patient-reported data points.",
    ],
  },
  {
    period: "August 2024 — May 2025",
    place: "Remote",
    heading: "Lockheed Martin",
    subheading: "Software Engineer, Contract",
    paragraphs: [
      "Developed a computer vision system in Python and PyTorch that estimates cognitive load from emotion and body language, at 85% accuracy.",
    ],
    links: [
      {
        label: "github.com/6namdang/emotionPose",
        href: "https://github.com/6namdang/emotionPose",
      },
    ],
  },
  {
    period: "January 2025 — May 2025",
    place: "Remote",
    heading: "E3 Company",
    subheading: "Software Engineer, Contract",
    paragraphs: [
      "Designed REST APIs and backend services in JavaScript to ingest, store, and serve monitoring data at low latency.",
      "Built dashboards and alerting in JavaScript and React so operators could watch equipment health and respond to critical events.",
    ],
  },
];

export const projects: readonly Entry[] = [
  {
    period: "2026",
    place: "MIT GrandHack",
    heading: "BurnX",
    subheading: "Burn monitoring with risk detection",
    note: "First place",
    paragraphs: [
      "iOS application in Swift that integrates a computer vision model with Twilio SMS, so nursing staff are notified when a case looks high-risk.",
    ],
    links: [
      {
        label: "github.com/6namdang/burnai",
        href: "https://github.com/6namdang/burnai",
      },
    ],
  },
  {
    period: "2026",
    place: "HackNation AI",
    heading: "FoldForward",
    subheading: "Co-scientist for protein structure prediction",
    note: "First place",
    paragraphs: [
      "An agentic system that generates, runs, and ranks structure-prediction experiments for the α7 nicotinic acetylcholine receptor.",
    ],
    links: [
      {
        label: "github.com/6namdang/foldforward",
        href: "https://github.com/6namdang/foldforward",
      },
    ],
  },
];

export const education: Entry = {
  period: "August 2021 — May 2025",
  place: "Erie, PA",
  heading: "Gannon University",
  subheading: "B.S. Computer Science",
  detail: "GPA 3.96 / 4.00",
  paragraphs: [],
};

export const competencies: readonly { label: string; value: string }[] = [
  {
    label: "Languages",
    value: "C#, HTML/CSS, Java, JavaScript, LaTeX, Python, SQL",
  },
  {
    label: "Software",
    value:
      "Atlassian (Bitbucket, Jira, Confluence), AWS (DynamoDB, EC2, Lambda, RDS, Redshift, S3, SQS), Microsoft (Azure DevOps, Visual Studio), DigitalOcean, Django, Heroku, IntelliJ IDEA, Selenium",
  },
];
