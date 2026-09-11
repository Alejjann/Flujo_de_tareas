"use client";

import { redirect } from "next/navigation";
import { useEffect, useState } from "react";

import Header from "@/components/layout/Header";

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<{
    name: string | null;
    email: string;
    avatarUrl: string | null;
  } | null>(null);

  useEffect(() => {
    async function loadUser() {
      try {
        const res = await fetch("/api/me");

        if (!res.ok) {
          redirect("/login");
          return;
        }

        const data = await res.json();

        setUser(data);
      } catch {
        redirect("/login");
      }
    }

    loadUser();
  }, []);

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-muted-foreground">
          Loading...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header
        name={user.name}
        email={user.email}
        avatarUrl={user.avatarUrl}
      />

      <main className="mx-auto w-full max-w-7xl px-6 py-8 md:px-8">
        {children}
      </main>
    </div>
  );
}