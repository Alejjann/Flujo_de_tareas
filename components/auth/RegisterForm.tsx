"use client";

import { useState } from "react";
import { registerUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { toast } from "sonner";

export default function RegisterForm() {
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    if (loading) {
      return;
    }

    const name = String(formData.get("name") ?? "").trim();
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();
    const password = String(formData.get("password") ?? "");

    if (!name) {
      toast.error("Introduce tu nombre.");
      return;
    }

    if (!email) {
      toast.error("Introduce tu correo electrónico.");
      return;
    }

    if (!password) {
      toast.error("Introduce una contraseña.");
      return;
    }

    if (password.length < 6) {
      toast.error(
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    setLoading(true);

    try {
      await registerUser(formData);
    } catch (error) {
      console.error("ERROR REGISTRANDO USUARIO:", error);

      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo crear la cuenta."
      );

      setLoading(false);
    }
  }

  return (
    <form
      action={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl shadow-black/30"
    >
      <h1 className="text-3xl font-bold text-white">
        Crear cuenta
      </h1>

      <Input
        name="name"
        placeholder="Nombre"
        autoComplete="name"
        disabled={loading}
        className="border-slate-700 !bg-slate-950 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/30"
        required
      />

      <Input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        autoComplete="email"
        disabled={loading}
        className="border-slate-700 !bg-slate-950 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/30"
        required
      />

      <Input
        type="password"
        name="password"
        placeholder="Contraseña"
        disabled={loading}
        minLength={6}
        autoComplete="new-password"
        className="border-slate-700 !bg-slate-950 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/30"
        required
      />

      <p className="text-xs text-slate-500">
        La contraseña debe tener al menos 6 caracteres.
      </p>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Creando cuenta..." : "Registrarse"}
      </Button>

      <p className="text-center text-sm text-slate-400">
        ¿Ya tienes una cuenta?{" "}
        <Link
          href="/login"
          className="font-semibold text-cyan-400 transition hover:text-cyan-300 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </form>
  );
}