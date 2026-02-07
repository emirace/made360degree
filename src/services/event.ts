"use server";

import dbConnect from "@/lib/dbConnect";
import Event, { IEvent } from "@/models/Event";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function getAllEvents() {
  await dbConnect();
  try {
    const events = await Event.find({}).sort({ date: 1 }).lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

export async function getUpcomingEvents() {
  await dbConnect();
  try {
    const events = await Event.find({ status: "upcoming" })
      .sort({ date: 1 })
      .lean();
    return JSON.parse(JSON.stringify(events));
  } catch (error) {
    return [];
  }
}

export async function getEventById(id: string) {
  await dbConnect();
  try {
    const event = await Event.findById(id).lean();
    if (!event) return null;
    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error("Error fetching event by id:", error);
    return null;
  }
}

export async function createEvent(data: Partial<IEvent>) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  await dbConnect();
  try {
    const event = new Event(data);
    await event.save();
    revalidatePath("/dashboard/events");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(event)) };
  } catch (error) {
    console.error("Error creating event:", error);
    return { success: false, error: "Failed to create event" };
  }
}

export async function updateEvent(id: string, data: Partial<IEvent>) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  await dbConnect();
  try {
    const event = await Event.findByIdAndUpdate(id, data, { new: true });
    if (!event) return { success: false, error: "Event not found" };
    revalidatePath("/dashboard/events");
    revalidatePath("/");
    return { success: true, data: JSON.parse(JSON.stringify(event)) };
  } catch (error) {
    console.error("Error updating event:", error);
    return { success: false, error: "Failed to update event" };
  }
}

export async function deleteEvent(id: string) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  await dbConnect();
  try {
    const event = await Event.findByIdAndDelete(id);
    if (!event) return { success: false, error: "Event not found" };
    revalidatePath("/dashboard/events");
    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return { success: false, error: "Failed to delete event" };
  }
}
