"use server";

import dbConnect from "@/lib/dbConnect";
import Booking from "@/models/Booking";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function createBooking(data: {
  serviceType: string;
  name: string;
  email: string;
  phone: string;
  company?: string;
  preferredDate: Date;
  sessionType: "virtual" | "in-person";
  notes?: string;
}) {
  await dbConnect();
  try {
    const booking = new Booking({
      ...data,
      status: "pending",
    });
    await booking.save();
    return { success: true, data: JSON.parse(JSON.stringify(booking)) };
  } catch (error) {
    console.error("Error creating booking:", error);
    return { success: false, error: "Failed to create booking" };
  }
}

export async function getAllBookings() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  try {
    const bookings = await Booking.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(bookings));
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return [];
  }
}

export async function updateBookingStatus(
  id: string,
  status: "pending" | "confirmed" | "cancelled",
) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  await dbConnect();
  try {
    const booking = await Booking.findByIdAndUpdate(
      id,
      { status },
      { new: true },
    );
    if (!booking) return { success: false, error: "Booking not found" };
    revalidatePath("/dashboard/bookings");
    return { success: true, data: JSON.parse(JSON.stringify(booking)) };
  } catch (error) {
    console.error("Error updating booking status:", error);
    return { success: false, error: "Failed to update booking" };
  }
}
