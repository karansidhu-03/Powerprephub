import { Award, CheckCircle2, RotateCcw, XCircle, MinusCircle, Clock } from "lucide-react";
import { Link } from "@tanstack/react-router";
import type { Question } from "@/data/exams";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;
const PASS_MARK = 65;

interface ResultsScreenProps {
  title: string;
  questions: Question[];
  answers: (number | null)[];
  elapsed: string;
  examId: string;
  onRestart: () => void;
  onReview: (index: number) => void;
}

export function ResultsScreen({
  title,
  questions,
  answers,
  elapsed,
  examId,
  onRestart,
  onReview,
}: ResultsScreenProps) {
  const correct = answers.filter((a, i) => a === questions[i]?.correctAnswer).length;
  const incorrect = answers.filter((a, i) => a !== null && a !== questions[i]?.correctAnswer).length;
  const skipped = answers.filter((a) => a === null).length;
  const score = Math.round((correct / questions.length) * 100);
  const passed = score >= PASS_MARK;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10">
      <section className="animate-in fade-in zoom-in-95 overflow-hidden rounded-3xl border bg-card p-6 text-center shadow-panel duration-500 sm:p-10">
        <Award className={cn("mx-auto size-12", passed ? "text-success" : "text-destructive")} />
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
          {passed ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
          {passed ? "Pass" : "Fail"}
        </span>

        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <Stat icon={CheckCircle2} label="Correct" value={correct} tone="success" />
          <Stat icon={XCircle} label="Incorrect" value={incorrect} tone="destructive" />
          <Stat icon={MinusCircle} label="Skipped" value={skipped} tone="muted" />
          <Stat icon={Clock} label="Questions" value={questions.length} tone="muted" />
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button onClick={onRestart} size="lg">
            <RotateCcw /> Retake with a new shuffle
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link to="/exams/$examId" params={{ examId }}>Choose another paper</Link>
          </Button>
        </div>
      </section>

      <h2 className="mt-10 mb-3 text-lg font-semibold uppercase tracking-wide">Review breakdown</h2>
      <ul className="flex flex-col gap-2">
        {questions.map((q, i) => {
          const answer = answers[i] ?? null;
          const isCorrect = answer === q.correctAnswer;
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
                  <span className="block text-sm font-medium">{q.question}</span>
                  <span className="mt-1 block text-xs text-muted-foreground">
                    {answer === null ? "Not answered · " : `Your answer: ${LETTERS[answer]} · `}
                    Correct: {LETTERS[q.correctAnswer]} — {q.options[q.correctAnswer]}
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
      <p className="text-xs uppercase tracking-wide text-muted-foreground">{label}</p>
    </div>
  );
}
