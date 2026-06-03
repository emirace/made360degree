import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  MAX_UPLOAD_SIZE_BYTES,
  MAX_UPLOAD_SIZE_LABEL,
  uploadBufferToCloudinary,
} from "@/lib/cloudinary-upload";

const PUBLIC_UPLOAD_FOLDERS = new Set(["made360/receipts"]);

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folderValue = formData.get("folder");
    const folder =
      typeof folderValue === "string" && folderValue.trim()
        ? folderValue
        : "made360/blogs";

    if (!(file instanceof File)) {
      return NextResponse.json(
        { success: false, error: "No file provided" },
        { status: 400 },
      );
    }

    const session = await auth();
    const isPublicFolder = PUBLIC_UPLOAD_FOLDERS.has(folder);

    if (!isPublicFolder && session?.user?.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (file.size > MAX_UPLOAD_SIZE_BYTES) {
      return NextResponse.json(
        {
          success: false,
          error: `File too large. Max ${MAX_UPLOAD_SIZE_LABEL}.`,
        },
        { status: 413 },
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadResponse = await uploadBufferToCloudinary(buffer, folder);

    return NextResponse.json({
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    });
  } catch (error) {
    console.error("Cloudinary API upload error:", error);

    return NextResponse.json(
      { success: false, error: "Failed to upload image" },
      { status: 500 },
    );
  }
}
