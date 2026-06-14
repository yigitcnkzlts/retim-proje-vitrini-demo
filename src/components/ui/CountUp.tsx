"use client";

import { useEffect, useRef, useState } from "react";

interface CountUpProps {
  value: string;
  className?: string;
  duration?: number;
}

function easeOutExpo(t: number): number {
  return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
}

function parseValue(value: string) {
  const match = value.match(/^(\d+)(.*)$/);
  if (!match) return null;
  return { target: parseInt(match[1], 10), suffix: match[2] };
}

export default function CountUp({ value, className = "", duration = 1800 }: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const data = parseValue(value);
  const [display, setDisplay] = useState(data ? `0${data.suffix}` : value);

  useEffect(() => {
    const el = ref.current;
    const parsed = parseValue(value);

    if (!el || !parsed) {
      setDisplay(value);
      return;
    }

    let raf = 0;
    let running = false;

    const runAnimation = () => {
      if (running) return;
      running = true;
      setDisplay(`0${parsed.suffix}`);

      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1);
        const current = Math.round(easeOutExpo(progress) * parsed.target);
        setDisplay(`${current}${parsed.suffix}`);
        if (progress < 1) {
          raf = requestAnimationFrame(tick);
        } else {
          running = false;
        }
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          runAnimation();
        } else if (!running) {
          setDisplay(`0${parsed.suffix}`);
        }
      },
      { threshold: 0.35 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
