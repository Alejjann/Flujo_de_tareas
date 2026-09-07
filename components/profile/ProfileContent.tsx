"use client";

import Link from "next/link";
import {
  User,
  Mail,
  CalendarDays,
  CheckCircle,
  Clock3,
  ListTodo,
  ArrowLeft,
  Settings,
} from "lucide-react";

import ProfileMediaButtons from "@/components/profile/ProfileMediaButtons";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface ProfileContentProps {
  name: string | null;
  email: string;
  avatarUrl: string | null;
  bannerUrl: string | null;
  createdAt: string;
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
  productivity: number;
}

export default function ProfileContent({
  name,
  email,
  avatarUrl,
  bannerUrl,
  createdAt,
  totalTasks,
  completedTasks,
  pendingTasks,
  inProgressTasks,
  productivity,
}: ProfileContentProps) {
  const { t, language } = useLanguage();

  const dateLocale = language === "es" ? "es-ES" : "en-US";

  const memberSince = new Date(createdAt).toLocaleDateString(
    dateLocale,
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    }
  );

  const displayName = name?.trim() || email;

  const initials = displayName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="ui-page">
      <div className="ui-container max-w-6xl">
        {/* CABECERA */}
        <header className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
          <Link
            href="/dashboard"
            className="ui-button-secondary h-10 px-3 text-xs sm:h-11 sm:px-4 sm:text-sm"
          >
            <ArrowLeft size={17} />
            <span className="hidden sm:inline">
              {t.profile.backToDashboard}
            </span>
            <span className="sm:hidden">
              {language === "es" ? "Volver" : "Back"}
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-2 text-muted-foreground">
            <Settings size={17} />
            <span className="hidden text-sm sm:inline">
              {t.profile.title}
            </span>
          </div>
        </header>

        {/* PERFIL PRINCIPAL */}
        <section className="ui-card-main overflow-hidden">
          {/* BANNER */}
          <div className="relative h-28 overflow-hidden sm:h-36 md:h-44 lg:h-52">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt={t.profile.banner}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-primary via-info to-violet" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-black/10" />

            <div className="absolute right-3 top-3 sm:right-5 sm:top-5">
              <ProfileMediaButtons type="banner" />
            </div>
          </div>

          {/* DATOS */}
          <div className="relative px-4 pb-5 sm:px-7 sm:pb-7 md:px-10 md:pb-8">
            {/* AVATAR */}
            <div className="-mt-12 mb-4 sm:-mt-16 sm:mb-5 md:-mt-20">
              <div className="relative w-fit">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${t.profile.avatar} ${t.profile.of} ${displayName}`}
                    className="h-24 w-24 rounded-full border-4 border-card bg-card object-cover shadow-xl sm:h-32 sm:w-32 sm:border-6 md:h-40 md:w-40 md:border-8"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary to-info text-2xl font-bold text-primary-foreground shadow-xl sm:h-32 sm:w-32 sm:border-6 sm:text-3xl md:h-40 md:w-40 md:border-8 md:text-4xl">
                    {initials}
                  </div>
                )}

                <div className="absolute bottom-0 right-0 sm:bottom-1 sm:right-1">
                  <ProfileMediaButtons type="avatar" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="min-w-0">
                <h1 className="break-words text-2xl font-bold tracking-tight text-foreground sm:text-3xl md:text-4xl">
                  {displayName}
                </h1>

                <div className="mt-2 flex items-start gap-2 break-all text-sm text-muted-foreground sm:mt-3 sm:items-center sm:text-base">
                  <Mail
                    size={16}
                    className="mt-0.5 shrink-0 sm:mt-0"
                  />
                  <span>{email}</span>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground sm:mt-4 sm:items-center sm:text-sm">
                  <CalendarDays
                    size={16}
                    className="mt-0.5 shrink-0 sm:mt-0"
                  />
                  <span>
                    {t.profile.memberSince} {memberSince}
                  </span>
                </div>
              </div>

              <Link
                href="/profile/edit"
                className="ui-button-primary w-full lg:w-auto"
              >
                <User size={18} />
                {t.profile.editProfile}
              </Link>
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS */}
        <section
          aria-label={t.profile.activitySummary}
          className="mt-6 grid grid-cols-2 gap-3 sm:mt-8 sm:gap-5 lg:grid-cols-4"
        >
          <div className="ui-card-interactive min-w-0 p-4 sm:p-5 lg:p-6">
            <div className="ui-icon-box ui-icon-primary h-10 w-10 rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl">
              <ListTodo size={20} />
            </div>

            <p className="ui-kpi-label mt-4 text-xs sm:mt-5 sm:text-sm">
              {t.profile.totalTasks}
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:mt-2 sm:text-4xl">
              {totalTasks}
            </h2>
          </div>

          <div className="ui-card-interactive min-w-0 p-4 sm:p-5 lg:p-6">
            <div className="ui-icon-box ui-icon-success h-10 w-10 rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl">
              <CheckCircle size={20} />
            </div>

            <p className="ui-kpi-label mt-4 text-xs sm:mt-5 sm:text-sm">
              {t.status.completedPlural}
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:mt-2 sm:text-4xl">
              {completedTasks}
            </h2>
          </div>

          <div className="ui-card-interactive min-w-0 p-4 sm:p-5 lg:p-6">
            <div className="ui-icon-box ui-icon-warning h-10 w-10 rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl">
              <Clock3 size={20} />
            </div>

            <p className="ui-kpi-label mt-4 text-xs sm:mt-5 sm:text-sm">
              {t.status.pendingPlural}
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:mt-2 sm:text-4xl">
              {pendingTasks}
            </h2>
          </div>

          <div className="ui-card-interactive min-w-0 p-4 sm:p-5 lg:p-6">
            <div className="ui-icon-box ui-icon-violet h-10 w-10 rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl">
              <CheckCircle size={20} />
            </div>

            <p className="ui-kpi-label mt-4 text-xs sm:mt-5 sm:text-sm">
              {t.profile.productivity}
            </p>

            <h2 className="mt-1 text-3xl font-bold tracking-tight text-foreground sm:mt-2 sm:text-4xl">
              {productivity}%
            </h2>
          </div>
        </section>

        {/* INFORMACIÓN Y ACTIVIDAD */}
        <section className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-2">
          {/* INFORMACIÓN PERSONAL */}
          <article className="ui-card-main p-5 sm:p-6 md:p-7">
            <div className="mb-5 sm:mb-6">
              <h2 className="ui-section-title text-lg sm:text-xl">
                {t.profile.information}
              </h2>

          
            </div>

            <div className="space-y-3 sm:space-y-4">
              <div className="ui-card-subtle p-3.5 sm:p-4">
                <div className="flex items-start gap-3 sm:items-center">
                  <div className="ui-icon-box ui-icon-primary h-9 w-9 rounded-xl">
                    <User size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="ui-caption">
                      {t.profile.name}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-foreground sm:text-base">
                      {name || t.profile.noName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ui-card-subtle p-3.5 sm:p-4">
                <div className="flex items-start gap-3 sm:items-center">
                  <div className="ui-icon-box ui-icon-primary h-9 w-9 rounded-xl">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="ui-caption">
                      {t.profile.email}
                    </p>

                    <p className="mt-1 break-all text-sm font-semibold text-foreground sm:text-base">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="ui-card-subtle p-3.5 sm:p-4">
                <div className="flex items-start gap-3 sm:items-center">
                  <div className="ui-icon-box ui-icon-primary h-9 w-9 rounded-xl">
                    <CalendarDays size={18} />
                  </div>

                  <div className="min-w-0">
                    <p className="ui-caption">
                      {t.profile.accountCreated}
                    </p>

                    <p className="mt-1 break-words text-sm font-semibold text-foreground sm:text-base">
                      {memberSince}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </article>

          {/* RESUMEN DE ACTIVIDAD */}
          <article className="ui-card-main p-5 sm:p-6 md:p-7">
            <div className="mb-5 sm:mb-6">
              <h2 className="ui-section-title text-lg sm:text-xl">
                {t.profile.activitySummary}
              </h2>

              <p className="ui-section-description text-xs sm:text-sm">
                {t.profile.activitySummaryDescription}
              </p>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* PROGRESO */}
              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <span className="text-xs font-medium text-muted-foreground sm:text-sm">
                    {t.profile.overallProgress}
                  </span>

                  <span className="shrink-0 text-sm font-bold text-primary">
                    {productivity}%
                  </span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-secondary sm:h-3"
                  role="progressbar"
                  aria-label={t.profile.overallProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={productivity}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-info transition-all duration-500"
                    style={{
                      width: `${Math.min(
                        Math.max(productivity, 0),
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div className="ui-card-subtle flex items-center justify-between gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="ui-icon-box ui-icon-info h-9 w-9 rounded-xl">
                    <Clock3 size={18} />
                  </div>

                  <span className="truncate text-sm font-medium text-foreground sm:text-base">
                    {t.status.inProgressPlural}
                  </span>
                </div>

                <span className="shrink-0 text-lg font-bold text-foreground sm:text-xl">
                  {inProgressTasks}
                </span>
              </div>

              <div className="ui-card-subtle flex items-center justify-between gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="ui-icon-box ui-icon-success h-9 w-9 rounded-xl">
                    <CheckCircle size={18} />
                  </div>

                  <span className="truncate text-sm font-medium text-foreground sm:text-base">
                    {t.profile.completedTasks}
                  </span>
                </div>

                <span className="shrink-0 text-lg font-bold text-foreground sm:text-xl">
                  {completedTasks}
                </span>
              </div>

              <div className="ui-card-subtle flex items-center justify-between gap-3 px-3.5 py-3 sm:px-4 sm:py-3.5">
                <div className="flex min-w-0 items-center gap-3">
                  <div className="ui-icon-box ui-icon-warning h-9 w-9 rounded-xl">
                    <ListTodo size={18} />
                  </div>

                  <span className="truncate text-sm font-medium text-foreground sm:text-base">
                    {t.profile.pendingTasks}
                  </span>
                </div>

                <span className="shrink-0 text-lg font-bold text-foreground sm:text-xl">
                  {pendingTasks}
                </span>
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}