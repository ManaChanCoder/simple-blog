import { useEffect, useState } from "react";
import { blogStore } from "../store/blogStore";
import { themeStore } from "../store/themeStore";
import {
  formatDate,
  wordTruncate,
  updatePost,
  uploadImage,
  deletePostWithImage,
} from "../helper/service";
import Modal from "./modal/Modal";
import { useLocation } from "react-router-dom";

import { TailSpin } from "react-loader-spinner";
import Pagination from "./pagination";

interface CardProps {
  cardLimit?: number;
}
export default function Card({ cardLimit }: CardProps) {
  const { getPost, cards, loading, error, page, pageSize, total } = blogStore();
  const isDark = themeStore((state) => state.isDark);
  const [openModal, setOpenModal] = useState<boolean>(false);
  const [selectedCard, setSelectedCard] = useState<any | null>(null);
  const [editSelectedCard, setEditSelectedCard] = useState<boolean>(false);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string>("");
  const location = useLocation();

  useEffect(() => {
    getPost(page);
  }, [page]);

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      let imageUrl = selectedCard.image_url;

      // If user selected new image
      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
      }

      const updatedData = await updatePost(selectedCard.id, {
        title: editTitle,
        description: editDescription,
        image_url: imageUrl,
      });

      alert("Post updated!");
      setSelectedCard(updatedData[0]);
      setEditSelectedCard(false);
      setOpenModal(false);
      getPost(); // refresh list
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDeletePost = async () => {
    try {
      await deletePostWithImage(selectedCard.id, selectedCard.image_url);

      alert("Post deleted!");
      setOpenModal(false);
      setSelectedCard(null);
      getPost(); // refresh cards
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading)
    return (
      <div className="h-50 mt-20 flex justify-center">
        <TailSpin
          visible={true}
          height="50"
          width="50"
          color="#4fa94d"
          ariaLabel="tail-spin-loading"
          radius="1"
        />
      </div>
    );
  if (error) return <p>{error}</p>;

  const displayedCards = cardLimit ? cards.slice(0, cardLimit) : cards;

  return (
    <div className={`flex flex-col md:flex-row justify-center gap-5 px-5`}>
      <div className="">
        <div
          className="
              grid
              gap-6
              px-2
              grid-cols-1
              sm:grid-cols-2
              md:grid-cols-3
              place-items-center
            "
        >
          {displayedCards.map((card) => (
            <div
              key={card.id}
              onClick={() => {
                setSelectedCard(card);
                setOpenModal(true);
              }}
              className={`w-100 max-w-[90%] h-full p-5 rounded-sm shadow-lg cursor-pointer
        transition-transform duration-200 hover:scale-[1.02]
        ${isDark ? "text-white bg-(--blue-950)" : "bg-yellow-100 text-black"}
      `}
            >
              <img
                src={card.image_url}
                alt={`card image - ${card.id}`}
                className="w-full h-56 object-cover rounded"
              />

              <span className="mt-5 mb-1 block text-2xl font-semibold">
                {card.title}
              </span>

              <span className="block mb-4 text-sm opacity-90">
                {wordTruncate(card.description, 20)}
              </span>

              <span className="flex justify-end text-xs opacity-70">
                {formatDate(card.created_at)}
              </span>
            </div>
          ))}
        </div>
        {location.pathname !== "/" && location.pathname !== "/dashboard" && (
          <Pagination
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={(newPage) => getPost(newPage)}
          />
        )}
      </div>

      <Modal
        title="View Post"
        isOpen={openModal}
        onClose={() => setOpenModal(!openModal)}
      >
        {selectedCard && (
          <div className="">
            <img src={selectedCard.image_url} className="w-full h-40 rounded" />

            <h2 className="text-2xl font-bold mt-5">{selectedCard.title}</h2>

            {/* FULL TEXT (NO LIMIT) */}
            <p>{selectedCard.description}</p>

            <p className="text-xs text-right mb-3">
              {formatDate(selectedCard.created_at)}
            </p>

            <div className="flex justify-start gap-5 text-black">
              <button
                onClick={() => {
                  setEditSelectedCard(true);
                  setEditTitle(selectedCard.title);
                  setEditDescription(selectedCard.description);
                  setEditImagePreview(selectedCard.image_url);
                }}
                className="px-4 py-2 bg-blue-400 rounded hover:bg-blue-600 hover:text-white duration-200"
              >
                Edit
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-400 rounded hover:bg-red-600 hover:text-white duration-200"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Modal
        title="Edit Post"
        isOpen={editSelectedCard}
        onClose={() => setEditSelectedCard(false)}
      >
        {selectedCard && (
          <form onSubmit={handleUpdatePost}>
            {/* IMAGE PREVIEW */}
            <div className="relative">
              <img
                src={editImagePreview}
                className="w-full h-20 rounded mb-3 object-cover"
              />

              {/* IMAGE INPUT */}
              <input
                type="file"
                accept="image/*"
                className="mb-3 opacity-0 w-full h-full absolute top-0 leading-0"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setEditImageFile(file);
                    setEditImagePreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>

            {/* TITLE */}
            <div className="mb-3">
              <label>Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className={`w-full p-1 border-0 outline-0 text-white rounded-sm ${isDark ? "bg-blue-900" : "bg-black"}`}
              />
            </div>

            {/* DESCRIPTION */}
            <div className="mb-3">
              <label className="pl-1">Description</label>
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                rows={4}
                className={`w-full p-1 border-0 outline-0 text-white rounded-sm ${isDark ? "bg-blue-900" : "bg-black"}`}
              />
            </div>

            <button
              type="submit"
              className="px-4 py-2 text-black bg-lime-400 rounded hover:bg-lime-500"
            >
              Save Changes
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
