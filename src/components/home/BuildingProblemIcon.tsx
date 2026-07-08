type BuildingProblemIconType =
  | "mantolama"
  | "drenaj"
  | "cati"
  | "yagmur"
  | "boya"
  | "balkon";

interface BuildingProblemIconProps {
  type: BuildingProblemIconType;
  className?: string;
}

export default function BuildingProblemIcon({
  type,
  className = "h-5 w-5",
}: BuildingProblemIconProps) {
  const props = {
    className,
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    "aria-hidden": true as const,
  };

  switch (type) {
    case "mantolama":
      return (
        <svg {...props}>
          <rect x="4" y="4" width="16" height="16" rx="1" strokeWidth={1.5} />
          <path strokeLinecap="round" strokeWidth={1.5} d="M4 9h16M4 14h16M9 4v16M14 4v16" />
        </svg>
      );
    case "drenaj":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v14M8 17h8" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M6 21h12M9 21v-2M15 21v-2" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M10 10l2 2 2-2" />
        </svg>
      );
    case "cati":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l9-7 9 7" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M6 10v9h12v-9" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M10 14h4" />
        </svg>
      );
    case "yagmur":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeWidth={1.5} d="M12 3v15" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 18h8" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M7 8l1 2M12 6l1 2M17 9l1 2" />
        </svg>
      );
    case "boya":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 20h16M6 16l8-8 4 4-8 8H6v-4z" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M14 6l2 2" />
        </svg>
      );
    case "balkon":
      return (
        <svg {...props}>
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 18h16M6 18V9h12v9" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M6 12h12M6 15h12" />
          <path strokeLinecap="round" strokeWidth={1.5} d="M9 9V6M15 9V6" />
        </svg>
      );
  }
}
