import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfileContent from "@/components/profile/ProfileContent";

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

  return (
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
  );
}