"use server";

import dbConnect from "@/lib/dbConnect";
import Registration, { IRegistration } from "@/models/Registration";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function createRegistration(data: {
  eventId: string;
  name: string;
  email: string;
  amount: number;
  paymentMethod: "card" | "offline";
  paymentStatus?: "pending" | "completed" | "failed";
  transactionId?: string;
}) {
  await dbConnect();
  try {
    const registration = new Registration({
      ...data,
      paymentStatus: data.paymentStatus || "pending",
    });
    await registration.save();
    revalidatePath("/dashboard/events");
    return { success: true, data: JSON.parse(JSON.stringify(registration)) };
  } catch (error) {
    console.error("Error creating registration:", error);
    return { success: false, error: "Failed to create registration" };
  }
}

export async function getRegistrationsByEvent(eventId: string) {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  try {
    const registrations = await Registration.find({ eventId })
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(registrations));
  } catch (error) {
    console.error("Error fetching registrations:", error);
    return [];
  }
}

export async function getAllRegistrations() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  try {
    const registrations = await Registration.find({})
      .populate("eventId", "title date")
      .sort({ createdAt: -1 })
      .lean();
    return JSON.parse(JSON.stringify(registrations));
  } catch (error) {
    console.error("Error fetching all registrations:", error);
    return [];
  }
}

export async function getRegistrationCountByEvent(eventId: string) {
  await dbConnect();
  try {
    const count = await Registration.countDocuments({
      eventId,
      paymentStatus: "completed",
    });
    return count;
  } catch (error) {
    console.error("Error counting registrations:", error);
    return 0;
  }
}

export async function updateRegistrationStatus(
  id: string,
  status: "pending" | "completed" | "failed",
) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  await dbConnect();
  try {
    const registration = await Registration.findByIdAndUpdate(
      id,
      { paymentStatus: status },
      { new: true },
    );
    if (!registration)
      return { success: false, error: "Registration not found" };
    revalidatePath("/dashboard/events");
    return { success: true, data: JSON.parse(JSON.stringify(registration)) };
  } catch (error) {
    console.error("Error updating registration status:", error);
    return { success: false, error: "Failed to update registration" };
  }
}
