"use client";

import { motion } from "framer-motion";

interface ProgressCardProps {
  completed: number;
  total: number;
}

export default function ProgressCard({
  completed,
  total,
}: ProgressCardProps) {
  const percentage =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-white">
            Progreso general
          </h2>

          <p className="mt-2 text-slate-400">
            {completed} de {total} tareas completadas
          </p>
        </div>

        <div className="text-3xl font-bold text-cyan-400">
          {percentage}%
        </div>
      </div>

      <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 1,
            ease: "easeOut",
          }}
          className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500"
        />
      </div>
    </div>
  );
}