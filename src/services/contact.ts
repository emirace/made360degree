"use server";

import dbConnect from "@/lib/dbConnect";
import Contact, { IContact } from "@/models/Contact";
import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";

async function isAdmin() {
  const session = await auth();
  return session?.user?.role === "admin";
}

export async function submitContact(data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) {
  await dbConnect();
  try {
    const contact = new Contact({
      ...data,
      isRead: false,
    });
    await contact.save();
    revalidatePath("/dashboard/contact");
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return {
      success: false,
      error: "Failed to send message. Please try again later.",
    };
  }
}

export async function getAllContacts() {
  if (!(await isAdmin())) {
    throw new Error("Unauthorized");
  }

  await dbConnect();
  try {
    const contacts = await Contact.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(contacts));
  } catch (error) {
    console.error("Error fetching contacts:", error);
    return [];
  }
}

export async function markContactAsRead(id: string) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  await dbConnect();
  try {
    const contact = await Contact.findByIdAndUpdate(
      id,
      { isRead: true },
      { new: true },
    );
    if (!contact) return { success: false, error: "Inquiry not found" };

    revalidatePath("/dashboard/contact");
    return { success: true };
  } catch (error) {
    console.error("Error marking contact as read:", error);
    return { success: false, error: "Failed to update inquiry" };
  }
}

export async function deleteContact(id: string) {
  if (!(await isAdmin())) {
    return { success: false, error: "Unauthorized" };
  }

  await dbConnect();
  try {
    const contact = await Contact.findByIdAndDelete(id);
    if (!contact) return { success: false, error: "Inquiry not found" };

    revalidatePath("/dashboard/contact");
    return { success: true };
  } catch (error) {
    console.error("Error deleting contact:", error);
    return { success: false, error: "Failed to delete inquiry" };
  }
}
