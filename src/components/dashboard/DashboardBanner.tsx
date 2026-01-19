import {
  ACCOUNT_GREET,
  DASHBOARD_DESCRIPTION,
  POST_COUNT,
} from "../../local_db/localStorage";
import type { DashboardBannerThemeState } from "../../interface";
import { themeStore } from "../../store/themeStore";
import { blogStore } from "../../store/blogStore";
import { authStore } from "../../store/authStore";

import { Rings } from "react-loader-spinner";
import DashboardBannerBg from "../../assets/d-w-img.png";

export default function DashboardBanner() {
  const isDark = themeStore((state) => state.isDark);
  const { cards, loading } = blogStore();
  const user = authStore((state) => state.user);

  const bgTheme: DashboardBannerThemeState = {
    backgroundImage: `url(${DashboardBannerBg})`,
    backgroundPosition: "center",
    backgroundSize: "cover",
  };

  return (
    <div
      className={`w-full h-125 flex justify-center items-center md:block md:relative ${
        isDark ? "text-white" : "text-black"
      }`}
      style={bgTheme}
    >
      <div
        className={`block md:absolute top-50 left-30 w-100 rounded-md ${
          isDark ? "bg-black/60" : "bg-white/60"
        }`}
      >
        <div className="p-5">
          <div className="flex gap-1 mb-2">
            <h1 className="text-2xl md:text-3xl">{ACCOUNT_GREET}</h1>
            {loading ? (
              <Rings
                visible={true}
                height="40"
                width="40"
                color="#4fa94d"
                ariaLabel="rings-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              <span className="self-end">{user?.email}</span>
            )}
          </div>

          <span className="mb-5 block">{DASHBOARD_DESCRIPTION}</span>

          <div className="flex gap-1 items-center">
            <h2 className="capitalize">{POST_COUNT}:</h2>
            {loading ? (
              <Rings
                visible={true}
                height="40"
                width="40"
                color="#4fa94d"
                ariaLabel="rings-loading"
                wrapperStyle={{}}
                wrapperClass=""
              />
            ) : (
              <span>{cards?.length}</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
