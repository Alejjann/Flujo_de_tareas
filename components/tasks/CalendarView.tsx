"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { es, enUS } from "react-day-picker/locale";
import "react-day-picker/dist/style.css";

import { useLanguage } from "@/components/providers/LanguageProvider";

interface Task {
  dueDate: Date | string | null;
}

interface CalendarViewProps {
  tasks: Task[];
}

function parseTaskDate(value: Date | string) {
  const rawDate = value instanceof Date ? value.toISOString() : value;

  const [year, month, day] = rawDate
    .slice(0, 10)
    .split("-")
    .map(Number);

  // Mediodía local: evita que UTC cambie el día mostrado en España.
  return new Date(year, month - 1, day, 12, 0, 0, 0);
}

export default function CalendarView({
  tasks,
}: CalendarViewProps) {
  const { t, language } = useLanguage();

  const [month, setMonth] = useState(() => new Date());

  const taskDates = useMemo(() => {
    return tasks
      .filter(
        (
          task
        ): task is Task & {
          dueDate: Date | string;
        } => task.dueDate !== null
      )
      .map((task) => parseTaskDate(task.dueDate));
  }, [tasks]);

  function previousMonth() {
    setMonth((currentMonth) => {
      return new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() - 1,
        1
      );
    });
  }

  function nextMonth() {
    setMonth((currentMonth) => {
      return new Date(
        currentMonth.getFullYear(),
        currentMonth.getMonth() + 1,
        1
      );
    });
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
          showOutsideDays
          fixedWeeks
          locale={language === "es" ? es : enUS}
          hideNavigation
          modifiers={{
            hasTask: taskDates,
          }}
          modifiersStyles={{
            hasTask: {
              backgroundColor: "var(--primary)",
              color: "var(--primary-foreground)",
              borderRadius: "9999px",
              fontWeight: 700,
            },
          }}
        />
      </div>

      <div className="mt-5 border-t border-border pt-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            {t.calendar.tasksWithDate}
          </span>

          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
            {taskDates.length}
          </span>
        </div>
      </div>

      <style jsx global>{`
        .calendar-wrapper {
          width: 100%;
          min-width: 0;
        }

        .calendar-wrapper .rdp {
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
          border-radius: 9999px;
        }

        .calendar-wrapper .rdp-day_button:hover {
          background: var(--accent);
        }

        .calendar-wrapper .rdp-outside {
          color: var(--muted-foreground);
          opacity: 0.4;
        }

        .calendar-wrapper .rdp-today .rdp-day_button {
          border: 1px solid var(--primary);
        }
      `}</style>
    </div>
  );
}