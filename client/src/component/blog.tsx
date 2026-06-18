import { useEffect, useState } from "react";
import BlogCard from "./reusable/BlogCard";
import { motion } from "framer-motion";
import Pagination from "./reusable/Pagination";

export interface BlogEntry {
  content: string;
  post_id: number;
  title: string;
  short_description: string;
  thumbnail_src: string;
  linkhref: string;
  updated_at: string;
}

export default function Blog() {
  const [blogs, setBlogs] = useState<BlogEntry[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  useEffect(() => {
    console.log("Starting fetch...");

    const baseURL = import.meta.env.VITE_API_URL;
    fetch(`${baseURL}/my-blog`)
      .then((res) => {
        console.log("Response Status:", res.status);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        console.log("Raw Data from API:", data);
        const blogArray = data.blogs || data;
        setBlogs(Array.isArray(blogArray) ? blogArray : []);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("FETCH FAILED:", err);
        setIsLoading(false);
      });
  }, []);

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.short_description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  console.log("Current Blogs State:", blogs);

  const totalPages = Math.ceil(filteredBlogs.length / postsPerPage);
  const indexOfLast = currentPage * postsPerPage;
  const indexOfFirst = indexOfLast - postsPerPage;
  const currentItems = filteredBlogs.slice(indexOfFirst, indexOfLast);

  return (
    <section className="md:px-15 px-10 py-3 md:py-5 min-h-screen ">
      <div className="flex flex-row gap-10 relative">
        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          src="img/flower-blog.png"
          alt="decor"
          className="absolute -z-10 right-0 w-45 top-10 md:w-xs"
        />
        <h1 className="font-plex text-accent text-3xl md:text-6xl font-bold">Blog</h1>
        <h1 className="font-plex text-3xl md:text-6xl font-bold text-transparent opacity-50 [-webkit-text-stroke:1px_var(--color-accent)]">
          ブログ
        </h1>
      </div>

      <div className="relative mt-10 flex items-center bg-white/10 border border-accent rounded-3xl px-4 py-3 shadow-2xl w-full md:w-1/3">
        <input
          type="text"
          placeholder="Search by title or keyword..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="font-plex text-white w-full bg-transparent outline-none"
        />
      </div>

      <div className="flex flex-col gap-5 mt-10">
        {isLoading ? (
          <div className="py-20 text-center">
            <p className="text-white font-plex animate-pulse">
              Fetching blogs...
            </p>
          </div>
        ) : currentItems.length > 0 ? (
          currentItems.map((item) => <BlogCard key={item.post_id} {...item} />)
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
