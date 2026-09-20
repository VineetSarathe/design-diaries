export const CALL_TIMEZONE = "Asia/Kolkata";
export const CALL_DAYS = 60;

export const CALL_SLOTS = [
  { id: "11:00-11:30", label: "11:00-11:30", startHour: 11, startMin: 0 },
  { id: "12:00-12:30", label: "12:00-12:30", startHour: 12, startMin: 0 },
  { id: "01:00-01:30", label: "01:00-01:30", startHour: 13, startMin: 0 },
  { id: "02:00-2:30", label: "02:00-2:30", startHour: 14, startMin: 0 },
  { id: "3:30-4:00", label: "3:30-4:00", startHour: 15, startMin: 30 },
  { id: "4:30-5:00", label: "4:30-5:00", startHour: 16, startMin: 30 },
  { id: "5:30-6:00", label: "5:30-6:00", startHour: 17, startMin: 30 },
  { id: "6:30-7:00", label: "6:30-7:00", startHour: 18, startMin: 30 },
] as const;

export type CallSlotId = (typeof CALL_SLOTS)[number]["id"];

const SLOT_IDS = new Set<string>(CALL_SLOTS.map((slot) => slot.id));

export function isCallSlotId(value: string): value is CallSlotId {
  return SLOT_IDS.has(value);
}

function partNumber(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return Number(parts.find((part) => part.type === type)?.value);
}

export function nowInCallZone() {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: CALL_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date());

  return {
    year: partNumber(parts, "year"),
    month: partNumber(parts, "month"),
    day: partNumber(parts, "day"),
    hour: partNumber(parts, "hour"),
    minute: partNumber(parts, "minute"),
  };
}

export function todayYmd() {
  const now = nowInCallZone();
  return `${now.year}-${String(now.month).padStart(2, "0")}-${String(now.day).padStart(2, "0")}`;
}

export function addDaysYmd(ymd: string, days: number) {
  const [year, month, day] = ymd.split("-").map(Number);
  const next = new Date(Date.UTC(year, month - 1, day + days));
  return next.toISOString().slice(0, 10);
}

export function isYmd(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function dateLabel(ymd: string, today = todayYmd()) {
  if (ymd === today) return "Today";
  if (ymd === addDaysYmd(today, 1)) return "Tomorrow";
  const [year, month, day] = ymd.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day)).toLocaleDateString("en-GB", {
    timeZone: "UTC",
    day: "numeric",
    month: "long",
  });
}

export function bookingWindow() {
  const today = todayYmd();
  return {
    today,
    start: today,
    end: addDaysYmd(today, CALL_DAYS - 1),
    dates: Array.from({ length: CALL_DAYS }, (_, index) => {
      const date = addDaysYmd(today, index);
      return { date, label: dateLabel(date, today) };
    }),
  };
}

export function isDateInWindow(ymd: string) {
  if (!isYmd(ymd)) return false;
  const { start, end } = bookingWindow();
  return ymd >= start && ymd <= end;
}

export function isSlotPast(ymd: string, slotId: string) {
  const slot = CALL_SLOTS.find((item) => item.id === slotId);
  if (!slot) return true;
  const today = todayYmd();
  if (ymd > today) return false;
  if (ymd < today) return true;
  const now = nowInCallZone();
  return now.hour > slot.startHour || (now.hour === slot.startHour && now.minute >= slot.startMin);
}

export function slotKey(date: string, slot: string) {
  return `${date}|${slot}`;
}
