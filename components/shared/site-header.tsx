import Link from "next/link";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const links = [
  { href: "/app", label: "ホーム" },
  { href: "/history", label: "履歴" },
  { href: "/weekly", label: "週次" },
  { href: "/settings", label: "設定" }
];

export function SiteHeader({ className }: { className?: string }) {
  return (
    <header className={cn("sticky top-0 z-30 w-full bg-background/80 backdrop-blur", className)}>
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Link href="/app" className="flex items-center gap-2 text-lg font-semibold">
          <span className="flex h-9 w-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
            <Sparkles className="h-5 w-5" />
          </span>
          <span>習慣ガチャ</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-full px-3 py-2 text-muted-foreground transition hover:text-foreground"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-2 border-t px-4 py-2 text-xs text-muted-foreground md:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="flex-1 rounded-full px-3 py-2 text-center transition hover:text-foreground"
          >
            {link.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
