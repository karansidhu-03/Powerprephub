import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Gauge,
  ShieldCheck,
  Shuffle,
  Timer,
  Lock,
} from "lucide-react";

import { exams } from "@/data/exams";
import { cn } from "@/lib/utils";

const TITLE = "Exam Practice Hub | Power Engineering MCQ Practice";
const DESCRIPTION =
  "Practice Power Engineering Fourth Class exams with randomized question papers, instant feedback, detailed explanations, a timer and scored results.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: LandingPage,
});

function LandingPage() {
  return (
    <main className="min-h-screen bg-background">
      <section className="relative overflow-hidden border-b bg-card">
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 right-[-10%] size-[28rem] rounded-full bg-accent/15 blur-3xl"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute -bottom-40 left-[-10%] size-[26rem] rounded-full bg-primary/15 blur-3xl"
        />
        <div className="relative mx-auto w-full max-w-6xl px-4 py-16 sm:py-24">
          <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            <Gauge className="size-3.5 text-accent" /> Exam practice hub
          </span>
          <h1 className="mt-5 max-w-3xl text-4xl leading-[1.05] font-bold sm:text-6xl">
            Sharpen your certification exam skills, one paper at a time.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            Randomized question papers, instant answer feedback with
            explanations, a live timer and a full scored review — in a clean,
            distraction-free interface.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Feature icon={Shuffle} label="Fresh shuffle every attempt" />
            <Feature icon={Timer} label="Live exam timer" />
            <Feature icon={ShieldCheck} label="Explained answers" />
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-bold sm:text-3xl">Choose your exam</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Select a certification stream to see its available question papers.
        </p>

        <div className="mt-8 grid gap-5 md:grid-cols-2">
          {exams.map((exam) => {
            const card = (
              <div
                className={cn(
                  "group relative flex h-full flex-col overflow-hidden rounded-2xl border bg-card p-6 shadow-panel transition-all duration-300 sm:p-8",
                  exam.available
                    ? "hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                    : "opacity-70",
                )}
              >
                <div
                  aria-hidden
                  className="absolute inset-x-0 top-0 h-1 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                />
                <div className="flex items-center justify-between gap-3">
                  <span className="grid size-11 place-items-center rounded-xl bg-primary text-primary-foreground">
                    <Gauge className="size-5" />
                  </span>
                  <span
                    className={cn(
                      "rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider",
                      exam.available
                        ? "bg-success-soft text-success"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {exam.available ? "Available" : "Coming soon"}
                  </span>
                </div>
                <h3 className="mt-5 text-xl font-bold sm:text-2xl">
                  {exam.title}
                </h3>
                <p className="text-sm font-semibold uppercase tracking-[0.18em] text-accent">
                  {exam.subtitle}
                </p>
                <p className="mt-3 flex-1 text-sm leading-relaxed text-muted-foreground">
                  {exam.description}
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
                  {exam.available ? "View question papers" : "Not yet released"}
                  {exam.available ? (
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  ) : (
                    <Lock className="size-4" />
                  )}
                </span>
              </div>
            );

            return exam.available ? (
              <Link
                key={exam.id}
                to="/exams/$examId"
                params={{ examId: exam.id }}
              >
                {card}
              </Link>
            ) : (
              <div key={exam.id}>{card}</div>
            );
          })}
        </div>

        <Link
          to="/reference"
          className="group mt-6 flex flex-col gap-4 overflow-hidden rounded-2xl border bg-card p-6 shadow-panel transition-all duration-300 hover:-translate-y-1 hover:border-primary hover:shadow-lg sm:flex-row sm:items-center sm:p-8"
        >
          <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-accent text-accent-foreground">
            <BookOpen className="size-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h3 className="text-lg font-bold sm:text-xl">
              Power Engineering Fourth Class Part A — Quick Reference &amp;
              Blueprint
            </h3>
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Exam topic blueprint, common formulas, steam and heat terms,
              boiler fittings, codes and standards, operator safety and
              electrical basics.
            </p>
          </div>
          <span className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-primary">
            Open reference
            <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </span>
        </Link>
      </section>
    </main>
  );
}

function Feature({ icon: Icon, label }: { icon: typeof Timer; label: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3.5 py-2 text-sm text-foreground">
      <Icon className="size-4 text-accent" />
      {label}
    </span>
  );
}
