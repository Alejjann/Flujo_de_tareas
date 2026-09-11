"use client";

import GuestDashboardWrapper from "@/components/guest/GuestDashBoardWrapper";
import GuestHeader from "@/components/layout/GuestHeader";
import { GuestTasksProvider } from "@/components/providers/GuestTasksProvider";

export default function GuestPageClient() {
  return (
    <GuestTasksProvider>
      <div className="min-h-screen bg-background">
        <GuestHeader />

        <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <GuestDashboardWrapper />
        </main>
      </div>
    </GuestTasksProvider>
  );
}