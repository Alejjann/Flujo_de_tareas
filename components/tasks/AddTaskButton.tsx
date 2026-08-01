"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTask } from "@/actions/createTask";
import { useState } from "react";
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
        <Select name="priority" defaultValue="MEDIUM">
        <SelectTrigger>
            <SelectValue placeholder="Prioridad" />
        </SelectTrigger>

        <SelectContent>
            <SelectItem value="LOW">🟢 Baja</SelectItem>
            <SelectItem value="MEDIUM">🟡 Media</SelectItem>
            <SelectItem value="HIGH">🔴 Alta</SelectItem>
        </SelectContent>
        </Select>
        
        <Input
            type="date"
            name="dueDate"
            />

        <Button type="submit" className="w-full">
          Crear tarea
        </Button>

      </form>
      </DialogContent>
    </Dialog>
  );
}