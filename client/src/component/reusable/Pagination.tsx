interface PaginationProps {
  currentPages: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Pagination({
  currentPages,
  totalPages,
  onPageChange,
}: PaginationProps) {
  const getPageNumbers = () => {
    const pages = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPages <= 3) {
        pages.push(1, 2, 3, "...", totalPages);
      } else if (currentPages >= totalPages - 2) {
        pages.push(1, "...", totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, "...", currentPages, "...", totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="flex items-center border-2 border-accent/30 cursor-pointer rounded-md overflow-hidden w-fit bg-bg-dark font-plex">
      <button
        disabled={currentPages === 1}
        onClick={() => onPageChange(currentPages - 1)}
        className="px-4 py-2 border-r border-accent/30 text-accent cursor-pointer"
      >
        <i className="fa-solid fa-arrow-left "></i>
      </button>

      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          disabled={page === "..."}
          onClick={() => typeof page === "number" && onPageChange(page)}
          className={`px-4 py-2 border-r border-accent/30 transition-colors
            ${page === currentPages ? "bg-accent text-bg font-bold" : "text-gray hover:bg-white/5"}
            ${page === "..." ? "cursor-default" : "cursor-pointer"}`}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPages === totalPages}
        onClick={() => onPageChange(currentPages + 1)}
        className="px-4 py-2 text-accent cursor-pointer"
      >
        <i className="fa-solid fa-arrow-right "></i>
      </button>
    </div>
  );
}
