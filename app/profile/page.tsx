import { redirect } from "next/navigation";

import { auth } from "@/auth";
import Header from "@/components/layout/Header";
import ProfileContent from "@/components/profile/ProfileContent";
import { prisma } from "@/lib/prisma";

export default async function ProfilePage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      email: true,
      avatarUrl: true,
      bannerUrl: true,
      createdAt: true,
      tasks: {
        select: {
          completed: true,
          status: true,
        },
      },
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
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  return (
    <main className="ui-profile-page">
      <Header
        name={user.name}
        email={user.email}
        avatarUrl={user.avatarUrl}
      />

      <div className="ui-container max-w-[1440px]">
        <ProfileContent
          name={user.name}
          email={user.email}
          avatarUrl={user.avatarUrl}
          bannerUrl={user.bannerUrl}
          createdAt={user.createdAt.toISOString()}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          pendingTasks={pendingTasks}
          inProgressTasks={inProgressTasks}
          productivity={productivity}
        />
      </div>
    </main>
  );
}