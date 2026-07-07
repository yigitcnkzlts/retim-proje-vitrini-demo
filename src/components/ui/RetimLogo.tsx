import Image from "next/image";
import { mediaAssets } from "@/data/mediaAssets";

interface RetimLogoProps {
  variant?: "header" | "footer" | "hero";
  className?: string;
  priority?: boolean;
}

export default function RetimLogo({
  variant = "header",
  className = "",
  priority = false,
}: RetimLogoProps) {
  const isFooter = variant === "footer";
  const isHero = variant === "hero";

  const width = isHero ? 280 : isFooter ? 250 : 220;
  const height = isHero ? 84 : isFooter ? 64 : 52;

  return (
    <Image
      src={mediaAssets.logo.primary}
      alt={mediaAssets.logo.alt}
      width={width}
      height={height}
      priority={priority || variant === "header"}
      className={className}
    />
  );
}
