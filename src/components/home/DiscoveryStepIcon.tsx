export type DiscoveryIconType = "drone" | "thermal" | "structural";

interface DiscoveryStepIconProps {
  type: DiscoveryIconType;
  className?: string;
}

export default function DiscoveryStepIcon({ type, className = "h-6 w-6" }: DiscoveryStepIconProps) {
  if (type === "drone") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <rect x="9" y="9" width="6" height="6" rx="1" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeWidth={1.5} d="M12 9V6M12 15v3M9 12H6M15 12h3" />
        <circle cx="5" cy="5" r="2" strokeWidth={1.5} />
        <circle cx="19" cy="5" r="2" strokeWidth={1.5} />
        <circle cx="5" cy="19" r="2" strokeWidth={1.5} />
        <circle cx="19" cy="19" r="2" strokeWidth={1.5} />
        <path strokeLinecap="round" strokeWidth={1.5} d="M7 7l2 2M17 7l-2 2M7 17l2-2M17 17l-2-2" />
      </svg>
    );
  }

  if (type === "thermal") {
    return (
      <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M4 7V6a2 2 0 012-2h1M4 17v1a2 2 0 002 2h1M16 4h1a2 2 0 012 2v1M19 16v1a2 2 0 01-2 2h-1"
        />
        <rect x="7" y="7" width="10" height="10" rx="1.5" strokeWidth={1.5} />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={1.5}
          d="M10 14c.5-1.5 1.5-2 2-2s1.5.5 2 2M10 11h4M12 9v6"
        />
        <path strokeLinecap="round" strokeWidth={1.5} d="M5 12h1M18 12h1M12 5v1M12 18v1" />
      </svg>
    );
  }

  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M4 21h16M6 21V9l6-4 6 4v12"
      />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 21v-5h4v5" />
      <path strokeLinecap="round" strokeWidth={1.5} d="M9 12h1M14 12h1M9 15h1M14 15h1" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 5v3" />
      <path strokeLinecap="round" strokeWidth={1.5} d="M3 12h3M18 12h3" />
    </svg>
  );
}
