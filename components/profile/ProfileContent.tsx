"use client";

import Link from "next/link";

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock3,
  ListTodo,
  Mail,
  Settings,
  TrendingUp,
  User,
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

function ProfileStat({
  icon,
  iconClassName,
  label,
  value,
  valueClassName = "text-foreground",
}: {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  value: string | number;
  valueClassName?: string;
}) {
  return (
    <article className="ui-card-interactive group relative min-w-0 overflow-hidden p-4 sm:p-5 lg:p-6">
      <div className="absolute inset-x-0 top-0 h-0.5 bg-current opacity-0 transition-opacity duration-200 group-hover:opacity-100" />

      <div
        className={`ui-icon-box h-10 w-10 rounded-xl sm:h-11 sm:w-11 sm:rounded-2xl ${iconClassName}`}
      >
        {icon}
      </div>

      <p className="ui-kpi-label mt-4 sm:mt-5">{label}</p>

      <h2
        className={`ui-kpi-value ${valueClassName}`}
      >
        {value}
      </h2>
    </article>
  );
}

function ProfileInfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="ui-card-subtle group flex items-start gap-3 p-3.5 transition-colors duration-200 hover:border-primary/25 hover:bg-secondary/60 sm:items-center sm:p-4">
      <div className="ui-icon-box ui-icon-primary h-9 w-9 rounded-xl transition-transform duration-200 group-hover:scale-105">
        {icon}
      </div>

      <div className="min-w-0">
        <p className="ui-caption">{label}</p>

        <p className="mt-1 break-words text-sm font-semibold text-foreground sm:text-base">
          {value}
        </p>
      </div>
    </div>
  );
}

function ActivityRow({
  icon,
  iconClassName,
  label,
  value,
}: {
  icon: React.ReactNode;
  iconClassName: string;
  label: string;
  value: number;
}) {
  return (
    <div className="ui-card-subtle group flex items-center justify-between gap-3 px-3.5 py-3 transition-colors duration-200 hover:border-primary/25 hover:bg-secondary/60 sm:px-4 sm:py-3.5">
      <div className="flex min-w-0 items-center gap-3">
        <div
          className={`ui-icon-box h-9 w-9 rounded-xl transition-transform duration-200 group-hover:scale-105 ${iconClassName}`}
        >
          {icon}
        </div>

        <span className="truncate text-sm font-semibold text-foreground sm:text-base">
          {label}
        </span>
      </div>

      <span className="shrink-0 rounded-lg bg-card px-2.5 py-1 text-sm font-bold tabular-nums text-foreground shadow-sm ring-1 ring-inset ring-border">
        {value}
      </span>
    </div>
  );
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

  const safeProductivity = Math.min(
    Math.max(productivity, 0),
    100
  );

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
    .filter(Boolean)
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

            <span className="hidden text-sm font-medium sm:inline">
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

            <div className="absolute inset-0 bg-gradient-to-t from-card via-card/10 to-black/15" />

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
                    className="h-24 w-24 rounded-full border-4 border-card bg-card object-cover shadow-xl shadow-slate-950/20 sm:h-32 sm:w-32 sm:border-6 md:h-40 md:w-40 md:border-8"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-full border-4 border-card bg-gradient-to-br from-primary to-info text-2xl font-bold text-primary-foreground shadow-xl shadow-slate-950/20 sm:h-32 sm:w-32 sm:border-6 sm:text-3xl md:h-40 md:w-40 md:border-8 md:text-4xl">
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
                <h1 className="break-words text-3xl font-black leading-tight tracking-[-0.045em] text-foreground sm:text-4xl">
                  {displayName}
                </h1>

                <div className="mt-3 flex items-start gap-2 break-all text-sm font-medium text-muted-foreground sm:items-center sm:text-base">
                  <Mail
                    size={16}
                    className="mt-0.5 shrink-0 text-primary sm:mt-0"
                  />
                  <span>{email}</span>
                </div>

                <div className="mt-3 flex items-start gap-2 text-xs font-medium text-muted-foreground sm:mt-4 sm:items-center sm:text-sm">
                  <CalendarDays
                    size={16}
                    className="mt-0.5 shrink-0 text-info sm:mt-0"
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
          <ProfileStat
            icon={<ListTodo size={20} />}
            iconClassName="ui-icon-primary text-primary"
            label={t.profile.totalTasks}
            value={totalTasks}
            valueClassName="text-primary"
          />

          <ProfileStat
            icon={<CheckCircle size={20} />}
            iconClassName="ui-icon-success text-success"
            label={t.status.completedPlural}
            value={completedTasks}
            valueClassName="text-success"
          />

          <ProfileStat
            icon={<Clock3 size={20} />}
            iconClassName="ui-icon-warning text-warning"
            label={t.status.pendingPlural}
            value={pendingTasks}
            valueClassName="text-warning"
          />

          <ProfileStat
            icon={<TrendingUp size={20} />}
            iconClassName="ui-icon-violet text-violet"
            label={t.profile.productivity}
            value={`${safeProductivity}%`}
            valueClassName="text-violet"
          />
        </section>

        {/* INFORMACIÓN Y ACTIVIDAD */}
        <section className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-2">
          {/* INFORMACIÓN PERSONAL */}
          <article className="ui-card-main p-5 sm:p-6 md:p-7">
            <div className="mb-5 border-b border-border pb-5 sm:mb-6 sm:pb-6">
              <h2 className="ui-section-title text-lg sm:text-xl">
                {t.profile.information}
              </h2>

            <p className="ui-section-description text-xs sm:text-sm">
              {t.profile.information}
            </p>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <ProfileInfoRow
                icon={<User size={18} />}
                label={t.profile.name}
                value={name || t.profile.noName}
              />

              <ProfileInfoRow
                icon={<Mail size={18} />}
                label={t.profile.email}
                value={email}
              />

              <ProfileInfoRow
                icon={<CalendarDays size={18} />}
                label={t.profile.accountCreated}
                value={memberSince}
              />
            </div>
          </article>

          {/* RESUMEN DE ACTIVIDAD */}
          <article className="ui-card-main p-5 sm:p-6 md:p-7">
            <div className="mb-5 border-b border-border pb-5 sm:mb-6 sm:pb-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="ui-section-title text-lg sm:text-xl">
                    {t.profile.activitySummary}
                  </h2>

                  <p className="ui-section-description text-xs sm:text-sm">
                    {t.profile.activitySummaryDescription}
                  </p>
                </div>

                <div className="ui-badge ui-badge-primary shrink-0">
                  <TrendingUp size={14} />
                  {safeProductivity}%
                </div>
              </div>
            </div>

            <div className="space-y-4 sm:space-y-5">
              {/* PROGRESO */}
              <div className="rounded-2xl border border-border/70 bg-secondary/35 p-4">
                <div className="mb-3 flex items-center justify-between gap-3">
                  <span className="text-sm font-semibold text-foreground">
                    {t.profile.overallProgress}
                  </span>

                  <span className="shrink-0 text-sm font-bold text-primary">
                    {safeProductivity}%
                  </span>
                </div>

                <div
                  className="h-2.5 overflow-hidden rounded-full bg-card/80 ring-1 ring-inset ring-border"
                  role="progressbar"
                  aria-label={t.profile.overallProgress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={safeProductivity}
                >
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary via-info to-violet transition-all duration-500 ease-out"
                    style={{
                      width: `${safeProductivity}%`,
                    }}
                  />
                </div>
              </div>

              <div className="space-y-3">
                <ActivityRow
                  icon={<Clock3 size={18} />}
                  iconClassName="ui-icon-info"
                  label={t.status.inProgressPlural}
                  value={inProgressTasks}
                />

                <ActivityRow
                  icon={<CheckCircle size={18} />}
                  iconClassName="ui-icon-success"
                  label={t.profile.completedTasks}
                  value={completedTasks}
                />

                <ActivityRow
                  icon={<ListTodo size={18} />}
                  iconClassName="ui-icon-warning"
                  label={t.profile.pendingTasks}
                  value={pendingTasks}
                />
              </div>
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}