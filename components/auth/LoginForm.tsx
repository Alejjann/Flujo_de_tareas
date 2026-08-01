"use client";

import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginForm() {
  return (
    <form
      action={loginUser}
      className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8"
    >
      <h1 className="text-3xl font-bold text-white">
        Iniciar sesión
      </h1>

      <Input
        type="email"
        name="email"
        placeholder="Correo"
      />

      <Input
        type="password"
        name="password"
        placeholder="Contraseña"
      />

      <Button
        type="submit"
        className="w-full"
      >
        Entrar
      </Button>
    </form>
  );
}