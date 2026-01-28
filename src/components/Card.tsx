import { useEffect, useState } from "react";
import { blogStore } from "../store/blogStore";
import {
  formatDate,
  wordTruncate,
  updatePost,
  uploadImage,
  deletePostWithImage,
} from "../helper/service";
import type { CardProps, BlogCard } from "../interface";
import Modal from "./modal/Modal";
import { useLocation } from "react-router-dom";
import PaginationTemp from "./PaginationTemp";
import { MdDeleteForever } from "react-icons/md";
import { TailSpin } from "react-loader-spinner";

export default function Card({ cardLimit }: CardProps) {
  const {
    getPost,
    getComments,
    addComment,
    deleteComment,
    cards,
    comments,
    loading,
    error,
    page,
    pageSize,
    total,
  } = blogStore();

  const [openModal, setOpenModal] = useState(false);
  const [commentModal, setCommentModal] = useState(false);
  const [editSelectedCard, setEditSelectedCard] = useState(false);

  const [selectedCard, setSelectedCard] = useState<BlogCard | null>(null);

  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editImageFile, setEditImageFile] = useState<File | null>(null);
  const [editImagePreview, setEditImagePreview] = useState<string | null>(null);
  const [removeImage, setRemoveImage] = useState(false);

  const [commentText, setCommentText] = useState("");

  const location = useLocation();

  useEffect(() => {
    getPost(page);
  }, [page, getPost]);

  const openComment = async (card: BlogCard) => {
    setSelectedCard(card);
    setCommentModal(true);
    await getComments(card.id);
  };

  const openViewModal = (card: BlogCard) => {
    setSelectedCard(card);
    setOpenModal(true);
  };

  const openEditModal = () => {
    if (!selectedCard) return;

    setEditTitle(selectedCard.title);
    setEditDescription(selectedCard.description);
    setEditImagePreview(selectedCard.image_url ?? null);
    setEditImageFile(null);
    setRemoveImage(false);
    setEditSelectedCard(true);
  };

  const handleAddComment = async () => {
    if (!selectedCard) return;
    if (!commentText.trim()) return alert("Comment is required");

    await addComment(selectedCard.id, commentText);
    setCommentText("");
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCard) return;

    try {
      let imageUrl: string | null = selectedCard.image_url ?? null;
      if (removeImage) {
        imageUrl = null;
      }

      if (editImageFile) {
        imageUrl = await uploadImage(editImageFile);
      }

      const updatedData = await updatePost(selectedCard.id, {
        title: editTitle,
        description: editDescription,
        image_url: imageUrl,
      });

      alert("Post updated!");
      setSelectedCard(updatedData);
      setEditSelectedCard(false);
      setOpenModal(false);
      getPost(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDeletePost = async () => {
    if (!selectedCard) return;

    try {
      await deletePostWithImage(
        selectedCard.id,
        selectedCard.image_url ?? null,
      );

      alert("Post deleted!");
      setOpenModal(false);
      setSelectedCard(null);
      getPost(page);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  if (loading)
    return (
      <div className="h-50 mt-20 flex justify-center">
        <TailSpin height="50" width="50" />
      </div>
    );

  if (error) return <p>{error}</p>;

  const displayedCards = cardLimit ? cards.slice(0, cardLimit) : cards;

  return (
    <div className="flex flex-col md:flex-row justify-center gap-5 px-5">
      <div>
        <div className="grid gap-6 px-2 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 place-items-center">
          {displayedCards.map((card: BlogCard) => (
            <div
              key={card.id}
              className="w-100 max-w-[90%] h-full p-5 rounded-sm shadow-lg cursor-pointer"
              onClick={() => openViewModal(card)}
            >
              {card.image_url && (
                <img
                  src={card.image_url}
                  className="w-full h-56 object-cover rounded"
                />
              )}

              <span className="mt-5 mb-5 h-10 block text-lg font-semibold">
                {card.title}
              </span>

              <span className="block h-15 mb-4 text-sm opacity-90">
                {wordTruncate(card.description, 20)}
              </span>

              <span className="flex justify-between text-xs opacity-70">
                {formatDate(card.created_at)}

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    openComment(card);
                  }}
                  className="px-3 py-1 bg-green-400 rounded hover:bg-green-600 text-white"
                >
                  Comment
                </button>
              </span>
            </div>
          ))}
        </div>

        {location.pathname !== "/" && location.pathname !== "/dashboard" && (
          <PaginationTemp
            page={page}
            pageSize={pageSize}
            total={total}
            onPageChange={(newPage) => getPost(newPage)}
          />
        )}
      </div>

      {/* VIEW MODAL */}
      <Modal
        title="View Post"
        isOpen={openModal}
        onClose={() => setOpenModal(false)}
      >
        {selectedCard && (
          <div>
            {selectedCard.image_url && (
              <img
                src={selectedCard.image_url}
                className="w-full h-40 rounded"
              />
            )}

            <h2 className="text-2xl font-bold mt-5">{selectedCard.title}</h2>
            <p>{selectedCard.description}</p>
            <p className="text-xs text-right mb-3">
              {formatDate(selectedCard.created_at)}
            </p>

            <div className="flex gap-5">
              <button
                onClick={openEditModal}
                className="px-4 py-2 bg-blue-400 rounded"
              >
                Edit
              </button>
              <button
                onClick={handleDeletePost}
                className="px-4 py-2 bg-red-400 rounded"
              >
                Delete
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* COMMENT MODAL */}
      <Modal
        title="Comments"
        isOpen={commentModal}
        onClose={() => setCommentModal(false)}
      >
        {selectedCard && (
          <div>
            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Write your comment..."
            />

            <button
              onClick={handleAddComment}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add Comment
            </button>

            <div className="mt-3">
              {comments.map((c) => (
                <div
                  key={c.id}
                  className="flex justify-between items-center border p-2 rounded mb-2"
                >
                  <div>
                    <p>{c.content}</p>
                    <span className="text-xs opacity-70">
                      {formatDate(c.created_at)}
                    </span>
                  </div>

                  <MdDeleteForever
                    size={20}
                    className="cursor-pointer"
                    onClick={() => deleteComment(c.id, selectedCard.id)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        title="Edit Post"
        isOpen={editSelectedCard}
        onClose={() => setEditSelectedCard(false)}
      >
        {selectedCard && (
          <form onSubmit={handleUpdatePost}>
            {editImagePreview && (
              <div className="relative mb-3">
                <img
                  src={editImagePreview}
                  className="w-full h-20 rounded object-cover"
                />

                <button
                  type="button"
                  onClick={() => {
                    setEditImagePreview(null);
                    setEditImageFile(null);
                    setRemoveImage(true);
                  }}
                  className="absolute top-1 right-1 px-2 py-1 text-xs bg-red-500 text-white rounded"
                >
                  Remove
                </button>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setEditImageFile(file);
                setEditImagePreview(URL.createObjectURL(file));
              }}
            />

            <input
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full p-1 rounded my-2"
            />

            <textarea
              value={editDescription}
              onChange={(e) => setEditDescription(e.target.value)}
              rows={4}
              className="w-full p-1 rounded"
            />

            <button
              type="submit"
              className="mt-2 px-4 py-2 bg-lime-400 rounded"
            >
              Save Changes
            </button>
          </form>
        )}
      </Modal>
    </div>
  );
}
