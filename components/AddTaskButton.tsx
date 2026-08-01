"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTask } from "@/actions/createTask";

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
  return (
    <Dialog>
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

        <form action={createTask} className="space-y-4">
        <Input
          name="title"
          placeholder="Título"
        />

        <Textarea
          name="description"
          placeholder="Descripción..."
          rows={5}
        />

        <Button type="submit" className="w-full">
          Crear tarea
        </Button>
        
      </form>
      </DialogContent>
    </Dialog>
  );
}