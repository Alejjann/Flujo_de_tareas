"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { updateTask } from "@/actions/updateTasks";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  tag: string | null;
}

export default function EditTaskDialog({
  open,
  onOpenChange,
  id,
  title,
  description,
  priority,
  dueDate,
  tag,
}: EditTaskDialogProps) {
  const [currentTag, setCurrentTag] = useState(
    tag &&
    !["Trabajo", "Estudios", "Personal", "Casa"].includes(tag)
      ? "CUSTOM"
      : tag || "Personal"
  );

  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      await updateTask(formData);

      toast.success("Cambios guardados correctamente");

      onOpenChange(false);

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("No se pudieron guardar los cambios");
    }
  }

  const isCustom =
    currentTag === "CUSTOM";

  const customValue =
    tag &&
    !["Trabajo", "Estudios", "Personal", "Casa"].includes(tag)
      ? tag
      : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-slate-700 bg-slate-950 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Editar tarea
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">

          <input
            type="hidden"
            name="id"
            value={id}
          />

          {/* TÍTULO */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Título
            </label>

            <Input
              name="title"
              defaultValue={title}
              placeholder="Título..."
              className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-500"
              required
            />
          </div>

          {/* DESCRIPCIÓN */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Descripción
            </label>

            <Textarea
              name="description"
              defaultValue={description || ""}
              placeholder="Descripción..."
              rows={6}
              className="resize-y border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-500"
            />
          </div>

          {/* PRIORIDAD */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Prioridad
            </label>

            <select
              name="priority"
              defaultValue={priority}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-cyan-500"
            >
              <option value="LOW">🟢 Baja</option>
              <option value="MEDIUM">🟡 Media</option>
              <option value="HIGH">🔴 Alta</option>
            </select>
          </div>

          {/* ETIQUETA */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Etiqueta
            </label>

            <select
              name="tag"
              value={currentTag}
              onChange={(e) =>
                setCurrentTag(e.target.value)
              }
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-cyan-500"
            >
              <option value="Trabajo">💼 Trabajo</option>
              <option value="Estudios">📚 Estudios</option>
              <option value="Personal">❤️ Personal</option>
              <option value="Casa">🏠 Casa</option>
              <option value="CUSTOM">✨ Personalizada</option>
            </select>
          </div>

          {/* PERSONALIZADA */}
          {isCustom && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Nombre de la etiqueta
              </label>

              <Input
                name="customTag"
                defaultValue={customValue}
                placeholder="Nombre de tu etiqueta..."
                className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-500"
                required
              />
            </div>
          )}

          {/* FECHA */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Fecha límite
            </label>

            <Input
              type="date"
              name="dueDate"
              defaultValue={
                dueDate
                  ? new Date(dueDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="border-slate-700 bg-slate-900 text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-500 font-semibold text-white hover:bg-cyan-400"
          >
            Guardar cambios
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}