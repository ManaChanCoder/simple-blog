import { themeStore } from "../store/themeStore";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import LoginModal from "./modal/LoginModal";
import Modal from "./modal/Modal";
import { authStore } from "../store/authStore";
import { createPost, uploadImage } from "../helper/service";

import {
  navLink,
  LoginNavLink,
  LIGHT_LOGO,
  DARK_LOGO,
} from "../local_db/localStorage";
import { useState, useEffect } from "react";

import {
  IoMoonSharp,
  IoSunnyOutline,
  IoCloseOutline,
  IoMenuOutline,
} from "react-icons/io5";

const Navbar = () => {
  const [isSmallWidth, setIsSmallWidth] = useState<boolean>(false);
  const { user, logout } = authStore();
  const { isDark, toggleTheme } = themeStore();
  const [openMenu, setOpenMenu] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isPostModalOpen, setIsPostModalOpen] = useState<boolean>(false);
  const [fileName, setFileName] = useState<string>("Upload Image");
  const navigate = useNavigate();

  useEffect(() => {
    const checkWidth = () => {
      setIsSmallWidth(window.innerWidth <= 676);
    };
    checkWidth();

    if (openMenu) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "auto";

    window.addEventListener("resize", checkWidth);
    return () => {
      window.removeEventListener("resize", checkWidth);
      document.body.style.overflow = "auto";
    };
  }, [openMenu]);

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  const handlePostBlog = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const imageFile = (form.elements.namedItem("image") as HTMLInputElement)
      .files?.[0];
    const title = (form.elements.namedItem("title") as HTMLInputElement).value;
    const description = (
      form.elements.namedItem("description") as HTMLTextAreaElement
    ).value;

    if (!user) return alert("Please login first");
    if (!title.trim()) return alert("Title is required");
    if (!description.trim()) return alert("Description is required");

    try {
      let imageUrl: string | null = null;

      // ✅ upload only if may image
      if (imageFile) {
        imageUrl = await uploadImage(imageFile);
      }

      await createPost({
        title,
        description,
        image_url: imageUrl, // 👈 can be null
        user_id: user.id,
      });

      alert("Post created!");
      setIsPostModalOpen(false);
      setFileName("Upload Image");
    } catch (err) {
      alert(err instanceof Error ? err.message : "Post failed");
    }
  };

  return (
    <div className="px-5 w-full">
      {isSmallWidth ? (
        <div className="">
          {user ? (
            <div className="flex justify-between items-center py-3">
              {isDark ? (
                <img
                  src={LIGHT_LOGO}
                  alt="logo"
                  className="w-15 h-15 select-none"
                />
              ) : (
                <img
                  src={DARK_LOGO}
                  alt="logo"
                  className="w-15 h-15 select-none"
                />
              )}

              <div className="flex gap-5 items-center select-none">
                {isDark ? (
                  <IoSunnyOutline onClick={toggleTheme} size={30} />
                ) : (
                  <IoMoonSharp onClick={toggleTheme} size={30} />
                )}

                {openMenu ? (
                  <IoCloseOutline
                    size={35}
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                ) : (
                  <IoMenuOutline
                    size={30}
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                )}

                <AnimatePresence>
                  {openMenu && (
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 100, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`fixed top-21 right-0 w-full h-119.25 ${
                        isDark ? "bg-(--blue-950)" : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-5 p-10 h-full">
                        {LoginNavLink.map((item, i) => (
                          <Link
                            to={item.location || ""}
                            onClick={() => {
                              setOpenMenu(!openMenu);
                              if (i === 3) handleLogout();
                              if (i === 1) setIsPostModalOpen(true);
                            }}
                            key={i}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          ) : (
            <div className="flex justify-between items-center py-3">
              {isDark ? (
                <img
                  src={LIGHT_LOGO}
                  alt="logo"
                  className="w-15 h-15 select-none"
                />
              ) : (
                <img
                  src={DARK_LOGO}
                  alt="logo"
                  className="w-15 h-15 select-none"
                />
              )}

              <div className="flex gap-5 items-center select-none">
                {isDark ? (
                  <IoSunnyOutline onClick={toggleTheme} size={30} />
                ) : (
                  <IoMoonSharp onClick={toggleTheme} size={30} />
                )}

                {openMenu ? (
                  <IoCloseOutline
                    size={35}
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                ) : (
                  <IoMenuOutline
                    size={30}
                    onClick={() => setOpenMenu(!openMenu)}
                  />
                )}

                <AnimatePresence>
                  {openMenu && (
                    <motion.div
                      initial={{ x: 100, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      exit={{ x: 100, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeOut" }}
                      className={`fixed top-21 right-0 w-full h-119.25 ${
                        isDark ? "bg-(--blue-950)" : "bg-white"
                      }`}
                    >
                      <div className="flex flex-col items-center gap-5 p-10 h-full">
                        {navLink.map((item, i) => (
                          <Link
                            to={item.location || ""}
                            onClick={() => {
                              if (i === 2) setIsModalOpen(true);
                              else setOpenMenu(!openMenu);
                            }}
                            key={i}
                          >
                            {item.title}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      ) : user ? (
        <div className="flex justify-between items-center py-3">
          {isDark ? (
            <img src={LIGHT_LOGO} alt="logo" className="w-16 h-16" />
          ) : (
            <img src={DARK_LOGO} alt="logo" className="w-16 h-16" />
          )}

          <div className="flex items-center gap-5 select-none">
            {LoginNavLink.map((item, i) => (
              <Link
                onClick={() => {
                  if (i === 1) setIsPostModalOpen(true);
                  if (i === 3) handleLogout();
                }}
                to={item.location || ""}
                key={i}
              >
                {item.title}
              </Link>
            ))}
            {isDark ? (
              <IoSunnyOutline onClick={toggleTheme} size={30} />
            ) : (
              <IoMoonSharp onClick={toggleTheme} size={30} />
            )}
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center py-3">
          {isDark ? (
            <img src={LIGHT_LOGO} alt="logo" className="w-16 h-16" />
          ) : (
            <img src={DARK_LOGO} alt="logo" className="w-16 h-16" />
          )}

          <div className="flex items-center gap-5 select-none">
            {navLink.map((item, i) => (
              <Link
                onClick={() => {
                  if (i === 2) setIsModalOpen(true);
                }}
                to={item.location || ""}
                key={i}
              >
                {item.title}
              </Link>
            ))}
            {isDark ? (
              <IoSunnyOutline onClick={toggleTheme} size={30} />
            ) : (
              <IoMoonSharp onClick={toggleTheme} size={30} />
            )}
          </div>
        </div>
      )}
      <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(!isModalOpen)}
        title="Create an account"
      />
      <Modal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(!isPostModalOpen)}
        title="Post Blog"
      >
        <form action="" onSubmit={handlePostBlog}>
          <div
            className={`relative rounded-sm cursor-default mb-3 ${isDark ? "bg-blue-900" : "bg-black text-white"}`}
          >
            <input
              type="file"
              className="w-full h-20 opacity-0 "
              name="image"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) setFileName(file.name);
              }}
            />
            <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
              {fileName}
            </span>
          </div>

          <div className="flex flex-col gap-3 mb-3">
            <label htmlFor="title" className="pl-1">
              Title
            </label>
            <input
              type="text"
              className={`w-full p-1 border-0 outline-0 text-white rounded-sm ${isDark ? "bg-blue-900" : "bg-black"}`}
              name="title" // <-- add this
              id="title"
            />
          </div>

          <div className="flex flex-col gap-3 mb-3">
            <label htmlFor="description">Description</label>
            <textarea
              name="description" // <-- add this
              id="description"
              className={`w-full text-white p-1 border-0 outline-0 rounded-sm ${isDark ? "bg-blue-900" : "bg-black"}`}
              rows={4}
            ></textarea>
          </div>

          <div className="flex justify-center">
            <button
              className="px-4 py-2 bg-lime-400 rounded hover:bg-lime-500 text-black"
              type="submit"
            >
              Post
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Navbar;
