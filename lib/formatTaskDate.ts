type Language = "es" | "en";

interface FormatTaskDateOptions {
  dueDate: Date | string;
  language: Language;
  completed?: boolean;
}

export function formatTaskDate({
  dueDate,
  language,
  completed = false,
}: FormatTaskDateOptions) {
  const date = new Date(dueDate);

  if (Number.isNaN(date.getTime())) {
    return {
      label: "",
      isOverdue: false,
    };
  }

  const now = new Date();

  const today = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  );

  const targetDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  const millisecondsPerDay = 1000 * 60 * 60 * 24;

  const differenceInDays = Math.round(
    (targetDate.getTime() - today.getTime()) / millisecondsPerDay
  );

  const locale = language === "es" ? "es-ES" : "en-US";

  const formattedFullDate = date.toLocaleDateString(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const isOverdue = differenceInDays < 0 && !completed;

  if (isOverdue) {
    return {
      label:
        language === "es"
          ? `Vencida · ${formattedFullDate}`
          : `Overdue · ${formattedFullDate}`,
      isOverdue: true,
    };
  }

  if (differenceInDays === 0) {
    return {
      label: language === "es" ? "Hoy" : "Today",
      isOverdue: false,
    };
  }

  if (differenceInDays === 1) {
    return {
      label: language === "es" ? "Mañana" : "Tomorrow",
      isOverdue: false,
    };
  }

  if (differenceInDays === 2) {
    return {
      label: language === "es" ? "Pasado mañana" : "The day after tomorrow",
      isOverdue: false,
    };
  }

  return {
    label: formattedFullDate,
    isOverdue: false,
  };
}