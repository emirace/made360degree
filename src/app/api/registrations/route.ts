import { NextRequest, NextResponse } from "next/server";
import { createRegistration } from "@/services/registration";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      eventId,
      name,
      email,
      amount,
      paymentMethod,
      transactionId,
      paymentStatus,
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
      amount,
      paymentMethod,
      transactionId,
      paymentStatus: paymentStatus || "completed", // Default to completed for successful payments
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
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
