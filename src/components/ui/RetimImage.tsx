"use client";

import Image, { type ImageProps } from "next/image";
import { useState } from "react";
import type { RetimImageSource } from "@/data/mediaAssets";

type RetimImageProps = Omit<ImageProps, "src" | "alt"> & {
  source: RetimImageSource;
};

export default function RetimImage({ source, className, ...props }: RetimImageProps) {
  const [src, setSrc] = useState(source.primary);
  const [failed, setFailed] = useState(false);

  return (
    <Image
      {...props}
      src={src}
      alt={source.alt}
      className={className}
      onError={() => {
        if (!failed && src !== source.fallback) {
          setFailed(true);
          setSrc(source.fallback);
        }
      }}
    />
  );
}
