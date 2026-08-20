import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  BookOpen,
  Calculator,
  Flame,
  Gauge,
  HardHat,
  ScrollText,
  Thermometer,
  Zap,
} from "lucide-react";

const TITLE = "Power Engineering 4A Quick Reference & Exam Blueprint";
const DESCRIPTION =
  "Formulas, steam and heat terms, boiler fittings, codes, safety and electrical basics plus the SOPEEC Part A topic blueprint for Power Engineering Fourth Class.";

export const Route = createFileRoute("/reference")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: ReferencePage,
});

const blueprint: { topic: string; count: number; note?: string }[] = [
  { topic: "Boilers (types, construction, parts)", count: 15 },
  { topic: "Boiler systems (feedwater, steam, blowdown, fittings & mountings)", count: 15 },
  { topic: "Chemistry & thermodynamics (heat, steam properties)", count: 10 },
  { topic: "Power & heating plant safety", count: 10 },
  { topic: "Instrumentation & controls", count: 10 },
  { topic: "Elementary mechanics & dynamics", count: 10 },
  { topic: "Materials & welding", count: 7 },
  { topic: "Piping & valves", count: 7 },
  {
    topic: "Electricity, Environment, Codes & standards (Act/Regs, ASME, CSA B51), Plant communication",
    count: 16,
    note: "Electricity 7 · Environment 6 · Codes & standards 4 · Plant communication 2",
  },
];

const formulas = [
  "Heat added or removed: Q = m c ΔT (mass × specific heat × temperature change)",
  "Electrical power: P = VI. Ohm's law: V = IR. Power dissipated in a resistor: P = I²R.",
  "Stress = force ÷ area. Pressure = force ÷ area.",
  "Work = force × distance. Power = work ÷ time.",
  "Hydrostatic pressure: p = ρ g h (density × gravity × height)",
];

const steamTerms: [string, string][] = [
  ["Sensible heat", "heat that changes temperature with no change of state."],
  ["Latent heat", "heat that changes state (e.g. evaporation) at constant temperature."],
  ["Saturated steam", "steam at the boiling temperature for its pressure."],
  ["Superheated steam", "steam heated above saturation at a given pressure."],
  ["Dryness fraction", "mass of dry steam per unit mass of wet steam."],
  ["Enthalpy", "total heat content per unit mass."],
  ["Critical point", "the pressure and temperature above which water and steam are indistinguishable."],
];

const fittings: [string, string][] = [
  ["Gauge glass", "continuous visible indication of boiler water level."],
  ["Try-cocks and water column", "independent check of level and mounting for level controls."],
  ["Safety valve", "relieves overpressure; set per code and boiler classification."],
  ["Low-water fuel cutoff", "stops firing when water falls below a safe level."],
  ["Fusible plug", "melts to warn of low water in certain firetube boilers."],
  ["Steam trap", "discharges condensate while holding back steam."],
  ["Feedwater check valve", "prevents backflow from the boiler into the feed line."],
  ["Bottom blowoff and surface blowoff", "remove sludge and control dissolved solids."],
];

const codes: [string, string][] = [
  [
    "ASME BPVC",
    "Section I — power boilers; Section IV — heating boilers; Section VIII — pressure vessels; Section IX — welding qualification.",
  ],
  ["CSA B51", "boiler, pressure-vessel, and pressure-piping code (Canada)."],
  ["CRN (Canadian Registration Number)", "registration of a pressure design for use in a jurisdiction."],
  [
    "Provincial or territorial legislation",
    "sets registration, inspection, and operating-engineer requirements.",
  ],
];

const safety = [
  "Lockout/tagout and positive isolation before entry or servicing.",
  "Confined-space entry procedures for drums, headers, and furnaces.",
  "Furnace pre-purge and proven combustion air before light-off.",
  "Low-water response — secure firing first; do not add water blindly to a low-water boiler.",
  "Correct PPE and a controlled procedure for hot blowdown.",
];

const electrical = [
  "AC supply frequency in North America is 60 Hz.",
  "A motor converts electrical energy to mechanical energy; a generator does the reverse.",
  "A transformer changes AC voltage but does not change frequency.",
  "Fuses and breakers provide overcurrent protection.",
  "Series circuit — same current throughout; parallel circuit — same voltage across each branch.",
];

function Section({
  icon: Icon,
  step,
  title,
  children,
}: {
  icon: typeof Gauge;
  step: number;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border bg-card p-5 shadow-panel sm:p-7">
      <div className="flex items-center gap-3">
        <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary text-primary-foreground">
          <Icon className="size-5" />
        </span>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-accent">
            Section {step}
          </p>
          <h2 className="text-lg font-bold sm:text-xl">{title}</h2>
        </div>
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function DefList({ items }: { items: [string, string][] }) {
  return (
    <dl className="grid gap-3 sm:grid-cols-2">
      {items.map(([term, def]) => (
        <div key={term} className="rounded-xl border bg-background p-4">
          <dt className="text-sm font-bold">{term}</dt>
          <dd className="mt-1 text-sm leading-relaxed text-muted-foreground">{def}</dd>
        </div>
      ))}
    </dl>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-relaxed text-foreground">
          <span aria-hidden className="mt-2 size-1.5 shrink-0 rounded-full bg-accent" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function ReferencePage() {
  return (
    <main className="min-h-screen bg-background">
      <header className="relative overflow-hidden border-b bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-8%] size-[24rem] rounded-full bg-accent/15 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-4xl px-4 py-10 sm:py-14">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" /> All exams
          </Link>
          <h1 className="mt-4 text-3xl font-bold sm:text-4xl">
            Power Engineering 4A — <span className="text-accent">Quick Reference &amp; Blueprint</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            A compact refresher of the formulas, terms, exam blueprints, and references used across
            the Part A papers.
          </p>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-4xl gap-5 px-4 py-10 sm:py-14">
        <Section icon={Gauge} step={1} title="Part A Exam Blueprint (Topic Coverage)">
          <p className="text-sm text-muted-foreground">
            The 100 questions in each paper are distributed across these topics according to the
            SOPEEC 4A standard.
          </p>
          <ul className="mt-4 divide-y rounded-xl border bg-background">
            {blueprint.map((row) => (
              <li key={row.topic} className="flex items-start gap-4 px-4 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{row.topic}</p>
                  {row.note && (
                    <p className="mt-0.5 text-xs text-muted-foreground">{row.note}</p>
                  )}
                </div>
                <span className="shrink-0 rounded-full bg-secondary px-2.5 py-1 text-xs font-bold tabular-nums text-secondary-foreground">
                  {row.count}
                </span>
              </li>
            ))}
            <li className="flex items-center justify-between gap-4 bg-success-soft px-4 py-3">
              <p className="text-sm font-bold text-success">
                Total — pass mark 65% · allowed time 3 hours
              </p>
              <span className="shrink-0 rounded-full bg-success px-2.5 py-1 text-xs font-bold tabular-nums text-primary-foreground">
                100
              </span>
            </li>
          </ul>
        </Section>

        <Section icon={Calculator} step={2} title="Common Formulas">
          <Bullets items={formulas} />
        </Section>

        <Section icon={Thermometer} step={3} title="Steam & Heat Terms">
          <DefList items={steamTerms} />
        </Section>

        <Section icon={Flame} step={4} title="Boiler Fittings & Safety Devices">
          <DefList items={fittings} />
        </Section>

        <Section icon={ScrollText} step={5} title="Codes & Standards">
          <DefList items={codes} />
        </Section>

        <Section icon={HardHat} step={6} title="Operator Safety">
          <Bullets items={safety} />
        </Section>

        <Section icon={Zap} step={7} title="Electrical Basics">
          <Bullets items={electrical} />
        </Section>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/exams/$examId"
            params={{ examId: "power-eng-4th-part-a" }}
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            <BookOpen className="size-4" /> Go to Part A question papers
          </Link>
        </div>
      </div>
    </main>
  );
}
