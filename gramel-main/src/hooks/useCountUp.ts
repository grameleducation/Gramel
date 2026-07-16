import { useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

function parseStatValue(value: string) {
  const match = value.match(/^([\$])?([\d.]+)([+%M]?)$/);
  if (!match) return { prefix: "", number: 0, suffix: "" };
  const [, prefix = "", num, suffix = ""] = match;
  return { prefix, number: parseFloat(num), suffix };
}

function useCountUp(value: string, duration = 2) {
  const { prefix, number, suffix } = parseStatValue(value);
  const [display, setDisplay] = useState(0);
  const [isComplete, setIsComplete] = useState(false); // track animation completion status
  const animationRef = useRef<number | null>(null); // track animation value for cleanup function
  const startTimeRef = useRef<number | null>(null); // track animation start time

  // Create a ref and useInView to start animation only when component is inView
  const ref = useRef<HTMLSpanElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" }); // margin for early trigger

  // callback function for requestAnimationFrame. It updates the figure on the screen per animation frame
  function animate(currentTime: number) {
    if (!startTimeRef.current) {
      startTimeRef.current = currentTime;
    }

    const elapsed = currentTime - startTimeRef.current;
    const progress = Math.min(elapsed / (duration * 1000), 1);
    setDisplay(progress * number);

    if (progress < 1) {
      // recall the function for the next frame when progress is less than 1 (100%)
      animationRef.current = requestAnimationFrame(animate);
    } else {
      // clear animation tracking and mark animation as complete
      startTimeRef.current = null;
      animationRef.current = null;
      setIsComplete(true);
    }
  }

  useEffect(() => {
    if (inView) {
      animationRef.current = requestAnimationFrame(animate);
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        startTimeRef.current = null;
        animationRef.current = null;
      }
    };
  }, [inView]);

  // format values to be displayed, add comma and and fraction digits if necessary
  const formatted = display.toLocaleString(undefined, {
    minimumFractionDigits: value.includes(".") ? 1 : 0,
    maximumFractionDigits: value.includes(".") ? 1 : 0,
  });

  // only show "+" suffix when the animation is complete for values with "+" suffix
  const showSuffix =
    suffix === "+" && isComplete ? "+" : suffix !== "+" ? suffix : "";

  return { ref, prefix, formatted, showSuffix };
}

export default useCountUp;
