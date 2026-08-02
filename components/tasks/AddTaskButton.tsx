"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTask } from "@/actions/createTask";
import { useState } from "react";
import { toast } from "sonner";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AddTaskButton() {
  const [open, setOpen] = useState(false);

  async function handleSubmit(formData: FormData) {
    await createTask(formData);

    toast.success("✅ Tarea creada correctamente");

    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2">
            <Plus size={18} />
            Nueva tarea
          </Button>
        }
      />

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-4">
          <Input
            name="title"
            placeholder="Título"
          />

          <Textarea
            name="description"
            placeholder="Descripción..."
            rows={5}
          />

          <Select
            name="priority"
            defaultValue="MEDIUM"
          >
            <SelectTrigger>
              <SelectValue placeholder="Prioridad" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="LOW">🟢 Baja</SelectItem>
              <SelectItem value="MEDIUM">🟡 Media</SelectItem>
              <SelectItem value="HIGH">🔴 Alta</SelectItem>
            </SelectContent>
          </Select>

          <Select
            name="tag"
            defaultValue="Personal"
          >
            <SelectTrigger>
              <SelectValue placeholder="Etiqueta" />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Trabajo">💼 Trabajo</SelectItem>
              <SelectItem value="Estudios">📚 Estudios</SelectItem>
              <SelectItem value="Personal">❤️ Personal</SelectItem>
              <SelectItem value="Casa">🏠 Casa</SelectItem>
            </SelectContent>
          </Select>

          <Input
            type="date"
            name="dueDate"
          />

          <Button
            type="submit"
            className="w-full"
          >
            Crear tarea
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}