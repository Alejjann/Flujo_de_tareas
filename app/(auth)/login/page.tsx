import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <AuthCard
        title="Iniciar sesión"
        subtitle="Accede a tu espacio de trabajo"
      >
        <form className="space-y-5">
          <Input
            type="email"
            placeholder="Correo electrónico"
          />

          <Input
            type="password"
            placeholder="Contraseña"
          />

          <Button className="w-full">
            Iniciar sesión
          </Button>

          <p className="text-center text-sm text-slate-400">
            ¿No tienes una cuenta?{" "}
            <Link
              href="/register"
              className="font-medium text-cyan-400 hover:underline"
            >
              Regístrate
            </Link>
          </p>
        </form>
      </AuthCard>
    </main>
  );
}