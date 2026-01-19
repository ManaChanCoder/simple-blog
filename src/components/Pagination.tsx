import React from "react";

interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  page,
  pageSize,
  total,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);

  if (totalPages <= 1) return null;

  return (
    <div className="flex justify-between w-full text-white items-center gap-4 mt-10">
      <button
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 duration-150 disabled:opacity-40"
      >
        Prev
      </button>

      <span className="text-sm">
        Page {page} of {totalPages}
      </span>

      <button
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 rounded bg-blue-500 hover:bg-blue-700 duration-150 disabled:opacity-40"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
