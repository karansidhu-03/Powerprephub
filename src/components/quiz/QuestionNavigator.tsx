import { CircleCheck as CheckCircle2, Circle as XCircle, Circle, Flag } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigatorProps {
  total: number;
  current: number;
  answers: (number | null)[];
  flagged: boolean[];
  correctAnswers: number[];
  onJump: (index: number) => void;
}

export function QuestionNavigator({
  total,
  current,
  answers,
  flagged,
  correctAnswers,
  onJump,
}: NavigatorProps) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-panel">
      <div className="mb-3 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Question Navigator
        </h2>
        <span className="shrink-0 text-xs text-muted-foreground">
          {answers.filter((a) => a !== null).length}/{total}
        </span>
      </div>
      <div className="grid grid-cols-8 gap-1.5 sm:grid-cols-10">
        {Array.from({ length: total }, (_, i) => {
          const answer = answers[i];
          const answered = answer !== null && answer !== undefined;
          const correct = answered && answer === correctAnswers[i];
          const isFlagged = flagged[i];
          return (
            <button
              key={i}
              type="button"
              onClick={() => onJump(i)}
              aria-label={`Go to question ${i + 1}${isFlagged ? " (flagged)" : ""}`}
              aria-current={i === current}
              className={cn(
                "relative flex h-8 items-center justify-center rounded border text-xs font-semibold transition-colors",
                !answered &&
                  "border-border bg-background text-muted-foreground hover:bg-secondary",
                answered &&
                  correct &&
                  "border-success bg-success text-success-foreground",
                answered &&
                  !correct &&
                  "border-destructive bg-destructive text-destructive-foreground",
                i === current &&
                  "ring-2 ring-accent ring-offset-1 ring-offset-background",
              )}
            >
              {i + 1}
              {isFlagged && (
                <Flag className="absolute -top-1 -right-1 size-2.5 fill-warning text-warning" />
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <CheckCircle2 className="size-3.5 text-success" /> Correct
        </span>
        <span className="flex items-center gap-1">
          <XCircle className="size-3.5 text-destructive" /> Incorrect
        </span>
        <span className="flex items-center gap-1">
          <Circle className="size-3.5" /> Unanswered
        </span>
        <span className="flex items-center gap-1">
          <Flag className="size-3 fill-warning text-warning" /> Flagged
        </span>
      </div>
    </div>
  );
}
