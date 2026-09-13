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
import chp2Raw from "./Part A/Chp/chp2.json";
import chp3Raw from "./Part A/Chp/chp3.json";
import chp4Raw from "./Part A/Chp/chp4.json";
import chp5Raw from "./Part A/Chp/chp5.json";
import chp6Raw from "./Part A/Chp/chp6.json";

export interface Question {
  id: string | number;
  topic?: string;
  question: string;
  options: string[];
  /** Index into options: 0 = A, 1 = B, ... */
  correctAnswer: number;
  explanation: string;
}

/** Raw shape of papers 3, 4, and 5: correctAnswer stored as option text (`answer` field). */
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

const LETTER_TO_INDEX: Record<string, number> = {
  A: 0,
  B: 1,
  C: 2,
  D: 3,
  E: 4,
  F: 5,
};

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

/** Raw shape of chapter JSON files: options can be an array or an object map ({A, B, C, D}). */
interface RawChapterQuestion {
  id: string | number;
  chapter?: string;
  question: string;
  options: Record<string, string> | string[];
  correctAnswer?: string;
  answer?: string;
  explanation: string;
}

/** Convert chapter questions handling both array and object-map formats for options. */
function convertChapter(raw: RawChapterQuestion[]): Question[] {
  return raw.map((q) => {
    const options = Array.isArray(q.options)
      ? q.options
      : Object.keys(q.options)
          .sort()
          .map((k) => (q.options as Record<string, string>)[k]!);

    const targetAnswer = q.correctAnswer ?? q.answer ?? "";
    let idx = -1;

    if (Array.isArray(q.options)) {
      idx = q.options.indexOf(targetAnswer);
    } else {
      // If options is an object map (e.g. { A: "...", B: "..." }), targetAnswer might be a letter ("A") or matching text
      const upperLetter = targetAnswer.toUpperCase();
      if (LETTER_TO_INDEX[upperLetter] !== undefined) {
        idx = LETTER_TO_INDEX[upperLetter];
      } else {
        idx = options.indexOf(targetAnswer);
      }
    }

    return {
      id: q.id,
      question: q.question,
      options,
      correctAnswer: idx >= 0 ? idx : 0,
      explanation: q.explanation,
      topic: q.chapter,
    };
  });
}

const chp1 = convertChapter(chp1Raw as RawChapterQuestion[]);
const chp2 = convertChapter(chp2Raw as RawChapterQuestion[]);
const chp3 = convertChapter(chp3Raw as RawChapterQuestion[]);
const chp4 = convertChapter(chp4Raw as RawChapterQuestion[]);
const chp5 = convertChapter(chp5Raw as RawChapterQuestion[]);
const chp6 = convertChapter(chp6Raw as RawChapterQuestion[]);

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
        questions: paper3,
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
      {
        id: "chp2",
        label: "Chapter 2: Basic Arithmetic Operations",
        description: `${chp2.length} questions · randomized order`,
        questions: chp2,
      },
      {
        id: "chp3",
        label: "Chapter 3: Fractions, Decimals and Percentages",
        description: `${chp3.length} questions · randomized order`,
        questions: chp3,
      },
      {
        id: "chp4",
        label: "Chapter 4: Ratios and Proportion",
        description: `${chp4.length} questions · randomized order`,
        questions: chp4,
      },
      {
        id: "chp5",
        label: "Chapter 5: Equations and Transposition",
        description: `${chp5.length} questions · randomized order`,
        questions: chp5,
      },
      {
        id: "chp6",
        label: "Chapter 6: Length, Lines and Simple Plane Figures",
        description: `${chp6.length} questions · randomized order`,
        questions: chp6,
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
