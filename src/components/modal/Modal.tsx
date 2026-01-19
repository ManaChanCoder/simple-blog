import type { modalProps } from "../../interface";

import { themeStore } from "../../store/themeStore";

import { IoCloseOutline } from "react-icons/io5";

const Modal: React.FC<modalProps> = ({ onClose, isOpen, title, children }) => {
  const isDark = themeStore((state) => state.isDark);

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
          isDark ? "bg-(--blue-950) text-white" : "bg-yellow-100 text-black"
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
        <div className="overflow-y-auto">{children}</div>

        {/* Footer (optional) */}
        <div className="mt-4 flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 text-black"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
