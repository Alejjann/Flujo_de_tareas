import { redirect } from "next/navigation";

import type {
  Prisma,
  Priority,
  TaskStatus,
} from "@prisma/client";

import { auth } from "@/auth";
import DashboardContent from "@/components/dashboard/DashboardContent";
import Header from "@/components/layout/Header";
import { prisma } from "@/lib/prisma";

type DashboardPageProps = {
  searchParams: Promise<{
    search?: string;
    status?: string;
    priority?: string;
    sort?: string;
  }>;
};

const VALID_PRIORITIES: Priority[] = [
  "LOW",
  "MEDIUM",
  "HIGH",
];

export default async function DashboardPage({
  searchParams,
}: DashboardPageProps) {
  const { search, status, priority, sort } =
    await searchParams;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const normalizedSearch = search?.trim();

  const selectedPriority = VALID_PRIORITIES.includes(
    priority as Priority
  )
    ? (priority as Priority)
    : undefined;

  const where: Prisma.TaskWhereInput = {
    userId: session.user.id,
  };

  if (normalizedSearch) {
    where.OR = [
      {
        title: {
          contains: normalizedSearch,
          mode: "insensitive",
        },
      },
      {
        description: {
          contains: normalizedSearch,
          mode: "insensitive",
        },
      },
    ];
  }

  if (status === "completed") {
    where.status = "COMPLETED";
  }

  if (status === "pending") {
    where.status = {
      in: ["PENDING", "IN_PROGRESS"] as TaskStatus[],
    };
  }

  if (selectedPriority) {
    where.priority = selectedPriority;
  }

  const orderBy: Prisma.TaskOrderByWithRelationInput =
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
            };

  const tasks = await prisma.task.findMany({
    where,
    orderBy,
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
        name={session.user.name ?? null}
        email={session.user.email ?? null}
        avatarUrl={session.user.image ?? null}
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
            position: task.position,
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