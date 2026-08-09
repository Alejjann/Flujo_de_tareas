"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { updateProfile } from "@/actions/updateProfile";
import { toast } from "sonner";

interface ProfileEditFormProps {
  name: string | null;
  email: string;
}

export default function ProfileEditForm({
  name,
  email,
}: ProfileEditFormProps) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: name || "",
    email: email || "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = e.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

 async function handleSubmit() {
  if (loading) return;

    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    // -----------------------------
    // VALIDACIONES
    // -----------------------------

    if (!cleanName) {
      toast.error("El nombre no puede estar vacío.");
      return;
    }

    if (!cleanEmail) {
      toast.error("El correo no puede estar vacío.");
      return;
    }

    if (password && password.length < 6) {
      toast.error(
        "La contraseña debe tener al menos 6 caracteres."
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

    try {
      console.log("1. Enviando datos...");

      const formData = new FormData();

      formData.set("name", cleanName);
      formData.set("email", cleanEmail);

      if (password) {
        formData.set("password", password);
      }

      console.log(
        "2. Ejecutando updateProfile..."
      );

      await updateProfile(formData);

      console.log(
        "3. Perfil actualizado correctamente"
      );

      // LIMPIAR CONTRASEÑAS
      setForm((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));

      // Mostrar mensaje
      toast.success(
        "Perfil actualizado correctamente."
      );

      // Ir al perfil
      router.push("/profile");
    } catch (error) {
      console.error(
        "ERROR ACTUALIZANDO PERFIL:",
        error
      );

      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el perfil."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-8">

        {/* CABECERA */}

        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-white"
          >
            <ArrowLeft size={18} />
            Volver al perfil
          </Link>
        </div>

        {/* FORMULARIO */}

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">

          <div className="mb-8">
            <h1 className="text-center text-3xl font-bold">
              Editar perfil
            </h1>
          </div>

        
            {/* INFORMACIÓN PERSONAL */}

            <section>
              <div className="mb-5">
                <h2 className="text-xl font-bold">
                  Información personal
                </h2>
              </div>

              <div className="space-y-5">

                {/* NOMBRE */}

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <User
                      size={17}
                      className="text-cyan-400"
                    />
                    Nombre
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Tu nombre"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

                {/* EMAIL */}

                <div>
                  <label className="mb-2 flex items-center gap-2 text-sm font-medium text-slate-300">
                    <Mail
                      size={17}
                      className="text-cyan-400"
                    />
                    Correo electrónico
                  </label>

                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="correo@ejemplo.com"
                    disabled={loading}
                    className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />
                </div>

              </div>
            </section>

            {/* CONTRASEÑA */}

            <section className="border-t border-slate-800 pt-8">

              <div className="mb-5">
                <h2 className="flex items-center gap-2 text-xl font-bold">
                  <Lock
                    size={20}
                    className="text-cyan-400"
                  />
                  Cambiar contraseña
                </h2>
              </div>

              <div className="space-y-5">

                {/* NUEVA CONTRASEÑA */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Nueva contraseña
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showPassword
                          ? "text"
                          : "password"
                      }
                      name="password"
                      value={form.password}
                      onChange={handleChange}
                      placeholder="Nueva contraseña"
                      disabled={loading}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>
                </div>

                {/* CONFIRMAR CONTRASEÑA */}

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-300">
                    Confirmar nueva contraseña
                  </label>

                  <div className="relative">

                    <input
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder="Repite la nueva contraseña"
                      disabled={loading}
                      autoComplete="new-password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-950 px-4 py-3 pr-12 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 transition hover:text-white"
                    >
                      {showConfirmPassword ? (
                        <EyeOff size={19} />
                      ) : (
                        <Eye size={19} />
                      )}
                    </button>

                  </div>
                </div>

              </div>
            </section>

            {/* BOTONES */}

            <div className="flex flex-col-reverse gap-3 border-t border-slate-800 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-xl border border-slate-700 px-5 py-3 font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white"
              >
                Cancelar
              </Link>

              <button
                type="button"
                onClick={() => {
                  console.log("CLICK EN GUARDAR");
                  handleSubmit();
                }}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-500 px-6 py-3 font-semibold text-slate-950 transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} />

                {loading
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>

            </div>

        </div>
      </div>
    </main>
  );
}