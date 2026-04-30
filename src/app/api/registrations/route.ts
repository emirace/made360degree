import { NextRequest, NextResponse } from "next/server";
import { createRegistration } from "@/services/registration";
import {
  sendPaymentConfirmedEmail,
  sendTransferSubmittedEmail,
} from "@/lib/mailer";
import Event from "@/models/Event";
import dbConnect from "@/lib/dbConnect";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      name,
      email,
      phone,
      amount,
      paymentMethod,
      transactionId,
      paymentStatus,
      receiptUrl,
    } = body;

    if (!eventId || !name || !email || !amount || !paymentMethod) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await createRegistration({
      eventId,
      name,
      email,
      phone,
      amount,
      paymentMethod,
      transactionId,
      paymentStatus: paymentStatus || "pending",
      receiptUrl,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    // ── Send email notifications (non-fatal) ──────────────────────────────
    try {
      await dbConnect();
      const event = await Event.findById(eventId).lean() as any;
      const eventTitle = event?.title || "the event";
      const eventDate = event?.date
        ? new Date(event.date).toLocaleDateString("en-GB", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "";

      if (paymentMethod === "card" && paymentStatus === "completed") {
        // Gateway payment confirmed
        await sendPaymentConfirmedEmail({
          to: email,
          name,
          eventTitle,
          eventDate,
          amount,
          transactionId,
        });
      } else if (paymentMethod === "manual_transfer") {
        // Manual transfer submitted — pending review
        await sendTransferSubmittedEmail({
          to: email,
          name,
          eventTitle,
          amount,
        });
      }
    } catch (emailErr) {
      console.error("Failed to send registration email:", emailErr);
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error in registration API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
