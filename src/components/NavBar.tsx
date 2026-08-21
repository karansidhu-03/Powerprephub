import { Link, useRouterState } from "@tanstack/react-router";
import { BookOpen, Gauge, Moon, Sun, Menu, X } from "lucide-react";
import { useState } from "react";

import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV_LINKS = [
  { to: "/", label: "Exams", icon: Gauge },
  { to: "/reference", label: "Reference", icon: BookOpen },
] as const;

export function NavBar() {
  const { theme, toggleTheme } = useTheme();
  const location = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? location === "/" : location.startsWith(to);

  return (
    <header className="sticky top-0 z-50 border-b bg-card/90 backdrop-blur-md">
      <nav className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between gap-4 px-4">
        <Link
          to="/"
          className="flex items-center gap-2"
          onClick={() => setMobileOpen(false)}
        >
          <span className="grid size-8 place-items-center rounded-lg bg-primary text-primary-foreground">
            <Gauge className="size-5" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            Exam Practice Hub
          </span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive(to)
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          >
            {theme === "light" ? (
              <Moon className="size-4" />
            ) : (
              <Sun className="size-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="sm:hidden"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <X className="size-4" />
            ) : (
              <Menu className="size-4" />
            )}
          </Button>
        </div>
      </nav>

      {mobileOpen && (
        <div className="border-t bg-card sm:hidden">
          <div className="mx-auto flex w-full max-w-6xl flex-col gap-1 px-4 py-3">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive(to)
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-4" />
                {label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
