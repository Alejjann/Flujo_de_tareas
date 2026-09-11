import { Suspense } from "react";

import ResetPasswordContent from "./ResetPasswordContent";

function ResetPasswordLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#07101f] px-4 text-white">
      <div className="rounded-2xl border border-white/10 bg-[#13233a] px-6 py-5 text-sm font-semibold text-slate-300 shadow-xl">
        Cargando recuperación de cuenta...
      </div>
    </main>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<ResetPasswordLoading />}>
      <ResetPasswordContent />
    </Suspense>
  );
}