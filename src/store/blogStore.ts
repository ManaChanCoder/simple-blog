import { create } from "zustand";
import type { CardState } from "../interface";
import { supabase } from "../connection/connectionDb";

interface CardStore {
  cards: CardState[];
  loading: boolean;
  error: string | null;

  page: number;
  pageSize: number;
  total: number;

  getPost: (page?: number) => Promise<void>;
}

export const blogStore = create<CardStore>((set, get) => ({
  cards: [],
  loading: false,
  error: null,

  page: 1,
  pageSize: 6,
  total: 0,

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
}));
