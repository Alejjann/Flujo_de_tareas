import { CheckCircle2, Circle, Pencil, Trash2 } from "lucide-react";

interface TaskCardProps {
  title: string;
  description: string;
  completed?: boolean;
}

export default function TaskCard({
  title,
  description,
  completed = false,
}: TaskCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 transition hover:border-cyan-400">

      <div className="flex items-start justify-between">

        <div className="flex gap-4">

          <button>
            {completed ? (
              <CheckCircle2
                size={28}
                className="text-green-400"
              />
            ) : (
              <Circle
                size={28}
                className="text-slate-500 hover:text-cyan-400"
              />
            )}
          </button>

          <div>

            <h3 className="text-xl font-semibold">
              {title}
            </h3>

            <p className="mt-2 text-slate-400">
              {description}
            </p>

          </div>

        </div>

        <div className="flex gap-3">

          <button className="text-slate-400 hover:text-cyan-400">
            <Pencil size={20} />
          </button>

          <button className="text-slate-400 hover:text-red-500">
            <Trash2 size={20} />
          </button>

        </div>

      </div>

    </div>
  );
}