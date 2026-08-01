"use client";

import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function RegisterForm() {
  return (
    <form
      action={registerUser}
      className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8"
    >
      <h1 className="text-3xl font-bold text-white">
        Crear cuenta
      </h1>

    <Input
  name="name"
  placeholder="Nombre"
  className="bg-slate-900 border-slate-700 text-white placeholder:text-slate-500"
/>

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
        Registrarse
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
  );
}