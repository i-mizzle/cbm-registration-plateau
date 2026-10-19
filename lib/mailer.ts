import { Resend } from "resend";

type MailOptions = {
  to: string;
  subject: string;
  html: string;
  text: string;
};

export async function sendMail({ to, subject, html, text }: MailOptions) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.MAIL_FROM;
  if (!apiKey || !from) {
    throw new Error("RESEND_API_KEY and MAIL_FROM must be set in .env");
  }

  const { error } = await new Resend(apiKey).emails.send({
    from,
    to,
    subject,
    html,
    text,
  });
  if (error) throw new Error(`Resend error: ${error.message}`);
}
