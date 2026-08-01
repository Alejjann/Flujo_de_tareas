"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

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

        <form className="space-y-4">
          <Input placeholder="Título" />

          <Textarea
            placeholder="Descripción..."
            rows={5}
          />

          <Button className="w-full">
            Crear tarea
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}