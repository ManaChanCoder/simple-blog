import { supabase } from "../connection/connectionDb";
import type { FormAccountState } from "../interface";

export const loginWithGoogle = async () => {
  await supabase.auth.signInWithOAuth({ provider: "google" });
};

export const signup = async ({ email, password }: FormAccountState) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;

  return data.user;
};
