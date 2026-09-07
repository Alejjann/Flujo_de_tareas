"use client";

import {
  AlignLeft,
  CalendarDays,
  Check,
  Flag,
  Folder,
  LoaderCircle,
  Pencil,
  Tag,
} from "lucide-react";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

import { updateTask } from "@/actions/updateTasks";
import { useLanguage } from "@/components/providers/LanguageProvider";

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

const DEFAULT_TAG = "Personal";

const DEFAULT_TAGS = [
  "Trabajo",
  "Estudios",
  "Personal",
  "Casa",
];

function getInitialTag(tag: string | null) {
  if (!tag) {
    return DEFAULT_TAG;
  }

  return DEFAULT_TAGS.includes(tag) ? tag : "CUSTOM";
}

function getCustomTag(tag: string | null) {
  if (!tag || DEFAULT_TAGS.includes(tag)) {
    return "";
  }

  return tag;
}

function formatDateForInput(date: Date | null) {
  if (!date) {
    return "";
  }

  return new Date(date).toISOString().split("T")[0];
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
  const router = useRouter();
  const { t } = useLanguage();

  const [currentTag, setCurrentTag] = useState(
    getInitialTag(tag)
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentTag(getInitialTag(tag));
    }
  }, [open, tag]);

  function handleDialogChange(nextOpen: boolean) {
    if (isSaving) {
      return;
    }

    onOpenChange(nextOpen);
  }

  async function handleSubmit(formData: FormData) {
    if (isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      await updateTask(formData);

      toast.success(t.editTask.success);

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t.editTask.error);
    } finally {
      setIsSaving(false);
    }
  }

  const isCustom = currentTag === "CUSTOM";
  const customValue = getCustomTag(tag);

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="max-h-[90vh] w-[calc(100%-2rem)] overflow-y-auto rounded-3xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl shadow-slate-950/20 sm:max-w-xl">
        <DialogHeader className="border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-violet/5 px-5 py-5 sm:px-6 sm:py-6">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-inset ring-primary/15">
            <Pencil size={20} />
          </div>

          <DialogTitle className="text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
            {t.editTask.title}
          </DialogTitle>

          <DialogDescription className="mt-1 max-w-md text-sm leading-6 text-muted-foreground">
            {title}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="p-5 sm:p-6">
          <input type="hidden" name="id" value={id} />

          <fieldset
            disabled={isSaving}
            className="space-y-5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div>
              <label
                htmlFor={`edit-task-title-${id}`}
                className="ui-label-icon"
              >
                <Tag size={16} className="text-primary" />
                {t.editTask.titleLabel}
              </label>

              <Input
                id={`edit-task-title-${id}`}
                name="title"
                defaultValue={title}
                placeholder={t.editTask.titlePlaceholder}
                className="ui-input"
                required
                autoFocus
              />
            </div>

            <div>
              <label
                htmlFor={`edit-task-description-${id}`}
                className="ui-label-icon"
              >
                <AlignLeft size={16} className="text-muted-foreground" />
                {t.editTask.descriptionLabel}
              </label>

              <Textarea
                id={`edit-task-description-${id}`}
                name="description"
                defaultValue={description || ""}
                placeholder={t.editTask.descriptionPlaceholder}
                rows={5}
                className="min-h-30 w-full resize-y rounded-xl border border-input bg-background px-4 py-3 text-sm leading-6 text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10"
              />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`edit-task-priority-${id}`}
                  className="ui-label-icon"
                >
                  <Flag size={16} className="text-warning" />
                  {t.editTask.priorityLabel}
                </label>

                <select
                  id={`edit-task-priority-${id}`}
                  name="priority"
                  defaultValue={priority}
                  className="ui-input cursor-pointer appearance-none"
                >
                  <option value="LOW">{t.priority.low}</option>
                  <option value="MEDIUM">{t.priority.medium}</option>
                  <option value="HIGH">{t.priority.high}</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor={`edit-task-tag-${id}`}
                  className="ui-label-icon"
                >
                  <Folder size={16} className="text-violet" />
                  {t.editTask.tagLabel}
                </label>

                <select
                  id={`edit-task-tag-${id}`}
                  name="tag"
                  value={currentTag}
                  onChange={(event) =>
                    setCurrentTag(event.target.value)
                  }
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

            {isCustom && (
              <div className="rounded-2xl border border-violet/20 bg-violet/5 p-4">
                <label
                  htmlFor={`edit-task-custom-tag-${id}`}
                  className="ui-label-icon"
                >
                  <Folder size={16} className="text-violet" />
                  {t.editTask.customTagLabel}
                </label>

                <Input
                  id={`edit-task-custom-tag-${id}`}
                  name="customTag"
                  defaultValue={customValue}
                  placeholder={t.editTask.customTagPlaceholder}
                  className="ui-input"
                  required
                />
              </div>
            )}

            <div className="border-t border-border pt-5">
              <label
                htmlFor={`edit-task-date-${id}`}
                className="ui-label-icon"
              >
                <CalendarDays size={16} className="text-info" />
                {t.editTask.dueDateLabel}
              </label>

              <Input
                id={`edit-task-date-${id}`}
                type="date"
                name="dueDate"
                defaultValue={formatDateForInput(dueDate)}
                className="ui-input cursor-pointer"
              />
            </div>
          </fieldset>

          <div className="mt-6 flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-end">
            <Button
              type="button"
              variant="outline"
              disabled={isSaving}
              onClick={() => onOpenChange(false)}
              className="ui-button-secondary w-full sm:w-auto"
            >
              {t.common.cancel}
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="ui-button-primary w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <LoaderCircle size={17} className="animate-spin" />
                  {t.form.updating}
                </>
              ) : (
                <>
                  <Check size={17} />
                  {t.editTask.saveButton}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}