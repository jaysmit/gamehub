"use client";

import { cn } from "@/lib/utils";

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
  showSkip?: boolean;
  onSkip?: () => void;
  className?: string;
}

export function ProgressBar({
  current,
  total,
  label,
  showSkip = false,
  onSkip,
  className,
}: ProgressBarProps) {
  const percentage = Math.min((current / total) * 100, 100);

  return (
    <div className={cn("w-full", className)}>
      {/* Progress bar */}
      <div className="h-1 bg-border rounded-full overflow-hidden">
        <div
          className="h-full progress-fill rounded-full"
          style={{ width: `${percentage}%`, backgroundColor: "var(--accent)" }}
        />
      </div>

      {/* Label and skip */}
      <div className="flex items-center justify-between mt-3">
        <p className="text-sm text-muted">
          {label || `Question ${current} of ${total}`}
        </p>
        {showSkip && onSkip && (
          <button
            onClick={onSkip}
            className="text-sm text-muted hover:text-foreground transition-colors"
          >
            Skip
          </button>
        )}
      </div>
    </div>
  );
}
