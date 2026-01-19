import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { supabase } from "./connection/connectionDb";

// components
import Home from "./pages/Home";
import ViewPost from "./pages/ViewPost";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layout/MainLayout";

import { authStore } from "./store/authStore";
import { useEffect } from "react";
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  const user = authStore((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    authStore.getState().getUser();

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      authStore.setState({ user: session?.user ?? null });
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  // 2️⃣ Redirect when user changes
  useEffect(() => {
    if (user && location.pathname === "/") {
      navigate("/dashboard", { replace: true });
    }
  }, [user, location.pathname, navigate]);

  return (
    <>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="/view-post" element={<ViewPost />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
}
