import { useCallback, useEffect, useRef, useState } from "react";

/**
@params STORAGE_KEY - The key to store the cooldown timestamp in localStorage
@params COOLDOWN_DURATION - The duration of the cooldown in milliseconds
*/
export function useCooldown(STORAGE_KEY: string, COOLDOWN_DURATION: number) {
  const [remainingTime, setRemainingTime] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clears running interval
  const clearTick = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  // Starts a ticking interval
  const startTick = useCallback(() => {
    // Prevent double intervals
    if (intervalRef.current) return;

    intervalRef.current = setInterval(() => {
      setRemainingTime((prev) => {
        const newTime = prev - 1000;
        if (newTime <= 0) {
          localStorage.removeItem(STORAGE_KEY);
          clearTick();
          return 0;
        }
        return newTime;
      });
    }, 1000);
  }, [STORAGE_KEY]);

  // Starts cooldown programmatically
  const startCooldown = useCallback(() => {
    const timestamp = Date.now();
    localStorage.setItem(STORAGE_KEY, timestamp.toString());
    setRemainingTime(COOLDOWN_DURATION);
    startTick();
  }, [COOLDOWN_DURATION, STORAGE_KEY, startTick]);

  // Load remaining time from localStorage on mount
  useEffect(() => {
    const storedTimestamp = localStorage.getItem(STORAGE_KEY);
    if (storedTimestamp) {
      const ts = parseInt(storedTimestamp, 10);
      if (isNaN(ts)) return localStorage.removeItem(STORAGE_KEY);

      const elapsed = Date.now() - ts;
      const remaining = COOLDOWN_DURATION - elapsed;

      if (remaining > 0) {
        setRemainingTime(remaining);
        startTick();
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    }

    // Cleanup interval on unmount
    return clearTick;
  }, []);

  return { remainingTime, startCooldown };
}
