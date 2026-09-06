"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es, enUS } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface Task {
  dueDate: Date | null;
}

interface CalendarViewProps {
  tasks: Task[];
}

export default function CalendarView({
  tasks,
}: CalendarViewProps) {
  const { t, language } = useLanguage();
  const [month, setMonth] = useState(new Date());

  const dates = useMemo(
    () =>
      tasks
        .filter((task) => task.dueDate)
        .map((task) => new Date(task.dueDate!)),
    [tasks]
  );

  function previousMonth() {
    setMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() - 1,
          1
        )
    );
  }

  function nextMonth() {
    setMonth(
      (currentMonth) =>
        new Date(
          currentMonth.getFullYear(),
          currentMonth.getMonth() + 1,
          1
        )
    );
  }

  return (
    <div className="sticky top-8 rounded-2xl border border-border bg-card p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-foreground">
          {t.calendar.title}
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          {t.calendar.subtitle}
        </p>
      </div>

      {/* CABECERA DEL MES Y CONTROLES */}
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={previousMonth}
          aria-label={t.calendar.previous}
          title={t.calendar.previous}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronLeft size={18} />
        </button>

        <p className="min-w-0 px-2 text-center text-sm font-bold capitalize text-foreground">
          {month.toLocaleDateString(
            language === "es" ? "es-ES" : "en-US",
            {
              month: "long",
              year: "numeric",
            }
          )}
        </p>

        <button
          type="button"
          onClick={nextMonth}
          aria-label={t.calendar.next}
          title={t.calendar.next}
          className="flex h-8 w-8 items-center justify-center rounded-lg text-primary transition hover:bg-primary/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="calendar-wrapper flex w-full justify-center overflow-hidden">
        <DayPicker
          month={month}
          onMonthChange={setMonth}
          mode="multiple"
          selected={dates}
          showOutsideDays
          fixedWeeks
          locale={language === "es" ? es : enUS}
          hideNavigation
        />
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t.calendar.tasksWithDate}
          </span>

          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {dates.length}
          </span>
        </div>
      </div>

      <style jsx global>{`
        .calendar-wrapper .rdp {
          --rdp-accent-color: var(--primary);
          --rdp-accent-background-color: color-mix(
            in srgb,
            var(--primary) 15%,
            transparent
          );
          --rdp-day-height: 31px;
          --rdp-day-width: 31px;
          --rdp-day_button-height: 31px;
          --rdp-day_button-width: 31px;
          --rdp-selected-border: 0;

          width: 100%;
          max-width: 270px;
          margin: 0;
          color: var(--foreground);
        }

        .calendar-wrapper {
  width: 100%;
  min-width: 0;
}

.calendar-wrapper .rdp {
  --rdp-accent-color: var(--primary);
  --rdp-accent-background-color: color-mix(
    in srgb,
    var(--primary) 15%,
    transparent
  );
  --rdp-day-height: 28px;
  --rdp-day-width: 28px;
  --rdp-day_button-height: 28px;
  --rdp-day_button-width: 28px;
  --rdp-selected-border: 0;

  width: 100%;
  max-width: none;
  min-width: 0;
  margin: 0;
  color: var(--foreground);
}

.calendar-wrapper .rdp-months,
.calendar-wrapper .rdp-month,
.calendar-wrapper .rdp-month_grid {
  width: 100%;
  min-width: 0;
}

.calendar-wrapper .rdp-month_caption,
.calendar-wrapper .rdp-nav {
  display: none;
}

.calendar-wrapper .rdp-month_grid {
  table-layout: fixed;
  border-collapse: separate;
  border-spacing: 0;
}

.calendar-wrapper .rdp-weekday,
.calendar-wrapper .rdp-day {
  width: 14.285714%;
  padding: 0;
  text-align: center;
}

.calendar-wrapper .rdp-weekday {
  height: 27px;
  color: var(--muted-foreground);
  font-size: 0.62rem;
  font-weight: 600;
}

.calendar-wrapper .rdp-day {
  height: 28px;
}

.calendar-wrapper .rdp-day_button {
  width: 28px;
  height: 28px;
  min-width: 0;
  margin: 0 auto;
  padding: 0;
  color: var(--foreground);
  font-size: 0.75rem;
  font-weight: 500;
}

.calendar-wrapper .rdp-day_button:hover {
  background: var(--accent);
}

.calendar-wrapper .rdp-selected .rdp-day_button {
  background: var(--primary);
  color: var(--primary-foreground);
}

.calendar-wrapper .rdp-outside {
  color: var(--muted-foreground);
  opacity: 0.4;
}

.calendar-wrapper .rdp-today:not(.rdp-selected) .rdp-day_button {
  border: 1px solid var(--primary);
}
      `}</style>
    </div>
  );
}