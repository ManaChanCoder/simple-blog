import DashboardBanner from "../components/dashboard/DashboardBanner";
import { Link } from "react-router-dom";

import Card from "../components/Card";
import { FaArrowRightLong } from "react-icons/fa6";

import { themeStore } from "../store/themeStore";
import { blogStore } from "../store/blogStore";
import { CARD_BUTTON_TEXT } from "../local_db/localStorage";
import { useEffect } from "react";

const Dashboard = () => {
  const isDark = themeStore((state) => state.isDark);

  const { getPost, cards, loading } = blogStore();

  useEffect(() => {
    getPost();
  }, []);

  return (
    <>
      <DashboardBanner />
      {cards.length > 0 && (
        <div className="">
          {loading ? null : (
            <h1 className="text-center text-4xl font-semibold my-10">
              Blogs Post
            </h1>
          )}
          <Card cardLimit={3} />

          <div className="flex justify-center py-2 px-10 mt-8">
            <Link
              to="/view-post"
              className={`rounded-sm capitalize flex items-center gap-5 px-10 py-2 duration-200 hover:scale-105 ${
                isDark
                  ? "bg-blue-700 hover:bg-blue-950 text-white"
                  : "bg-white hover:bg-yellow-100 text-black"
              }`}
            >
              {CARD_BUTTON_TEXT}
              <FaArrowRightLong size={15} />
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
