import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowRight, FileText, Lock } from "lucide-react";

import { getExam } from "@/data/exams";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/exams/$examId/")({
  head: ({ params }) => {
    const exam = getExam(params.examId);
    const title = exam
      ? `${exam.title} ${exam.subtitle} — Question Papers`
      : "Question Papers | Exam Practice Hub";
    const description = exam
      ? `Select a question paper for ${exam.title} ${exam.subtitle}. Each paper is randomized and fully explained.`
      : "Select a question paper to begin your randomized practice exam.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
    };
  },
  component: PapersPage,
});

function PapersPage() {
  const { examId } = Route.useParams();
  const exam = getExam(examId);

  if (!exam) throw notFound();

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:py-14">
          <h1 className="text-3xl font-bold sm:text-4xl">
            {exam.title} <span className="text-accent">{exam.subtitle}</span>
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {exam.description}
          </p>
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 py-12">
        <h2 className="text-xl font-bold sm:text-2xl">Question papers</h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {exam.papers.map((paper) => {
            const ready = paper.questions !== null;
            const card = (
              <div
                className={cn(
                  "group relative flex h-full flex-col rounded-2xl border bg-card p-5 shadow-panel transition-all duration-300",
                  ready
                    ? "hover:-translate-y-1 hover:border-primary hover:shadow-lg"
                    : "opacity-70",
                )}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={cn(
                      "grid size-10 place-items-center rounded-xl",
                      ready
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground",
                    )}
                  >
                    {ready ? (
                      <FileText className="size-5" />
                    ) : (
                      <Lock className="size-4" />
                    )}
                  </span>
                  {ready && (
                    <span className="rounded-full bg-success-soft px-2.5 py-1 text-xs font-bold uppercase tracking-wider text-success">
                      Ready
                    </span>
                  )}
                </div>
                <h3 className="mt-4 text-lg font-bold">{paper.label}</h3>
                <p className="mt-1 flex-1 text-sm text-muted-foreground">
                  {paper.description}
                </p>
                <span
                  className={cn(
                    "mt-5 inline-flex items-center gap-2 text-sm font-semibold",
                    ready ? "text-primary" : "text-muted-foreground",
                  )}
                >
                  {ready ? "Start paper" : "Coming soon"}
                  {ready && (
                    <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
                  )}
                </span>
              </div>
            );

            return ready ? (
              <Link
                key={paper.id}
                to="/exams/$examId/$paperId"
                params={{ examId: exam.id, paperId: paper.id }}
              >
                {card}
              </Link>
            ) : (
              <div key={paper.id}>{card}</div>
            );
          })}
        </div>
      </section>
    </main>
  );
}
