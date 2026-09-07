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

import { createTask } from "@/actions/createTask";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AddTaskButton() {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("Personal");
  const [isCreating, setIsCreating] = useState(false);

  const router = useRouter();
  const { t } = useLanguage();

  function handleDialogChange(nextOpen: boolean) {
    if (isCreating) {
      return;
    }

    setOpen(nextOpen);
  }

  async function handleSubmit(formData: FormData) {
    if (isCreating) {
      return;
    }

    setIsCreating(true);

    try {
      await createTask(formData);

      toast.success(t.createTask.success);

      setOpen(false);
      setTag("Personal");

      router.refresh();
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
          <Button className="ui-button-primary w-full sm:w-auto">
            <Plus size={18} />
            {t.tasks.newTask}
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl shadow-slate-950/20 sm:max-w-xl">
        <DialogHeader className="border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-info/5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
            <Plus size={21} />
          </div>

          <DialogTitle className="text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
            {t.createTask.title}
          </DialogTitle>

          <DialogDescription className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            {t.createTask.descriptionLabel}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="p-5 sm:p-6">
          <fieldset
            disabled={isCreating}
            className="space-y-5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div>
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
                className="ui-input"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor="task-description"
                className="ui-label-icon"
              >
                <AlignLeft size={16} className="text-muted-foreground" />
                {t.createTask.descriptionLabel}
              </label>

              <Textarea
                id="task-description"
                name="description"
                placeholder={t.createTask.descriptionPlaceholder}
                rows={5}
                className="min-h-30 w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
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
                  className="ui-input cursor-pointer appearance-none"
                >
                  <option value="LOW">{t.priority.low}</option>
                  <option value="MEDIUM">{t.priority.medium}</option>
                  <option value="HIGH">{t.priority.high}</option>
                </select>
              </div>

              <div>
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
                  onChange={(event) => setTag(event.target.value)}
                  className="ui-input cursor-pointer appearance-none"
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
              <div className="rounded-2xl border border-violet/20 bg-violet/5 p-4">
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
                  className="ui-input"
                  required
                />

                <p className="ui-form-help">
                  {t.createTask.customTagHelp}
                </p>
              </div>
            )}

            <div className="border-t border-border pt-5">
              <label
                htmlFor="task-due-date"
                className="ui-label-icon"
              >
                <CalendarDays size={16} className="text-info" />
                {t.createTask.dueDateLabel}
              </label>

              <Input
                id="task-due-date"
                type="date"
                name="dueDate"
                className="ui-input cursor-pointer"
              />
            </div>
          </fieldset>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isCreating}
              className="ui-button-secondary w-full sm:w-auto"
            >
              {t.common.cancel}
            </Button>

            <Button
              type="submit"
              disabled={isCreating}
              className="ui-button-primary w-full sm:w-auto"
            >
              {isCreating ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
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