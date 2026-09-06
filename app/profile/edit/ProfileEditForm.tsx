"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  User,
  Mail,
  Lock,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import Link from "next/link";
import { updateProfile } from "@/actions/updateProfile";
import { toast } from "sonner";
import { useLanguage } from "@/components/providers/LanguageProvider";

interface ProfileEditFormProps {
  name: string | null;
  email: string;
}

export default function ProfileEditForm({
  name,
  email,
}: ProfileEditFormProps) {
  const router = useRouter();
  const { t } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [form, setForm] = useState({
    name: name || "",
    email: email || "",
    password: "",
    confirmPassword: "",
  });

  function handleChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  }

  async function handleSubmit() {
    if (loading) {
      return;
    }

    const cleanName = form.name.trim();
    const cleanEmail = form.email.trim().toLowerCase();
    const password = form.password;
    const confirmPassword = form.confirmPassword;

    if (!cleanName) {
      toast.error(t.profile.nameRequired);
      return;
    }

    if (!cleanEmail) {
      toast.error(t.profile.emailRequired);
      return;
    }

    if (password && password.length < 6) {
      toast.error(t.profile.passwordTooShort);
      return;
    }

    if (password !== confirmPassword) {
      toast.error(t.profile.passwordMismatch);
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.set("name", cleanName);
      formData.set("email", cleanEmail);

      if (password) {
        formData.set("password", password);
      }

      await updateProfile(formData);

      setForm((current) => ({
        ...current,
        password: "",
        confirmPassword: "",
      }));

      toast.success(t.profile.updateSuccess);

      router.push("/profile");
      router.refresh();
    } catch (error) {
      console.error("ERROR UPDATING PROFILE:", error);

      toast.error(
        error instanceof Error ? error.message : t.profile.updateError
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-3xl px-6 py-10 md:px-8">
        <div className="mb-8 flex items-center justify-between">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm text-muted-foreground transition hover:border-primary hover:bg-secondary hover:text-foreground"
          >
            <ArrowLeft size={18} />
            {t.profile.backToProfile}
          </Link>
        </div>

        <div className="rounded-3xl border border-border bg-card p-6 text-card-foreground shadow-2xl shadow-black/10 md:p-8">
          <div className="mb-8">
            <h1 className="text-center text-3xl font-bold text-foreground">
              {t.profile.editProfile}
            </h1>
          </div>

          <section>
            <div className="mb-5">
              <h2 className="text-xl font-bold text-foreground">
                {t.profile.information}
              </h2>

         
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <User size={17} className="text-primary" />
                  {t.profile.name}
                </label>

                <input
                  id="name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder={t.profile.name}
                  disabled={loading}
                  autoComplete="name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <Mail size={17} className="text-primary" />
                  {t.profile.email}
                </label>

                <input
                  id="email"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder={t.profile.emailPlaceholder}
                  disabled={loading}
                  autoComplete="email"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>
            </div>
          </section>

          <section className="mt-8 border-t border-border pt-8">
            <div className="mb-5">
              <h2 className="flex items-center gap-2 text-xl font-bold text-foreground">
                <Lock size={20} className="text-primary" />
                {t.profile.changePassword}
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t.profile.newPassword}
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder={t.profile.newPassword}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((current) => !current)
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:opacity-50"
                    aria-label={
                      showPassword
                        ? t.profile.hidePassword
                        : t.profile.showPassword
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-foreground"
                >
                  {t.profile.confirmNewPassword}
                </label>

                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={
                      showConfirmPassword ? "text" : "password"
                    }
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder={t.profile.repeatNewPassword}
                    disabled={loading}
                    autoComplete="new-password"
                    className="w-full rounded-xl border border-border bg-background px-4 py-3 pr-12 text-foreground outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) => !current
                      )
                    }
                    disabled={loading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground disabled:opacity-50"
                    aria-label={
                      showConfirmPassword
                        ? t.profile.hidePassword
                        : t.profile.showPassword
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={19} />
                    ) : (
                      <Eye size={19} />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
            <Link
              href="/profile"
              className="inline-flex items-center justify-center rounded-xl border border-border bg-card px-5 py-3 font-medium text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            >
              {t.common.cancel}
            </Link>

            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Save size={18} />
              {loading ? t.profile.saving : t.profile.saveChanges}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}