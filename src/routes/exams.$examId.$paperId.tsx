import { useCallback, useEffect, useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  Flag,
} from "lucide-react";
import { toast } from "sonner";

import { getPaper, shuffleExam, type Question } from "@/data/exams";
import { QuestionCard } from "@/components/quiz/QuestionCard";
import { QuestionNavigator } from "@/components/quiz/QuestionNavigator";
import { ResultsScreen } from "@/components/quiz/ResultsScreen";
import { useElapsedTimer } from "@/hooks/use-elapsed-timer";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/exams/$examId/$paperId")({
  head: ({ params }) => {
    const { exam, paper } = getPaper(params.examId, params.paperId);
    const title =
      exam && paper
        ? `${paper.label} — ${exam.title} ${exam.subtitle} Practice Exam`
        : "Practice Exam";
    const description =
      "Randomized practice exam with instant answer feedback, explanations, a live timer and a scored review.";
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
  component: QuizPage,
});

function QuizPage() {
  const { examId, paperId } = Route.useParams();
  const { exam, paper } = getPaper(examId, paperId);

  if (!exam || !paper || !paper.questions) throw notFound();

  return (
    <Quiz
      key={`${examId}/${paperId}`}
      source={paper.questions}
      title={`${exam.title} ${exam.subtitle} · ${paper.label}`}
      examId={examId}
    />
  );
}

const LETTER_KEYS = ["1", "2", "3", "4", "5", "6"] as const;

function Quiz({
  source,
  title,
  examId,
}: {
  source: Question[];
  title: string;
  examId: string;
}) {
  const [seed, setSeed] = useState(0);
  const [questions, setQuestions] = useState<Question[]>(source);
  useEffect(() => {
    setQuestions(shuffleExam(source));
  }, [source, seed]);

  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(source.length).fill(null),
  );
  const [flagged, setFlagged] = useState<boolean[]>(() =>
    Array(source.length).fill(false),
  );
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);

  const { seconds, formatted, reset } = useElapsedTimer(!finished);

  const question = questions[current]!;
  const answered = answers.filter((a) => a !== null).length;
  const progress = Math.round((answered / questions.length) * 100);
  const flaggedCount = flagged.filter(Boolean).length;

  const select = useCallback(
    (optionIndex: number) => {
      setAnswers((prev) => {
        const next = [...prev];
        next[current] = optionIndex;
        return next;
      });
    },
    [current],
  );

  const toggleFlag = useCallback(() => {
    setFlagged((prev) => {
      const next = [...prev];
      next[current] = !next[current];
      return next;
    });
  }, [current]);

  const goNext = useCallback(() => {
    setCurrent((i) => Math.min(questions.length - 1, i + 1));
  }, [questions.length]);

  const goPrev = useCallback(() => {
    setCurrent((i) => Math.max(0, i - 1));
  }, []);

  const restart = () => {
    setSeed((s) => s + 1);
    setAnswers(Array(source.length).fill(null));
    setFlagged(Array(source.length).fill(false));
    setCurrent(0);
    setFinished(false);
    reset();
    toast.success("New exam started with a fresh shuffle");
  };

  const submit = () => {
    const unanswered = answers.filter((a) => a === null).length;
    if (unanswered > 0) {
      const proceed = window.confirm(
        `You have ${unanswered} unanswered question${unanswered > 1 ? "s" : ""}. Submit anyway?`,
      );
      if (!proceed) return;
    }
    setFinished(true);
    toast.success("Exam submitted — see your results below");
  };

  // Keyboard shortcuts
  useEffect(() => {
    if (finished) return;
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      const key = e.key.toLowerCase();
      const letterIdx = LETTER_KEYS.indexOf(
        key as (typeof LETTER_KEYS)[number],
      );

      if (letterIdx >= 0 && letterIdx < question.options.length) {
        e.preventDefault();
        select(letterIdx);
      } else if (key === "arrowright" || key === "d") {
        e.preventDefault();
        goNext();
      } else if (key === "arrowleft" || key === "a") {
        e.preventDefault();
        goPrev();
      } else if (key === "f") {
        e.preventDefault();
        toggleFlag();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [finished, question, select, goNext, goPrev, toggleFlag]);

  if (finished) {
    return (
      <main className="min-h-screen bg-background">
        <ResultsScreen
          title={title}
          questions={questions}
          answers={answers}
          flagged={flagged}
          elapsed={formatted}
          examId={examId}
          onRestart={restart}
          onReview={(i) => {
            setCurrent(i);
            setFinished(false);
          }}
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background pb-16">
      <header className="sticky top-14 z-10 border-b bg-card/90 backdrop-blur">
        <div className="mx-auto grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
          <div className="min-w-0">
            <Link
              to="/exams/$examId"
              params={{ examId }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" /> Papers
            </Link>
            <h1 className="truncate text-base font-bold sm:text-xl">{title}</h1>
            <p className="truncate text-xs text-muted-foreground">
              Question {current + 1} of {questions.length} · {answered} answered
              {flaggedCount > 0 && ` · ${flaggedCount} flagged`}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <span className="flex items-center gap-1.5 rounded-lg border bg-secondary px-2.5 py-1.5 font-mono text-sm text-secondary-foreground tabular-nums">
              <Clock className="size-4" />
              {formatted}
            </span>
            <Button size="sm" onClick={submit}>
              <Flag /> <span className="hidden sm:inline">Submit exam</span>
            </Button>
          </div>
        </div>
        <div className="h-1.5 w-full bg-secondary">
          <div
            className="h-full rounded-r-full bg-accent transition-[width] duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <QuestionCard
            question={question}
            index={current}
            total={questions.length}
            selected={answers[current] ?? null}
            flagged={flagged[current] ?? false}
            onSelect={select}
            onToggleFlag={toggleFlag}
          />

          <nav className="mt-5 flex items-center justify-between gap-3">
            <Button variant="outline" onClick={goPrev} disabled={current === 0}>
              <ChevronLeft /> Previous
            </Button>
            <span className="hidden text-xs text-muted-foreground sm:block">
              <kbd className="rounded border bg-secondary px-1.5 py-0.5 font-mono">
                1-4
              </kbd>{" "}
              answer ·{" "}
              <kbd className="rounded border bg-secondary px-1.5 py-0.5 font-mono">
                F
              </kbd>{" "}
              flag ·{" "}
              <kbd className="rounded border bg-secondary px-1.5 py-0.5 font-mono">
                ← →
              </kbd>{" "}
              navigate
            </span>
            {current === questions.length - 1 ? (
              <Button onClick={submit}>
                <Flag /> Finish &amp; score
              </Button>
            ) : (
              <Button onClick={goNext}>
                Next <ChevronRight />
              </Button>
            )}
          </nav>
        </div>

        <aside className="lg:sticky lg:top-28 lg:self-start">
          <QuestionNavigator
            total={questions.length}
            current={current}
            answers={answers}
            flagged={flagged}
            correctAnswers={questions.map((q) => q.correctAnswer)}
            onJump={setCurrent}
          />
        </aside>
      </div>
    </main>
  );
}
