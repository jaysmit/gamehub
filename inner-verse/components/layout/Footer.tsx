import Link from "next/link";
import { siteConfig } from "@/config/site";

interface FooterProps {
  minimal?: boolean;
}

export function Footer({ minimal = false }: FooterProps) {
  if (minimal) {
    return (
      <footer className="py-8 text-center">
        <div className="flex items-center justify-center gap-6 text-sm text-muted">
          <Link
            href={siteConfig.links.about}
            className="hover:text-foreground transition-colors"
          >
            About
          </Link>
          <Link
            href={siteConfig.links.privacy}
            className="hover:text-foreground transition-colors"
          >
            Privacy
          </Link>
          <Link
            href={siteConfig.links.terms}
            className="hover:text-foreground transition-colors"
          >
            Terms
          </Link>
        </div>
      </footer>
    );
  }

  return (
    <footer className="py-12 border-t border-border">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex flex-col items-center gap-6">
          <p className="font-[family-name:var(--font-crimson)] text-xl text-foreground">
            {siteConfig.name}
          </p>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link
              href={siteConfig.links.about}
              className="hover:text-foreground transition-colors"
            >
              About
            </Link>
            <Link
              href={siteConfig.links.privacy}
              className="hover:text-foreground transition-colors"
            >
              Privacy
            </Link>
            <Link
              href={siteConfig.links.terms}
              className="hover:text-foreground transition-colors"
            >
              Terms
            </Link>
          </div>
          <p className="text-xs text-muted/50">
            © {new Date().getFullYear()} {siteConfig.name}
          </p>
        </div>
      </div>
    </footer>
  );
}
