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
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">
        {/* CABECERA */}
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft size={18} />
            {t.profile.backToDashboard}
          </Link>

          <div className="flex items-center gap-2 text-muted-foreground">
            <Settings size={18} />
            <span className="text-sm">{t.profile.title}</span>
          </div>
        </div>

        {/* TARJETA PRINCIPAL */}
        <section className="overflow-hidden rounded-3xl border border-border bg-card shadow-2xl shadow-black/10">
          {/* BANNER */}
          <div className="relative h-40 overflow-hidden sm:h-44 md:h-48">
            {bannerUrl ? (
              <img
                src={bannerUrl}
                alt={t.profile.banner}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-primary via-info to-violet" />
            )}

            <div className="absolute inset-0 bg-black/10" />

            <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
              <ProfileMediaButtons type="banner" />
            </div>
          </div>

          {/* DATOS DEL USUARIO */}
          <div className="relative px-5 pb-7 sm:px-8 md:px-10">
            <div className="relative -mt-16 mb-5 flex flex-col sm:-mt-20 sm:mb-6 md:-mt-20">
              <div className="relative w-fit">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={`${t.profile.avatar} ${t.profile.of} ${displayName}`}
                    className="h-40 w-40 rounded-full border-8 border-card bg-card object-cover shadow-2xl sm:h-44 sm:w-44"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-card bg-gradient-to-br from-primary to-info text-4xl font-bold text-primary-foreground shadow-2xl sm:h-44 sm:w-44">
                    {initials}
                  </div>
                )}

                <div className="absolute bottom-1 right-1">
                  <ProfileMediaButtons type="avatar" />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
              <div className="min-w-0">
                <h1 className="break-words text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                  {displayName}
                </h1>

                <div className="mt-3 flex items-center gap-2 break-all text-sm text-muted-foreground sm:text-base">
                  <Mail size={17} className="shrink-0" />
                  <span>{email}</span>
                </div>

                <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} className="shrink-0" />
                  <span>
                    {t.profile.memberSince} {memberSince}
                  </span>
                </div>
              </div>

              <Link
                href="/profile/edit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 sm:w-fit"
              >
                <User size={18} />
                {t.profile.editProfile}
              </Link>
            </div>
          </div>
        </section>

        {/* ESTADÍSTICAS */}
        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="group rounded-3xl border border-border bg-card/80 p-6 transition hover:-translate-y-1 hover:border-primary hover:shadow-xl hover:shadow-primary/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
              <ListTodo size={24} />
            </div>

            <p className="text-sm text-muted-foreground">
              {t.profile.totalTasks}
            </p>

            <h2 className="mt-2 text-4xl font-bold text-foreground">
              {totalTasks}
            </h2>
          </div>

          <div className="group rounded-3xl border border-border bg-card/80 p-6 transition hover:-translate-y-1 hover:border-success hover:shadow-xl hover:shadow-success/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10 text-success">
              <CheckCircle size={24} />
            </div>

            <p className="text-sm text-muted-foreground">
              {t.status.completedPlural}
            </p>

            <h2 className="mt-2 text-4xl font-bold text-foreground">
              {completedTasks}
            </h2>
          </div>

          <div className="group rounded-3xl border border-border bg-card/80 p-6 transition hover:-translate-y-1 hover:border-warning hover:shadow-xl hover:shadow-warning/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-warning/10 text-warning">
              <Clock3 size={24} />
            </div>

            <p className="text-sm text-muted-foreground">
              {t.status.pendingPlural}
            </p>

            <h2 className="mt-2 text-4xl font-bold text-foreground">
              {pendingTasks}
            </h2>
          </div>

          <div className="group rounded-3xl border border-border bg-card/80 p-6 transition hover:-translate-y-1 hover:border-violet hover:shadow-xl hover:shadow-violet/10">
            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-violet/10 text-violet">
              <CheckCircle size={24} />
            </div>

            <p className="text-sm text-muted-foreground">
              {t.profile.productivity}
            </p>

            <h2 className="mt-2 text-4xl font-bold text-foreground">
              {productivity}%
            </h2>
          </div>
        </section>

        {/* INFORMACIÓN Y RESUMEN */}
        <section className="mt-8 grid gap-8 lg:grid-cols-2">
          {/* INFORMACIÓN PERSONAL */}
          <div className="rounded-3xl border border-border bg-card p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {t.profile.information}
              </h2>

           
            </div>

            <div className="space-y-5">
              <div className="rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  <User className="text-primary" size={20} />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t.profile.name}
                    </p>

                    <p className="mt-1 font-medium text-foreground">
                      {name || t.profile.noName}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  <Mail className="text-primary" size={20} />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t.profile.email}
                    </p>

                    <p className="mt-1 break-all font-medium text-foreground">
                      {email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  <CalendarDays
                    className="text-primary"
                    size={20}
                  />

                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t.profile.accountCreated}
                    </p>

                    <p className="mt-1 font-medium capitalize text-foreground">
                      {memberSince}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RESUMEN DE ACTIVIDAD */}
          <div className="rounded-3xl border border-border bg-card p-7">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-foreground">
                {t.profile.activitySummary}
              </h2>

            
            </div>

            <div className="space-y-6">
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t.profile.overallProgress}
                  </span>

                  <span className="font-semibold text-primary">
                    {productivity}%
                  </span>
                </div>

                <div className="h-3 overflow-hidden rounded-full bg-secondary">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-primary to-info transition-all"
                    style={{
                      width: `${productivity}%`,
                    }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-info/10 text-info">
                    <Clock3 size={20} />
                  </div>

                  <span className="text-foreground">
                    {t.status.inProgressPlural}
                  </span>
                </div>

                <span className="text-xl font-bold text-foreground">
                  {inProgressTasks}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-success/10 text-success">
                    <CheckCircle size={20} />
                  </div>

                  <span className="text-foreground">
                    {t.profile.completedTasks}
                  </span>
                </div>

                <span className="text-xl font-bold text-foreground">
                  {completedTasks}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-2xl border border-border bg-secondary/50 p-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-warning/10 text-warning">
                  <ListTodo size={20} />
                </div>

                <div className="mr-auto ml-3">
                  <span className="text-foreground">
                    {t.profile.pendingTasks}
                  </span>
                </div>

                <span className="text-xl font-bold text-foreground">
                  {pendingTasks}
                </span>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}