"use server";

import cloudinary from "@/lib/cloudinary";
import { auth } from "@/lib/auth";

export async function uploadImage(
  fileBase64: string,
  folder: string = "made360/blogs",
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: folder,
      resource_type: "auto",
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}

export async function uploadImagePublic(
  fileBase64: string,
  folder: string = "made360/receipts",
) {
  try {
    const uploadResponse = await cloudinary.uploader.upload(fileBase64, {
      folder: folder,
      resource_type: "auto",
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return { success: false, error: "Failed to upload image" };
  }
}
