"use server";

import { auth } from "@/lib/auth";
import {
  MAX_UPLOAD_SIZE_LABEL,
  isWithinUploadLimit,
  uploadBase64ToCloudinary,
} from "@/lib/cloudinary-upload";

export async function uploadImage(
  fileBase64: string,
  folder: string = "made360/blogs",
) {
  const session = await auth();
  if (session?.user?.role !== "admin") {
    return { success: false, error: "Unauthorized" };
  }

  if (!isWithinUploadLimit(fileBase64)) {
    return { success: false, error: `File too large. Max ${MAX_UPLOAD_SIZE_LABEL}.` };
  }

  try {
    const uploadResponse = await uploadBase64ToCloudinary(fileBase64, folder);

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
  if (!isWithinUploadLimit(fileBase64)) {
    return { success: false, error: `File too large. Max ${MAX_UPLOAD_SIZE_LABEL}.` };
  }

  try {
    const uploadResponse = await uploadBase64ToCloudinary(fileBase64, folder);

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
