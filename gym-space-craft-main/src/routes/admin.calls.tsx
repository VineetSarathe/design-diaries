import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Calendar as CalendarIcon } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdminSession } from "@/hooks/use-admin-session";
import { adminApi, type CallBooking, type CallBookingList } from "@/lib/admin-api";

export const Route = createFileRoute("/admin/calls")({
  head: () => ({
    meta: [
      { title: "Calls | Design Diaries" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminCallsPage,
});

const PAGE_SIZE = 50;

function formatCallDate(ymd: string) {
  const [year, month, day] = ymd.split("-").map(Number);
  if (!year || !month || !day) return ymd;
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function AdminCallsPage() {
  const { admin, loading, logout } = useAdminSession({ required: true });
  const [q, setQ] = useState("");
  const [date, setDate] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<CallBookingList | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notifyEmail, setNotifyEmail] = useState("");
  const [accessKey, setAccessKey] = useState("");
  const [savingEmail, setSavingEmail] = useState(false);
  const [emailSaved, setEmailSaved] = useState(false);
  const dateInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!admin) return;
    let cancelled = false;
    setError(null);
    adminApi
      .listCallBookings({ page, limit: PAGE_SIZE, q, date })
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Could not load calls");
      });
    return () => {
      cancelled = true;
    };
  }, [admin, page, q, date]);

  useEffect(() => {
    if (!admin) return;
    adminApi
      .getCallSettings()
      .then((res) => {
        setNotifyEmail(res.settings.email);
        setAccessKey(res.settings.accessKey || "");
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Could not load email"));
  }, [admin]);

  async function saveEmail(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSavingEmail(true);
    setError(null);
    setEmailSaved(false);
    try {
      const res = await adminApi.updateCallSettings(notifyEmail, accessKey);
      setNotifyEmail(res.settings.email);
      setAccessKey(res.settings.accessKey || "");
      setEmailSaved(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not save email");
    } finally {
      setSavingEmail(false);
    }
  }

  if (loading || !admin) {
    return <div className="min-h-svh bg-background" />;
  }

  const total = data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const bookings = data?.bookings ?? [];

  return (
    <AdminShell admin={admin} onLogout={() => void logout()}>
      <section className="mx-auto max-w-[110rem] px-5 py-16 md:px-10">
        <p className="label-caps text-primary">Bookings</p>
        <h1 className="display-lg mt-4">Calls</h1>
        <p className="mt-4 max-w-xl text-muted-foreground">
          Discovery calls booked from Start a project. A booked time is closed for everyone else.
        </p>

        <form onSubmit={(event) => void saveEmail(event)} className="mt-10 max-w-xl border border-border p-6">
          <p className="label-caps text-primary">Notification email</p>
          <p className="mt-2 text-sm text-muted-foreground">
            Save the inbox email and the Web3Forms access key created with that same Gmail. To change inbox, generate a new key with the new Gmail and paste both here.
          </p>
          <label className="mt-6 block">
            <span className="label-caps text-muted-foreground">Email</span>
            <input
              required
              type="email"
              value={notifyEmail}
              onChange={(event) => setNotifyEmail(event.target.value)}
              className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none transition-colors focus:border-primary"
            />
          </label>
          <label className="mt-6 block">
            <span className="label-caps text-muted-foreground">Web3Forms key</span>
            <input
              required
              type="text"
              value={accessKey}
              onChange={(event) => setAccessKey(event.target.value)}
              autoComplete="off"
              className="mt-2 w-full border-b border-input bg-transparent py-3 outline-none transition-colors focus:border-primary"
            />
          </label>
          {emailSaved && <p className="mt-3 text-sm text-muted-foreground">Saved. New forms will use this email and key.</p>}
          <button
            type="submit"
            disabled={savingEmail}
            className="label-caps mt-6 bg-primary px-6 py-3 text-primary-foreground transition-colors hover:bg-foreground disabled:opacity-60"
          >
            {savingEmail ? "Saving…" : "Save"}
          </button>
        </form>

        <form
          className="mt-10 flex flex-wrap items-end gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            setPage(1);
            setQ(String(form.get("q") ?? "").trim());
            setDate(String(form.get("date") ?? "").trim());
          }}
        >
          <input
            name="q"
            defaultValue={q}
            placeholder="Search name, phone, city"
            className="min-w-[16rem] flex-1 border-b border-input bg-transparent py-3 outline-none transition-colors focus:border-primary"
          />
          <label className="relative block min-w-[12rem]">
            <span className="label-caps text-[0.65rem] text-muted-foreground">Date</span>
            <input
              ref={dateInputRef}
              name="date"
              type="date"
              defaultValue={date}
              className="mt-1 w-full cursor-pointer border-b border-input bg-transparent py-3 pr-8 outline-none focus:border-primary [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:h-4 [&::-webkit-calendar-picker-indicator]:w-4 [&::-webkit-calendar-picker-indicator]:opacity-0"
            />
            <button
              type="button"
              aria-label="Open calendar"
              onClick={() => dateInputRef.current?.showPicker?.()}
              className="absolute right-0 bottom-3 cursor-pointer text-muted-foreground transition-colors hover:text-primary"
            >
              <CalendarIcon className="h-4 w-4" />
            </button>
          </label>
          <button
            type="submit"
            className="label-caps border border-input px-5 py-3 transition-colors hover:border-primary hover:text-primary"
          >
            Filter
          </button>
        </form>

        <p className="label-caps mt-8 text-muted-foreground">
          {total} call{total === 1 ? "" : "s"}
        </p>
        {error && <p className="mt-3 text-sm text-destructive">{error}</p>}

        <div className="mt-5">
          {bookings.length === 0 ? (
            <div className="border border-border px-6 py-16 text-center">
              <p className="label-caps text-primary">No calls yet</p>
              <p className="mt-3 text-muted-foreground">Booked discovery calls will appear here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto border border-border">
              <table className="w-full min-w-[56rem] text-left text-sm">
                <thead className="border-b border-border bg-secondary/60">
                  <tr>
                    {["Name", "Mobile", "City", "Date", "Time", "Message"].map((heading) => (
                      <th key={heading} className="label-caps px-4 py-3 font-medium text-muted-foreground">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {bookings.map((booking: CallBooking) => (
                    <tr key={booking.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-4">{booking.name}</td>
                      <td className="px-4 py-4">{booking.phone}</td>
                      <td className="px-4 py-4">{booking.city}</td>
                      <td className="px-4 py-4">{formatCallDate(booking.date)}</td>
                      <td className="px-4 py-4">{booking.slot}</td>
                      <td className="max-w-[20rem] px-4 py-4 text-muted-foreground">{booking.message}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {pageCount > 1 && (
          <div className="mt-8 flex items-center gap-4">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((value) => value - 1)}
              className="label-caps border border-input px-4 py-2 disabled:opacity-40"
            >
              Previous
            </button>
            <p className="text-sm text-muted-foreground">
              Page {page} of {pageCount}
            </p>
            <button
              type="button"
              disabled={page >= pageCount}
              onClick={() => setPage((value) => value + 1)}
              className="label-caps border border-input px-4 py-2 disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </AdminShell>
  );
}
