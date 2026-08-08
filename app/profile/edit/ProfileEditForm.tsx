"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Save, User, Mail } from "lucide-react";
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
  const [loading, setLoading] = useState(false);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      await updateProfile(formData);

      toast.success("Perfil actualizado correctamente");
    } catch (error) {
      console.error(error);

      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo actualizar el perfil"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-8">

        <Link
          href="/profile"
          className="mb-8 inline-flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-sm text-slate-300 transition hover:border-cyan-500 hover:text-white"
        >
          <ArrowLeft size={18} />
          Volver al perfil
        </Link>

        <div className="rounded-3xl border border-slate-800 bg-slate-900 p-6 shadow-2xl md:p-8">

          <div className="mb-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-500/10 text-cyan-400">
              <User size={28} />
            </div>

            <h1 className="mt-5 text-3xl font-bold">
              Editar perfil
            </h1>

            <p className="mt-2 text-slate-400">
              Modifica la información de tu cuenta.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            <div>
              <label
                htmlFor="name"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Nombre
              </label>

              <div className="relative">
                <User
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="name"
                  name="name"
                  type="text"
                  defaultValue={name ?? ""}
                  placeholder="Tu nombre"
                  className="w-full rounded-xl border border-slate-700 bg-slate-950 py-3 pl-11 pr-4 text-white outline-none transition placeholder:text-slate-600 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-slate-300"
              >
                Correo electrónico
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                />

                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={email}
                  disabled
                  className="w-full cursor-not-allowed rounded-xl border border-slate-800 bg-slate-950/50 py-3 pl-11 pr-4 text-slate-500 outline-none"
                />
              </div>

              <p className="mt-2 text-xs text-slate-600">
                El correo electrónico no se puede modificar.
              </p>
            </div>

            <div className="flex flex-col gap-3 pt-4 sm:flex-row">

              <Link
                href="/profile"
                className="flex-1 rounded-xl border border-slate-700 px-5 py-3 text-center font-semibold text-slate-300 transition hover:border-slate-500 hover:bg-slate-800"
              >
                Cancelar
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save size={18} />

                {loading
                  ? "Guardando..."
                  : "Guardar cambios"}
              </button>

            </div>

          </form>
        </div>
      </div>
    </main>
  );
}