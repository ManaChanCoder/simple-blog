import { themeStore } from "../store/themeStore";

import {
  BANNER_BUTTON_TEXT,
  BANNER_CARD_DESCRIPTION,
  BANNER_CARD_TITLE,
  BANNER_TITLE,
} from "../local_db/localStorage";
import { BANNER_DESCRIPTION } from "../local_db/localStorage";

export default function Banner() {
  const isDark = themeStore((state) => state.isDark);

  return (
    <div
      className={`w-full h-100 ${
        isDark ? "text-white bg-(--blue-950)" : "text-black bg-white"
      }`}
    >
      <div className="flex justify-center items-center flex-col md:flex-row md:gap-25 h-full">
        <div className="">
          <h2 className="text-5xl font-bold text-center">{BANNER_TITLE}</h2>
          <span className="block text-3xl font-medium">
            {BANNER_DESCRIPTION}
          </span>
        </div>

        <div
          className={`hidden md:block w-125 h-58 py-5 px-10 shadow-lg rounded-sm ${
            isDark ? "bg-white text-black" : "bg-(--blue-950) text-white"
          }`}
        >
          <h2 className="font-bold text-3xl mb-5">{BANNER_CARD_TITLE}</h2>
          <span className="block mb-5">{BANNER_CARD_DESCRIPTION}</span>
          <div className="flex justify-end">
            <button
              className={`py-2 px-10 rounded-sm hover:scale-105 duration-300 tracking-wide ${
                isDark
                  ? "bg-(--gray-300) hover:bg-yellow-100 text-black"
                  : "bg-blue-700 text-white"
              }`}
            >
              {BANNER_BUTTON_TEXT}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
