"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function PriorityFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const currentPriority =
    searchParams.get("priority") || "all";

  function changePriority(priority: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (priority === "all") {
      params.delete("priority");
    } else {
      params.set("priority", priority);
    }

    const query = params.toString();

    router.push(query ? `${pathname}?${query}` : pathname);
  }

  const buttonClass =
    "rounded-xl px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() => changePriority("all")}
        className={`${buttonClass} ${
          currentPriority === "all"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "border border-border bg-secondary text-secondary-foreground hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        {t.filters.allPriorities}
      </button>

      <button
        type="button"
        onClick={() => changePriority("HIGH")}
        className={`${buttonClass} ${
          currentPriority === "HIGH"
            ? "bg-destructive text-white shadow-sm"
            : "border border-border bg-secondary text-secondary-foreground hover:border-destructive/40 hover:bg-destructive/10 hover:text-destructive"
        }`}
      >
        {t.filters.high}
      </button>

      <button
        type="button"
        onClick={() => changePriority("MEDIUM")}
        className={`${buttonClass} ${
          currentPriority === "MEDIUM"
            ? "bg-warning text-slate-950 shadow-sm"
            : "border border-border bg-secondary text-secondary-foreground hover:border-warning/40 hover:bg-warning/10 hover:text-warning"
        }`}
      >
        {t.filters.medium}
      </button>

      <button
        type="button"
        onClick={() => changePriority("LOW")}
        className={`${buttonClass} ${
          currentPriority === "LOW"
            ? "bg-success text-white shadow-sm"
            : "border border-border bg-secondary text-secondary-foreground hover:border-success/40 hover:bg-success/10 hover:text-success"
        }`}
      >
        {t.filters.low}
      </button>
    </div>
  );
}