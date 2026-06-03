import cloudinary from "@/lib/cloudinary";
import type { UploadApiResponse } from "cloudinary";

export const MAX_UPLOAD_SIZE_BYTES = 5 * 1024 * 1024;
export const MAX_UPLOAD_SIZE_LABEL = "5MB";

export function isWithinUploadLimit(fileBase64: string) {
  const base64Data = fileBase64.includes(",")
    ? fileBase64.split(",")[1]
    : fileBase64;

  return Buffer.byteLength(base64Data, "base64") <= MAX_UPLOAD_SIZE_BYTES;
}

export async function uploadBase64ToCloudinary(
  fileBase64: string,
  folder: string,
) {
  return cloudinary.uploader.upload(fileBase64, {
    folder,
    resource_type: "auto",
  });
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  folder: string,
) {
  return new Promise<UploadApiResponse>((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "auto",
      },
      (error, result) => {
        if (error) {
          reject(error);
          return;
        }

        if (!result) {
          reject(new Error("Cloudinary upload returned no result"));
          return;
        }

        resolve(result);
      },
    );

    stream.end(buffer);
  });
}
