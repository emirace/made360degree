import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  // host: process.env.SMTP_HOST || "smtp.gmail.com",
  // port: Number(process.env.SMTP_PORT) || 465,
  // secure: process.env.SMTP_SECURE === "true",
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const FROM = process.env.SMTP_FROM || "Made360 <noreply@made360.com>";

// ── Shared HTML wrapper ──────────────────────────────────────────────────────
function wrapHtml(content: string) {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { margin:0; padding:0; background:#f4f4f5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    .wrapper { max-width:580px; margin:40px auto; background:#fff; border-radius:12px; overflow:hidden; box-shadow:0 2px 12px rgba(0,0,0,.08); }
    .header { background:#111; padding:32px 40px; text-align:center; }
    .header h1 { margin:0; color:#fff; font-size:22px; letter-spacing:-0.3px; }
    .header span { color:#a855f7; }
    .body { padding:36px 40px; color:#374151; line-height:1.6; }
    .body h2 { margin:0 0 12px; font-size:20px; color:#111; }
    .body p { margin:0 0 16px; }
    .detail-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px; padding:20px; margin:20px 0; }
    .detail-box .row { display:flex; justify-content:space-between; padding:6px 0; border-bottom:1px solid #f0f0f0; font-size:14px; }
    .detail-box .row:last-child { border-bottom:none; }
    .detail-box .label { color:#6b7280; }
    .detail-box .value { font-weight:600; color:#111; }
    .badge { display:inline-block; padding:4px 12px; border-radius:999px; font-size:13px; font-weight:600; }
    .badge-green { background:#d1fae5; color:#065f46; }
    .badge-red { background:#fee2e2; color:#991b1b; }
    .badge-amber { background:#fef3c7; color:#92400e; }
    .btn { display:inline-block; margin-top:8px; padding:14px 32px; background:#a855f7; color:#fff; border-radius:8px; text-decoration:none; font-weight:700; font-size:15px; }
    .footer { background:#f9fafb; border-top:1px solid #e5e7eb; padding:20px 40px; text-align:center; color:#9ca3af; font-size:12px; }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="header">
      <h1>Made<span>360</span></h1>
    </div>
    <div class="body">
      ${content}
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} Made360. All rights reserved.</p>
      <p>If you did not register for this event, please ignore this email.</p>
    </div>
  </div>
</body>
</html>`;
}

// ── Email: Gateway payment confirmed ────────────────────────────────────────
export async function sendPaymentConfirmedEmail(opts: {
  to: string;
  name: string;
  eventTitle: string;
  eventDate: string;
  amount: number;
  transactionId?: string;
}) {
  const html = wrapHtml(`
    <h2>Payment Confirmed ✓</h2>
    <p>Hi <strong>${opts.name}</strong>,</p>
    <p>Your payment has been received and your seat is officially booked for <strong>${opts.eventTitle}</strong>. We look forward to seeing you!</p>
    <div class="detail-box">
      <div class="row"><span class="label">Event</span><span class="value">${opts.eventTitle}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${opts.eventDate}</span></div>
      <div class="row"><span class="label">Amount Paid</span><span class="value">₦${opts.amount.toLocaleString()}</span></div>
      ${opts.transactionId ? `<div class="row"><span class="label">Transaction ID</span><span class="value">${opts.transactionId}</span></div>` : ""}
      <div class="row"><span class="label">Status</span><span class="value"><span class="badge badge-green">Confirmed</span></span></div>
    </div>
    <p>Please keep this email as your registration confirmation. See you at the event!</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: `✅ Registration Confirmed — ${opts.eventTitle}`,
    html,
  });
}

// ── Email: Manual transfer submitted (pending) ───────────────────────────────
export async function sendTransferSubmittedEmail(opts: {
  to: string;
  name: string;
  eventTitle: string;
  amount: number;
  phone?: string;
  receiptUrl?: string;
  dashboardUrl?: string;
}) {
  const html = wrapHtml(`
    <h2>Transfer Received — Under Review</h2>
    <p>Hi <strong>${opts.name}</strong>,</p>
    <p>Thank you for submitting your payment for <strong>${opts.eventTitle}</strong>. Our team will verify your receipt and confirm your registration within <strong>24 hours</strong>.</p>
    <div class="detail-box">
      <div class="row"><span class="label">Event</span><span class="value">${opts.eventTitle}</span></div>
      <div class="row"><span class="label">Amount</span><span class="value">₦${opts.amount.toLocaleString()}</span></div>
      <div class="row"><span class="label">Status</span><span class="value"><span class="badge badge-amber">Pending Review</span></span></div>
    </div>
    <p>You will receive another email once your registration is confirmed. If you have any questions, please contact us.</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: `⏳ Payment Under Review — ${opts.eventTitle}`,
    html,
  });

  const adminHtml = wrapHtml(`
    <h2>Manual Transfer Pending Review ⏳</h2>
    <p>Hello Admin,</p>
    <p>A new registration has been submitted via <strong>Manual Bank Transfer</strong> and is awaiting your verification.</p>
    <div class="detail-box">
      <div class="row"><span class="label">Event</span><span class="value">${opts.eventTitle}</span></div>
      <div class="row"><span class="label">Amount</span><span class="value">₦${opts.amount.toLocaleString()}</span></div>
      <div class="row"><span class="label">User Name</span><span class="value">${opts.name}</span></div>
      <div class="row"><span class="label">User Email</span><span class="value">${opts.to}</span></div>
      ${opts.phone ? `<div class="row"><span class="label">User Phone</span><span class="value">${opts.phone}</span></div>` : ""}
      <div class="row"><span class="label">Status</span><span class="value"><span class="badge badge-amber">Pending Verification</span></span></div>
    </div>
    <p>Please cross-reference the payment in your bank account. If the payment is valid, you can approve the registration in the admin dashboard.</p>
    <div style="text-align: center; margin: 24px 0 10px 0;">
      ${opts.receiptUrl ? `<a href="${opts.receiptUrl}" target="_blank" class="btn" style="background: #4b5563; margin-right: 12px; margin-bottom: 8px;">View Payment Receipt</a>` : ""}
      ${opts.dashboardUrl ? `<a href="${opts.dashboardUrl}" target="_blank" class="btn" style="margin-bottom: 8px;">Go to Dashboard</a>` : ""}
    </div>
  `);

  await transporter.sendMail({
    from: FROM,
    to: process.env.ADMIN_EMAIL || "sandranwafor67@gmail.com",
    subject: `⏳ New Registration Notification — ${opts.name} (${opts.eventTitle})`,
    html: adminHtml,
  });
}

// ── Email: Registration approved ────────────────────────────────────────────
export async function sendRegistrationApprovedEmail(opts: {
  to: string;
  name: string;
  eventTitle: string;
  eventDate: string;
  amount: number;
}) {
  const html = wrapHtml(`
    <h2>Registration Approved 🎉</h2>
    <p>Hi <strong>${opts.name}</strong>,</p>
    <p>Great news! Your payment has been verified and your registration for <strong>${opts.eventTitle}</strong> is now <strong>confirmed</strong>.</p>
    <div class="detail-box">
      <div class="row"><span class="label">Event</span><span class="value">${opts.eventTitle}</span></div>
      <div class="row"><span class="label">Date</span><span class="value">${opts.eventDate}</span></div>
      <div class="row"><span class="label">Amount Paid</span><span class="value">₦${opts.amount.toLocaleString()}</span></div>
      <div class="row"><span class="label">Status</span><span class="value"><span class="badge badge-green">Approved</span></span></div>
    </div>
    <p>We look forward to seeing you at the event!</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: `🎉 Registration Confirmed — ${opts.eventTitle}`,
    html,
  });
}

// ── Email: Registration rejected ────────────────────────────────────────────
export async function sendRegistrationRejectedEmail(opts: {
  to: string;
  name: string;
  eventTitle: string;
}) {
  const html = wrapHtml(`
    <h2>Registration Update</h2>
    <p>Hi <strong>${opts.name}</strong>,</p>
    <p>Unfortunately, we were unable to verify the payment receipt you submitted for <strong>${opts.eventTitle}</strong>. Your registration could not be confirmed at this time.</p>
    <div class="detail-box">
      <div class="row"><span class="label">Event</span><span class="value">${opts.eventTitle}</span></div>
      <div class="row"><span class="label">Status</span><span class="value"><span class="badge badge-red">Not Confirmed</span></span></div>
    </div>
    <p>If you believe this is an error, please contact us with your original payment receipt and we will review it promptly.</p>
  `);

  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: `Registration Update — ${opts.eventTitle}`,
    html,
  });
}

export async function sendMail(opts: {
  to: string;
  eventTitle: string;
  content: string;
}) {
  console.log("hellllo", {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  });
  await transporter.sendMail({
    from: FROM,
    to: opts.to,
    subject: `Registration Update — ${opts.eventTitle}`,
    html: wrapHtml(opts.content),
  });
}
