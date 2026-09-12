import paper1 from "./Part A/papers/partapaper1.json";
import paper2 from "./Part A/papers/partapaper2.json";
import paper3Raw from "./Part A/papers/partapaper3.json";
import paper4Raw from "./Part A/papers/partapaper4.json";
import paper5 from "./Part A/papers/partapaper5.json";
import paper6Raw from "./Part A/papers/partapaper6.json";
import paper7Raw from "./Part A/papers/partapaper7.json";
import paper8Raw from "./Part A/papers/partapaper8.json";
import paper9Raw from "./Part A/papers/partapaper9.json";
import chp1Raw from "./Part A/Chp/chp1.json";

export interface Question {
  id: string | number;
  topic?: string;
  question: string;
  options: string[];
  /** Index into options: 0 = A, 1 = B, ... */
  correctAnswer: number;
  explanation: string;
}

/** Raw shape of partapaper3.json and partapaper4.json: correctAnswer stored as option text. */
interface RawTextAnswerQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
  explanation: string;
}

/** Convert text-answer papers into the Question shape the quiz engine uses. */
function convertTextAnswer(raw: RawTextAnswerQuestion[]): Question[] {
  return raw.map((q) => {
    const idx = q.options.indexOf(q.answer);
    const topicMatch = q.explanation.match(/\[([^\]]+)\]\s*\.?$/);
    return {
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: idx >= 0 ? idx : 0,
      explanation: q.explanation,
      topic: topicMatch ? topicMatch[1] : undefined,
    };
  });
}

const paper3 = convertTextAnswer(paper3Raw as RawTextAnswerQuestion[]);
const paper4 = convertTextAnswer(paper4Raw as RawTextAnswerQuestion[]);

/** Raw shape of papers 6-9: options may be an object {A,B,C,D} or array, answer is a letter. */
interface RawLetterAnswerQuestion {
  id: number;
  question: string;
  options: Record<string, string> | string[];
  correctAnswer?: string;
  answer?: string;
  explanation: string;
}

const LETTER_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2, D: 3, E: 4, F: 5 };

/** Convert letter-answer papers (options as object or array) into the Question shape. */
function convertLetterAnswer(raw: RawLetterAnswerQuestion[]): Question[] {
  return raw.map((q) => {
    const options = Array.isArray(q.options)
      ? q.options
      : Object.keys(q.options)
          .sort()
          .map((k) => (q.options as Record<string, string>)[k]!);
    const letter = (q.correctAnswer ?? q.answer ?? "").toUpperCase();
    return {
      id: q.id,
      question: q.question,
      options,
      correctAnswer: LETTER_TO_INDEX[letter] ?? 0,
      explanation: q.explanation,
    };
  });
}

const paper6 = convertLetterAnswer(paper6Raw as RawLetterAnswerQuestion[]);
const paper7 = convertLetterAnswer(paper7Raw as RawLetterAnswerQuestion[]);
const paper8 = convertLetterAnswer(paper8Raw as RawLetterAnswerQuestion[]);
const paper9 = convertLetterAnswer(paper9Raw as RawLetterAnswerQuestion[]);

/** Raw shape of chapter JSON files: string IDs, correctAnswer stored as option text. */
interface RawChapterQuestion {
  id: string;
  chapter: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
}

/** Convert chapter questions (text answer, string IDs) into the Question shape. */
function convertChapter(raw: RawChapterQuestion[]): Question[] {
  return raw.map((q, i) => {
    const idx = q.options.indexOf(q.correctAnswer);
    return {
      id: q.id,
      question: q.question,
      options: q.options,
      correctAnswer: idx >= 0 ? idx : 0,
      explanation: q.explanation,
      topic: q.chapter,
    };
  });
}

const chp1 = convertChapter(chp1Raw as RawChapterQuestion[]);

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
  /** Full-length exam papers (100 questions each). */
  papers: Paper[];
  /** Chapter-wise question sets (shorter, topic-focused). */
  chapters: Paper[];
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
      {
        id: "paper4",
        label: "Paper 4",
        description: "100 questions · randomized order",
        questions: paper4,
      },
      {
        id: "paper5",
        label: "Paper 5",
        description: "100 questions · randomized order",
        questions: paper5 as Question[],
      },
      {
        id: "paper6",
        label: "Paper 6",
        description: "100 questions · randomized order",
        questions: paper6,
      },
      {
        id: "paper7",
        label: "Paper 7",
        description: "100 questions · randomized order",
        questions: paper7,
      },
      {
        id: "paper8",
        label: "Paper 8",
        description: "100 questions · randomized order",
        questions: paper8,
      },
      {
        id: "paper9",
        label: "Paper 9",
        description: "100 questions · randomized order",
        questions: paper9,
      },
    ],
    chapters: [
      {
        id: "chp1",
        label: "Chapter 1: SI Units",
        description: `${chp1.length} questions · randomized order`,
        questions: chp1,
      },
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
    chapters: [],
  },
];

export const getExam = (examId: string) => exams.find((e) => e.id === examId);

export const getPaper = (examId: string, paperId: string) => {
  const exam = getExam(examId);
  const paper =
    exam?.papers.find((p) => p.id === paperId) ??
    exam?.chapters.find((c) => c.id === paperId);
  return { exam, paper };
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
