import { useCallback, useEffect, useState } from "react";

export interface QuizSaveState {
  answers: (number | null)[];
  flagged: boolean[];
  current: number;
  elapsedSeconds: number;
  finished: boolean;
}

const STORAGE_PREFIX = "quiz-save";

export function getSavedQuiz(
  examId: string,
  paperId: string,
): QuizSaveState | null {
  if (typeof localStorage === "undefined") return null;
  try {
    const raw = localStorage.getItem(`${STORAGE_PREFIX}:${examId}:${paperId}`);
    if (!raw) return null;
    const data = JSON.parse(raw) as QuizSaveState;
    if (!Array.isArray(data.answers) || !Array.isArray(data.flagged))
      return null;
    return data;
  } catch {
    return null;
  }
}

export function clearSavedQuiz(examId: string, paperId: string) {
  try {
    localStorage.removeItem(`${STORAGE_PREFIX}:${examId}:${paperId}`);
  } catch {
    /* ignore */
  }
}

export function useQuizSave(
  examId: string,
  paperId: string,
  total: number,
  enabled: boolean,
) {
  const storageKey = `${STORAGE_PREFIX}:${examId}:${paperId}`;
  const [hasSaved, setHasSaved] = useState(false);

  useEffect(() => {
    if (!enabled) return;
    try {
      setHasSaved(localStorage.getItem(storageKey) !== null);
    } catch {
      setHasSaved(false);
    }
  }, [storageKey, enabled]);

  const save = useCallback(
    (state: QuizSaveState) => {
      try {
        localStorage.setItem(storageKey, JSON.stringify(state));
        setHasSaved(true);
      } catch {
        /* ignore quota errors */
      }
    },
    [storageKey],
  );

  const clear = useCallback(() => {
    clearSavedQuiz(examId, paperId);
    setHasSaved(false);
  }, [examId, paperId]);

  return { save, clear, hasSaved };
}
