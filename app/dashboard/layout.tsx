import type { Metadata } from "next";
import LanguageProvider from "@/components/providers/LanguageProvider";

export const metadata: Metadata = {
  title: "FlowDesk",
  description: "Gestiona tus tareas y mejora tu productividad.",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <LanguageProvider>{children}</LanguageProvider>;
}