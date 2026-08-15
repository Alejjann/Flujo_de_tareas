import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
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

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    include: {
      tasks: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  const totalTasks = user.tasks.length;

  const completedTasks = user.tasks.filter(
    (task) => task.completed
  ).length;

  const pendingTasks = user.tasks.filter(
    (task) => !task.completed
  ).length;

  const inProgressTasks = user.tasks.filter(
    (task) => task.status === "IN_PROGRESS"
  ).length;

  const productivity =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const memberSince = new Date(
    user.createdAt
  ).toLocaleDateString("es-ES", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const initials = (user.name || user.email)
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-6xl px-4 py-6 md:px-8 md:py-10">

        {/* HEADER */}

        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-white"
          >
            <ArrowLeft size={18} />
            Volver al panel
          </Link>

          <div className="flex items-center gap-2 text-slate-400">
            <Settings size={18} />

            <span className="text-sm">
              Mi perfil
            </span>
          </div>
        </div>

        {/* ===================================================== */}
        {/* PERFIL - ESTILO LINKEDIN                              */}
        {/* ===================================================== */}

        <section className="overflow-hidden rounded-3xl border border-slate-800 bg-slate-900 shadow-2xl">

          {/* BANNER */}

          <div className="relative h-40 overflow-hidden sm:h-44 md:h-48">

            {user.bannerUrl ? (
              <img
                src={user.bannerUrl}
                alt="Banner del perfil"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-700" />
            )}

            {/* OSCURECER LIGERAMENTE EL BANNER */}

            <div className="absolute inset-0 bg-black/10" />

            {/* CAMBIAR BANNER */}

            <div className="absolute right-4 top-4 sm:right-5 sm:top-5">
              <ProfileMediaButtons type="banner" />
            </div>
          </div>

          {/* ================================================= */}
          {/* INFORMACIÓN DEL USUARIO                           */}
          {/* ================================================= */}

          <div className="relative px-5 pb-7 sm:px-8 md:px-10">

            {/* FOTO SUPERPUESTA AL BANNER */}

            <div className="relative -mt-16 mb-5 flex flex-col sm:-mt-20 sm:mb-6 md:-mt-20">

              <div className="relative w-fit">

                {user.avatarUrl ? (
                  <img
                    src={user.avatarUrl}
                    alt="Avatar"
                    className="h-40 w-40 rounded-full border-8 border-slate-900 bg-slate-900 object-cover shadow-2xl sm:h-44 sm:w-44"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center rounded-full border-8 border-slate-900 bg-gradient-to-br from-cyan-400 to-blue-600 text-4xl font-bold text-white shadow-2xl sm:h-44 sm:w-44">
                    {initials}
                  </div>
                )}

                {/* CAMBIAR FOTO */}

                <div className="absolute bottom-1 right-1">
                  <ProfileMediaButtons type="avatar" />
                </div>

              </div>
            </div>

            {/* DATOS + BOTÓN */}

            <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">

              {/* DATOS DEL USUARIO */}

              <div className="min-w-0">

                <h1 className="break-words text-3xl font-bold tracking-tight text-white sm:text-4xl">
                  {user.name || "Usuario"}
                </h1>

                <div className="mt-3 flex items-center gap-2 break-all text-sm text-slate-400 sm:text-base">
                  <Mail
                    size={17}
                    className="shrink-0"
                  />

                  <span>
                    {user.email}
                  </span>
                </div>

                {/* FECHA */}

                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500">
                  <CalendarDays
                    size={16}
                    className="shrink-0"
                  />

                  <span>
                    Miembro desde {memberSince}
                  </span>
                </div>

              </div>

              {/* EDITAR PERFIL */}

              <Link
                href="/profile/edit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 sm:w-fit"
              >
                <User size={18} />
                Editar perfil
              </Link>

            </div>

          </div>

        </section>

        {/* ===================================================== */}
        {/* ESTADÍSTICAS                                         */}
        {/* ===================================================== */}

        <section className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          {/* TOTAL */}

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-cyan-500 hover:shadow-xl hover:shadow-cyan-500/10">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <ListTodo size={24} />
            </div>

            <p className="text-sm text-slate-400">
              Total de tareas
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {totalTasks}
            </h2>

          </div>

          {/* COMPLETADAS */}

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-green-500 hover:shadow-xl hover:shadow-green-500/10">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-500/10 text-green-400">
              <CheckCircle size={24} />
            </div>

            <p className="text-sm text-slate-400">
              Completadas
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {completedTasks}
            </h2>

          </div>

          {/* PENDIENTES */}

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-yellow-500 hover:shadow-xl hover:shadow-yellow-500/10">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-yellow-500/10 text-yellow-400">
              <Clock3 size={24} />
            </div>

            <p className="text-sm text-slate-400">
              Pendientes
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {pendingTasks}
            </h2>

          </div>

          {/* PRODUCTIVIDAD */}

          <div className="group rounded-3xl border border-slate-800 bg-slate-900/80 p-6 transition hover:-translate-y-1 hover:border-purple-500 hover:shadow-xl hover:shadow-purple-500/10">

            <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-400">
              <CheckCircle size={24} />
            </div>

            <p className="text-sm text-slate-400">
              Productividad
            </p>

            <h2 className="mt-2 text-4xl font-bold">
              {productivity}%
            </h2>

          </div>

        </section>

        {/* ===================================================== */}
        {/* INFORMACIÓN                                         */}
        {/* ===================================================== */}

        <section className="mt-8 grid gap-8 lg:grid-cols-2">

          {/* INFORMACIÓN PERSONAL */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                Información personal
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Información asociada a tu cuenta.
              </p>

            </div>

            <div className="space-y-5">

              {/* NOMBRE */}

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <User
                    className="text-cyan-400"
                    size={20}
                  />

                  <div>

                    <p className="text-xs text-slate-500">
                      Nombre
                    </p>

                    <p className="mt-1 font-medium">
                      {user.name || "Sin nombre"}
                    </p>

                  </div>

                </div>

              </div>

              {/* EMAIL */}

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <Mail
                    className="text-cyan-400"
                    size={20}
                  />

                  <div>

                    <p className="text-xs text-slate-500">
                      Correo electrónico
                    </p>

                    <p className="mt-1 break-all font-medium">
                      {user.email}
                    </p>

                  </div>

                </div>

              </div>

              {/* FECHA */}

              <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <CalendarDays
                    className="text-cyan-400"
                    size={20}
                  />

                  <div>

                    <p className="text-xs text-slate-500">
                      Cuenta creada
                    </p>

                    <p className="mt-1 font-medium capitalize">
                      {memberSince}
                    </p>

                  </div>

                </div>

              </div>

            </div>

          </div>

          {/* ACTIVIDAD */}

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7">

            <div className="mb-6">

              <h2 className="text-xl font-bold">
                Resumen de actividad
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Cómo llevas tus tareas actualmente.
              </p>

            </div>

            <div className="space-y-6">

              {/* PROGRESO */}

              <div>

                <div className="mb-2 flex items-center justify-between">

                  <span className="text-sm text-slate-400">
                    Progreso general
                  </span>

                  <span className="font-semibold text-cyan-400">
                    {productivity}%
                  </span>

                </div>

                <div className="h-3 overflow-hidden rounded-full bg-slate-800">

                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 transition-all"
                    style={{
                      width: `${productivity}%`,
                    }}
                  />

                </div>

              </div>

              {/* EN PROGRESO */}

              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-500/10 text-cyan-400">
                    <Clock3 size={20} />
                  </div>

                  <span className="text-slate-300">
                    En progreso
                  </span>

                </div>

                <span className="text-xl font-bold">
                  {inProgressTasks}
                </span>

              </div>

              {/* COMPLETADAS */}

              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10 text-green-400">
                    <CheckCircle size={20} />
                  </div>

                  <span className="text-slate-300">
                    Tareas completadas
                  </span>

                </div>

                <span className="text-xl font-bold">
                  {completedTasks}
                </span>

              </div>

              {/* PENDIENTES */}

              <div className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950 p-4">

                <div className="flex items-center gap-3">

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-yellow-500/10 text-yellow-400">
                    <ListTodo size={20} />
                  </div>

                  <span className="text-slate-300">
                    Tareas pendientes
                  </span>

                </div>

                <span className="text-xl font-bold">
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