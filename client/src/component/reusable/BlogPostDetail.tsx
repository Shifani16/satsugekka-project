import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import type { BlogEntry } from "../blog";
import { motion } from "framer-motion";
import { playClickSound } from "../../utils/playClickSound";

export default function BlogPostDetail() {
  const params = useParams();
  const { postId } = params;

  const [post, setPost] = useState<BlogEntry | null>(null);
  const [prevPost, setPrevPost] = useState<BlogEntry | null>(null);
  const [nextPost, setNextPost] = useState<BlogEntry | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return;

    const baseURL = import.meta.env.VITE_API_URL;

    fetch(`${baseURL}/my-blog/${postId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Blog post not found");
        return res.json();
      })
      .then((singlePostData) => {
        setPost(singlePostData);

        return fetch(`${baseURL}/my-blog`);
      })
      .then((res) => (res ? res.json() : null))
      .then((allData) => {
        if (!allData) return;
        const blogArray = allData.blogs || allData;

        const currentIndex = blogArray.findIndex(
          (b: any) => String(b.post_id) === String(postId),
        );

        if (currentIndex !== -1) {
          setPrevPost(blogArray[currentIndex - 1] || null);
          setNextPost(blogArray[currentIndex + 1] || null);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message);
      });

    window.scrollTo(0, 0);
  }, [postId]);

  if (error) return <p className="text-white p-15">Error: {error}</p>;
  if (!post) return <p className="text-white p-15">Loading post...</p>;

  return (
    <section className="px-8 py-4 md:px-15 md:py-8 min-h-screen font-plex">
      <div className="flex flex-col">
        <h1 className="font-bold text-4xl text-white">{post.title}</h1>
        <p className="font-dogica text-primary mt-5 text-xs text-right">
          {post.updated_at
            ? new Date(post.updated_at).toLocaleDateString("en-GB", {
                day: "2-digit",
                month: "long",
                year: "numeric",
              })
            : "No Date"}
        </p>
      </div>
      <div className="flex justify-center w-full h-auto mt-10">
        <img
          className="rounded-xl shadow-lg w-1/2"
          src={post.thumbnail_src}
          alt={post.title}
        />
      </div>
      <motion.img
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 5 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false, margin: "-50px" }}
        className="absolute -z-10 right-0 w-32"
        src="/img/Emotion-3.png"
        alt=""
      />
      <div
        className="mt-10 text-primary leading-relaxed blog-content text-sm md:text-base wrap-break-word hyphens-auto"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Pagination Controls */}
      <div className="mt-20 flex flex-col md:flex-row text-primary gap-4 md:gap-10 mb-20">
        {prevPost ? (
          <Link
            className="px-4 py-3 w-full md:w-1/2 border border-accent-secondary opacity-70 rounded-md transition-all duration-300 hover:scale-102 hover:opacity-100 flex items-center justify-between"
            to={`/blog/${prevPost.post_id}`}
            onClick={() => {
              playClickSound();
            }}
          >
            <i className="fa-solid fa-arrow-left text-white mr-4"></i>
            <div className="text-right flex-1 min-w-0">
              {" "}
              <span className="text-[10px] block opacity-50 uppercase">
                Previous
              </span>
              <h1 className="truncate text-sm font-bold">{prevPost.title}</h1>
            </div>
          </Link>
        ) : (
          <div className="hidden md:flex w-1/2 opacity-20 border border-dashed border-accent-secondary rounded-md px-4 py-2 items-center italic text-xs"></div>
        )}

        {nextPost ? (
          <Link
            className="px-4 py-3 w-full md:w-1/2 border border-accent-secondary opacity-70 rounded-md text-right transition-all duration-300 hover:scale-102 hover:opacity-100 flex items-center justify-between"
            to={`/blog/${nextPost.post_id}`}
            onClick={() => {
              playClickSound();
            }}
          >
            <div className="text-left flex-1 min-w-0">
              {" "}
              <span className="text-[10px] block opacity-50 uppercase">
                Next Up
              </span>
              <h1 className="truncate text-sm font-bold">{nextPost.title}</h1>
            </div>
            <i className="fa-solid fa-arrow-right text-white ml-4"></i>
          </Link>
        ) : (
          <div className="hidden md:flex w-1/2 opacity-20 border border-dashed border-accent-secondary rounded-md px-4 py-2 items-center justify-end italic text-xs"></div>
        )}
      </div>
    </section>
  );
}
