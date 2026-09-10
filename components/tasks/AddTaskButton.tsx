"use client";

import {
  AlignLeft,
  CalendarDays,
  Flag,
  Folder,
  LoaderCircle,
  Plus,
  Tag,
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createTask } from "@/actions/createTask";
import { useGuestTasks } from "@/components/providers/GuestTasksProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type AddTaskButtonProps = {
  variant?: "default" | "floating";
  guestMode?: boolean;
};

export default function AddTaskButton({
  variant = "default",
  guestMode = false,
}: AddTaskButtonProps) {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("Personal");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();
  const { t } = useLanguage();

  /*
   * En /guest contiene la API local.
   * En /dashboard devuelve null, por lo que no rompe el dashboard real.
   */
  const guestTasks = useGuestTasks();

  const isFloating = variant === "floating";

  const fieldClassName =
    "mt-2 w-full min-w-0 max-w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";

  function openDatePicker(input: HTMLInputElement | null) {
    if (!input) {
      return;
    }

    try {
      input.showPicker?.();
    } catch {
      input.focus();
    }
  }

  function handleDialogChange(nextOpen: boolean) {
    if (isCreating) {
      return;
    }

    setOpen(nextOpen);

    if (!nextOpen) {
      setTag("Personal");
    }
  }

  async function handleSubmit(formData: FormData) {
    if (isCreating) {
      return;
    }

    setIsCreating(true);

    try {
      const title = String(formData.get("title") ?? "").trim();

      const descriptionValue = String(
        formData.get("description") ?? ""
      ).trim();

      const priority = formData.get("priority") as
        | "LOW"
        | "MEDIUM"
        | "HIGH";

      const dueDateValue = String(
        formData.get("dueDate") ?? ""
      ).trim();

      const selectedTag = String(formData.get("tag") ?? "");
      const customTag = String(
        formData.get("customTag") ?? ""
      ).trim();

      const finalTag =
        selectedTag === "CUSTOM"
          ? customTag || null
          : selectedTag || null;

      if (guestMode) {
        /*
         * Si aparece este error en /guest, significa que falta envolver
         * app/guest/page.tsx con <GuestTasksProvider>.
         */
        if (!guestTasks) {
          throw new Error(
            "GuestTasksProvider no está disponible en modo invitado."
          );
        }

        guestTasks.createTask({
          title,
          description: descriptionValue || null,
          priority,
          dueDate: dueDateValue || null,
          tag: finalTag,
          status: "PENDING",
          completed: false,
        });

        toast.success(t.createTask.success);

        setOpen(false);
        setTag("Personal");

        /*
         * No uses router.refresh() aquí.
         * El provider actualiza las tareas y React redibuja el dashboard.
         */
        return;
      }

      await createTask(formData);

      toast.success(t.createTask.success);

      setOpen(false);
      setTag("Personal");

      router.replace("/dashboard");
    } catch (error) {
      console.error(error);
      toast.error(t.createTask.error);
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogTrigger
        render={
          isFloating ? (
            <Button
              type="button"
              className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-50 h-14 rounded-2xl bg-primary px-5 text-primary-foreground shadow-xl shadow-primary/30 transition-all duration-200 hover:scale-[1.03] hover:bg-primary/90 hover:shadow-2xl hover:shadow-primary/40 active:scale-[0.98] sm:bottom-6 sm:right-6 sm:h-12 sm:px-5"
              aria-label={t.tasks.newTask}
              title={t.tasks.newTask}
            >
              <Plus size={21} strokeWidth={2.5} />

              <span className="ml-1 hidden text-sm font-bold sm:inline">
                {t.tasks.newTask}
              </span>
            </Button>
          ) : (
            <Button
              type="button"
              className="ui-button-primary w-full sm:w-auto"
            >
              <Plus size={18} />
              {t.tasks.newTask}
            </Button>
          )
        }
      />

      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl shadow-slate-950/20 sm:w-[760px] sm:max-w-[calc(100vw-4rem)]">
        <DialogHeader className="shrink-0 border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-info/5 px-5 py-5 pr-12 sm:px-6 sm:py-6">
          <DialogTitle className="break-words text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
            {t.createTask.title}
          </DialogTitle>

          <DialogDescription className="mt-1 max-w-2xl break-words text-sm leading-6 text-muted-foreground">
            {t.createTask.descriptionLabel}
          </DialogDescription>
        </DialogHeader>

        <form
          action={handleSubmit}
          className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-6"
        >
          <fieldset
            disabled={isCreating}
            className="min-w-0 space-y-5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div className="min-w-0">
              <label
                htmlFor="task-title"
                className="ui-label-icon"
              >
                <Tag size={16} className="text-primary" />
                {t.createTask.titleLabel}
              </label>

              <Input
                id="task-title"
                name="title"
                placeholder={t.createTask.titlePlaceholder}
                className={`${fieldClassName} break-words [overflow-wrap:anywhere]`}
                required
                autoFocus
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor="task-description"
                className="ui-label-icon"
              >
                <AlignLeft
                  size={16}
                  className="text-muted-foreground"
                />
                {t.createTask.descriptionLabel}
              </label>

              <Textarea
                id="task-description"
                name="description"
                placeholder={t.createTask.descriptionPlaceholder}
                rows={5}
                className={`${fieldClassName} min-h-[120px] resize-y break-words leading-6 [overflow-wrap:anywhere]`}
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="min-w-0">
                <label
                  htmlFor="task-priority"
                  className="ui-label-icon"
                >
                  <Flag size={16} className="text-warning" />
                  {t.createTask.priorityLabel}
                </label>

                <select
                  id="task-priority"
                  name="priority"
                  defaultValue="MEDIUM"
                  className={`${fieldClassName} cursor-pointer appearance-none`}
                >
                  <option value="LOW">{t.priority.low}</option>
                  <option value="MEDIUM">
                    {t.priority.medium}
                  </option>
                  <option value="HIGH">{t.priority.high}</option>
                </select>
              </div>

              <div className="min-w-0">
                <label
                  htmlFor="task-tag"
                  className="ui-label-icon"
                >
                  <Folder size={16} className="text-violet" />
                  {t.createTask.tagLabel}
                </label>

                <select
                  id="task-tag"
                  name="tag"
                  value={tag}
                  onChange={(event) =>
                    setTag(event.target.value)
                  }
                  className={`${fieldClassName} cursor-pointer appearance-none`}
                >
                  <option value="Trabajo">{t.tags.work}</option>
                  <option value="Estudios">{t.tags.studies}</option>
                  <option value="Personal">{t.tags.personal}</option>
                  <option value="Casa">{t.tags.home}</option>
                  <option value="CUSTOM">{t.tags.custom}</option>
                </select>
              </div>
            </div>

            {tag === "CUSTOM" && (
              <div className="min-w-0 rounded-2xl border border-violet/20 bg-violet/5 p-4">
                <label
                  htmlFor="custom-tag"
                  className="ui-label-icon"
                >
                  <Folder size={16} className="text-violet" />
                  {t.createTask.customTagLabel}
                </label>

                <Input
                  id="custom-tag"
                  name="customTag"
                  placeholder={t.createTask.customTagPlaceholder}
                  className={`${fieldClassName} break-words [overflow-wrap:anywhere]`}
                  required
                />

                <p className="ui-form-help break-words">
                  {t.createTask.customTagHelp}
                </p>
              </div>
            )}

            <div className="min-w-0 border-t border-border pt-5">
              <label
                htmlFor="task-due-date"
                className="ui-label-icon"
              >
                <CalendarDays size={16} className="text-info" />
                {t.createTask.dueDateLabel}
              </label>

              <div className="relative mt-2">
                <Input
                  id="task-due-date"
                  type="date"
                  name="dueDate"
                  className="w-full cursor-pointer pr-12"
                  onClick={(event) =>
                    openDatePicker(event.currentTarget)
                  }
                  onFocus={(event) =>
                    openDatePicker(event.currentTarget)
                  }
                />

                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById(
                      "task-due-date"
                    ) as HTMLInputElement | null;

                    openDatePicker(input);
                  }}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={t.createTask.dueDateLabel}
                  title={t.createTask.dueDateLabel}
                >
                  <CalendarDays size={18} />
                </button>
              </div>
            </div>
          </fieldset>

          <div className="mt-6 flex min-w-0 flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleDialogChange(false)}
              disabled={isCreating}
              className="ui-button-secondary h-10 w-full sm:w-auto"
            >
              {t.common.cancel}
            </Button>

            <Button
              type="submit"
              disabled={isCreating}
              className="ui-button-primary h-10 w-full sm:w-auto"
            >
              {isCreating ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
                  {t.form.creating}
                </>
              ) : (
                <>
                  <Plus size={17} />
                  {t.createTask.createButton}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}