"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTask } from "@/actions/createTask";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AddTaskButton() {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("Personal");
  const router = useRouter();

  async function handleSubmit(formData: FormData) {
    try {
      await createTask(formData);

      toast.success("Tarea creada correctamente");

      setOpen(false);

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error("No se pudo crear la tarea");
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button className="gap-2 bg-cyan-500 text-white hover:bg-cyan-400">
          <Plus size={18} />
          Nueva tarea
        </Button>
      </DialogTrigger>

      <DialogContent className="max-h-[90vh] overflow-y-auto border border-slate-700 bg-slate-950 text-white sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Nueva tarea
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">

          {/* TÍTULO */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">
              Título
            </label>

            <Input
              name="title"
              placeholder="Escribe el título de la tarea..."
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
              placeholder="Describe la tarea..."
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
              defaultValue="MEDIUM"
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
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="h-10 w-full rounded-md border border-slate-700 bg-slate-900 px-3 text-sm text-white outline-none transition focus:border-cyan-500"
            >
              <option value="Trabajo">💼 Trabajo</option>
              <option value="Estudios">📚 Estudios</option>
              <option value="Personal">❤️ Personal</option>
              <option value="Casa">🏠 Casa</option>
              <option value="CUSTOM">✨ Personalizada</option>
            </select>
          </div>

          {/* ETIQUETA PERSONALIZADA */}
          {tag === "CUSTOM" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Nombre de la etiqueta
              </label>

              <Input
                name="customTag"
                placeholder="Ej: Gimnasio, Viaje, Proyecto..."
                className="border-slate-700 bg-slate-900 text-white placeholder:text-slate-500 focus:border-cyan-500"
                required
              />

              <p className="mt-2 text-xs text-slate-500">
                Puedes escribir cualquier etiqueta que quieras.
              </p>
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
              className="border-slate-700 bg-slate-900 text-white"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-cyan-500 font-semibold text-white hover:bg-cyan-400"
          >
            Crear tarea
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}