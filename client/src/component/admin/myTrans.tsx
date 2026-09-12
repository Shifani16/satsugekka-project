import { useEffect, useState } from "react";
import Popup from "../reusable/Popup";
import type { TranslationEntry } from "../translation";
import { useNavigate } from "react-router-dom";
import Pagination from "../reusable/Pagination";
import { adminFetch } from "../../utils/adminApi";

export default function MyTrans() {
  const [translations, setTranslation] = useState<TranslationEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  const totalPages = Math.ceil(translations.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentTrans = translations.slice(indexOfFirst, indexOfLast);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [statusPopup, setStatusPopup] = useState({
    isOpen: false,
    type: "success" as "success" | "danger",
    title: "",
    message: "",
  });

  const baseURL = import.meta.env.VITE_API_URL;

  const fetchTranslations = () => {
    setIsLoading(true);
    fetch(`${baseURL}/translation-posts`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const transArray = data.translations || data;
        setTranslation(Array.isArray(transArray) ? transArray : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Fetch failed", err);
        setIsLoading(false);
      });
  };

  const handleDelete = async () => {
    if (!selectedId) return;

    try {
      const resp = await adminFetch(`${baseURL}/translation-posts/${selectedId}`, {
        method: "DELETE",
      });

      if (resp.ok) {
        setTranslation((prev) => prev.filter((b) => b.translation_id !== selectedId));
        setIsDeleteOpen(false);
        setStatusPopup({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message: "The post has been removed successfully.",
        });
        setSelectedId(null);
      } else {
        const err = await resp.json().catch(() => ({}));
        setIsDeleteOpen(false);
        setStatusPopup({
          isOpen: true,
          type: "danger",
          title: "Error",
          message:
            resp.status === 401
              ? "You're not logged in (or your session expired). Please log in again."
              : err.error || "Failed to delete the post. Please try again.",
        });
      }
    } catch (err: any) {
      setIsDeleteOpen(false);
      setStatusPopup({
        isOpen: true,
        type: "danger",
        title: "Network Error",
        message: err.message || "Could not connect to the server.",
      });
    }
  };

  useEffect(() => {
    fetchTranslations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section className="font-plex">
      <div className="flex items-center justify-between">
        <h1 className="text-white text-3xl md:text-5xl font-bold">
          My Translation
        </h1>
        <button
          onClick={fetchTranslations}
          className="text-sm font-plex text-accent hover:text-accent-secondary"
        >
          ↻ Refresh
        </button>
      </div>

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
            {translations.length > 0 ? (
              currentTrans.map((translation) => (
                <tr
                  key={translation.translation_id}
                  className="text-sm md:text-md text-primary shadow-bg border-b border-bg-dark hover:text-white"
                >
                  <td className="py-3">{translation.title}</td>
                  <td className="py-3">
                    {new Date(translation.updated_at).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      },
                    )}
                  </td>

                  <td className="py-3">
                    <div className="flex flex-row gap-3">
                      <i
                        onClick={() => {
                          const cleanSlug = translation.linkhref.replace(
                            "/translation/",
                            "",
                          );
                          navigate(`/edit-translation/${cleanSlug}`);
                        }}
                        className="fa-regular fa-pen-to-square text-sm md:text-xl hover:text-accent-secondary cursor-pointer"
                      ></i>
                      <i
                        onClick={() => {
                          setSelectedId(translation.translation_id);
                          setIsDeleteOpen(true);
                        }}
                        className="fa-solid fa-trash text-sm md:text-xl hover:text-accent-secondary cursor-pointer"
                      ></i>
                      <i
                        onClick={() =>
                          window.open(translation.linkhref, "_blank")
                        }
                        className="fa-solid fa-arrow-right rotate-315 text-md md:text-2xl hover:text-accent-secondary cursor-pointer"
                      ></i>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className="py-10 text-center text-gray-500">
                  {isLoading ? "Fetching posts..." : "No post found."}
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
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete"
          type="confirm"
        >
          <p className="text-lg">Are you sure to delete?</p>
        </Popup>
        <Popup
          isOpen={statusPopup.isOpen}
          onClose={() => setStatusPopup({ ...statusPopup, isOpen: false })}
          onConfirm={() => setStatusPopup({ ...statusPopup, isOpen: false })}
          title={statusPopup.title}
          type={statusPopup.type}
        >
          <p className="text-lg">{statusPopup.message}</p>
        </Popup>
      </div>
    </section>
  );
}
