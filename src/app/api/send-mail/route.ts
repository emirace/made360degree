import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mailer";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { to, eventTitle, content } = body || {};
    if (!to || !eventTitle || !content) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    await sendMail({ to, eventTitle, content });

    return NextResponse.json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error("/api/send-mail error", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
