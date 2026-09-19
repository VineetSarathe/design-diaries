import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { CalendarDays, ChevronDown, Clock, Globe } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  getCallAvailability,
  isSlotTaken,
  type CallAvailability,
} from "@/lib/call-booking";

function ymdToDate(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function dateToYmd(value: Date) {
  return `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, "0")}-${String(value.getDate()).padStart(2, "0")}`;
}

export function CalendarEmbed({ compact = false }: { compact?: boolean }) {
  const navigate = useNavigate();
  const [availability, setAvailability] = useState<CallAvailability | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    getCallAvailability()
      .then((data) => {
        if (cancelled) return;
        setAvailability(data);
        const firstOpen = data.dates.find((day) => data.slots.some((slot) => !isSlotTaken(data, day.date, slot.id)));
        setSelectedDate(firstOpen?.date || data.dates[0]?.date || "");
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load times");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const allowed = useMemo(() => new Set(availability?.dates.map((day) => day.date) ?? []), [availability]);
  const selectedLabel = availability?.dates.find((day) => day.date === selectedDate)?.label || "Select a date";
  const from = availability?.dates[0] ? ymdToDate(availability.dates[0].date) : undefined;
  const to = availability?.dates.length ? ymdToDate(availability.dates[availability.dates.length - 1].date) : undefined;

  function bookSlot(slotId: string) {
    if (!selectedDate) return;
    void navigate({
      to: "/book-a-call",
      search: { date: selectedDate, slot: slotId },
    });
  }

  return (
    <div className="border border-border bg-card text-foreground">
      <div className={`border-b border-border ${compact ? "px-5 py-5 md:px-6" : "px-5 py-6 md:px-8 md:py-7"}`}>
        <p className="label-caps text-primary">Calendar</p>
        <h3 className="mt-3 font-display text-2xl uppercase leading-tight md:text-[1.75rem]">
          30 minutes, no pitch deck
        </h3>
        {!compact && (
          <p className="mt-3 max-w-md text-sm leading-relaxed text-muted-foreground">
            Your space, your model, your peak hour. You leave with an initial view on capacity and
            layout either way.
          </p>
        )}
        <div className="label-caps mt-5 flex flex-wrap gap-x-5 gap-y-2 text-muted-foreground">
          <span className="inline-flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" /> 30 min
          </span>
          <span className="inline-flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-primary" /> Every day
          </span>
          <span className="inline-flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> India time
          </span>
        </div>
      </div>

      <div className={compact ? "px-5 py-5 md:px-6 md:py-6" : "px-5 py-6 md:px-8 md:py-7"}>
        {error && <p className="text-sm text-destructive">{error}</p>}

        {!availability && !error && (
          <div className="grid gap-8 lg:grid-cols-2">
            <div className="h-16 bg-muted" />
            <div className="h-16 bg-muted" />
          </div>
        )}

        {availability && (
          <div className="grid items-start gap-8 lg:grid-cols-2">
            <div>
              <p className="label-caps text-muted-foreground">Date</p>
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-between border border-input px-4 py-4 text-left transition-colors hover:border-primary"
                  >
                    <span>
                      <span className="label-caps block text-muted-foreground">Choose date</span>
                      <span className="mt-2 block font-display text-xl uppercase leading-none">{selectedLabel}</span>
                    </span>
                    <ChevronDown className={`h-5 w-5 text-primary transition-transform ${dateOpen ? "rotate-180" : ""}`} />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-auto rounded-none border-border bg-card p-0 shadow-2xl"
                >
                  <Calendar
                    mode="single"
                    selected={selectedDate ? ymdToDate(selectedDate) : undefined}
                    defaultMonth={selectedDate ? ymdToDate(selectedDate) : from}
                    onSelect={(value) => {
                      if (!value) return;
                      const next = dateToYmd(value);
                      if (!allowed.has(next)) return;
                      setSelectedDate(next);
                      setDateOpen(false);
                    }}
                    disabled={(value) => !allowed.has(dateToYmd(value))}
                    startMonth={from}
                    endMonth={to}
                    className="p-4"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <p className="label-caps text-muted-foreground">Call time</p>
              <Popover open={timeOpen} onOpenChange={setTimeOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="mt-4 flex w-full items-center justify-between border border-input px-4 py-4 text-left transition-colors hover:border-primary"
                  >
                    <span>
                      <span className="label-caps block text-muted-foreground">Choose time</span>
                      <span className="mt-2 block font-display text-xl uppercase leading-none">Select a time</span>
                    </span>
                    <ChevronDown className={`h-5 w-5 text-primary transition-transform ${timeOpen ? "rotate-180" : ""}`} />
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  align="start"
                  className="w-[var(--radix-popover-trigger-width)] rounded-none border-border bg-card p-0 shadow-2xl"
                >
                  <div className="max-h-80 overflow-y-auto">
                    {availability.slots.map((slot) => {
                      const taken = selectedDate ? isSlotTaken(availability, selectedDate, slot.id) : true;
                      return (
                        <button
                          key={slot.id}
                          type="button"
                          disabled={taken}
                          onClick={() => {
                            setTimeOpen(false);
                            bookSlot(slot.id);
                          }}
                          className={`flex w-full items-center justify-between border-b border-border px-4 py-3.5 text-left last:border-b-0 ${
                            taken
                              ? "cursor-not-allowed text-muted-foreground/40"
                              : "transition-colors hover:bg-secondary hover:text-primary"
                          }`}
                        >
                          <span className="label-caps">{slot.label}</span>
                          <span className="text-xs text-muted-foreground">{taken ? "Booked" : "Open"}</span>
                        </button>
                      );
                    })}
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
