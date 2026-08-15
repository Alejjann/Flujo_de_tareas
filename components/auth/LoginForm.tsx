import { useState } from "react";
import { loginUser } from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (loading) return;

    setError("");
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const result = await loginUser(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }
    } catch (error) {
      console.error("ERROR LOGIN:", error);

      setError("Correo o contraseña incorrectos.");
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full max-w-md space-y-4 rounded-2xl border border-slate-800 bg-slate-900 p-8"
    >
      <h1 className="text-3xl font-bold text-white">
        Iniciar sesión
      </h1>

      {/* MENSAJE DE ERROR */}

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
        className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
      />

      <Input
        type="password"
        name="password"
        placeholder="ContraseÃ±a"
        autoComplete="current-password"
        required
        disabled={loading}
        className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500"
      />

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-cyan-500 text-slate-950 hover:bg-cyan-400 disabled:opacity-50"
      >
        {loading
          ? "Iniciando sesiÃ³n..."
          : "Iniciar sesiÃ³n"}
      </Button>

      <p className="text-center text-sm text-slate-400">
        ÂÂ¿No tienes una cuenta?{" "}

        <Link
          href="/register"
          className="font-medium text-cyan-400 hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </form>
  );
}
