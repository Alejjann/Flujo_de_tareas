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


interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;

  id: string;
  title: string;
  description: string;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
}
export default function EditTaskDialog({
  open,
  onOpenChange,
  id,
  title,
  description,
  priority,
  dueDate,
}: EditTaskDialogProps) {
    async function handleSubmit(formData: FormData) {
    await updateTask(formData);
    onOpenChange(false);
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>
        

                <form action={handleSubmit} className="space-y-4">

            <input
                type="hidden"
                name="id"
                defaultValue={id}
            />

            <Input
                name="title"
                defaultValue={title}
                placeholder="Título"
            />

            <Textarea
                name="description"
                defaultValue={description}
                placeholder="Descripción"
                rows={5}
            />

            <select
            name="priority"
            defaultValue={priority}
            className="w-full rounded-lg border border-slate-700  p-2"
            >
            <option value="LOW">🟢 Baja</option>
            <option value="MEDIUM">🟡 Media</option>
            <option value="HIGH">🔴 Alta</option>
            </select>

            <Input
            type="date"
            name="dueDate"
            defaultValue={
                dueDate
                ? new Date(dueDate).toISOString().split("T")[0]
                : ""
            }
            ></Input>

            <Button
                type="submit"
                className="w-full"
            >
                Guardar cambios
            </Button>

            </form>
      </DialogContent>
    </Dialog>
  );
}