"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function SortTasks() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { t } = useLanguage();

  const current = searchParams.get("sort") || "date";

  function changeSort(value: string) {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    params.set("sort", value);

    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => changeSort(e.target.value)}
      aria-label={t.filters.sort}
      className="h-10 rounded-xl border border-border bg-secondary px-4 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
    >
      <option value="date">{t.filters.creationDate}</option>
      <option value="due">{t.filters.dueDate}</option>
      <option value="priority">{t.filters.prioritySort}</option>
      <option value="title">{t.filters.title}</option>
    </select>
  );
}