import type React from "react";
import type { BlogEntry } from "../blog";

type BlogCardProps = Pick<
  BlogEntry,
  "title" | "short_description" | "thumbnail_src" | "linkhref"
>;

const BlogCard: React.FC<BlogCardProps> = ({
  title,
  short_description,
  thumbnail_src,
  linkhref,
}) => {
  return (
    <div className="relative grid grid-cols-1 md:grid-cols-2 items-center transition-all duration-300 hover:scale-[1.01] gap-10 py-6">
      <div className="flex flex-col border-l-2 border-accent pl-6">
        <h2 className="font-plex text-white text-xl font-bold">{title}</h2>
        <div
          className=" font-plex text-primary leading-relaxed blog-content wrap-break-word whitespace-normal"
          dangerouslySetInnerHTML={{ __html: short_description}}
        />
        
        <a
          rel="noopener noreferrer"
          href={linkhref}
          className="flex text-sm hover:bg-accent hover:text-bg transition-all duration-300 hover:translate-x-1 shadow-lg font-plex font-semibold w-32 items-center justify-center h-8 text-white bg-accent-secondary rounded-xl mt-6"
        >
          Read More
          <i className="fa-solid fa-arrow-right ml-3 -rotate-45"></i>
        </a>
      </div>

      <div className="flex justify-center md:justify-end">
        <img
          src={thumbnail_src || "https://via.placeholder.com/400"}
          alt={title}
          className="w-full max-w-sm h-48 object-cover rounded-md shadow-2xl"
        />
      </div>
    </div>
  );
};

export default BlogCard;
