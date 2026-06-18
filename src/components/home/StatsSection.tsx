"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import CountUp from "@/components/ui/CountUp";
import { stats } from "@/data/site";

export default function StatsSection() {
  const pathname = usePathname();
  const prevPath = useRef(pathname);
  const [playKey, setPlayKey] = useState(0);

  useEffect(() => {
    if (pathname === "/" && prevPath.current !== "/") {
      setPlayKey((k) => k + 1);
    }
    prevPath.current = pathname;
  }, [pathname]);

  return (
    <section className="border-b border-retim-gray-dark bg-white py-12">
      <div className="container-main">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5 md:gap-6">
          {stats.map((stat, i) => (
            <div key={stat.label} className="stat-card" style={{ animationDelay: `${i * 80}ms` }}>
              <p className="text-2xl font-bold text-retim-navy transition-colors duration-300 md:text-3xl stat-card-value">
                {/^\d/.test(stat.value) ? (
                  <CountUp key={`${stat.label}-${playKey}`} value={stat.value} />
                ) : (
                  stat.value
                )}
              </p>
              <p className="mt-1 text-sm text-gray-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
