"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export default function TaskFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

    router.push(
      `${pathname}?${params.toString()}`
    );
  }

  const buttonClass =
    "rounded-xl px-4 py-2 text-sm font-medium transition";

  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        onClick={() =>
          changeStatus("all")
        }
        className={`${buttonClass} ${
          currentStatus === "all"
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Todas
      </button>

      <button
        type="button"
        onClick={() =>
          changeStatus("pending")
        }
        className={`${buttonClass} ${
          currentStatus === "pending"
            ? "bg-yellow-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Pendientes
      </button>

      <button
        type="button"
        onClick={() =>
          changeStatus("completed")
        }
        className={`${buttonClass} ${
          currentStatus === "completed"
            ? "bg-green-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Completadas
      </button>
    </div>
  );
}