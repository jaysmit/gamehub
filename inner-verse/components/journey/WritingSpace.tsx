"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface WritingSpaceProps {
  question: string;
  guidance?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
}

export function WritingSpace({
  question,
  guidance,
  value,
  onChange,
  placeholder = "Begin writing...",
  className,
  autoFocus = true,
}: WritingSpaceProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [isSaving, setIsSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = `${Math.max(textarea.scrollHeight, 200)}px`;
    }
  }, [value]);

  // Auto-focus on mount
  useEffect(() => {
    if (autoFocus && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [autoFocus]);

  // Show saving indicator briefly when value changes
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value);

    // Show saving indicator
    setIsSaving(true);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      setIsSaving(false);
    }, 1000);
  };

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      {/* Question */}
      <h1 className="font-[family-name:var(--font-crimson)] text-xl sm:text-2xl text-stone-700 leading-relaxed mb-4">
        {question}
      </h1>

      {/* Guidance */}
      {guidance && (
        <p className="text-sm text-stone-400 mb-8 leading-relaxed">
          {guidance}
        </p>
      )}

      {/* Writing area */}
      <div className="relative">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={cn(
            "w-full min-h-[200px] p-0 bg-transparent",
            "text-lg text-stone-800 leading-relaxed",
            "placeholder:text-stone-300",
            "border-none resize-none",
            "writing-area",
            "focus:outline-none"
          )}
        />

        {/* Autosave indicator */}
        <div
          className={cn(
            "absolute bottom-0 right-0 text-xs text-stone-300 transition-opacity duration-300",
            isSaving ? "opacity-100" : "opacity-0"
          )}
        >
          Saving...
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="h-px bg-gradient-to-r from-transparent via-stone-200 to-transparent mt-4" />
    </div>
  );
}
