"use client";

import { useState } from "react";
import {
  useSearchParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";
import {
  Lock,
  Save,
  Eye,
  EyeOff,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { resetPassword } from "@/actions/resetPassword";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    console.log("1. BOTÓN PULSADO");

    if (loading) {
      return;
    }

    if (!token) {
      toast.error(
        "El enlace de recuperación no es válido."
      );
      return;
    }

    if (!password) {
      toast.error(
        "Introduce una nueva contraseña."
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    if (!confirmPassword) {
      toast.error(
        "Confirma la nueva contraseña."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        "Las contraseñas no coinciden."
      );
      return;
    }

    setLoading(true);

    console.log("2. VALIDACIÓN CORRECTA");
    console.log("3. ENVIANDO AL SERVIDOR");

    try {
      const result = await resetPassword(
        token,
        password
      );

      console.log("4. RESPUESTA:", result);

      if (!result?.success) {
        throw new Error(
          "No se pudo actualizar la contraseña."
        );
      }

      toast.success(
        "Contraseña actualizada correctamente."
      );

      setPassword("");
      setConfirmPassword("");

      setTimeout(() => {
        router.push("/login");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error(
        "ERROR CAMBIANDO CONTRASEÑA:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo cambiar la contraseña."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-md">

        {/* VOLVER */}

        <div className="mb-6">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Volver al inicio de sesión
          </Link>
        </div>

        {/* CARD */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-2xl">

          {/* CABECERA */}

          <div className="mb-8 text-center">

            <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10">
              <Lock
                size={28}
                className="text-cyan-400"
              />
            </div>

            <h1 className="text-3xl font-bold">
              Nueva contraseña
            </h1>

            <p className="mt-3 text-sm text-slate-400">
              Introduce una nueva contraseña
              para tu cuenta de FlowDesk.
            </p>

          </div>

          {/* SIN TOKEN */}

          {!token ? (

            <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-center text-sm text-red-400">
              El enlace de recuperación no es
              válido o está incompleto.
            </div>

          ) : (

            <div className="space-y-5">

              {/* NUEVA CONTRASEÑA */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Nueva contraseña
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(e) =>
                      setPassword(
                        e.target.value
                      )
                    }
                    placeholder="Nueva contraseña"
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        !showPassword
                      )
                    }
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* CONFIRMAR */}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-300">
                  Confirmar contraseña
                </label>

                <div className="relative">

                  <Lock
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />

                  <input
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(e) =>
                      setConfirmPassword(
                        e.target.value
                      )
                    }
                    placeholder="Repite la contraseña"
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        !showConfirmPassword
                      )
                    }
                    disabled={loading}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>

                </div>
              </div>

              {/* BOTÓN */}

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} />

                {loading
                  ? "Guardando..."
                  : "Cambiar contraseña"}
              </button>

            </div>
          )}

        </div>

        {/* FOOTER */}

        <p className="mt-6 text-center text-xs text-slate-600">
          © {new Date().getFullYear()} FlowDesk
        </p>

      </div>
    </main>
  );
}