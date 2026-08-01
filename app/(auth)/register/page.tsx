import AuthCard from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function RegisterPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <AuthCard
        title="Crear cuenta"
        subtitle="Empieza a organizar tu trabajo con TaskFlow"
      >
        <form className="space-y-4">
          <Input
            placeholder="Nombre completo"
            name="name"
          />

          <Input
            type="email"
            placeholder="Correo electrónico"
            name="email"
          />

          <Input
            type="password"
            placeholder="Contraseña"
            name="password"
          />

          <Button className="w-full">
            Crear cuenta
          </Button>

        <p className="text-center text-sm text-slate-400">
  ¿Ya tienes una cuenta?{" "}
  <Link
    href="/login"
    className="font-medium text-cyan-400 hover:underline"
  >
    Inicia sesión
  </Link>
</p>

        </form>
      </AuthCard>
    </main>
  );
}