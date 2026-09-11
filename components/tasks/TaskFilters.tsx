"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Check, ListFilter } from "lucide-react";

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

    router.replace(
      query ? `${pathname}?${query}` : pathname,
      {
        scroll: false,
      }
    );
  }

  const buttonBase =
    "inline-flex h-9 items-center justify-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-10 sm:px-4 sm:text-sm";

  const filters = [
    {
      value: "all",
      label: t.filters.all,
      activeClass:
        "bg-primary text-primary-foreground shadow-sm",
      inactiveClass:
        "border border-border bg-card text-muted-foreground hover:border-primary/40 hover:bg-secondary hover:text-foreground",
    },
    {
      value: "pending",
      label: t.filters.pending,
      activeClass:
        "bg-warning text-slate-950 shadow-sm",
      inactiveClass:
        "border border-border bg-card text-muted-foreground hover:border-warning/40 hover:bg-warning/10 hover:text-warning",
    },
    {
      value: "completed",
      label: t.filters.completed,
      activeClass:
        "bg-success text-white shadow-sm",
      inactiveClass:
        "border border-border bg-card text-muted-foreground hover:border-success/40 hover:bg-success/10 hover:text-success",
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="hidden h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
        <ListFilter size={17} />
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive =
            currentStatus === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() =>
                changeStatus(filter.value)
              }
              className={`${buttonBase} ${
                isActive
                  ? filter.activeClass
                  : filter.inactiveClass
              }`}
            >
              {isActive && (
                <Check size={14} strokeWidth={3} />
              )}

              {filter.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}