import nodemailer from "nodemailer";

let transporter: ReturnType<typeof nodemailer.createTransport> | null = null;

function getTransporter() {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  if (!user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      service: "gmail",
      auth: { user, pass },
    });
  }
  return transporter;
}

function escapeHtml(str: string) {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  };
  return str.replace(/[&<>"']/g, (c) => map[c]);
}

export async function sendWaitlistNotification({
  email,
  name,
}: {
  email: string;
  name: string | null;
}) {
  const t = getTransporter();
  if (!t) {
    console.warn(
      "[mailer] GMAIL_USER / GMAIL_APP_PASSWORD not set — skipping waitlist notification email."
    );
    return;
  }

  const to = process.env.NOTIFY_EMAIL || process.env.GMAIL_USER!;
  const who = name ? `${name} (${email})` : email;

  try {
    await t.sendMail({
      from: `Greppa Waitlist <${process.env.GMAIL_USER}>`,
      to,
      subject: `New waitlist signup: ${email}`,
      text: `${who} just joined the Greppa waitlist.`,
      html: `<p><strong>${name ? escapeHtml(name) : "Someone"}</strong> (${escapeHtml(
        email
      )}) just joined the Greppa waitlist.</p>`,
    });
  } catch (error) {
    console.error("[mailer] Failed to send waitlist notification email", error);
  }
}
