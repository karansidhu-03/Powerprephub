import { CheckCircle2, XCircle, Lightbulb } from "lucide-react";
import type { Question } from "@/data/exams";
import { cn } from "@/lib/utils";

const LETTERS = ["A", "B", "C", "D", "E", "F"] as const;

interface QuestionCardProps {
  question: Question;
  index: number;
  total: number;
  selected: number | null;
  onSelect: (optionIndex: number) => void;
}

export function QuestionCard({ question, index, total, selected, onSelect }: QuestionCardProps) {
  const locked = selected !== null;

  return (
    <article
      key={question.id}
      className="animate-in fade-in slide-in-from-bottom-2 rounded-2xl border bg-card p-5 shadow-panel duration-300 sm:p-8"
    >
      <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-accent">
            {question.topic ?? `Question ${index + 1}`}
          </p>
          <h1 className="mt-2 text-xl leading-snug font-semibold text-card-foreground sm:text-2xl">
            {question.question}
          </h1>
        </div>
        <span className="shrink-0 rounded-full border bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground tabular-nums">
          {index + 1}/{total}
        </span>
      </div>

      <div className="mt-6 flex flex-col gap-2.5">
        {question.options.map((option, i) => {
          const isCorrect = i === question.correctAnswer;
          const isChosen = selected === i;
          const reveal = locked && (isCorrect || isChosen);

          return (
            <button
              key={i}
              type="button"
              disabled={locked}
              onClick={() => onSelect(i)}
              className={cn(
                "flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all duration-200 sm:p-4",
                !locked &&
                  "cursor-pointer border-border bg-background hover:-translate-y-0.5 hover:border-primary hover:bg-secondary hover:shadow-panel",
                locked && !reveal && "border-border bg-background opacity-50",
                reveal && isCorrect && "border-success bg-success text-success-foreground shadow-panel",
                reveal &&
                  !isCorrect &&
                  "border-destructive bg-destructive text-destructive-foreground shadow-panel",
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg border text-sm font-bold",
                  reveal ? "border-current" : "border-border bg-secondary text-secondary-foreground",
                )}
              >
                {LETTERS[i]}
              </span>
              <span className="min-w-0 flex-1 text-sm leading-relaxed sm:text-base">{option}</span>
              {reveal && isCorrect && <CheckCircle2 className="mt-0.5 size-5 shrink-0" />}
              {reveal && !isCorrect && <XCircle className="mt-0.5 size-5 shrink-0" />}
            </button>
          );
        })}
      </div>

      {locked && (
        <div
          className={cn(
            "animate-in fade-in slide-in-from-top-1 mt-5 rounded-xl border-l-4 p-4 duration-300",
            selected === question.correctAnswer
              ? "border-l-success bg-success-soft"
              : "border-l-destructive bg-danger-soft",
          )}
        >
          <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
            <Lightbulb className="size-4 shrink-0 text-accent" />
            {selected === question.correctAnswer ? "Correct" : "Incorrect"} — the answer is{" "}
            {LETTERS[question.correctAnswer]}. {question.options[question.correctAnswer]}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {question.explanation}
          </p>
        </div>
      )}
    </article>
  );
}
