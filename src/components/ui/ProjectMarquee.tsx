"use client";

interface ProjectMarqueeProps {
  items: string[];
}

export default function ProjectMarquee({ items }: ProjectMarqueeProps) {
  const track = [...items, ...items];

  return (
    <div className="marquee-mask border-t border-white/10 bg-retim-navy/80 py-3 backdrop-blur-sm">
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
