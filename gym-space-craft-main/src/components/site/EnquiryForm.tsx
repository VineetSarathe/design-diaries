import { useState } from "react";
import { submitEnquiry } from "@/lib/enquiry.functions";
import { cn } from "@/lib/utils";

const fields = [
  { name: "name", label: "Name", type: "text", placeholder: "Your full name" },
  { name: "phone", label: "Phone / WhatsApp", type: "tel", placeholder: "+91" },
  { name: "email", label: "Email", type: "email", placeholder: "you@example.com" },
  { name: "city", label: "City", type: "text", placeholder: "Indore" },
] as const;

export function EnquiryForm({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setError(null);
    try {
      await submitEnquiry({
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        email: String(fd.get("email") ?? ""),
        city: String(fd.get("city") ?? ""),
      });
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="animate-in fade-in border border-primary/40 bg-card p-8 duration-500">
        <p className="label-caps text-primary">Enquiry received</p>
        <p className="mt-4 font-display text-2xl">Thank you — we'll be in touch within 24 hours.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Placeholder confirmation: submissions are logged to a mock handler until the Google Sheet
          is connected.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("space-y-5", compact && "space-y-4")}>
      <div className="grid gap-5 sm:grid-cols-2">
        {fields.map((f) => (
          <label key={f.name} className="block">
            <span className="label-caps text-muted-foreground">{f.label}</span>
            <input
              required
              name={f.name}
              type={f.type}
              placeholder={f.placeholder}
              className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-all duration-300 placeholder:text-muted-foreground/60 hover:border-foreground focus:border-primary"
            />
          </label>
        ))}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="label-caps w-full bg-primary px-8 py-4 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.98] disabled:opacity-60 sm:w-auto"
      >
        {state === "sending" ? "Sending…" : "Send Enquiry"}
      </button>
      <p className="text-xs text-muted-foreground">
        Thank you. We will get back to you shortly.
      </p>
    </form>
  );
}
