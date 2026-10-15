import { supabase } from "@/integrations/supabase/client";

const TEN_YEARS = 60 * 60 * 24 * 365 * 10;

/** Compresses an image in the browser, uploads it to the media bucket and returns a long-lived URL. */
export async function uploadImage(file: File, folder = "uploads"): Promise<string> {
  if (!file.type.startsWith("image/")) throw new Error("الملف ليس صورة");
  const blob = await compress(file);
  const path = `${folder}/${crypto.randomUUID()}.jpg`;
  const { error } = await supabase.storage.from("media").upload(path, blob, { contentType: "image/jpeg" });
  if (error) throw new Error("فشل رفع الصورة: " + error.message);
  const { data, error: e2 } = await supabase.storage.from("media").createSignedUrl(path, TEN_YEARS);
  if (e2 || !data) throw new Error("تعذر إنشاء رابط الصورة");
  return data.signedUrl;
}

async function compress(file: File, max = 1280, quality = 0.78): Promise<Blob> {
  const bmp = await createImageBitmap(file);
  const scale = Math.min(1, max / Math.max(bmp.width, bmp.height));
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(bmp.width * scale);
  canvas.height = Math.round(bmp.height * scale);
  canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
  return new Promise((res, rej) => canvas.toBlob((b) => (b ? res(b) : rej(new Error("فشل ضغط الصورة"))), "image/jpeg", quality));
}
