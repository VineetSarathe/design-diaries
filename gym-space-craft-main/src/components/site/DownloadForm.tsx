import { useState } from "react";
import { submitDownloadLead } from "@/lib/enquiry.functions";

export function DownloadForm({ resource }: { resource: string }) {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setState("sending");
    setError(null);
    try {
      await submitDownloadLead({
        name: String(fd.get("name") ?? ""),
        email: String(fd.get("email") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        resource,
      });
      setState("done");
      window.open("/placeholder-resource.txt", "_blank", "noopener");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className="animate-in fade-in border border-primary/40 bg-card p-8 duration-500">
        <p className="label-caps text-primary">Unlocked</p>
        <p className="mt-4 font-display text-2xl">Your guide has opened in a new tab.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          Placeholder file — the real PDF and the Google Sheets lead destination are wired up
          separately. If the tab was blocked, allow pop-ups and submit again.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="border border-border bg-card p-6 md:p-8">
      <p className="label-caps text-primary">Unlock this resource</p>
      <p className="mt-3 text-sm text-muted-foreground">
        Three details. The guide opens in a new tab as soon as you submit.
      </p>
      <div className="mt-6 space-y-5">
        {[
          { name: "name", label: "Name", type: "text", placeholder: "Your full name", required: true },
          { name: "email", label: "Email", type: "email", placeholder: "you@example.com", required: true },
          { name: "phone", label: "Phone (optional)", type: "tel", placeholder: "+91", required: false },
        ].map((f) => (
          <label key={f.name} className="block">
            <span className="label-caps text-muted-foreground">{f.label}</span>
            <input
              name={f.name}
              type={f.type}
              required={f.required}
              placeholder={f.placeholder}
              className="mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-all duration-300 placeholder:text-muted-foreground/60 hover:border-foreground focus:border-primary"
            />
          </label>
        ))}
      </div>
      {error && <p className="mt-4 text-sm text-destructive">{error}</p>}
      <button
        type="submit"
        disabled={state === "sending"}
        className="label-caps mt-7 w-full bg-primary px-8 py-4 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.98] disabled:opacity-60"
      >
        {state === "sending" ? "Sending…" : "Get the resource"}
      </button>
      <p className="mt-4 text-xs text-muted-foreground">
        Mock lead handler — goes to the same destination as the main enquiry form.
      </p>
    </form>
  );
}
