import { redirect } from "next/navigation";

import { auth } from "@/auth";
import HomeContent from "@/components/home/HomeContent";

export default async function HomePage() {
  const session = await auth();

  if (session?.user?.id) {
    redirect("/dashboard");
  }

  return <HomeContent />;
}