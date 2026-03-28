import { useEffect, useState  } from "react";
import TranslationCard from "./reusable/TranslationCard";
import { motion } from "framer-motion";
import Pagination from "./reusable/Pagination";

export interface TranslationEntry {
  content: string;
  translation_id: number;
  title: string;
  short_description: string;
  thumbnail_src: string;
  linkhref: string;
  updated_at: string;
}

export default function Translation() {
  const [translations, setTranslations] = useState<TranslationEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL;

    fetch(`${baseURL}/translation-posts`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const transArray = data.translations || data;
        setTranslations(Array.isArray(transArray) ? transArray : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("FETCH FAILED:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredPosts = translations.filter(
    (translation) =>
      translation.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      translation.short_description
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentItems = filteredPosts.slice(indexOfFirst, indexOfLast);

  return (
    <section className="px-15 py-5 h-full relative">
      <motion.img
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 5 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false, margin: "-50px" }}
        src="img/flower-trans.png"
        alt=""
        className="absolute -z-10 right-0 w-64"
      />

      <div className="flex flex-row gap-10">
        <h1 className="font-plex text-accent text-6xl font-bold">
          Translation
        </h1>
        <h1 className="font-plex text-6xl font-bold text-transparent opacity-50 [-webkit-text-stroke:1px_var(--color-accent)]">
          翻 訳
        </h1>
      </div>

      <div className="relative mt-10 flex items-center bg-white/10 border border-accent rounded-3xl px-4 py-3 shadow-2xl w-1/3">
        <input
          type="text"
          placeholder="Search by title or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="font-plex text-white w-full bg-transparent outline-none"
        />
        {searchTerm && (
          <button 
            onClick={() => setSearchTerm("")}
            className="text-accent hover:text-white ml-2"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        )}
      </div>

      <div className="flex flex-col gap-5 mt-10">
        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-white font-plex animate-pulse">Fetching posts...</p>
          </div>
        ) : currentItems.length > 0 ? (
          currentItems.map((item) => (
            <TranslationCard key={item.translation_id} {...item} />
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-gray-400 font-plex">
              {searchTerm 
                ? `No translations found matching "${searchTerm}"` 
                : "No posts found."}
            </p>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!isLoading && totalPages > 1 && (
        <div className="flex items-center justify-center mt-20 mb-10">
          <Pagination
            currentPages={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>
      )}
    </section>
  );
}