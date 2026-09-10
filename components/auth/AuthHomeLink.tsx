// components/auth/AuthHomeLink.tsx
"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function AuthHomeLink() {
  return (
    <Link
      href="/"
      className="mb-8 inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <ArrowLeft size={16} />
      Volver a la página principal
    </Link>
  );
}