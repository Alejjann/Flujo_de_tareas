"use client";

import { motion } from "framer-motion";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  XAxis,
  YAxis,
  Bar,
} from "recharts";

interface Props {
  completed: number;
  pending: number;
  low: number;
  medium: number;
  high: number;
}

export default function DashboardCharts({
  completed,
  pending,
  low,
  medium,
  high,
}: Props) {
  const statusData = [
    { name: "Completadas", value: completed },
    { name: "Pendientes", value: pending },
  ];

  const priorityData = [
    { name: "Alta", tareas: high },
    { name: "Media", tareas: medium },
    { name: "Baja", tareas: low },
  ];

  const total = completed + pending;

  const progress =
    total === 0 ? 0 : Math.round((completed / total) * 100);

  return (
    <>
      <div className="mb-8 rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              📈 Productividad
            </h2>

            <p className="mt-1 text-slate-400">
              {completed} de {total} tareas completadas
            </p>
          </div>

          <span className="text-5xl font-bold text-cyan-400">
            {progress}%
          </span>
        </div>

        <div className="mt-6 h-4 overflow-hidden rounded-full bg-slate-800">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500"
          />
        </div>
      </div>
    </>
  );
}