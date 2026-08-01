"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function PriorityFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const current = searchParams.get("priority") || "all";

  function changePriority(priority: string) {
    const params = new URLSearchParams(searchParams);

    if (priority === "all") {
      params.delete("priority");
    } else {
      params.set("priority", priority);
    }

    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex gap-2">
      <Button
        onClick={() => changePriority("all")}
        className={
          current === "all"
            ? "bg-cyan-500 text-black"
            : "bg-slate-800 text-white hover:bg-slate-700"
        }
      >
        Todas
      </Button>

      <Button
        onClick={() => changePriority("HIGH")}
        className={
          current === "HIGH"
            ? "bg-red-500 text-white"
            : "bg-slate-800 text-white hover:bg-slate-700"
        }
      >
        Alta
      </Button>

      <Button
        onClick={() => changePriority("MEDIUM")}
        className={
          current === "MEDIUM"
            ? "bg-yellow-500 text-black"
            : "bg-slate-800 text-white hover:bg-slate-700"
        }
      >
        Media
      </Button>

      <Button
        onClick={() => changePriority("LOW")}
        className={
          current === "LOW"
            ? "bg-green-500 text-white"
            : "bg-slate-800 text-white hover:bg-slate-700"
        }
      >
        Baja
      </Button>
    </div>
  );
}