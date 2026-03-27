import { useEffect, useState, type ReactNode } from "react";
import TranslationCard from "./reusable/TranslationCard";
import { motion } from "framer-motion";

export interface TranslationEntry {
  content: ReactNode;
  post_id: number;
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

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL;

    fetch(`${baseURL}/translation-posts`)
      .then((res) => {
        console.log("Res Status", res.status);
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
      translation.short_description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="px-15 py-5 h-full">
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

      <div className="relative mt-10 flex items-center bg-white/8 border border-accent rounded-3xl px-4 py-3 shadow-2xl w-1/3">
        <input
          type="text"
          placeholder="Search by title or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="font-plex text-white w-full border-accent outline-none"
        />
      </div>

      <div className="flex flex-col gap-5">
        {isLoading ? (
          <p className="text-white font-plex">Loading your stories...</p>
        ) : filteredPosts.length > 0 ? (
          filteredPosts.map((item) => <TranslationCard key={item.post_id} {...item} />)
        ) : (
          <p className="text-gray-400 font-plex">
            No blogs found matching "{searchTerm}"
          </p>
        )}
      </div>
    </section>
  );
}
