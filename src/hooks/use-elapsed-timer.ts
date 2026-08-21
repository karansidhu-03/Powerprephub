import { useEffect, useRef, useState } from "react";

export function useElapsedTimer(running: boolean, initialSeconds = 0) {
  const [seconds, setSeconds] = useState(initialSeconds);
  const startRef = useRef<number>(0);

  useEffect(() => {
    if (!running) return;
    startRef.current = Date.now() - seconds * 1000;
    const id = setInterval(() => {
      setSeconds(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  const reset = (newInitial = 0) => {
    startRef.current = Date.now() - newInitial * 1000;
    setSeconds(newInitial);
  };

  const formatted = [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");

  return { seconds, formatted, reset };
}
