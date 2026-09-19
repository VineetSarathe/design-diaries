import {
  CallSettings,
  CALL_SETTINGS_KEY,
} from "../models/call-settings.model";
import { ContactSettings, CONTACT_SETTINGS_KEY } from "../models/contact-settings.model";
import { DEFAULT_CONTACT_SETTINGS } from "./contact-settings.seed";
import { env } from "../config/env";

export async function seedCallSettings(): Promise<void> {
  const existing = await CallSettings.findOne({ key: CALL_SETTINGS_KEY });
  if (existing) {
    if (!existing.accessKey && env.WEB3FORMS_KEY) {
      existing.accessKey = env.WEB3FORMS_KEY;
      await existing.save();
    }
    return;
  }

  const contact = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY });
  const email = contact?.email || DEFAULT_CONTACT_SETTINGS.email;
  await CallSettings.create({
    key: CALL_SETTINGS_KEY,
    email,
    accessKey: env.WEB3FORMS_KEY || "",
  });
  console.log("Call settings ready");
}

export async function getCallNotifyEmail(): Promise<string> {
  const settings = await getCallNotifySettings();
  return settings.email;
}

export async function getCallNotifySettings(): Promise<{ email: string; accessKey: string }> {
  const settings = await CallSettings.findOne({ key: CALL_SETTINGS_KEY });
  const contact = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY });
  return {
    email: settings?.email || contact?.email || DEFAULT_CONTACT_SETTINGS.email,
    accessKey: settings?.accessKey || env.WEB3FORMS_KEY || "",
  };
}
