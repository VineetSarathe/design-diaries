import { API_BASE } from "@/lib/api";

export type NotifyField = {
  label: string;
  value: string;
};

async function getNotifySettings() {
  try {
    const res = await fetch(`${API_BASE}/call-settings`);
    const data = (await res.json().catch(() => null)) as {
      ok?: boolean;
      settings?: { email?: string; accessKey?: string };
    } | null;
    if (!data?.ok) return { email: "", accessKey: "" };
    const email = data.settings?.email?.trim() || "";
    const accessKey = data.settings?.accessKey?.trim() || "";
    return {
      email: email.includes("@") ? email : "",
      accessKey,
    };
  } catch {
    return { email: "", accessKey: "" };
  }
}

async function postWeb3Forms(body: Record<string, string>) {
  const res = await fetch("https://api.web3forms.com/submit", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify(body),
  });
  return (await res.json().catch(() => null)) as { success?: boolean; message?: string } | null;
}

function buildMessage(options: { eyebrow: string; heading: string; intro: string; fields: NotifyField[] }) {
  const details = options.fields
    .filter((field) => field.value.trim())
    .map((field) => `${field.label}\n${field.value}`)
    .join("\n\n");

  return [
    "DESIGN DIARIES",
    options.eyebrow.toUpperCase(),
    "",
    options.heading,
    "",
    options.intro,
    "",
    "────────────",
    "",
    details,
    "",
    "────────────",
    "Open the admin panel for the full record.",
  ].join("\n");
}

export async function notifyAdmin(options: {
  subject: string;
  eyebrow: string;
  heading: string;
  intro: string;
  fields: NotifyField[];
  name?: string;
  replyTo?: string;
}) {
  const settings = await getNotifySettings();
  const accessKey = settings.accessKey;
  if (!accessKey) return;

  try {
    const data = await postWeb3Forms({
      access_key: accessKey,
      subject: options.subject,
      from_name: "Design Diaries",
      email: options.replyTo || settings.email || "designdiariesbysagrika@gmail.com",
      message: buildMessage(options),
    });
    if (!data?.success) {
      console.warn("Admin email was not sent", data?.message);
    }
  } catch (err) {
    console.warn("Admin email was not sent", err);
  }
}
