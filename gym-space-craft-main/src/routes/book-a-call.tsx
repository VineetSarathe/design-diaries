import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Reveal } from "@/components/site/Reveal";
import {
  createCallBooking,
  getCallAvailability,
  isSlotTaken,
  type CallAvailability,
} from "@/lib/call-booking";

type BookSearch = {
  date: string;
  slot: string;
};

export const Route = createFileRoute("/book-a-call")({
  validateSearch: (search: Record<string, unknown>): BookSearch => ({
    date: typeof search.date === "string" ? search.date : "",
    slot: typeof search.slot === "string" ? search.slot : "",
  }),
  head: () => ({
    meta: [
      { title: "Confirm your call | Design Diaries" },
      {
        name: "description",
        content: "Confirm your 30-minute discovery call with Design Diaries.",
      },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: BookACall,
});

const inputClass =
  "mt-2 w-full border-b border-input bg-transparent py-3 text-base outline-none transition-all duration-300 placeholder:text-muted-foreground/60 hover:border-foreground focus:border-primary";

function BookACall() {
  const { date, slot } = Route.useSearch();
  const [availability, setAvailability] = useState<CallAvailability | null>(null);
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCallAvailability()
      .then((data) => {
        if (!cancelled) setAvailability(data);
      })
      .catch((err) => {
        if (!cancelled) {
          setState("error");
          setError(err instanceof Error ? err.message : "Could not load this time");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [date, slot]);

  const dateLabel = availability?.dates.find((day) => day.date === date)?.label || date;
  const slotLabel = availability?.slots.find((item) => item.id === slot)?.label || slot;
  const validSlot = Boolean(availability?.slots.some((item) => item.id === slot));
  const validDate = Boolean(availability?.dates.some((day) => day.date === date));
  const taken = availability ? isSlotTaken(availability, date, slot) : false;
  const ready = Boolean(date && slot && availability && validDate && validSlot && !taken);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fd = new FormData(event.currentTarget);
    setState("sending");
    setError(null);
    try {
      await createCallBooking({
        date,
        slot,
        name: String(fd.get("name") ?? ""),
        phone: String(fd.get("phone") ?? ""),
        city: String(fd.get("city") ?? ""),
        email: String(fd.get("email") ?? ""),
        message: String(fd.get("message") ?? ""),
      });
      setState("done");
    } catch (err) {
      setState("error");
      setError(err instanceof Error ? err.message : "Could not confirm this call");
    }
  }

  return (
    <>
      <section className="bg-foreground pt-24 text-background md:pt-28">
        <div className="mx-auto max-w-[52rem] px-5 pb-8 md:px-10 md:pb-10">
          <Reveal>
            <p className="label-caps text-primary">Book a call</p>
            <h1 className="display-lg mt-3">Confirm your call</h1>
          </Reveal>
          <div className="mt-6 grid gap-px bg-background/20 sm:grid-cols-2">
            <div className="bg-foreground/80 px-5 py-4">
              <p className="label-caps text-background/50">Date</p>
              <p className="mt-1 font-display text-lg uppercase">{dateLabel || "—"}</p>
            </div>
            <div className="bg-foreground/80 px-5 py-4">
              <p className="label-caps text-background/50">Call time</p>
              <p className="mt-1 font-display text-lg uppercase">{slotLabel || "—"}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[52rem] px-5 py-8 md:px-10 md:py-10">
        {state === "done" ? (
          <Reveal className="border border-primary/40 bg-card p-8 md:p-10">
            <p className="label-caps text-primary">Call booked</p>
            <h2 className="mt-4 font-display text-3xl uppercase">We'll see you then</h2>
            <p className="mt-4 max-w-md text-muted-foreground">
              {dateLabel} · {slotLabel}. Keep this time free — Sagrika will join you on the call.
            </p>
            <Link
              to="/start-a-project"
              className="label-caps mt-8 inline-block bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground"
            >
              Back to start a project
            </Link>
          </Reveal>
        ) : !date || !slot || (availability && (!validDate || !validSlot)) ? (
          <Reveal>
            <p className="max-w-md text-muted-foreground">Pick a date and time from the calendar first.</p>
            <Link
              to="/start-a-project"
              hash="calendar"
              className="label-caps mt-8 inline-block bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground"
            >
              View calendar
            </Link>
          </Reveal>
        ) : taken ? (
          <Reveal>
            <p className="max-w-md text-muted-foreground">This time is no longer available. Please pick another slot.</p>
            <Link
              to="/start-a-project"
              hash="calendar"
              className="label-caps mt-8 inline-block bg-primary px-7 py-4 text-primary-foreground transition-colors hover:bg-foreground"
            >
              View calendar
            </Link>
          </Reveal>
        ) : (
          <Reveal>
            <div className="border border-border bg-card p-5 shadow-2xl md:p-8">
              <p className="label-caps text-primary">Your details</p>
              <h2 className="mt-3 font-display text-2xl uppercase">Almost there</h2>
              <form onSubmit={onSubmit} className="mt-8 space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="label-caps text-muted-foreground">Full name</span>
                    <input required name="name" type="text" placeholder="Your full name" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="label-caps text-muted-foreground">Mobile number</span>
                    <input required name="phone" type="tel" placeholder="+91" className={inputClass} />
                  </label>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <label className="block">
                    <span className="label-caps text-muted-foreground">City</span>
                    <input required name="city" type="text" placeholder="Indore" className={inputClass} />
                  </label>
                  <label className="block">
                    <span className="label-caps text-muted-foreground">Email</span>
                    <input required name="email" type="email" placeholder="you@example.com" className={inputClass} />
                  </label>
                </div>
                <label className="block">
                  <span className="label-caps text-muted-foreground">Short message</span>
                  <textarea
                    name="message"
                    rows={4}
                    maxLength={400}
                    placeholder="A line about the space or what you want to discuss. Optional."
                    className={`${inputClass} resize-none`}
                  />
                </label>
                {error && <p className="text-sm text-destructive">{error}</p>}
                <button
                  type="submit"
                  disabled={state === "sending" || !ready}
                  className="label-caps w-full bg-primary px-8 py-4 text-primary-foreground transition-all duration-300 hover:bg-foreground active:scale-[0.98] disabled:opacity-60 sm:w-auto"
                >
                  {state === "sending" ? "Confirming…" : "Confirm your call"}
                </button>
              </form>
            </div>
          </Reveal>
        )}
      </section>
    </>
  );
}
