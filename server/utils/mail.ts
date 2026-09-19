import nodemailer from "nodemailer";
import { env } from "../config/env";

export function isMailConfigured() {
  return Boolean(env.WEB3FORMS_KEY || (env.SMTP_USER && env.SMTP_PASS));
}

type MailOptions = {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
  fromName?: string;
};

async function sendViaSmtp(options: MailOptions) {
  const host = env.SMTP_HOST || "smtp.gmail.com";
  const port = env.SMTP_PORT || 587;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    requireTLS: port === 587,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS.replace(/\s/g, ""),
    },
  });

  await transporter.sendMail({
    from: env.SMTP_FROM || env.SMTP_USER,
    to: options.to,
    replyTo: options.replyTo,
    subject: options.subject,
    text: options.text,
  });
}

export async function sendMail(options: MailOptions) {
  if (env.WEB3FORMS_KEY) {
    // Browser sends Web3Forms; Node gets Cloudflare 403 from this network.
    return false;
  }
  if (!env.SMTP_USER || !env.SMTP_PASS) {
    console.warn("Admin notification email skipped: set WEB3FORMS_KEY or SMTP in server/.env");
    return false;
  }
  await sendViaSmtp(options);
  console.log(`Admin notification email sent to ${options.to}`);
  return true;
}
