import { prisma } from "@/lib/prisma";

import DashboardContent from "@/components/dashboard/DashboardContent";
import Header from "@/components/layout/Header";

import { auth } from "@/auth";
import { redirect } from "next/navigation";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
  }>;
}) {
  // ==========================================
  // SEARCH PARAMS
  // ==========================================

  const {
    search,
    status,
    priority,
    sort,
  } = await searchParams;

  // ==========================================
  // SESIÓN
  // ==========================================

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  // ==========================================
  // OBTENER TAREAS
  // ==========================================

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,

      // ==============================
      // BUSCADOR
      // ==============================

      ...(search
        ? {
            OR: [
              {
                title: {
                  contains: search,
                  mode: "insensitive",
                },
              },
              {
                description: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),

      // ==============================
      // ESTADO
      // ==============================

      ...(status === "completed"
        ? {
            status: "COMPLETED" as const,
          }
        : {}),

      ...(status === "pending"
        ? {
            status: {
              in: [
                "PENDING",
                "IN_PROGRESS",
              ] as const,
            },
          }
        : {}),

      // ==============================
      // PRIORIDAD
      // ==============================

      ...(priority
        ? {
            priority:
              priority as
                | "LOW"
                | "MEDIUM"
                | "HIGH",
          }
        : {}),
    },

    // ==========================================
    // ORDENACIÓN
    // ==========================================

    orderBy:
      sort === "priority"
        ? {
            priority: "desc",
          }
        : sort === "title"
        ? {
            title: "asc",
          }
        : sort === "due"
        ? {
            dueDate: "asc",
          }
        : {
            createdAt: "desc",
          },
  });

  // ==========================================
  // ESTADÍSTICAS
  // ==========================================

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending =
    tasks.length - completed;

  const high = tasks.filter(
    (task) => task.priority === "HIGH"
  ).length;

  const medium = tasks.filter(
    (task) => task.priority === "MEDIUM"
  ).length;

  const low = tasks.filter(
    (task) => task.priority === "LOW"
  ).length;

  // ==========================================
  // PRODUCTIVIDAD
  // ==========================================

  const productivity =
    tasks.length > 0
      ? Math.round(
          (completed / tasks.length) * 100
        )
      : 0;

  // ==========================================
  // RENDER
  // ==========================================

  return (
<main className="min-h-screen bg-background text-foreground">
      {/* ======================================
          HEADER PRINCIPAL
      ====================================== */}

      <Header
        name={session.user.name}
        email={session.user.email}
        avatarUrl={session.user.image}
      />

      {/* ======================================
          CONTENIDO DASHBOARD
      ====================================== */}

      <div className="mx-auto max-w-[1500px] px-5 py-8 sm:px-8">

        <DashboardContent
          tasks={tasks.map((task) => ({
            id: task.id,
            title: task.title,
            description: task.description,
            completed: task.completed,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            tag: task.tag,
          }))}

          completed={completed}
          pending={pending}
          high={high}
          medium={medium}
          low={low}
          productivity={productivity}
        />

      </div>

    </main>
  );
}