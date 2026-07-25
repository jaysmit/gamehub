// ============================================
// SITE CONFIGURATION
// Change these values to rebrand the entire site
// ============================================

export const siteConfig = {
  // Brand
  name: "Inner Verse",
  tagline: "See yourself clearly",
  description: "A guided reflection that reveals what you already know.",

  // Landing page copy
  landing: {
    headline: "What if the answers you're searching for are already within you?",
    subheadline: "Inner Verse guides you through a moment of honest reflection. Your thoughts are then unpacked and reflected back to you — revealing clarity you didn't know was there.",
    features: [
      {
        title: "Reflect",
        description: "Answer a powerful question designed to surface what matters most",
      },
      {
        title: "Explore",
        description: "Go deeper at your own pace, uncovering layers you hadn't considered",
      },
      {
        title: "Discover",
        description: "Your words return to you transformed — seen from a new perspective",
      },
    ],
    cta: "Begin your reflection",
    socialProof: "Join thousands who've discovered something true about themselves",
  },

  // URLs
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",

  // Colors (using CSS variables for theme support)
  colors: {
    // Theme-aware colors via CSS variables
    background: "bg-background",
    foreground: "text-foreground",
    accent: "text-accent",
    accentBg: "bg-accent",
    muted: "text-muted",
    border: "border-border",
  },

  // Typography
  fonts: {
    serif: "font-serif",      // For poems
    sans: "font-sans",        // For UI
  },

  // Feature flags
  features: {
    stripeEnabled: false,     // Payments not live yet
    darkMode: true,           // Dark mode with theme picker
    multipleQuestionSets: false,
  },

  // Free tier limits
  limits: {
    freePoems: 2,             // 1 anonymous + 1 after signup
    rateLimitPerHour: 5,      // API calls per IP per hour
  },

  // Links
  links: {
    about: "/about",
    privacy: "/privacy",
    terms: "/terms",
  },
} as const;

export type SiteConfig = typeof siteConfig;
