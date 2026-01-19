import { supabase } from "../connection/connectionDb";
import type { AuthState } from "../interface";
import { create } from "zustand";

export const authStore = create<AuthState>((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  login: async (email: string, password: string) => {
    set({ error: null, loading: true });

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      set({ user: data.user, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login Failed";
      set({ loading: false, error: message });
    }
  },

  getUser: async () => {
    set({ error: null, loading: true });
    try {
      const { data, error } = await supabase.auth.getUser();
      if (error) throw error;
      set({ user: data.user || null, loading: false });
    } catch (err) {
      const message = err instanceof Error ? err.message : "Login failed";
      set({ loading: false, error: message });
    }
  },
  logout: async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      set({ user: null });
    } catch (err) {
      console.log(err);
    }
  },
}));
