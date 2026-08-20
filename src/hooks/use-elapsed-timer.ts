import { useEffect, useState } from "react";

export function useElapsedTimer(running: boolean) {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSeconds((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const reset = () => setSeconds(0);
  const formatted = [
    Math.floor(seconds / 3600),
    Math.floor((seconds % 3600) / 60),
    seconds % 60,
  ]
    .map((v) => String(v).padStart(2, "0"))
    .join(":");

  return { seconds, formatted, reset };
}
