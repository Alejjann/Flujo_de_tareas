"use client";

import { useRef, useState } from "react";
import { Camera, Loader2 } from "lucide-react";
import { updateBanner } from "@/actions/updateBanner";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function BannerUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const { t } = useLanguage();

  async function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      toast.error("Selecciona una imagen válida.");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("La imagen no puede superar los 10 MB.");
      return;
    }

    const formData = new FormData();
    formData.append("banner", file);

    setLoading(true);

    try {
      await updateBanner(formData);

      toast.success("Banner actualizado correctamente.");

      window.location.reload();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo actualizar el banner.");
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
        onChange={handleChange}
      />

      <button
        type="button"
        disabled={loading}
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-xl border border-white/30 bg-black/45 px-4 py-2 text-sm font-semibold text-white backdrop-blur-md transition hover:bg-black/65 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            {t.common.loading}
          </>
        ) : (
          <>
            <Camera size={16} />
            {t.profile.changeBanner}
          </>
        )}
      </button>
    </>
  );
}