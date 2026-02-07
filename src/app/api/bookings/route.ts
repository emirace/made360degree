import { NextRequest, NextResponse } from "next/server";
import { createBooking } from "@/services/booking";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      serviceType,
      name,
      email,
      phone,
      company,
      preferredDate,
      sessionType,
      notes,
    } = body;

    if (
      !serviceType ||
      !name ||
      !email ||
      !phone ||
      !preferredDate ||
      !sessionType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await createBooking({
      serviceType,
      name,
      email,
      phone,
      company,
      preferredDate: new Date(preferredDate),
      sessionType,
      notes,
    });

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 });
    }

    return NextResponse.json(result.data, { status: 201 });
  } catch (error) {
    console.error("Error in booking API:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
