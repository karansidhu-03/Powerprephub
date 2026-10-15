import paper1 from "./Part A/papers/partapaper1.json";
import paper2 from "./Part A/papers/partapaper2.json";
import paper3Raw from "./Part A/papers/partapaper3.json";
import paper4Raw from "./Part A/papers/partapaper4.json";
import paper5 from "./Part A/papers/partapaper5.json";
import paper6Raw from "./Part A/papers/partapaper6.json";
import paper7Raw from "./Part A/papers/partapaper7.json";
import paper8Raw from "./Part A/papers/partapaper8.json";
import paper9Raw from "./Part A/papers/partapaper9.json";

// Book A1 chapters
import a1chp1 from "./Part A/Chp/BookA1/chp1.json";
import a1chp2 from "./Part A/Chp/BookA1/chp2.json";
import a1chp3 from "./Part A/Chp/BookA1/chp3.json";
import a1chp4 from "./Part A/Chp/BookA1/chp4.json";
import a1chp5 from "./Part A/Chp/BookA1/chp5.json";
import a1chp6 from "./Part A/Chp/BookA1/chp6.json";
import a1chp7 from "./Part A/Chp/BookA1/chp7.json";
import a1chp8 from "./Part A/Chp/BookA1/chp8.json";
import a1chp9 from "./Part A/Chp/BookA1/chp9.json";

// Book A2 chapters
import a2chp1 from "./Part A/Chp/BookA2/chp1.json";
import a2chp2 from "./Part A/Chp/BookA2/chp2.json";
import a2chp3 from "./Part A/Chp/BookA2/chp3.json";

// Book A3 chapters
import a3chp1 from "./Part A/Chp/BookA3/chp1.json";
import a3chp2 from "./Part A/Chp/BookA3/chp2.json";
import a3chp3 from "./Part A/Chp/BookA3/chp3.json";

// Book A4 chapters
import a4chp1 from "./Part A/Chp/BookA4/chp1.json";
import a4chp2 from "./Part A/Chp/BookA4/chp2.json";
import a4chp3 from "./Part A/Chp/BookA4/chp3.json";
import a4chp4 from "./Part A/Chp/BookA4/chp4.json";
import a4chp5 from "./Part A/Chp/BookA4/chp5.json";

// Book A5 chapters
import a5chp1 from "./Part A/Chp/BookA5/chp1.json";
import a5chp2 from "./Part A/Chp/BookA5/chp2.json";
import a5chp3 from "./Part A/Chp/BookA5/chp3.json";

// Book A6 chapters
import a6chp1 from "./Part A/Chp/BookA6/chp1.json";
import a6chp2 from "./Part A/Chp/BookA6/chp2.json";
import a6chp3 from "./Part A/Chp/BookA6/chp3.json";

// Book A7 chapters
import a7chp1 from "./Part A/Chp/BookA7/chp1.json";
import a7chp2 from "./Part A/Chp/BookA7/chp2.json";

// Book A8 chapters
import a8chp1 from "./Part A/Chp/BookA8/chp1.json";

// Book A10 chapters
import a10chp1 from "./Part A/Chp/BookA10/chp1.json";
import a10chp2 from "./Part A/Chp/BookA10/chp2.json";
import a10chp3 from "./Part A/Chp/BookA10/chp3.json";

// Preparatory topics chapters
import prepChp1 from "./Part A/Chp/Preparatory topics/chp1.json";
import prepChp2 from "./Part A/Chp/Preparatory topics/chp2.json";
import prepChp3 from "./Part A/Chp/Preparatory topics/chp3.json";
import prepChp4 from "./Part A/Chp/Preparatory topics/chp4.json";
import prepChp5 from "./Part A/Chp/Preparatory topics/chp5.json";
import prepChp6 from "./Part A/Chp/Preparatory topics/chp6.json";
import prepChp7 from "./Part A/Chp/Preparatory topics/chp7.json";

export interface Question {
  id: string | number;
  topic?: string;
  question: string;
  options: string[];
  /** Index into options: 0 = A, 1 = B, ... */
  correctAnswer: number;
  explanation?: string;
}

// ─── Converters for the 3 raw JSON formats ───────────────────────────────────

/** Format 1 & 2: options as {A,B,C,D,E}, answer as letter "A"-"E", id as "number" */
interface RawNumberQuestion {
  number: number;
  heading?: string;
  question: string;
  options: Record<string, string>;
  correctAnswer: string;
  explanation?: string;
}

/** Format 3: options as array, answer as full text, id as string "ch1_q1" */
interface RawStringIdQuestion {
  id: string;
  chapter?: string;
  question: string;
  options: string[];
  correctAnswer: string;
  explanation?: string;
}

/** Format 1 & 2 legacy: options as array, answer as full text (papers 3,4) */
interface RawTextAnswerQuestion {
  id: number;
  question: string;
  options: string[];
  answer: string;
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

type RawAny = RawNumberQuestion | RawStringIdQuestion | RawTextAnswerQuestion;

function isNumberQ(r: RawAny): r is RawNumberQuestion {
  return typeof (r as RawNumberQuestion).number === "number";
}
function isStringIdQ(r: RawAny): r is RawStringIdQuestion {
  return typeof (r as RawStringIdQuestion).id === "string";
}

/** Universal converter: handles all three raw formats into Question. */
function toQuestions(raw: RawAny[], fallbackTopic?: string): Question[] {
  return raw.map((q, i) => {
    if (isNumberQ(q)) {
      const keys = Object.keys(q.options).sort();
      const options = keys.map((k) => q.options[k]!);
      const letter = (q.correctAnswer ?? "").toUpperCase();
      return {
        id: q.number,
        question: q.question,
        options,
        correctAnswer: LETTER_TO_INDEX[letter] ?? 0,
        explanation: q.explanation || undefined,
        topic: q.heading || fallbackTopic,
      };
    }
    if (isStringIdQ(q)) {
      const options = Array.isArray(q.options)
        ? q.options
        : Object.values(q.options ?? {});

      const answer = q.correctAnswer;
      const idx =
        typeof answer === "number"
          ? answer
          : options.indexOf(answer) >= 0
            ? options.indexOf(answer)
            : (LETTER_TO_INDEX[answer.toUpperCase()] ?? 0);

      return {
        id: q.id,
        question: q.question,
        options,
        correctAnswer: idx,
        explanation: q.explanation || undefined,
        topic: q.chapter || fallbackTopic,
      };
    }
    // RawTextAnswerQuestion
    const options = Array.isArray(q.options)
      ? q.options
      : Object.values(q.options ?? {});

    const answer = q.answer;

    const idx =
      typeof answer === "number"
        ? answer
        : options.indexOf(answer) >= 0
          ? options.indexOf(answer)
          : (LETTER_TO_INDEX[String(answer).toUpperCase()] ?? 0);
    const topicMatch = q.explanation?.match(/\[([^\]]+)\]\s*\.?$/);
    return {
      id: q.id,
      question: q.question,
      options,
      correctAnswer: idx >= 0 ? idx : 0,
      explanation: q.explanation,
      topic: topicMatch ? topicMatch[1] : fallbackTopic,
    };
  });
}

// ─── Paper data ──────────────────────────────────────────────────────────────

const paper3 = toQuestions(paper3Raw as unknown as RawTextAnswerQuestion[]);
const paper4 = toQuestions(paper4Raw as unknown as RawTextAnswerQuestion[]);
const paper6 = toQuestions(paper6Raw as unknown as RawNumberQuestion[]);
const paper7 = toQuestions(paper7Raw as unknown as RawNumberQuestion[]);
const paper8 = toQuestions(paper8Raw as unknown as RawNumberQuestion[]);
const paper9 = toQuestions(paper9Raw as unknown as RawNumberQuestion[]);

// ─── Chapter definitions ─────────────────────────────────────────────────────

export interface ChapterGroup {
  id: string;
  label: string;
  description: string;
  papers: Paper[];
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
  /** Full-length exam papers (100 questions each). */
  papers: Paper[];
  /** Chapter-wise question groups organized by book. */
  chapterGroups: ChapterGroup[];
}

const placeholderPapers = (from: number, to: number): Paper[] =>
  Array.from({ length: to - from + 1 }, (_, i) => ({
    id: `paper${from + i}`,
    label: `Paper ${from + i}`,
    description: "Questions are being prepared",
    questions: null,
  }));

function makePaper(id: string, label: string, questions: Question[]): Paper {
  return {
    id,
    label,
    description: `${questions.length} questions · randomized order`,
    questions,
  };
}

// Build chapter groups
const prepChapters: Paper[] = [
  makePaper(
    "prep-chp1",
    "SI Units",
    toQuestions(prepChp1 as unknown as RawStringIdQuestion[]),
  ),
  makePaper(
    "prep-chp2",
    "Elementary Mechanics & Dynamics",
    toQuestions(
      prepChp2 as unknown as RawNumberQuestion[],
      "Elementary mechanics & dynamics",
    ),
  ),
  makePaper(
    "prep-chp3",
    "Fractions, Decimals & Percentages",
    toQuestions(
      prepChp3 as unknown as RawNumberQuestion[],
      "Fractions, decimals and percentages",
    ),
  ),
  makePaper(
    "prep-chp4",
    "Fractions, Decimals & Percentages II",
    toQuestions(
      prepChp4 as unknown as RawNumberQuestion[],
      "Fractions, decimals and percentages",
    ),
  ),
  makePaper(
    "prep-chp5",
    "Basic Algebra",
    toQuestions(prepChp5 as unknown as RawNumberQuestion[], "Basic algebra"),
  ),
  makePaper(
    "prep-chp6",
    "Geometry & Mensuration",
    toQuestions(
      prepChp6 as unknown as RawNumberQuestion[],
      "Geometry and Mensuration",
    ),
  ),
  makePaper(
    "prep-chp7",
    "Mensuration & Geometry II",
    toQuestions(
      prepChp7 as unknown as RawNumberQuestion[],
      "Mensuration and Geometry",
    ),
  ),
];

const bookA1Chapters: Paper[] = [
  makePaper(
    "a1-chp1",
    "Mechanics & Dynamics",
    toQuestions(
      a1chp1 as unknown as RawNumberQuestion[],
      "Mechanics and Dynamics",
    ),
  ),
  makePaper(
    "a1-chp2",
    "Statics & Moments",
    toQuestions(
      a1chp2 as unknown as RawNumberQuestion[],
      "Statics and Moments",
    ),
  ),
  makePaper(
    "a1-chp3",
    "Machines & Mechanical Advantage",
    toQuestions(
      a1chp3 as unknown as RawNumberQuestion[],
      "Machines and Mechanical Advantage",
    ),
  ),
  makePaper(
    "a1-chp4",
    "Vectors & Scalars",
    toQuestions(
      a1chp4 as unknown as RawNumberQuestion[],
      "Vectors and Scalars",
    ),
  ),
  makePaper(
    "a1-chp5",
    "Kinematics & Motion",
    toQuestions(
      a1chp5 as unknown as RawNumberQuestion[],
      "Kinematics and Motion",
    ),
  ),
  makePaper(
    "a1-chp6",
    "Energy, Work & Pressure",
    toQuestions(
      a1chp6 as unknown as RawNumberQuestion[],
      "Energy, Work & Pressure",
    ),
  ),
  makePaper(
    "a1-chp7",
    "Friction Fundamentals",
    toQuestions(
      a1chp7 as unknown as RawNumberQuestion[],
      "Friction Fundamentals",
    ),
  ),
  makePaper(
    "a1-chp8",
    "Strength of Materials",
    toQuestions(
      a1chp8 as unknown as RawNumberQuestion[],
      "Strength of Materials",
    ),
  ),
  makePaper(
    "a1-chp9",
    "Mechanical Drives",
    toQuestions(a1chp9 as unknown as RawNumberQuestion[], "Mechanical Drives"),
  ),
];

const bookA2Chapters: Paper[] = [
  makePaper(
    "a2-chp1",
    "Chemistry Fundamentals",
    toQuestions(
      a2chp1 as unknown as RawNumberQuestion[],
      "Chemistry Fundamentals",
    ),
  ),
  makePaper(
    "a2-chp2",
    "Thermodynamics & Heat",
    toQuestions(
      a2chp2 as unknown as RawNumberQuestion[],
      "Thermodynamics & Heat",
    ),
  ),
  makePaper(
    "a2-chp3",
    "Heat Transfer",
    toQuestions(a2chp3 as unknown as RawNumberQuestion[], "Heat Transfer"),
  ),
];

const bookA3Chapters: Paper[] = [
  makePaper(
    "a3-chp1",
    "Intro to Power Engineering",
    toQuestions(a3chp1 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a3-chp2",
    "Legislation & Regulation",
    toQuestions(a3chp2 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a3-chp3",
    "ASME & CSA Codes",
    toQuestions(a3chp3 as unknown as RawNumberQuestion[]),
  ),
];

const bookA4Chapters: Paper[] = [
  makePaper(
    "a4-chp1",
    "Work Permits & Safety",
    toQuestions(a4chp1 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a4-chp2",
    "Work Permits & Safety II",
    toQuestions(a4chp2 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a4-chp3",
    "WHMIS, Gases & Flammability",
    toQuestions(a4chp3 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a4-chp4",
    "Fire Safety & Prevention",
    toQuestions(a4chp4 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a4-chp5",
    "Fire Safety & Prevention II",
    toQuestions(a4chp5 as unknown as RawNumberQuestion[]),
  ),
];

const bookA5Chapters: Paper[] = [
  makePaper(
    "a5-chp1",
    "Environmental Science & Plant Ops",
    toQuestions(a5chp1 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a5-chp2",
    "Atmospheric Emissions & Control",
    toQuestions(a5chp2 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a5-chp3",
    "Plant Waste Management & Pollution",
    toQuestions(a5chp3 as unknown as RawNumberQuestion[]),
  ),
];

const bookA6Chapters: Paper[] = [
  makePaper(
    "a6-chp1",
    "Metallurgy & Materials Engineering",
    toQuestions(a6chp1 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a6-chp2",
    "Welding, Cutting & Metal Joining",
    toQuestions(a6chp2 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a6-chp3",
    "Non-Destructive Testing & Weld Inspection",
    toQuestions(a6chp3 as unknown as RawNumberQuestion[]),
  ),
];

const bookA7Chapters: Paper[] = [
  makePaper(
    "a7-chp1",
    "Piping, Pipe Fittings & Steam Traps",
    toQuestions(a7chp1 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a7-chp2",
    "Valves & Valve Operation",
    toQuestions(a7chp2 as unknown as RawNumberQuestion[]),
  ),
];

const bookA8Chapters: Paper[] = [
  makePaper(
    "a8-chp1",
    "Basic Electricity & Circuit Fundamentals",
    toQuestions(a8chp1 as unknown as RawNumberQuestion[]),
  ),
];

const bookA10Chapters: Paper[] = [
  makePaper(
    "a10-chp1",
    "Energy Plant Sketching",
    toQuestions(a10chp1 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a10-chp2",
    "Plant Diagrams & Drawings",
    toQuestions(a10chp2 as unknown as RawNumberQuestion[]),
  ),
  makePaper(
    "a10-chp3",
    "Plant Communications & Results",
    toQuestions(a10chp3 as unknown as RawNumberQuestion[]),
  ),
];

function chapterCount(papers: Paper[]): number {
  return papers.reduce((sum, p) => sum + (p.questions?.length ?? 0), 0);
}

export const exams: Exam[] = [
  {
    id: "power-eng-4th-part-a",
    title: "Power Engineering Fourth Class",
    subtitle: "Part A",
    description:
      "Boilers, plant safety, codes, instrumentation, materials and applied mathematics for the Fourth Class Part A examination.",
    available: true,
    papers: [
      makePaper("paper1", "Paper 1", paper1 as unknown as Question[]),
      makePaper("paper2", "Paper 2", paper2 as unknown as Question[]),
      makePaper("paper3", "Paper 3", paper3),
      makePaper("paper4", "Paper 4", paper4),
      makePaper("paper5", "Paper 5", paper5 as unknown as Question[]),
      makePaper("paper6", "Paper 6", paper6),
      makePaper("paper7", "Paper 7", paper7),
      makePaper("paper8", "Paper 8", paper8),
      makePaper("paper9", "Paper 9", paper9),
    ],
    chapterGroups: [
      {
        id: "prep-topics",
        label: "Preparatory Topics",
        description: `${chapterCount(prepChapters)} questions across ${prepChapters.length} chapters`,
        papers: prepChapters,
      },
      {
        id: "book-a1",
        label: "Book A1 — Applied Mechanics",
        description: `${chapterCount(bookA1Chapters)} questions across ${bookA1Chapters.length} chapters`,
        papers: bookA1Chapters,
      },
      {
        id: "book-a2",
        label: "Book A2 — Applied Chemistry & Heat",
        description: `${chapterCount(bookA2Chapters)} questions across ${bookA2Chapters.length} chapters`,
        papers: bookA2Chapters,
      },
      {
        id: "book-a3",
        label: "Book A3 — Power Engineering Intro & Codes",
        description: `${chapterCount(bookA3Chapters)} questions across ${bookA3Chapters.length} chapters`,
        papers: bookA3Chapters,
      },
      {
        id: "book-a4",
        label: "Book A4 — Safety, WHMIS & Fire Prevention",
        description: `${chapterCount(bookA4Chapters)} questions across ${bookA4Chapters.length} chapters`,
        papers: bookA4Chapters,
      },
      {
        id: "book-a5",
        label: "Book A5 — Environmental & Plant Operations",
        description: `${chapterCount(bookA5Chapters)} questions across ${bookA5Chapters.length} chapters`,
        papers: bookA5Chapters,
      },
      {
        id: "book-a6",
        label: "Book A6 — Metallurgy, Welding & NDT",
        description: `${chapterCount(bookA6Chapters)} questions across ${bookA6Chapters.length} chapters`,
        papers: bookA6Chapters,
      },
      {
        id: "book-a7",
        label: "Book A7 — Piping, Valves & Steam Traps",
        description: `${chapterCount(bookA7Chapters)} questions across ${bookA7Chapters.length} chapters`,
        papers: bookA7Chapters,
      },
      {
        id: "book-a8",
        label: "Book A8 — Basic Electricity",
        description: `${chapterCount(bookA8Chapters)} questions across ${bookA8Chapters.length} chapters`,
        papers: bookA8Chapters,
      },
      {
        id: "book-a10",
        label: "Book A10 — Plant Sketching & Communications",
        description: `${chapterCount(bookA10Chapters)} questions across ${bookA10Chapters.length} chapters`,
        papers: bookA10Chapters,
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
    chapterGroups: [],
  },
];

export const getExam = (examId: string) => exams.find((e) => e.id === examId);

/** Search both full papers and all chapter groups for a matching paper ID. */
export const getPaper = (examId: string, paperId: string) => {
  const exam = getExam(examId);
  if (!exam) return { exam: undefined, paper: undefined };
  const paper = exam.papers.find((p) => p.id === paperId);
  if (paper) return { exam, paper };
  for (const group of exam.chapterGroups) {
    const ch = group.papers.find((p) => p.id === paperId);
    if (ch) return { exam, paper: ch };
  }
  return { exam, paper: undefined };
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
