import { useState } from "react";
import { Award, CircleCheck as CheckCircle2, RotateCcw, Circle as XCircle, CircleMinus as MinusCircle, Clock, Flag, ListFilter as Filter } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Question } from "@/data/exams";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;
const PASS_MARK = 65;

type FilterMode = "all" | "incorrect" | "unanswered" | "flagged";

interface ResultsScreenProps {
  title: string;
  questions: Question[];
  answers: (number | null)[];
  flagged: boolean[];
  elapsed: string;
  examId: string;
  onRestart: () => void;
  onReview: (index: number) => void;
}

export function ResultsScreen({
  title,
  questions,
  answers,
  flagged,
  elapsed,
  examId,
  onRestart,
  onReview,
}: ResultsScreenProps) {
  const [filter, setFilter] = useState<FilterMode>("all");

  const correct = answers.filter(
    (a, i) => a === questions[i]?.correctAnswer,
  ).length;
  const incorrect = answers.filter(
    (a, i) => a !== null && a !== questions[i]?.correctAnswer,
  ).length;
  const skipped = answers.filter((a) => a === null).length;
  const flaggedCount = flagged.filter(Boolean).length;
  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= PASS_MARK;

  const filteredIndices = questions
    .map((_, i) => i)
    .filter((i) => {
      const answer = answers[i];
      switch (filter) {
        case "incorrect":
          return answer !== null && answer !== questions[i]?.correctAnswer;
        case "unanswered":
          return answer === null;
        case "flagged":
          return flagged[i];
        default:
          return true;
      }
    });

  const FILTERS: { mode: FilterMode; label: string; count: number }[] = [
    { mode: "all", label: "All", count: questions.length },
    { mode: "incorrect", label: "Incorrect", count: incorrect },
    { mode: "unanswered", label: "Unanswered", count: skipped },
    { mode: "flagged", label: "Flagged", count: flaggedCount },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <section className="animate-in fade-in zoom-in-95 overflow-hidden rounded-3xl border bg-card p-6 text-center shadow-panel duration-500 sm:p-10">
        <Award
          className={cn(
            "mx-auto size-12",
            passed ? "text-success" : "text-destructive",
          )}
        />
        <p className="mt-3 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {title}
        </p>
        <h1 className="mt-1 text-3xl font-bold sm:text-4xl">Exam Complete</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pass mark is {PASS_MARK}% · Time taken {elapsed}
        </p>

        <p
          className={cn(
            "mt-6 text-6xl font-bold tabular-nums sm:text-7xl",
            passed ? "text-success" : "text-destructive",
          )}
        >
          {score}%
        </p>
        <span
          className={cn(
            "mt-3 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-bold uppercase tracking-wider",
            passed
              ? "bg-success text-success-foreground"
              : "bg-destructive text-destructive-foreground",
          )}
        >
          {passed ? (
            <CheckCircle2 className="size-4" />
          ) : (
            <XCircle className="size-4" />
          )}
          {passed ? "Pass" : "Fail"}
        </span>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat
            icon={CheckCircle2}
            label="Correct"
            value={correct}
            tone="success"
          />
          <Stat
            icon={XCircle}
            label="Incorrect"
            value={incorrect}
            tone="destructive"
          />
          <Stat
            icon={MinusCircle}
            label="Skipped"
            value={skipped}
            tone="muted"
          />
          <Stat
            icon={Clock}
            label="Questions"
            value={questions.length}
            tone="muted"
          />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={onRestart} size="lg">
            <RotateCcw /> Retake with a new shuffle
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/exams/$examId" params={{ examId }}>
              Choose another paper
            </Link>
          </Button>
        </div>
      </section>

      <div className="mt-10 mb-3 flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-semibold uppercase tracking-wide">
          Review breakdown
        </h2>
        <div className="flex items-center gap-1.5 rounded-lg border bg-card p-1">
          <Filter className="ml-2 size-4 text-muted-foreground" />
          {FILTERS.map(({ mode, label, count }) => (
            <button
              key={mode}
              type="button"
              onClick={() => setFilter(mode)}
              className={cn(
                "rounded-md px-2.5 py-1 text-xs font-semibold transition-colors",
                filter === mode
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              {label} ({count})
            </button>
          ))}
        </div>
      </div>

      {filteredIndices.length === 0 ? (
        <p className="py-8 text-center text-sm text-muted-foreground">
          No questions match this filter.
        </p>
      ) : (
        <ul className="flex flex-col gap-2">
          {filteredIndices.map((i) => {
            const q = questions[i]!;
            const answer = answers[i] ?? null;
            const isCorrect = answer === q.correctAnswer;
            const isFlagged = flagged[i];
            return (
              <li key={q.id}>
                <button
                  type="button"
                  onClick={() => onReview(i)}
                  className="flex w-full items-start gap-3 rounded-xl border bg-card p-3.5 text-left transition-colors hover:bg-secondary"
                >
                  <span
                    className={cn(
                      "flex size-7 shrink-0 items-center justify-center rounded-lg text-xs font-bold",
                      answer === null
                        ? "bg-secondary text-secondary-foreground"
                        : isCorrect
                          ? "bg-success text-success-foreground"
                          : "bg-destructive text-destructive-foreground",
                    )}
                  >
                    {i + 1}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="block text-sm font-medium">
                        {q.question}
                      </span>
                      {isFlagged && (
                        <Flag className="size-3.5 shrink-0 fill-warning text-warning" />
                      )}
                    </span>
                    <span className="mt-1 block text-xs text-muted-foreground">
                      {answer === null
                        ? "Not answered · "
                        : `Your answer: ${LETTERS[answer]} · `}
                      Correct: {LETTERS[q.correctAnswer]} —{" "}
                      {q.options[q.correctAnswer]}
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-muted-foreground/80">
                      {q.explanation}
                    </span>
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof CheckCircle2;
  label: string;
  value: number;
  tone: "success" | "destructive" | "muted";
}) {
  return (
    <div className="rounded-xl border bg-background p-3">
      <Icon
        className={cn(
          "mx-auto size-5",
          tone === "success" && "text-success",
          tone === "destructive" && "text-destructive",
          tone === "muted" && "text-muted-foreground",
        )}
      />
      <p className="mt-1.5 text-2xl font-bold tabular-nums">{value}</p>
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
    </div>
  );
}
