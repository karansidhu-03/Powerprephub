import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowRight,
  BookMarked,
  FileText,
  Layers,
  Lock,
} from "lucide-react";

import { getExam, type Paper } from "@/data/exams";
import { cn } from "@/lib/utils";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  const hasChapters = exam.chapterGroups.length > 0;

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

      <div className="mx-auto w-full max-w-6xl px-4 py-12">
        {hasChapters && (
          <section>
            <div className="flex items-center gap-2.5">
              <BookMarked className="size-5 text-accent" />
              <h2 className="text-xl font-bold sm:text-2xl">
                Chapter-wise Question Papers
              </h2>
            </div>
            <p className="mt-1 text-sm text-muted-foreground">
              Focused practice sets organized by book and chapter topic.
            </p>

            <Accordion
              type="multiple"
              defaultValue={[]}
              className="mt-6 space-y-3"
            >
              {exam.chapterGroups.map((group) => (
                <AccordionItem
                  key={group.id}
                  value={group.id}
                  className="rounded-2xl border bg-card px-5 shadow-panel data-[state=open]:border-primary"
                >
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-3 pr-2">
                      <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-accent/10 text-accent">
                        <Layers className="size-4.5" />
                      </span>
                      <div className="min-w-0 text-left">
                        <p className="truncate text-base font-bold">
                          {group.label}
                        </p>
                        <p className="truncate text-xs text-muted-foreground">
                          {group.description}
                        </p>
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                      {group.papers.map((paper) => (
                        <PaperCard
                          key={paper.id}
                          paper={paper}
                          examId={exam.id}
                          compact
                        />
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
        )}

        <section className={hasChapters ? "mt-14" : ""}>
          <div className="flex items-center gap-2.5">
            <FileText className="size-5 text-accent" />
            <h2 className="text-xl font-bold sm:text-2xl">
              Full 100 Question Papers
            </h2>
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Complete full-length practice exams simulating the real test
            experience.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exam.papers.map((paper) => (
              <PaperCard key={paper.id} paper={paper} examId={exam.id} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function PaperCard({
  paper,
  examId,
  compact,
}: {
  paper: Paper;
  examId: string;
  compact?: boolean;
}) {
  const ready = paper.questions !== null;
  const card = (
    <div
      className={cn(
        "group relative flex h-full flex-col rounded-xl border bg-card shadow-panel transition-all duration-300",
        compact ? "p-4" : "p-5",
        ready
          ? "hover:-translate-y-1 hover:border-primary hover:shadow-lg"
          : "opacity-70",
      )}
    >
      <div className="flex items-center justify-between">
        <span
          className={cn(
            "grid place-items-center rounded-lg",
            compact ? "size-8" : "size-10",
            ready
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground",
          )}
        >
          {ready ? (
            <FileText className={compact ? "size-4" : "size-5"} />
          ) : (
            <Lock className="size-4" />
          )}
        </span>
        {ready && (
          <span className="rounded-full bg-success-soft px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider text-success">
            Ready
          </span>
        )}
      </div>
      <h3 className={cn("mt-3 font-bold", compact ? "text-sm" : "text-lg")}>
        {paper.label}
      </h3>
      <p className="mt-1 flex-1 text-xs text-muted-foreground">
        {paper.description}
      </p>
      <span
        className={cn(
          "mt-4 inline-flex items-center gap-1.5 text-xs font-semibold",
          ready ? "text-primary" : "text-muted-foreground",
        )}
      >
        {ready ? "Start" : "Coming soon"}
        {ready && (
          <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        )}
      </span>
    </div>
  );

  return ready ? (
    <Link to="/exams/$examId/$paperId" params={{ examId, paperId: paper.id }}>
      {card}
    </Link>
  ) : (
    <div>{card}</div>
  );
}
