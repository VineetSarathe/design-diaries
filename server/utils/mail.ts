import nodemailer from "nodemailer";
import { env } from "../config/env";
import { ContactSettings, CONTACT_SETTINGS_KEY } from "../models/contact-settings.model";

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  fromName?: string;
};

export function normalizeAppPassword(pass: string): string {
  return pass.replace(/\s/g, "");
}

export function buildSmtpConfig(user: string, pass: string, from?: string): SmtpConfig {
  const normalizedUser = user.trim().toLowerCase();
  return {
    host: env.SMTP_HOST || "smtp.gmail.com",
    port: env.SMTP_PORT || 587,
    user: normalizedUser,
    pass: normalizeAppPassword(pass),
    from: (from || env.SMTP_FROM || normalizedUser).trim().toLowerCase(),
  };
}

export function formatSmtpError(err: unknown): string {
  if (err && typeof err === "object") {
    const e = err as {
      code?: string;
      responseCode?: number;
      response?: string;
      message?: string;
    };
    const response = e.response?.trim();
    if (e.responseCode === 535 || response?.includes("535") || response?.includes("BadCredentials")) {
      return "Gmail rejected the login. Use a 16-character App Password (not your normal password) with 2-Step Verification enabled.";
    }
    if (e.code === "ETIMEDOUT" || e.code === "ECONNECTION" || e.code === "ESOCKET") {
      return "Could not reach Gmail SMTP. Check firewall, antivirus, or your internet connection.";
    }
    if (response) return response.split("\n")[0].slice(0, 240);
    if (e.message) return e.message.slice(0, 240);
  }
  return "Gmail SMTP verification failed.";
}

function isGmailConfig(config: SmtpConfig): boolean {
  return config.host.includes("gmail.com") || /@gmail\.com$/i.test(config.user);
}

export async function getSmtpConfig(): Promise<SmtpConfig | null> {
  const settings = await ContactSettings.findOne({ key: CONTACT_SETTINGS_KEY }).select("+smtpPass");
  const user = (settings?.smtpUser || env.SMTP_USER || "").trim().toLowerCase();
  const pass = normalizeAppPassword(settings?.smtpPass || env.SMTP_PASS || "");
  if (!user || !pass) return null;
  return buildSmtpConfig(user, pass);
}

export function isMailConfigured() {
  return Boolean(env.WEB3FORMS_KEY || (env.SMTP_USER && env.SMTP_PASS));
}

function createTransport(config: SmtpConfig) {
  const auth = { user: config.user, pass: normalizeAppPassword(config.pass) };

  if (isGmailConfig(config)) {
    return nodemailer.createTransport({
      service: "gmail",
      auth,
      family: 4,
    });
  }

  return nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    requireTLS: config.port === 587,
    auth,
  });
}

export async function verifySmtp(config?: SmtpConfig | null) {
  const smtp = config ?? (await getSmtpConfig());
  if (!smtp) throw new Error("Gmail SMTP is not configured");
  const transporter = createTransport(smtp);
  await transporter.verify();
  return smtp;
}

export async function sendMail(options: MailOptions) {
  const smtp = await getSmtpConfig();
  if (!smtp) {
    console.warn("Email skipped: add Gmail SMTP on Admin → Contact (app password) or in server/.env");
    return false;
  }

  const transporter = createTransport(smtp);
  const fromName = options.fromName || "Design Diaries";
  await transporter.sendMail({
    from: `"${fromName}" <${smtp.from}>`,
    to: options.to,
    replyTo: options.replyTo || smtp.from,
    subject: options.subject,
    text: options.text,
    html: options.html,
  });
  console.log(`Email sent to ${options.to}`);
  return true;
}

export function thankYouEmailHtml(options: {
  firstName: string;
  studioEmail: string;
  studioPhone: string;
  title?: string;
  body?: string;
}) {
  const phone = options.studioPhone.replace(/\s/g, "");
  const wa = `https://wa.me/${phone.replace(/\D/g, "")}`;
  const title = options.title || "Thank you";
  const body =
    options.body ||
    "Thank you for getting in touch with Design Diaries. We have received your project enquiry. Sagrika will reply within 24 hours on working days.";
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4efe8;font-family:Arial,sans-serif;color:#1c1917;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f4efe8;padding:32px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="560" cellspacing="0" cellpadding="0" style="max-width:560px;background:#ffffff;border:1px solid #e7e0d6;">
            <tr>
              <td style="background:#1c1917;padding:28px 32px;">
                <p style="margin:0;letter-spacing:0.22em;text-transform:uppercase;font-size:11px;color:#c65a3c;">Design Diaries</p>
                <h1 style="margin:12px 0 0;font-size:26px;line-height:1.2;color:#ffffff;">${title}</h1>
              </td>
            </tr>
            <tr>
              <td style="padding:32px;">
                <p style="margin:0 0 16px;font-size:16px;">Hi ${options.firstName},</p>
                <p style="margin:0 0 16px;font-size:16px;line-height:1.6;">${body}</p>
                <p style="margin:0 0 24px;font-size:16px;line-height:1.6;">
                  If you would like to talk sooner, WhatsApp is the fastest route.
                </p>
                <p style="margin:0;">
                  <a href="${wa}" style="display:inline-block;background:#c65a3c;color:#fffaf5;text-decoration:none;letter-spacing:0.16em;text-transform:uppercase;font-size:12px;padding:14px 22px;">Message on WhatsApp</a>
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 32px 32px;color:#6b645c;font-size:13px;line-height:1.6;">
                Design Diaries<br/>
                <a href="mailto:${options.studioEmail}" style="color:#c65a3c;">${options.studioEmail}</a><br/>
                ${options.studioPhone}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}
