import { create } from "zustand";
import type { CardState, CommentState } from "../interface";
import { supabase } from "../connection/connectionDb";

interface CardStore {
  cards: CardState[];
  loading: boolean;
  error: string | null;

  page: number;
  pageSize: number;
  total: number;

  comments: CommentState[];

  getPost: (page?: number) => Promise<void>;
  getComments: (post_id: number) => Promise<void>;
  addComment: (post_id: number, content: string) => Promise<void>;
  deleteComment: (comment_id: number, post_id: number) => Promise<void>;
}

export const blogStore = create<CardStore>((set, get) => ({
  cards: [],
  loading: false,
  error: null,

  page: 1,
  pageSize: 6,
  total: 0,

  comments: [],

  getPost: async (page = 1) => {
    set({ loading: true, error: null });

    const { pageSize } = get();
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    try {
      const { data, error, count } = await supabase
        .from("blog")
        .select("*", { count: "exact" })
        .order("created_at", { ascending: false })
        .range(from, to);

      if (error) throw error;

      set({
        cards: data ?? [],
        total: count ?? 0,
        page,
        loading: false,
      });
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Something went wrong.";
      set({ error: message, loading: false });
    }
  },

  // fetch comments for a post
  getComments: async (post_id: number) => {
    const { data, error } = await supabase
      .from("comment")
      .select("*")
      .eq("post_id", post_id)
      .order("created_at", { ascending: false });

    if (error) throw error;
    set({ comments: data ?? [] });
  },

  // add comment
  addComment: async (post_id: number, content: string) => {
    set({ loading: true });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not logged in");

    const { error } = await supabase.from("comment").insert([
      {
        post_id,
        user_id: userData.user.id,
        content,
      },
    ]);
    set({ loading: false });
    if (error) throw error;

    // Refresh comments
    await get().getComments(post_id);
  },
  deleteComment: async (comment_id: number, post_id: number) => {
    set({ loading: true });
    const { data: userData } = await supabase.auth.getUser();
    if (!userData.user) throw new Error("Not logged in");

    const { error } = await supabase
      .from("comment")
      .delete()
      .eq("id", comment_id)
      .eq("user_id", userData.user.id); // ensure only owner can delete
    set({ loading: false });
    if (error) throw error;

    await get().getComments(post_id); // refresh list
  },
}));
