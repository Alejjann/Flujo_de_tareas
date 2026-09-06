"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { createTask } from "@/actions/createTask";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useLanguage } from "@/components/providers/LanguageProvider";

export default function AddTaskButton() {
  const [open, setOpen] = useState(false);
  const [tag, setTag] = useState("Personal");
  const router = useRouter();
  const { t } = useLanguage();

  async function handleSubmit(formData: FormData) {
    try {
      await createTask(formData);

      toast.success(t.createTask.success);

      setOpen(false);
      router.refresh();
    } catch (error) {
      console.error(error);
      toast.error(t.createTask.error);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            <Plus size={18} />
            {t.tasks.newTask}
          </Button>
        }
      />

      <DialogContent className="max-h-[90vh] overflow-y-auto border border-border bg-popover text-popover-foreground sm:max-w-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">
            {t.createTask.title}
          </DialogTitle>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.createTask.titleLabel}
            </label>

            <Input
              name="title"
              placeholder={t.createTask.titlePlaceholder}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.createTask.descriptionLabel}
            </label>

            <Textarea
              name="description"
              placeholder={t.createTask.descriptionPlaceholder}
              rows={6}
              className="resize-y border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.createTask.priorityLabel}
            </label>

            <select
              name="priority"
              defaultValue="MEDIUM"
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="LOW">🟢 {t.priority.low}</option>
              <option value="MEDIUM">🟡 {t.priority.medium}</option>
              <option value="HIGH">🔴 {t.priority.high}</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.createTask.tagLabel}
            </label>

            <select
              name="tag"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
            >
              <option value="Trabajo">💼 {t.tags.work}</option>
              <option value="Estudios">📚 {t.tags.studies}</option>
              <option value="Personal">❤️ {t.tags.personal}</option>
              <option value="Casa">🏠 {t.tags.home}</option>
              <option value="CUSTOM">✨ {t.tags.custom}</option>
            </select>
          </div>

          {tag === "CUSTOM" && (
            <div>
              <label className="mb-2 block text-sm font-medium text-foreground">
                {t.createTask.customTagLabel}
              </label>

              <Input
                name="customTag"
                placeholder={t.createTask.customTagPlaceholder}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus:border-primary"
                required
              />

              <p className="mt-2 text-xs text-muted-foreground">
                {t.createTask.customTagHelp}
              </p>
            </div>
          )}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              {t.createTask.dueDateLabel}
            </label>

            <Input
              type="date"
              name="dueDate"
              className="border-border bg-background text-foreground"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-primary font-semibold text-primary-foreground hover:bg-primary/90"
          >
            {t.createTask.createButton}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}