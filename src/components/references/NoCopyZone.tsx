"use client";

import {
  useEffect,
  useRef,
  type ClipboardEvent,
  type DragEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from "react";

interface NoCopyZoneProps {
  children: ReactNode;
  className?: string;
}

function blockInteraction(event: ClipboardEvent | MouseEvent | DragEvent) {
  event.preventDefault();
}

function isBlockedShortcut(event: KeyboardEvent) {
  if (!event.ctrlKey && !event.metaKey) return false;
  const key = event.key.toLowerCase();
  return key === "c" || key === "a" || key === "x" || key === "u" || key === "insert";
}

export default function NoCopyZone({ children, className = "" }: NoCopyZoneProps) {
  const zoneRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const zone = zoneRef.current;
    if (!zone) return;

    const blockClipboard = (event: Event) => {
      event.preventDefault();
    };

    const blockSelection = (event: Event) => {
      event.preventDefault();
    };

    const blockKeyboard = (event: Event) => {
      if (!(event instanceof KeyboardEvent)) return;
      if (!(event.ctrlKey || event.metaKey)) return;

      const key = event.key.toLowerCase();
      if (!["c", "a", "x", "u", "insert"].includes(key)) return;

      const selection = document.getSelection();
      if (!selection || selection.rangeCount === 0) return;

      const anchor = selection.anchorNode;
      if (anchor && zone.contains(anchor)) {
        event.preventDefault();
      }
    };

    zone.addEventListener("copy", blockClipboard);
    zone.addEventListener("cut", blockClipboard);
    zone.addEventListener("selectstart", blockSelection);
    document.addEventListener("keydown", blockKeyboard, true);

    return () => {
      zone.removeEventListener("copy", blockClipboard);
      zone.removeEventListener("cut", blockClipboard);
      zone.removeEventListener("selectstart", blockSelection);
      document.removeEventListener("keydown", blockKeyboard, true);
    };
  }, []);

  return (
    <div
      ref={zoneRef}
      className={`references-no-copy select-none [webkit-touch-callout:none] ${className}`.trim()}
      onCopy={blockInteraction}
      onCut={blockInteraction}
      onContextMenu={blockInteraction}
      onDragStart={blockInteraction}
      onKeyDown={(event) => {
        if (isBlockedShortcut(event)) event.preventDefault();
      }}
    >
      {children}
    </div>
  );
}
