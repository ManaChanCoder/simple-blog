import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { themeStore } from "../store/themeStore";

const MainLayout = () => {
  const isDark = themeStore((state) => state.isDark);
  return (
    <>
      <div className={` ${isDark ? "text-white bg-black" : "bg-(--gray-300)"}`}>
        <Navbar />
        <main>
          <Outlet />
        </main>
        <Footer />
      </div>
    </>
  );
};

export default MainLayout;
