"use client";

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

  return (
    <div className="grid gap-6 lg:grid-cols-2">

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-6 text-xl font-bold">
          Estado de tareas
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={statusData}
                dataKey="value"
                innerRadius={70}
                outerRadius={110}
              >
                <Cell fill="#06b6d4" />
                <Cell fill="#facc15" />
              </Pie>

              <Tooltip />

            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
        <h2 className="mb-6 text-xl font-bold">
          Prioridades
        </h2>

        <div className="h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={priorityData}>

              <XAxis dataKey="name" />

              <YAxis />

              <Tooltip />

              <Bar dataKey="tareas">
                <Cell fill="#ef4444" />
                <Cell fill="#eab308" />
                <Cell fill="#22c55e" />
              </Bar>

            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}