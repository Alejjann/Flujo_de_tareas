"use client";

import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

export default function PriorityFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

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
          changePriority("all")
        }
        className={`${buttonClass} ${
          currentPriority === "all"
            ? "bg-cyan-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Todas
      </button>

      <button
        type="button"
        onClick={() =>
          changePriority("HIGH")
        }
        className={`${buttonClass} ${
          currentPriority === "HIGH"
            ? "bg-red-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Alta
      </button>

      <button
        type="button"
        onClick={() =>
          changePriority("MEDIUM")
        }
        className={`${buttonClass} ${
          currentPriority === "MEDIUM"
            ? "bg-yellow-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Media
      </button>

      <button
        type="button"
        onClick={() =>
          changePriority("LOW")
        }
        className={`${buttonClass} ${
          currentPriority === "LOW"
            ? "bg-green-500 text-white"
            : "bg-slate-800 text-slate-300 hover:bg-slate-700"
        }`}
      >
        Baja
      </button>
    </div>
  );
}