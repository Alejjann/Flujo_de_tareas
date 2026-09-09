import { redirect } from "next/navigation";

import { auth } from "@/auth";
import DashboardContent from "@/components/dashboard/DashboardContent";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/prisma";

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
  const { search, status, priority, sort } = await searchParams;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const tasks = await prisma.task.findMany({
    where: {
      userId: session.user.id,

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

      ...(status === "completed"
        ? {
            status: "COMPLETED" as const,
          }
        : {}),

      ...(status === "pending"
        ? {
            status: {
              in: ["PENDING", "IN_PROGRESS"] as const,
            },
          }
        : {}),

      ...(priority
        ? {
            priority: priority as
              | "LOW"
              | "MEDIUM"
              | "HIGH",
          }
        : {}),
    },

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

  const totalTasks = tasks.length;

  const completed = tasks.filter(
    (task) => task.completed
  ).length;

  const pending = totalTasks - completed;

  const high = tasks.filter(
    (task) => task.priority === "HIGH"
  ).length;

  const medium = tasks.filter(
    (task) => task.priority === "MEDIUM"
  ).length;

  const low = tasks.filter(
    (task) => task.priority === "LOW"
  ).length;

  const productivity =
    totalTasks > 0
      ? Math.round((completed / totalTasks) * 100)
      : 0;

  const isFirstTask = totalTasks === 0;

  return (
    <main className="ui-dashboard-page">
      <Header
        name={session.user.name}
        email={session.user.email}
        avatarUrl={session.user.image}
      />

      <div className="ui-container max-w-[1440px]">
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
          isFirstTask={isFirstTask}
        />
      </div>
    </main>
  );
}