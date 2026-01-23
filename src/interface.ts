import type { ReactNode } from "react";
import type { User } from "@supabase/supabase-js";

export interface CardState {
  id: number;
  image_url: string | null;
  title: string;
  description: string;
  created_at: string;
}

export interface CommentState {
  id: number;
  post_id: number;
  user_id: string;
  content: string;
  created_at: string;
  user?: {
    id: string;
    email: string;
  };
}

export interface NavLinkState {
  title: string;
  location?: string;
}

export interface themeState {
  isDark: boolean;
  toggleTheme: () => void;
}

export interface modalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children?: ReactNode;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  login: (email: string, password: string) => Promise<void>;
  getUser: () => Promise<void>;
  logout: () => Promise<void>;
}

export interface FormAccountState {
  email: string;
  password: string;
}

export interface DashboardBannerThemeState {
  backgroundImage: string;
  backgroundSize: string;
  backgroundPosition: string;
}

export interface PostState {
  title: string;
  description: string;
  image_url: string | null;
  user_id: string;
}

export interface CardProps {
  cardLimit?: number;
}

export interface BlogCard {
  id: number;
  title: string;
  description: string;
  image_url: string | null;
  created_at: string;
}
