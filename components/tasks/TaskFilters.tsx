"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const currentStatus =
    searchParams.get("status") || "all";

  function changeStatus(status: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
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
        onClick={() => changeStatus("all")}
        className={`${buttonClass} ${
          currentStatus === "all"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "border border-border bg-secondary text-secondary-foreground hover:border-primary/40 hover:bg-accent hover:text-accent-foreground"
        }`}
      >
        {t.filters.all}
      </button>

      <button
        type="button"
        onClick={() => changeStatus("pending")}
        className={`${buttonClass} ${
          currentStatus === "pending"
            ? "bg-warning text-slate-950 shadow-sm"
            : "border border-border bg-secondary text-secondary-foreground hover:border-warning/40 hover:bg-warning/10 hover:text-warning"
        }`}
      >
        {t.filters.pending}
      </button>

      <button
        type="button"
        onClick={() => changeStatus("completed")}
        className={`${buttonClass} ${
          currentStatus === "completed"
            ? "bg-success text-white shadow-sm"
            : "border border-border bg-secondary text-secondary-foreground hover:border-success/40 hover:bg-success/10 hover:text-success"
        }`}
      >
        {t.filters.completed}
      </button>
    </div>
  );
}