"use client";

import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginForm() {
  return (
    <form action={loginUser} className="space-y-5">
      <div>
        <h1 className="text-3xl font-bold text-white">
          Iniciar sesión
        </h1>

        <p className="mt-2 text-slate-400">
          Accede a tu espacio de trabajo
        </p>
      </div>

      {/* CORREO */}
      <Input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        required
        className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
      />

      {/* CONTRASEÑA */}
      <Input
        type="password"
        name="password"
        placeholder="Contraseña"
        required
        className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
      />

      {/* ¿HAS OLVIDADO LA CONTRASEÑA? */}
      <div className="flex justify-end -mt-2">
        <Link
          href="/forgot-password"
          className="text-sm text-cyan-400 transition hover:text-cyan-300"
        >
          ¿Has olvidado tu contraseña?
        </Link>
      </div>

      {/* BOTÓN */}
      <Button
        type="submit"
        className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400"
      >
        Iniciar sesión
      </Button>

      {/* REGISTRO */}
      <p className="text-center text-sm text-slate-400">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="text-cyan-400 hover:text-cyan-300"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}