"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function TaskFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("status") || "all";

  function changeFilter(filter: string) {
    const params = new URLSearchParams(searchParams);

    if (filter === "all") {
      params.delete("status");
    } else {
      params.set("status", filter);
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      <Button
  className={
    current === "all"
      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
  }
  onClick={() => changeFilter("all")}
>
  Todas
</Button>

<Button
  className={
    current === "pending"
      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
  }
  onClick={() => changeFilter("pending")}
>
  Pendientes
</Button>

<Button
  className={
    current === "completed"
      ? "bg-cyan-500 text-slate-950 hover:bg-cyan-400"
      : "bg-slate-800 text-slate-300 hover:bg-slate-700"
  }
  onClick={() => changeFilter("completed")}
>
  Completadas
</Button>
    </div>
  );
}