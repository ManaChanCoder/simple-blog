import { supabase } from "../connection/connectionDb";
import type { PostState } from "../interface";

/* =======================
   DATE FORMATTER
======================= */
export const formatDate = (dateStr?: string | null) => {
  if (!dateStr) return "No Date";

  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return "Invalid date";

  return `${d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })} | ${d.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
};

/* =======================
   TEXT TRUNCATE
======================= */
export const wordTruncate = (text?: string | null, wordLimit = 20) => {
  if (!text) return "";

  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
};

/* =======================
   IMAGE UPLOAD
======================= */
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImage(file: File): Promise<string> {
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error("Only JPG, PNG, WEBP allowed");
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error("File size must be <= 2MB");
  }

  const filePath = `posts/${Date.now()}_${file.name}`;

  const { error } = await supabase.storage
    .from("blog-images")
    .upload(filePath, file, { upsert: true });

  if (error) throw error;

  const { data } = supabase.storage.from("blog-images").getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error("Unable to get public URL");
  }

  return data.publicUrl;
}

/* =======================
   CREATE POST
======================= */
export async function createPost({
  title,
  description,
  image_url,
  user_id,
}: PostState) {
  const { data, error } = await supabase.from("blog").insert([
    {
      title,
      description,
      image_url: image_url ?? null,
      user_id,
    },
  ]);

  if (error) throw error;
  return data;
}

/* =======================
   UPDATE POST
======================= */
export async function updatePost(
  id: number,
  payload: {
    title: string;
    description: string;
    image_url?: string | null;
  },
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("blog")
    .update({
      ...payload,
      image_url: payload.image_url ?? null,
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("No row updated");

  return data;
}

/* =======================
   DELETE POST + IMAGE
======================= */
export async function deletePostWithImage(
  id: number,
  imageUrl?: string | null,
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  if (imageUrl) {
    const path = imageUrl.split("/blog-images/")[1];
    if (path) {
      await supabase.storage.from("blog-images").remove([path]);
    }
  }

  const { error } = await supabase
    .from("blog")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) throw error;
}
