import Link from "next/link";
import AuthCard from "@/components/auth/AuthCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { loginUser } from "@/actions/auth";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-6">
      <AuthCard
        title="Iniciar sesión"
        subtitle="Accede a tu espacio de trabajo"
      >
        <form action={loginUser} className="space-y-5">
          <Input
  type="email"
  name="email"
  placeholder="Correo electrónico"
  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
/>

<Input
  type="password"
  name="password"
  placeholder="Contraseña"
  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
/>

      

         <Button
  type="submit"
  className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400"
>
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