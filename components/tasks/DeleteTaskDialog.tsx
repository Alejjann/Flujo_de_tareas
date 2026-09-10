"use client";

import {
  AlertTriangle,
  LoaderCircle,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { deleteTask } from "@/actions/deleteTasks";
import { useGuestTasks } from "@/components/providers/GuestTasksProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface DeleteTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  taskId: string;
  taskTitle: string;
  onDeleted?: () => void;
  guestMode?: boolean;
}

export default function DeleteTaskDialog({
  open,
  onOpenChange,
  taskId,
  taskTitle,
  onDeleted,
  guestMode = false,
}: DeleteTaskDialogProps) {
  const { t } = useLanguage();
  const router = useRouter();

  /*
   * En /guest contiene deleteTask().
   * En /dashboard es null y no se usa porque guestMode es false.
   */
  const guestTasks = useGuestTasks();

  const [isDeleting, setIsDeleting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    if (isDeleting) {
      return;
    }

    onOpenChange(nextOpen);
  }

  async function handleDelete() {
    if (isDeleting) {
      return;
    }

    setIsDeleting(true);

    try {
      if (guestMode) {
        if (!guestTasks) {
          throw new Error(
            "GuestTasksProvider no está disponible en modo invitado."
          );
        }

        guestTasks.deleteTask(taskId);

        toast.success(t.messages.deleteSuccess);

        onDeleted?.();
        onOpenChange(false);

        /*
         * No se usa router.refresh() aquí:
         * al actualizar el provider, React redibuja el dashboard invitado.
         */
        return;
      }

      await deleteTask(taskId);

      toast.success(t.messages.deleteSuccess);

      onDeleted?.();
      onOpenChange(false);

      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t.messages.deleteError);
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="w-[calc(100%-2rem)] rounded-2xl border border-border bg-popover p-5 text-popover-foreground shadow-2xl sm:max-w-md sm:p-6">
        <DialogHeader>
          <div className="ui-icon-box ui-icon-danger mb-3 h-12 w-12 rounded-2xl">
            <AlertTriangle size={24} />
          </div>

          <DialogTitle className="text-xl font-bold tracking-tight text-foreground">
            {t.tasks.deleteTitle}
          </DialogTitle>

          <DialogDescription className="pt-1 text-sm leading-6 text-muted-foreground">
            {t.tasks.deleteDescription}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-1 rounded-xl border border-border bg-secondary/40 px-4 py-3">
          <p className="line-clamp-2 text-sm font-semibold text-foreground">
            {taskTitle}
          </p>
        </div>

        <div className="mt-2 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            type="button"
            variant="outline"
            disabled={isDeleting}
            onClick={() => onOpenChange(false)}
            className="ui-button-secondary w-full sm:w-auto"
          >
            {t.common.cancel}
          </Button>

          <Button
            type="button"
            disabled={isDeleting}
            onClick={handleDelete}
            className="ui-button-danger w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <LoaderCircle
                  size={17}
                  className="animate-spin"
                />
                {t.tasks.deleting}
              </>
            ) : (
              <>
                <Trash2 size={17} />
                {t.tasks.deleteTask}
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}