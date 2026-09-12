import { useEffect, useState } from "react";
import type { BlogEntry } from "../blog";
import Pagination from "../reusable/Pagination";
import Popup from "../reusable/Popup";
import { useNavigate } from "react-router-dom";
import { adminFetch } from "../../utils/adminApi";

export default function MyBlog() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = Math.ceil(blogs.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentBlogs = blogs.slice(indexOfFirst, indexOfLast);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const baseURL = import.meta.env.VITE_API_URL;

  const fetchBlogs = () => {
    setIsLoading(true);
    fetch(`${baseURL}/my-blog`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const blogArray = data.blogs || data;
        setBlogs(Array.isArray(blogArray) ? blogArray : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch failed:", err);
        setIsLoading(false);
      });
  };

  const handleDelete = async () => {
    if (!selectedId) return;
    setIsDeleting(true);
    setDeleteError(null);

    try {
      const resp = await adminFetch(`${baseURL}/my-blog/${selectedId}`, {
        method: "DELETE",
      });

      if (resp.ok) {
        setBlogs((prev) => prev.filter((b) => b.post_id !== selectedId));
        setIsDeleteOpen(false);
        setSelectedId(null);
      } else {
        const err = await resp.json().catch(() => ({}));
        setDeleteError(
          resp.status === 401
            ? "You're not logged in (or your session expired). Please log in again."
            : err.error || "Failed to delete.",
        );
      }
    } catch (err: any) {
      setDeleteError(err.message || "Something went wrong.");
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="font-plex">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-3xl md:text-5xl font-bold">My Blog</h1>
        <button
          onClick={fetchBlogs}
          className="text-sm font-plex text-accent hover:text-accent-secondary"
        >
          ↻ Refresh
        </button>
      </div>
      <p className="text-primary/60 text-xs mt-2">
        Publishing commits straight to your repo, so a new or edited post can
        take a few seconds to show up here — use Refresh if you don't see it
        right away.
      </p>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white">
            <tr className="">
              <th className="mt-5 text-left text-sm md:text-lg text-accent font-bold w-1/3 md:w-auto">
                Title
              </th>
              <th className="py-3 text-left text-sm md:text-lg text-accent font-bold w-1/3 md:w-auto">
                Uploaded Date
              </th>
              <th className="py-3 text-right text-accent font-bold w-1/4 md:w-auto"></th>
            </tr>
          </thead>
          <tbody>
            {blogs.length > 0 ? (
              currentBlogs.map((blog) => (
                <tr
                  key={blog.post_id}
                  className="text-sm md:text-md text-primary shadow-bg border-b border-bg-dark hover:text-white"
                >
                  <td className="">{blog.title}</td>

                  <td>
                    {new Date(blog.updated_at).toLocaleDateString("en-GB", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                    })}
                  </td>

                  <div className="flex flex-row py-3 gap-3">
                    <td>
                      <i
                        onClick={() => navigate(`/edit-blog/${blog.post_id}`)}
                        className="fa-regular fa-pen-to-square text-sm md:text-xl hover:text-accent-secondary cursor-pointer"
                      ></i>
                    </td>
                    <td>
                      <i
                        onClick={() => {
                          setSelectedId(blog.post_id);
                          setDeleteError(null);
                          setIsDeleteOpen(true);
                        }}
                        className="fa-solid fa-trash text-sm md:text-xl hover:text-accent-secondary cursor-pointer"
                      ></i>
                    </td>
                    <td>
                      <i
                        onClick={() => window.open(blog.linkhref, "_blank")}
                        className="fa-solid fa-arrow-right rotate-315 text-md md:text-2xl hover:text-accent-secondary cursor-pointer"
                      ></i>
                    </td>
                  </div>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-500">
                  {isLoading ? "Fetching blogs..." : "No blogs found."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        <div className="flex items-center justify-center mt-20">
          <Pagination
            currentPages={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          ></Pagination>
        </div>
        <Popup
          isOpen={isDeleteOpen}
          onClose={() => {
            setIsDeleteOpen(false);
            setDeleteError(null);
          }}
          onConfirm={handleDelete}
          title="Delete"
          type="confirm"
        >
          <p className="text-lg">
            {isDeleting ? "Deleting..." : "Are you sure you want to delete this?"}
          </p>
          {deleteError && (
            <p className="text-red-400 text-sm mt-2">{deleteError}</p>
          )}
        </Popup>
      </div>
    </section>
  );
}
