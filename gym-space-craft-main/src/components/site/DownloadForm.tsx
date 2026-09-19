import { useState } from "react";
import { submitDownloadLead } from "@/lib/enquiry.functions";

function startDownload(file: string) {
  const filename = file.split("/").pop() || "resource.pdf";
  const a = document.createElement("a");
  a.href = file;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
}

export function DownloadForm({
  resource,
  file,
  className = "",
}: {
  resource: string;
  file: string;
  className?: string;
}) {
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
      startDownload(file);
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    }
  }

  if (state === "done") {
    return (
      <div className={`animate-in fade-in border border-primary/40 bg-card p-8 duration-500 ${className}`}>
        <p className="label-caps text-primary">Unlocked</p>
        <p className="mt-4 font-display text-2xl">Your PDF is downloading.</p>
        <p className="mt-3 text-sm text-muted-foreground">
          If nothing started,{" "}
          <button type="button" className="underline hover:text-primary" onClick={() => startDownload(file)}>
            download it here
          </button>
          .
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={`border border-border bg-card p-6 md:p-8 ${className}`}>
      <p className="label-caps text-primary">Unlock this resource</p>
      <p className="mt-3 text-sm text-muted-foreground">
        Three details. The PDF downloads as soon as you submit.
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
    </form>
  );
}
