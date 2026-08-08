"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { updateProfileMedia } from "@/actions/updateProfileMedia";

interface Props {
  type: "avatar" | "banner";
}

export default function ProfileMediaButtons({
  type,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  async function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona una imagen válida");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 5 MB");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);
      formData.append("type", type);

      await updateProfileMedia(formData);

      toast.success(
        type === "avatar"
          ? "Foto de perfil actualizada"
          : "Banner actualizado"
      );

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar la imagen");
    } finally {
      setLoading(false);

      if (inputRef.current) {
        inputRef.current.value = "";
      }
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={loading}
        className={
          type === "banner"
            ? "inline-flex items-center gap-2 rounded-xl border border-white/20 bg-black/40 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/60 disabled:opacity-50"
            : "flex h-10 w-10 items-center justify-center rounded-full border-2 border-slate-900 bg-slate-800 text-white shadow-lg transition hover:bg-cyan-500 disabled:opacity-50"
        }
        title={
          type === "avatar"
            ? "Cambiar foto de perfil"
            : "Cambiar banner"
        }
      >
        {loading ? (
          <Loader2
            size={type === "banner" ? 16 : 18}
            className="animate-spin"
          />
        ) : (
          <Camera
            size={type === "banner" ? 16 : 18}
          />
        )}

        {type === "banner" && (
          <span>
            Cambiar banner
          </span>
        )}
      </button>
    </>
  );
}