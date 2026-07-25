"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

interface PoemDisplayProps {
  content: string;
  animate?: boolean;
  className?: string;
}

export function PoemDisplay({
  content,
  animate = true,
  className,
}: PoemDisplayProps) {
  const [visibleStanzas, setVisibleStanzas] = useState<number[]>([]);

  // Split poem into stanzas (separated by blank lines)
  const stanzas = content
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  // Animate stanzas appearing one by one
  useEffect(() => {
    if (!animate) {
      setVisibleStanzas(stanzas.map((_, i) => i));
      return;
    }

    setVisibleStanzas([]);

    stanzas.forEach((_, index) => {
      setTimeout(() => {
        setVisibleStanzas((prev) => [...prev, index]);
      }, index * 800); // 800ms between each stanza
    });
  }, [content, animate, stanzas.length]);

  return (
    <div className={cn("space-y-8", className)}>
      {stanzas.map((stanza, index) => (
        <div
          key={index}
          className={cn(
            "transition-all duration-700",
            visibleStanzas.includes(index)
              ? "opacity-100 translate-y-0"
              : "opacity-0 translate-y-4"
          )}
        >
          {stanza.split("\n").map((line, lineIndex) => (
            <p
              key={lineIndex}
              className="font-[family-name:var(--font-crimson)] text-xl sm:text-2xl text-foreground leading-relaxed"
            >
              {line || <span className="invisible">.</span>}
            </p>
          ))}
        </div>
      ))}
    </div>
  );
}
