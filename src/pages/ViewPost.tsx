import Card from "../components/Card";

import { themeStore } from "../store/themeStore";

const ViewPost = () => {
  const isDark = themeStore((state) => state.isDark);

  return (
    <div className={`py-5 px-10 ${isDark ? "text-white" : "text-black"}`}>
      <h1 className="text-center text-3xl font-semibold mb-5">All Blog Post</h1>

      <Card cardLimit={6} />
    </div>
  );
};

export default ViewPost;
