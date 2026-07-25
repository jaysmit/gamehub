"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "ghost" | "link";
  size?: "sm" | "md" | "lg";
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", style, children, ...props }, ref) => {
    // For primary variant, use CSS variable for accent color
    const primaryStyle = variant === "primary" ? {
      backgroundColor: "var(--accent)",
      ...style,
    } : style;

    return (
      <button
        ref={ref}
        className={cn(
          // Base styles
          "inline-flex items-center justify-center font-medium transition-all duration-200",
          "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background",
          "disabled:opacity-50 disabled:cursor-not-allowed",

          // Variants
          variant === "primary" &&
            "text-white hover:brightness-110 active:brightness-90 focus:ring-[var(--accent)]/30",
          variant === "secondary" &&
            "bg-card text-foreground border border-border hover:bg-border/50 dark:hover:bg-white/10 focus:ring-border/30",
          variant === "ghost" &&
            "text-muted hover:text-foreground hover:bg-white/10 focus:ring-white/20",
          variant === "link" &&
            "text-[var(--accent)] hover:brightness-110 underline-offset-4 hover:underline p-0 focus:ring-[var(--accent)]/30",

          // Sizes
          size === "sm" && "text-sm px-4 py-2 rounded-md",
          size === "md" && "text-base px-6 py-3 rounded-lg",
          size === "lg" && "text-lg px-8 py-4 rounded-xl",

          className
        )}
        style={primaryStyle}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
