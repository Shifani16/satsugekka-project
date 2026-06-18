import { useEffect, useState } from "react";
import Popup from "../reusable/Popup";
import type { TranslationEntry } from "../translation";
import { useNavigate } from "react-router-dom";
import Pagination from "../reusable/Pagination";

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
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const [statusPopup, setStatusPopup] = useState({
    isOpen: false,
    type: "success" as "success" | "danger",
    title: "",
    message: "",
  });

  const baseURL = import.meta.env.VITE_API_URL;

  const handleDelete = async () => {
    if (!selectedId) {
      console.log("No ID selected, stopping delete.");
      return;
    }

    try {
      const resp = await fetch(`${baseURL}/translation-posts/${selectedId}`, {
        method: "DELETE",
      });

      setIsDeleteOpen(false);

      if (resp.ok) {
        setTranslation(
          translations.filter((b) => b.translation_id !== selectedId),
        );
        setIsDeleteOpen(false);
        setStatusPopup({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message: "The post has been removed successfully.",
        });
        setSelectedId(null);
      } else {
        setStatusPopup({
          isOpen: true,
          type: "danger",
          title: "Error",
          message: "Failed to delete the post. Please try again.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusPopup({
        isOpen: true,
        type: "danger",
        title: "Network Error",
        message: "Could not connect to the server.",
      });
    }
  };

  useEffect(() => {
    console.log("Starting fetch...");

    fetch(`${baseURL}/translation-posts`)
      .then((res) => {
        console.log("Status", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Data", data);
        const transArray = data.translations || data;
        setTranslation(Array.isArray(transArray) ? transArray : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.log("Fetch failed", err);
        setIsLoading(false);
      });
  }, []);

  console.log("State:", translations);

  return (
    <section className="font-plex">
      <h1 className="text-white text-3xl md:text-5xl font-bold">
        My Translation
      </h1>

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
                      "en-Gb",
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
