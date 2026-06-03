export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export async function uploadFile(
  file: File,
  folder: string = "made360/blogs",
): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/upload", {
    method: "POST",
    body: formData,
  });
  const result = (await response.json()) as UploadResult;

  if (!response.ok && !result.error) {
    return { success: false, error: "Failed to upload image" };
  }

  return result;
}
