"use client";

interface ProjectMarqueeProps {
  items: string[];
  className?: string;
}

export default function ProjectMarquee({ items, className = "" }: ProjectMarqueeProps) {
  const track = [...items, ...items];

  return (
    <div className={`marquee-mask py-3 ${className}`}>
      <div className="marquee-track">
        {track.map((item, i) => (
          <span key={`${item}-${i}`} className="marquee-item">
            <span className="h-1.5 w-1.5 rounded-full bg-retim-orange" />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
