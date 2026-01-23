import { supabase } from "../connection/connectionDb";
import type { PostState } from "../interface";

export const formatDate = (dateStr: string) => {
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

export const wordTruncate = (text: string, wordLimit: number) => {
  if (!text) return "";

  const words = text.split(/\s+/);
  if (words.length <= wordLimit) return text;

  return words.slice(0, wordLimit).join(" ") + "...";
};

const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadImage(file: File) {
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

  const { data: urlData } = supabase.storage
    .from("blog-images")
    .getPublicUrl(filePath);

  if (!urlData?.publicUrl) {
    throw new Error("Unable to get public URL");
  }

  return urlData.publicUrl;
}

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
      image_url,
      user_id,
    },
  ]);

  if (error) throw error;
  return data;
}

export async function updatePost(
  id: number,
  payload: {
    title: string;
    description: string;
    image_url?: string;
  },
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Not authenticated");

  const { data, error } = await supabase
    .from("blog")
    .update(payload)
    .eq("id", id)
    .eq("user_id", user.id) // 🔥 IMPORTANT
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error("No row updated");

  return data;
}

export async function deletePostWithImage(id: number, imageUrl?: string) {
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
    .eq("user_id", user.id); // 🔥 IMPORTANT

  if (error) throw error;
}
