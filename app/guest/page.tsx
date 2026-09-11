import { Suspense } from "react";

import GuestPageClient from "./GuestPageClient";

function GuestPageLoading() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl items-center justify-center px-4 py-8 sm:px-6 lg:px-8">
        <div className="ui-card-main flex min-h-40 w-full max-w-md items-center justify-center p-6">
          <p className="text-sm font-semibold text-muted-foreground">
            Cargando página de prueba...
          </p>
        </div>
      </div>
    </main>
  );
}

export default function GuestPage() {
  return (
    <Suspense fallback={<GuestPageLoading />}>
      <GuestPageClient />
    </Suspense>
  );
}