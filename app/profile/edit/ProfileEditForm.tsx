"use client";

import type { ChangeEvent } from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";

import {
  AlertCircle,
  ArrowLeft,
  Check,
  Circle,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Save,
  User,
} from "lucide-react";

import { updateProfile } from "@/actions/updateProfile";
import {
  getPasswordErrors,
  isPasswordValid,
  PASSWORD_MIN_LENGTH,
} from "@/lib/validation/password";
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
  const { t, language } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);
  const [passwordError, setPasswordError] = useState("");

  const [form, setForm] = useState({
    name: name || "",
    email: email || "",
    password: "",
    confirmPassword: "",
  });

  const passwordRules = [
    {
      label:
        language === "es"
          ? `Al menos ${PASSWORD_MIN_LENGTH} caracteres`
          : `At least ${PASSWORD_MIN_LENGTH} characters`,
      valid: form.password.length >= PASSWORD_MIN_LENGTH,
    },
    {
      label:
        language === "es"
          ? "Una letra mayúscula"
          : "One uppercase letter",
      valid: /[A-Z]/.test(form.password),
    },
    {
      label:
        language === "es"
          ? "Una letra minúscula"
          : "One lowercase letter",
      valid: /[a-z]/.test(form.password),
    },
    {
      label:
        language === "es"
          ? "Un número"
          : "One number",
      valid: /\d/.test(form.password),
    },
    {
      label:
        language === "es"
          ? "Un carácter especial (_, !, @, #)"
          : "One special character (_, !, @, #)",
      valid: /[^A-Za-z0-9]/.test(form.password),
    },
  ];

  const passwordRequirementsTitle =
    language === "es"
      ? "Requisitos de la contraseña"
      : "Password requirements";

  const hasPasswordMismatch = Boolean(passwordError);

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const { name: fieldName, value } = event.target;

    const nextForm = {
      ...form,
      [fieldName]: value,
    };

    setForm(nextForm);

    if (
      fieldName === "password" ||
      fieldName === "confirmPassword"
    ) {
      const passwordsMatch =
        !nextForm.password ||
        !nextForm.confirmPassword ||
        nextForm.password === nextForm.confirmPassword;

      setPasswordError(
        passwordsMatch ? "" : t.profile.passwordMismatch
      );
    }
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

    if (password) {
      const errors = getPasswordErrors(password);

      if (errors.length > 0 || !isPasswordValid(password)) {
        toast.error(errors[0] ?? "La contraseña no es válida.");
        return;
      }
    }

    if (password !== confirmPassword) {
      setPasswordError(t.profile.passwordMismatch);
      toast.error(t.profile.passwordMismatch);
      return;
    }

    setPasswordError("");
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
        error instanceof Error
          ? error.message
          : t.profile.updateError
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="ui-page">
      <div className="ui-container max-w-3xl">
        <header className="mb-6 flex items-center justify-between sm:mb-8">
          <Link
            href="/profile"
            className="ui-button-secondary h-10 px-3 text-xs sm:h-11 sm:px-4 sm:text-sm"
          >
            <ArrowLeft size={17} />

            <span className="hidden sm:inline">
              {t.profile.backToProfile}
            </span>

            <span className="sm:hidden">
              {t.common.cancel}
            </span>
          </Link>
        </header>

        <div className="ui-card-main overflow-hidden">
          <div className="border-b border-border bg-gradient-to-br from-primary/10 via-transparent to-info/5 px-5 py-6 sm:px-8 sm:py-8">
            <div className="ui-icon-box ui-icon-primary mb-4 h-11 w-11 rounded-2xl">
              <User size={21} />
            </div>

            <h1 className="text-2xl font-black tracking-[-0.04em] text-foreground sm:text-3xl">
              {t.profile.editProfile}
            </h1>

            <p className="mt-2 max-w-lg text-sm leading-6 text-muted-foreground">
              {t.profile.information}
            </p>
          </div>

          <div className="p-5 sm:p-8">
            <section>
              <div className="mb-5 border-b border-border pb-5">
                <h2 className="ui-section-title text-lg sm:text-xl">
                  {t.profile.information}
                </h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="name"
                    className="ui-label-icon"
                  >
                    <User size={16} className="text-primary" />
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
                    maxLength={80}
                    className="ui-input"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="ui-label-icon"
                  >
                    <Mail size={16} className="text-primary" />
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
                    maxLength={255}
                    className="ui-input"
                  />
                </div>
              </div>
            </section>

            <section className="mt-8 border-t border-border pt-8">
              <div className="mb-5">
                <h2 className="flex items-center gap-2 text-lg font-bold tracking-[-0.03em] text-foreground sm:text-xl">
                  <span className="ui-icon-box ui-icon-primary h-9 w-9 rounded-xl">
                    <Lock size={17} />
                  </span>

                  {t.profile.changePassword}
                </h2>

                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t.profile.changePasswordDescription}
                </p>
              </div>

              <div className="space-y-5">
                <div>
                  <label
                    htmlFor="password"
                    className="ui-label"
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
                      maxLength={72}
                      aria-invalid={hasPasswordMismatch}
                      aria-describedby={
                        hasPasswordMismatch
                          ? "password-mismatch-error"
                          : form.password
                          ? "password-rules"
                          : undefined
                      }
                      className={`ui-input pr-12 ${
                        hasPasswordMismatch
                          ? "border-destructive focus:border-destructive focus:ring-destructive/15"
                          : ""
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowPassword((current) => !current)
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-50"
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

                  {form.password && (
                    <div
                      id="password-rules"
                      className="mt-3 rounded-xl border border-border bg-secondary/35 p-3.5"
                    >
                      <p className="mb-2.5 text-xs font-bold text-foreground">
                        {passwordRequirementsTitle}
                      </p>

                      <ul className="grid gap-2 sm:grid-cols-2">
                        {passwordRules.map((rule) => (
                          <li
                            key={rule.label}
                            className={`flex items-center gap-2 text-xs font-medium ${
                              rule.valid
                                ? "text-success"
                                : "text-muted-foreground"
                            }`}
                          >
                            {rule.valid ? (
                              <Check
                                size={14}
                                className="shrink-0"
                              />
                            ) : (
                              <Circle
                                size={14}
                                className="shrink-0"
                              />
                            )}

                            {rule.label}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="ui-label"
                  >
                    {t.profile.confirmNewPassword}
                  </label>

                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={
                        showConfirmPassword
                          ? "text"
                          : "password"
                      }
                      name="confirmPassword"
                      value={form.confirmPassword}
                      onChange={handleChange}
                      placeholder={t.profile.repeatNewPassword}
                      disabled={loading}
                      autoComplete="new-password"
                      maxLength={72}
                      aria-invalid={hasPasswordMismatch}
                      aria-describedby={
                        hasPasswordMismatch
                          ? "password-mismatch-error"
                          : undefined
                      }
                      className={`ui-input pr-12 ${
                        hasPasswordMismatch
                          ? "border-destructive focus:border-destructive focus:ring-destructive/15"
                          : ""
                      }`}
                    />

                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(
                          (current) => !current
                        )
                      }
                      disabled={loading}
                      className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground disabled:opacity-50"
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

                  {hasPasswordMismatch && (
                    <p
                      id="password-mismatch-error"
                      role="alert"
                      className="mt-2 flex items-center gap-2 text-sm font-medium text-destructive"
                    >
                      <AlertCircle
                        size={16}
                        className="shrink-0"
                      />
                      {passwordError}
                    </p>
                  )}
                </div>
              </div>
            </section>

            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:justify-end">
              <Link
                href="/profile"
                className="ui-button-secondary w-full sm:w-auto"
              >
                {t.common.cancel}
              </Link>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="ui-button-primary w-full sm:w-auto"
              >
                <Save size={18} />

                {loading
                  ? t.profile.saving
                  : t.profile.saveChanges}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}