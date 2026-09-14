"use client";

import {
  AlignLeft,
  CalendarDays,
  Check,
  Flag,
  Folder,
  LoaderCircle,
  Tag,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateTask } from "@/actions/updateTasks";
import { useGuestTasks } from "@/components/providers/GuestTasksProvider";
import { useLanguage } from "@/components/providers/LanguageProvider";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditTaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
  title: string;
  description: string | null;
  priority: "LOW" | "MEDIUM" | "HIGH";
  dueDate: Date | null;
  tag: string | null;
  guestMode?: boolean;
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


  const localDate = new Date(date);

  const year = localDate.getFullYear();
  const month = String(localDate.getMonth() + 1).padStart(2, "0");
  const day = String(localDate.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
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
  guestMode = false,
}: EditTaskDialogProps) {
  const router = useRouter();
  const { t } = useLanguage();

 
  const guestTasks = useGuestTasks();

  const [currentTag, setCurrentTag] = useState(
    getInitialTag(tag)
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setCurrentTag(getInitialTag(tag));
    }
  }, [open, tag]);

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
      const titleValue = String(
        formData.get("title") ?? ""
      ).trim();

      const descriptionValue = String(
        formData.get("description") ?? ""
      ).trim();

      const priorityValue = formData.get("priority") as
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
        if (!guestTasks) {
          throw new Error(
            "GuestTasksProvider no está disponible en modo invitado."
          );
        }

        guestTasks.updateTask(id, {
          title: titleValue,
          description: descriptionValue || null,
          priority: priorityValue,
          dueDate: dueDateValue || null,
          tag: finalTag,
        });

        toast.success(t.editTask.success);

        onOpenChange(false);

      
        return;
      }

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

  const fieldClassName =
    "mt-2 w-full min-w-0 max-w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground shadow-sm outline-none transition-all duration-200 placeholder:text-muted-foreground focus:border-primary focus:ring-4 focus:ring-primary/10";

  const dateInputId = `edit-task-date-${id}`;

  return (
    <Dialog open={open} onOpenChange={handleDialogChange}>
      <DialogContent className="flex max-h-[calc(100dvh-2rem)] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-border bg-popover p-0 text-popover-foreground shadow-2xl shadow-slate-950/20 sm:w-[760px] sm:max-w-[calc(100vw-4rem)]">
        <DialogHeader className="shrink-0 border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-violet/5 px-5 py-4 pr-12 sm:px-6 sm:py-5">
          <DialogTitle className="break-words text-xl font-bold tracking-[-0.03em] text-foreground sm:text-2xl">
            {t.editTask.title}
          </DialogTitle>
        </DialogHeader>

        <form
          action={handleSubmit}
          className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-5 sm:p-6"
        >
          <input type="hidden" name="id" value={id} />

          <fieldset
            disabled={isSaving}
            className="min-w-0 space-y-5 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <div className="min-w-0">
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
                className={`${fieldClassName} break-words [overflow-wrap:anywhere]`}
                required
                autoFocus
              />
            </div>

            <div className="min-w-0">
              <label
                htmlFor={`edit-task-description-${id}`}
                className="ui-label-icon"
              >
                <AlignLeft
                  size={16}
                  className="text-muted-foreground"
                />
                {t.editTask.descriptionLabel}
              </label>

              <Textarea
                id={`edit-task-description-${id}`}
                name="description"
                defaultValue={description || ""}
                placeholder={t.editTask.descriptionPlaceholder}
                rows={5}
                className={`${fieldClassName} min-h-[120px] resize-y break-words leading-6 [overflow-wrap:anywhere]`}
              />
            </div>

            <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2">
              <div className="min-w-0">
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
                  className={`${fieldClassName} cursor-pointer appearance-none`}
                >
                  <option value="Trabajo">{t.tags.work}</option>
                  <option value="Estudios">
                    {t.tags.studies}
                  </option>
                  <option value="Personal">
                    {t.tags.personal}
                  </option>
                  <option value="Casa">{t.tags.home}</option>
                  <option value="CUSTOM">{t.tags.custom}</option>
                </select>
              </div>
            </div>

            {isCustom && (
              <div className="min-w-0 rounded-2xl border border-violet/20 bg-violet/5 p-4">
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
                  className={`${fieldClassName} break-words [overflow-wrap:anywhere]`}
                  required
                />
              </div>
            )}

            <div className="min-w-0 border-t border-border pt-5">
              <label
                htmlFor={dateInputId}
                className="ui-label-icon"
              >
                <CalendarDays size={16} className="text-info" />
                {t.editTask.dueDateLabel}
              </label>

              <div className="relative mt-2">
                <Input
                  id={dateInputId}
                  type="date"
                  name="dueDate"
                  defaultValue={formatDateForInput(dueDate)}
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
                      dateInputId
                    ) as HTMLInputElement | null;

                    openDatePicker(input);
                  }}
                  className="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-muted-foreground transition-colors hover:bg-primary/10 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
                  aria-label={t.editTask.dueDateLabel}
                  title={t.editTask.dueDateLabel}
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
              disabled={isSaving}
              onClick={() => handleDialogChange(false)}
              className="ui-button-secondary h-10 w-full sm:w-auto"
            >
              {t.common.cancel}
            </Button>

            <Button
              type="submit"
              disabled={isSaving}
              className="ui-button-primary h-10 w-full sm:w-auto"
            >
              {isSaving ? (
                <>
                  <LoaderCircle
                    size={17}
                    className="animate-spin"
                  />
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