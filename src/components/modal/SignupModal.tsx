import type { modalProps } from "../../interface";
import { themeStore } from "../../store/themeStore";
import { authStore } from "../../store/authStore";
import { signup } from "../../auth/authService";

import { IoCloseOutline } from "react-icons/io5";
import { FaRegEyeSlash, FaRegEye } from "react-icons/fa6";
import { useState } from "react";

const SignupModal: React.FC<modalProps> = ({ isOpen, onClose, title }) => {
  const isDark = themeStore((state) => state.isDark);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const setUser = authStore((state) => state.setUser);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const signupUser = await signup({ email, password });
      setUser(signupUser);
      alert("Sign up Successfully!");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Sign up Error!";
      alert(message);
    }
  };

  if (!isOpen) return null;
  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center ${
        isDark ? "bg-black/90" : "bg-white/90"
      }`}
      onClick={onClose} // click outside closes
    >
      <div
        className={`rounded-2xl shadow-lg w-[90%] md:w-[40%] p-6 relative ${
          isDark ? "bg-white text-black" : "bg-black text-white"
        }`}
        onClick={(e) => e.stopPropagation()} // prevent close when clicking inside
      >
        {/* Header */}
        {title && (
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">{title}</h2>
            <IoCloseOutline onClick={onClose} size={20} />
          </div>
        )}

        {/* Content */}
        <div className="">
          <form onSubmit={handleSignup}>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Email</label>
              <input
                type="email"
                name=""
                id=""
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="text-black border border-(--gray-300) bg-(--gray-300) h-8 px-1 rounded-sm outline-0 focus:ring-2 focus:ring-blue-300 focus:border-blue-400"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label htmlFor="">Password</label>
              <div
                className="
    flex justify-between
    border border-(--gray-300)
    bg-(--gray-300)
    rounded-sm
    relative
    focus-within:ring-2
    focus-within:ring-blue-300
    focus-within:border-blue-400
  "
              >
                <input
                  type={showPassword ? "text" : "password"}
                  minLength={8}
                  className="w-[92%] h-8 pl-1 outline-none bg-transparent text-black"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                {password.length > 0 && (
                  <span className="text-black">
                    {showPassword ? (
                      <FaRegEye
                        size={20}
                        className="absolute right-2 top-2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    ) : (
                      <FaRegEyeSlash
                        size={20}
                        className="absolute right-2 top-2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                      />
                    )}
                  </span>
                )}
              </div>
            </div>
            <button
              type="submit"
              className={`bg-blue-700 text-white cursor-pointer flex justify-center items-center gap-3 w-full h-8 rounded-sm mb-4 mt-5`}
            >
              Sign up
            </button>
          </form>
        </div>

        {/* Footer (optional) */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded text-black hover:bg-gray-300"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;
