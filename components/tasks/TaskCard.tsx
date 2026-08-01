import { Pencil, Trash2, CircleCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TaskCardProps {
  title: string;
  description: string;
  completed: boolean;
  priority: "LOW" | "MEDIUM" | "HIGH";
}

const priorityColors = {
  LOW: "bg-green-500",
  MEDIUM: "bg-yellow-500",
  HIGH: "bg-red-500",
};

export default function TaskCard({
  title,
  description,
  completed,
  priority,
}: TaskCardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-800 bg-slate-900 p-5 transition ${
        completed ? "opacity-60" : ""
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`h-3 w-3 rounded-full ${priorityColors[priority]}`}
          />

          <h3
            className={`text-lg font-semibold ${
              completed ? "line-through text-slate-500" : "text-white"
            }`}
          >
            {title}
          </h3>
        </div>

        <div className="flex gap-2">
          <Button size="icon" variant="ghost">
            <CircleCheck size={18} />
          </Button>

          <Button size="icon" variant="ghost">
            <Pencil size={18} />
          </Button>

          <Button size="icon" variant="ghost">
            <Trash2 size={18} />
          </Button>
        </div>
      </div>

      <p
        className={`mt-3 ${
          completed ? "text-slate-500" : "text-slate-400"
        }`}
      >
        {description}
      </p>
    </div>
  );
}