interface RetimLogoProps {
  variant?: "header" | "footer";
  className?: string;
}

export default function RetimLogo({ variant = "header", className = "" }: RetimLogoProps) {
  const isFooter = variant === "footer";
  const id = isFooter ? "footer" : "header";
  const height = isFooter ? 64 : 52;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 250 62"
      width={isFooter ? 250 : 220}
      height={height}
      fill="none"
      role="img"
      aria-label="Retim Restorasyon"
      className={className}
    >
      <defs>
        <linearGradient id={`retim-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#f47a24" />
          <stop offset="52%" stopColor="#e85d04" />
          <stop offset="100%" stopColor="#c44e00" />
        </linearGradient>
        <linearGradient id={`retim-shine-${id}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.24" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <filter id={`retim-glow-${id}`} x="-12%" y="-20%" width="124%" height="150%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#e85d04" floodOpacity="0.32" />
        </filter>
      </defs>

      <g filter={isFooter ? `url(#retim-glow-${id})` : undefined}>
        <rect x="1" y="1" width="248" height="60" rx="5" fill={`url(#retim-grad-${id})`} />
        <rect x="1" y="1" width="248" height="26" rx="5" fill={`url(#retim-shine-${id})`} />
        <rect
          x="1"
          y="1"
          width="248"
          height="60"
          rx="5"
          stroke="rgba(255,255,255,0.22)"
          strokeWidth="1"
        />
      </g>

      <g transform="translate(14, 11)">
        <rect width="30" height="40" rx="2.5" fill="#1a2332" />
        <rect width="30" height="7" rx="2.5" fill="rgba(255,255,255,0.92)" />
        <rect x="4" y="11" width="6" height="6" rx="1" fill="rgba(255,255,255,0.9)" />
        <rect x="12" y="11" width="6" height="6" rx="1" fill="rgba(255,255,255,0.65)" />
        <rect x="20" y="11" width="6" height="6" rx="1" fill="rgba(255,255,255,0.9)" />
        <rect x="4" y="20" width="6" height="6" rx="1" fill="rgba(255,255,255,0.55)" />
        <rect x="12" y="20" width="6" height="6" rx="1" fill="rgba(255,255,255,0.85)" />
        <rect x="20" y="20" width="6" height="6" rx="1" fill="rgba(255,255,255,0.55)" />
        <rect x="4" y="29" width="6" height="6" rx="1" fill="rgba(255,255,255,0.8)" />
        <rect x="12" y="29" width="6" height="6" rx="1" fill="rgba(255,255,255,0.5)" />
        <rect x="20" y="29" width="6" height="6" rx="1" fill="rgba(255,255,255,0.8)" />
        <rect x="8" y="38" width="14" height="2" rx="1" fill="#e85d04" />
      </g>

      <text
        x="54"
        y="36"
        fill="#ffffff"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="27"
        fontWeight="800"
        letterSpacing="0.1em"
      >
        RETİM
      </text>
      <text
        x="54"
        y="50"
        fill="rgba(26,35,50,0.88)"
        fontFamily="Arial, Helvetica, sans-serif"
        fontSize="6.8"
        fontWeight="600"
        letterSpacing="0.11em"
      >
        RESTORASYON MAD. SAN. VE TİC. LTD. ŞTİ.
      </text>

      <g transform="translate(214, 11)">
        <rect width="22" height="13" rx="2" fill="#1a2332" />
        <text
          x="11"
          y="9.5"
          textAnchor="middle"
          fill="#ffffff"
          fontFamily="Arial, Helvetica, sans-serif"
          fontSize="9"
          fontWeight="800"
        >
          R
        </text>
        <rect y="15" width="22" height="11" rx="2" fill="rgba(255,255,255,0.38)" />
        <rect y="28" width="22" height="12" rx="2" fill="#1a2332" />
      </g>
    </svg>
  );
}
