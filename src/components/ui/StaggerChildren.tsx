"use client";

import { Children, useEffect, useRef, useState, type ReactNode } from "react";

interface StaggerChildrenProps {
  children: ReactNode;
  className?: string;
  staggerMs?: number;
}

export default function StaggerChildren({
  children,
  className = "",
  staggerMs = 90,
}: StaggerChildrenProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {Children.map(children, (child, index) => (
        <div
          key={index}
          className={visible ? "stagger-item-visible" : "stagger-item-hidden"}
          style={{ animationDelay: visible ? `${index * staggerMs}ms` : undefined }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}
