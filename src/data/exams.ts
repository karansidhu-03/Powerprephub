import paper1 from "./papers/partapaper1.json";
import paper2 from "./papers/partapaper2.json";
import paper3 from "./papers/partapaper3.json";

export interface Question {
  id: number;
  topic?: string;
  question: string;
  options: string[];
  /** Index into options: 0 = A, 1 = B, ... */
  correctAnswer: number;
  explanation: string;
}

export interface Paper {
  id: string;
  label: string;
  description: string;
  questions: Question[] | null;
}

export interface Exam {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  available: boolean;
  papers: Paper[];
}

const placeholderPapers = (from: number, to: number): Paper[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({
    id: `paper${from + i}`,
    label: `Paper ${from + i}`,
    description: "Questions are being prepared",
    questions: null,
  }));

export const exams: Exam[] = [
  {
    id: "power-eng-4th-part-a",
    title: "Power Engineering Fourth Class",
    subtitle: "Part A",
    description:
      "Boilers, plant safety, codes, instrumentation, materials and applied mathematics for the Fourth Class Part A examination.",
    available: true,
    papers: [
      {
        id: "paper1",
        label: "Paper 1",
        description: "100 questions · randomized order",
        questions: paper1 as Question[],
      },
      {
        id: "paper2",
        label: "Paper 2",
        description: "100 questions · randomized order",
        questions: paper2 as Question[],
      },
      {
        id: "paper3",
        label: "Paper 3",
        description: "100 questions · randomized order",
        questions: paper3 as Question[],
      },
      ...placeholderPapers(4, 9),
    ],
  },
  {
    id: "power-eng-4th-part-b",
    title: "Power Engineering Fourth Class",
    subtitle: "Part B",
    description:
      "Prime movers, pumps, refrigeration, electrical systems and plant maintenance. Question papers are being prepared.",
    available: false,
    papers: placeholderPapers(1, 9),
  },
];

export const getExam = (examId: string) => exams.find((e) => e.id === examId);

export const getPaper = (examId: string, paperId: string) => {
  const exam = getExam(examId);
  return { exam, paper: exam?.papers.find((p) => p.id === paperId) };
};

/** Fisher-Yates shuffle — returns a new array. */
export function shuffle<T>(input: readonly T[]): T[] {
  const arr = [...input];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

/** Shuffle a question's options and remap correctAnswer to the new position. */
export function shuffleOptions(q: Question): Question {
  const order = shuffle(q.options.map((_, i) => i));
  return {
    ...q,
    options: order.map((i) => q.options[i]!),
    correctAnswer: order.indexOf(q.correctAnswer),
  };
}

/** Shuffle question order and each question's options. */
export function shuffleExam(questions: readonly Question[]): Question[] {
  return shuffle(questions).map(shuffleOptions);
}
