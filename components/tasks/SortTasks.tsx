"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function SortTasks() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("sort") || "date";

  function changeSort(value: string) {
    const params = new URLSearchParams(searchParams);

    params.set("sort", value);

    router.push(`/?${params.toString()}`);
  }

  return (
    <select
      value={current}
      onChange={(e) => changeSort(e.target.value)}
      className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-white"
    >
      <option value="date">Fecha creación</option>
      <option value="due">Fecha límite</option>
      <option value="priority">Prioridad</option>
      <option value="title">Título</option>
    </select>
  );
}