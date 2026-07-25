"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/Button";
import { trackEvent, getAnonymousToken } from "@/lib/analytics";
import { siteConfig } from "@/config/site";

interface PoemActionsProps {
  content: string;
  shareSlug: string;
  onCreateAnother?: () => void;
}

export function PoemActions({
  content,
  shareSlug,
  onCreateAnother,
}: PoemActionsProps) {
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const shareUrl = `${siteConfig.url}/poem/${shareSlug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      setCopied(true);
      trackEvent("copy_clicked", { anonymousToken: getAnonymousToken() });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleDownload = async () => {
    setDownloading(true);
    trackEvent("download_clicked", { anonymousToken: getAnonymousToken() });

    try {
      // Dynamic import to avoid SSR issues
      const { toPng } = await import("html-to-image");

      if (!cardRef.current) return;

      const dataUrl = await toPng(cardRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#fafaf9",
      });

      // Create download link
      const link = document.createElement("a");
      link.download = `inner-verse-poem-${shareSlug}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to download:", err);
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    trackEvent("share_clicked", { anonymousToken: getAnonymousToken() });

    if (navigator.share) {
      try {
        await navigator.share({
          title: `A poem from ${siteConfig.name}`,
          text: "I wrote a reflection and received this poem.",
          url: shareUrl,
        });
      } catch (err) {
        // User cancelled or error
        console.error("Share failed:", err);
      }
    } else {
      // Fallback: copy share URL
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy share URL:", err);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Action buttons */}
      <div className="flex flex-wrap gap-3 justify-center">
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? "Copied!" : "Copy"}
        </Button>
        <Button
          variant="secondary"
          size="sm"
          onClick={handleDownload}
          disabled={downloading}
        >
          {downloading ? "Saving..." : "Download"}
        </Button>
        <Button variant="secondary" size="sm" onClick={handleShare}>
          Share
        </Button>
      </div>

      {/* Create another button */}
      {onCreateAnother && (
        <div className="text-center pt-4">
          <Button onClick={onCreateAnother}>Create another</Button>
        </div>
      )}

      {/* Hidden card for download */}
      <div className="fixed left-[-9999px] top-0">
        <div
          ref={cardRef}
          className="w-[600px] p-12 bg-stone-50"
          style={{ fontFamily: "Georgia, serif" }}
        >
          {/* Card content */}
          <div className="space-y-6">
            {content
              .split(/\n\s*\n/)
              .map((s) => s.trim())
              .filter((s) => s.length > 0)
              .map((stanza, index) => (
                <div key={index}>
                  {stanza.split("\n").map((line, lineIndex) => (
                    <p
                      key={lineIndex}
                      className="text-xl text-stone-700 leading-relaxed"
                    >
                      {line}
                    </p>
                  ))}
                </div>
              ))}
          </div>

          {/* Branding */}
          <div className="mt-12 pt-6 border-t border-stone-200">
            <p className="text-sm text-stone-400 text-center">
              {siteConfig.name}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
