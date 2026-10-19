const escapeHtml = (value: string) =>
  value.replace(/[&<>"']/g, (char) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
      char
    ] as string,
  );

export function welcomeEmail(firstName: string) {
  const name = escapeHtml(firstName);

  const html = `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#F7F7F9;font-family:Arial,Helvetica,sans-serif;color:#171717;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;">
          <tr><td style="background:#02BC75;padding:28px 32px;color:#ffffff;">
            <h1 style="margin:0;font-size:24px;">Welcome to the Movement</h1>
          </td></tr>
          <tr><td style="padding:32px;font-size:16px;line-height:1.6;">
            <p style="margin:0 0 16px;">Hi ${name},</p>
            <p style="margin:0 0 16px;">Thank you for registering with the <strong>City Boy Movement</strong>. Your membership is confirmed, and we're proud to have you with us.</p>
            <p style="margin:0 0 16px;">Together we mobilise, organise and build a better Plateau. Here's what happens next:</p>
            <ul style="margin:0 0 16px;padding-left:20px;">
              <li>Keep your details up to date on your profile.</li>
              <li>Invite friends and family to join with your referral link.</li>
              <li>Watch out for updates from your ward and polling unit teams.</li>
            </ul>
            <p style="margin:24px 0;"><a href="https://cbmnigeria.org/login" style="background:#02BC75;color:#ffffff;text-decoration:none;padding:12px 24px;border-radius:10px;font-weight:bold;display:inline-block;">Sign in to your account</a></p>
            <p style="margin:0;">In solidarity,<br/>The City Boy Movement Team</p>
          </td></tr>
          <tr><td style="padding:16px 32px;background:#F7F7F9;font-size:12px;color:#6b7280;">
            You received this email because you registered with the City Boy Movement. You can withdraw your data consent at any time from your profile.
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;

  const text = `Hi ${firstName},

Thank you for registering with the City Boy Movement, Plateau State. Your membership is confirmed, and we're proud to have you with us.

Next steps:
- Keep your details up to date on your profile.
- Invite friends and family to join with your referral link.
- Watch out for updates from your ward and polling unit teams.

Sign in: https://cbmnigeria.org/login

In solidarity,
The City Boy Movement Team`;

  return { subject: "Welcome to the City Boy Movement!", html, text };
}
