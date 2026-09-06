"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
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
  CartesianGrid,
} from "recharts";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Props {
  completed: number;
  pending: number;
  low: number;
  medium: number;
  high: number;
}

const COLORS = {
  completed: "#22c55e",
  pending: "#f59e0b",
};

export default function DashboardCharts({
  completed,
  pending,
  low,
  medium,
  high,
}: Props) {
  const { t } = useLanguage();
  const [dark, setDark] = useState(true);

  useEffect(() => {
    function updateTheme() {
      setDark(
        document.documentElement.classList.contains("dark")
      );
    }

    updateTheme();

    const observer = new MutationObserver(updateTheme);

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const statusData = [
    {
      name: t.dashboard.completed,
      value: completed,
    },
    {
      name: t.dashboard.pending,
      value: pending,
    },
  ];

  const priorityData = [
    {
      name: t.filters.high,
      tasks: high,
    },
    {
      name: t.filters.medium,
      tasks: medium,
    },
    {
      name: t.filters.low,
      tasks: low,
    },
  ];

  const total = completed + pending;

  const progress =
    total === 0
      ? 0
      : Math.round((completed / total) * 100);

  const chartTheme = dark
    ? {
        tooltipBackground: "#121c2c",
        tooltipBorder: "#24344b",
        tooltipText: "#f8fafc",
        axisText: "#94a3b8",
        grid: "#24344b",
        cursor: "rgba(37, 134, 212, 0.12)",
      }
    : {
        tooltipBackground: "#ffffff",
        tooltipBorder: "#e2e8f0",
        tooltipText: "#0f172a",
        axisText: "#64748b",
        grid: "#e2e8f0",
        cursor: "rgba(37, 134, 212, 0.08)",
      };

  const completedTaskText =
    completed === 1
      ? t.tasks.taskSingular
      : t.tasks.taskPlural;

  return (
    <div className="space-y-6">
      {/* PRODUCTIVIDAD */}
      <div className="rounded-3xl border border-border bg-secondary/50 p-6 shadow-sm">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold text-foreground">
              📈 {t.dashboard.statistics.productivity}
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              {completed} {completedTaskText} {t.dashboard.completed.toLowerCase()}{" "}
              / {total}
            </p>
          </div>

          <span className="text-4xl font-black text-primary">
            {progress}%
          </span>
        </div>

        <div className="mt-6 h-3 overflow-hidden rounded-full bg-background/70">
          <motion.div
            initial={{ width: 0 }}
            animate={{
              width: `${progress}%`,
            }}
            transition={{
              duration: 1,
              ease: "easeOut",
            }}
            className="h-full rounded-full bg-gradient-to-r from-primary via-info to-violet"
          />
        </div>
      </div>

      {/* GRÁFICOS */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* ESTADO */}
        <div className="rounded-3xl border border-border bg-secondary/50 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-foreground">
              {t.filters.status}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {t.dashboard.activityDescription}
            </p>
          </div>

          <div className="h-[260px]">
            {total === 0 ? (
              <div className="flex h-full items-center justify-center">
                <div className="text-center">
                  <p className="text-sm font-medium text-muted-foreground">
                    {t.dashboard.noTasks}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.dashboard.noTasksDescription}
                  </p>
                </div>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={65}
                    outerRadius={95}
                    paddingAngle={4}
                    dataKey="value"
                    stroke="none"
                  >
                    <Cell fill={COLORS.completed} />
                    <Cell fill={COLORS.pending} />
                  </Pie>

                  <Tooltip
                    contentStyle={{
                      backgroundColor:
                        chartTheme.tooltipBackground,
                      border: `1px solid ${chartTheme.tooltipBorder}`,
                      borderRadius: "12px",
                      color: chartTheme.tooltipText,
                    }}
                    itemStyle={{
                      color: chartTheme.tooltipText,
                    }}
                    labelStyle={{
                      color: chartTheme.tooltipText,
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="mt-3 flex justify-center gap-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-success" />

              <span className="text-sm text-muted-foreground">
                {t.dashboard.completed}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-warning" />

              <span className="text-sm text-muted-foreground">
                {t.dashboard.pending}
              </span>
            </div>
          </div>
        </div>

        {/* PRIORIDADES */}
        <div className="rounded-3xl border border-border bg-secondary/50 p-6">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-foreground">
              {t.filters.priority}
            </h3>

            <p className="mt-1 text-sm text-muted-foreground">
              {t.dashboard.summaryDescription}
            </p>
          </div>

          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={priorityData}
                margin={{
                  top: 10,
                  right: 10,
                  left: -20,
                  bottom: 0,
                }}
              >
                <CartesianGrid
                  stroke={chartTheme.grid}
                  strokeDasharray="3 3"
                  vertical={false}
                />

                <XAxis
                  dataKey="name"
                  tick={{
                    fill: chartTheme.axisText,
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <YAxis
                  allowDecimals={false}
                  tick={{
                    fill: chartTheme.axisText,
                    fontSize: 12,
                  }}
                  axisLine={false}
                  tickLine={false}
                />

                <Tooltip
                  cursor={{
                    fill: chartTheme.cursor,
                  }}
                  contentStyle={{
                    backgroundColor:
                      chartTheme.tooltipBackground,
                    border: `1px solid ${chartTheme.tooltipBorder}`,
                    borderRadius: "12px",
                    color: chartTheme.tooltipText,
                  }}
                  itemStyle={{
                    color: chartTheme.tooltipText,
                  }}
                  labelStyle={{
                    color: chartTheme.tooltipText,
                  }}
                />

                <Bar
                  dataKey="tasks"
                  radius={[8, 8, 0, 0]}
                  fill="#15c9d8"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}