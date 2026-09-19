import { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { adminApi } from "@/lib/admin-api";

export function AdminLoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const email = String(form.get("email") ?? "");
    const password = String(form.get("password") ?? "");

    setSubmitting(true);
    setError(null);

    try {
      await adminApi.login(email, password);
      await navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <label className="block">
        <span className="label-caps text-muted-foreground">Email</span>
        <input
          required
          name="email"
          type="email"
          autoComplete="username"
          placeholder="admin@gmail.com"
          className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-all duration-300 placeholder:text-muted-foreground/60 hover:border-foreground focus:border-primary"
        />
      </label>

      <label className="block">
        <span className="label-caps text-muted-foreground">Password</span>
        <span className="relative mt-2 block">
          <input
            required
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            placeholder="••••••••"
            className="w-full border-b border-input bg-transparent py-3 pr-10 text-base outline-none transition-all duration-300 placeholder:text-muted-foreground/60 hover:border-foreground focus:border-primary"
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute top-1/2 right-0 -translate-y-1/2 cursor-pointer p-1 text-foreground transition-colors hover:text-primary"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </span>
      </label>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="label-caps w-full cursor-pointer bg-primary px-8 py-4 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {submitting ? "Signing in…" : "Sign in"}
      </button>
    </form>
  );
}
