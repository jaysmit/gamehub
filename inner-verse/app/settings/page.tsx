"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { useTheme, themes } from "@/hooks/useTheme";

export default function SettingsPage() {
  const { isDark, themeId, setThemeId, setIsDark, mounted } = useTheme();

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-background">
      <Header />

      {/* Content */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-12">
        <h1 className="font-[family-name:var(--font-crimson)] text-3xl text-foreground mb-8">
          Settings
        </h1>

        {/* Appearance Section */}
        <section className="mb-12">
          <h2 className="text-lg font-medium text-foreground mb-6">Appearance</h2>

          {/* Theme Selection */}
          <div className="mb-8">
            <label className="text-sm font-medium text-foreground mb-4 block">
              Color Theme
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => setThemeId(theme.id)}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    themeId === theme.id
                      ? "border-accent bg-accent/10"
                      : "border-border hover:border-accent/30"
                  }`}
                >
                  <div
                    className="w-8 h-8 rounded-full mx-auto mb-2"
                    style={{ backgroundColor: isDark ? theme.colors.dark.accent : theme.colors.light.accent }}
                  />
                  <p className="text-sm text-foreground text-center">{theme.name}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center justify-between p-4 bg-card rounded-xl border border-border">
            <div>
              <p className="font-medium text-foreground">Dark Mode</p>
              <p className="text-sm text-muted">Use dark background</p>
            </div>
            <button
              onClick={() => setIsDark(!isDark)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                mounted && isDark ? "bg-accent" : "bg-border"
              }`}
            >
              <span
                className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  mounted && isDark ? "left-7" : "left-1"
                }`}
              />
            </button>
          </div>
        </section>

        {/* Account Section */}
        <section className="mb-12">
          <h2 className="text-lg font-medium text-foreground mb-6">Account</h2>

          <div className="space-y-4">
            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="font-medium text-foreground">Email Notifications</p>
              <p className="text-sm text-muted mb-4">Receive updates about your reflections</p>
              <p className="text-xs text-muted/50">Sign in to manage notifications</p>
            </div>

            <div className="p-4 bg-card rounded-xl border border-border">
              <p className="font-medium text-foreground">Privacy</p>
              <p className="text-sm text-muted mb-4">Control how your reflections are shared</p>
              <p className="text-xs text-muted/50">Sign in to manage privacy settings</p>
            </div>
          </div>
        </section>

        {/* Data Section */}
        <section className="mb-12">
          <h2 className="text-lg font-medium text-foreground mb-6">Data</h2>

          <div className="space-y-4">
            <button className="w-full p-4 bg-card rounded-xl border border-border text-left hover:border-accent/30 transition-colors">
              <p className="font-medium text-foreground">Export My Data</p>
              <p className="text-sm text-muted">Download all your reflections</p>
            </button>

            <button className="w-full p-4 bg-card rounded-xl border border-red-500/30 text-left hover:bg-red-500/5 transition-colors">
              <p className="font-medium text-red-400">Delete Account</p>
              <p className="text-sm text-muted">Permanently remove your data</p>
            </button>
          </div>
        </section>

        {/* Links */}
        <section>
          <h2 className="text-lg font-medium text-foreground mb-6">Legal</h2>
          <div className="flex flex-wrap gap-4 text-sm">
            <a href="/privacy" className="text-muted hover:text-foreground transition-colors">
              Privacy Policy
            </a>
            <a href="/terms" className="text-muted hover:text-foreground transition-colors">
              Terms of Service
            </a>
            <a href="/about" className="text-muted hover:text-foreground transition-colors">
              About
            </a>
          </div>
        </section>
      </div>

      <Footer />
    </main>
  );
}
