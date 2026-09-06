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
import { toast } from "sonner";
import { useState } from "react";
import { useRouter } from "next/navigation";
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
  const [currentTag, setCurrentTag] = useState(
    tag &&
      !["Trabajo", "Estudios", "Personal", "Casa"].includes(tag)
      ? "CUSTOM"
      : tag || "Personal"
  );

  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(formData: FormData) {
    try {
      await updateTask(formData);

      toast.success(t.editTask.success);

      onOpenChange(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t.editTask.error);
    }
  }

  const isCustom = currentTag === "CUSTOM";

  const customValue =
    tag &&
    !["Trabajo", "Estudios", "Personal", "Casa"].includes(tag)
      ? tag
      : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border border-border bg-popover text-popover-foreground sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {t.editTask.title}
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">
          <input type="hidden" name="id" value={id} />

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.editTask.titleLabel}
            </label>

            <Input
              name="title"
              defaultValue={title}
              placeholder={t.editTask.titlePlaceholder}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.editTask.descriptionLabel}
            </label>

            <Textarea
              name="description"
              defaultValue={description || ""}
              placeholder={t.editTask.descriptionPlaceholder}
              rows={6}
              className="resize-y border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.editTask.priorityLabel}
            </label>

            <select
              name="priority"
              defaultValue={priority}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="LOW">🟢 {t.priority.low}</option>
              <option value="MEDIUM">🟡 {t.priority.medium}</option>
              <option value="HIGH">🔴 {t.priority.high}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.editTask.tagLabel}
            </label>

            <select
              name="tag"
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="Trabajo">💼 {t.tags.work}</option>
              <option value="Estudios">📚 {t.tags.studies}</option>
              <option value="Personal">❤️ {t.tags.personal}</option>
              <option value="Casa">🏠 {t.tags.home}</option>
              <option value="CUSTOM">✨ {t.tags.custom}</option>
            </select>
          </div>

          {isCustom && (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {t.editTask.customTagLabel}
              </label>

              <Input
                name="customTag"
                defaultValue={customValue}
                placeholder={t.editTask.customTagPlaceholder}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
                required
              />
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.editTask.dueDateLabel}
            </label>

            <Input
              type="date"
              name="dueDate"
              defaultValue={
                dueDate
                  ? new Date(dueDate)
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
              className="border-border bg-background text-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t.editTask.saveButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}