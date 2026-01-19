import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { themeState } from "../interface";

export const themeStore = create<themeState>()(
  persist(
    (set) => ({
      isDark: false,

      toggleTheme: () => set((state) => ({ isDark: !state.isDark })),
    }),
    {
      name: "theme-storage", // unique name
    }
  )
);
