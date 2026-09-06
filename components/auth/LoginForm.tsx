"use client";

import { useState } from "react";
import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const result = await loginUser(formData);

      if (result?.error) {
        setError(result.error);
        return;
      }
    } catch (error) {
      console.error("ERROR LOGIN:", error);

      setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-5 rounded-2xl border border-slate-800 bg-slate-900 p-8 text-white shadow-2xl shadow-black/30"
    >
      <div className="space-y-2">
        <h1 className="text-center text-3xl font-bold text-white">
          Iniciar sesión
        </h1>

        <p className="text-center text-sm text-slate-400">
          Accede a tu espacio de trabajo
        </p>
      </div>

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm font-medium text-red-400"
        >
          ⚠️ {error}
        </div>
      )}

      <Input
        type="email"
        name="email"
        placeholder="Correo electrónico"
        autoComplete="email"
        required
        disabled={loading}
        className="h-11 border-slate-700 !bg-slate-950 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/30"
      />

      <Input
        type="password"
        name="password"
        placeholder="Contraseña"
        autoComplete="current-password"
        required
        disabled={loading}
        className="h-11 border-slate-700 !bg-slate-950 text-white placeholder:text-slate-500 focus:border-cyan-500 focus:ring-cyan-500/30"
      />

      <Link
        href="/forgot-password"
        className="block text-sm font-medium text-cyan-400 transition hover:text-cyan-300 hover:underline"
      >
        ¿Has olvidado tu contraseña?
      </Link>

      <Button
        type="submit"
        disabled={loading}
        className="h-11 w-full bg-cyan-500 font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Iniciando sesión..." : "Iniciar sesión"}
      </Button>

      <p className="text-center text-sm text-slate-400">
        ¿No tienes una cuenta?{" "}
        <Link
          href="/register"
          className="font-semibold text-cyan-400 transition hover:text-cyan-300 hover:underline"
        >
          Regístrate
        </Link>
      </p>
    </form>
  );
}