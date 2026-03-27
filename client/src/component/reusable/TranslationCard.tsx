import type React from "react";
import type { TranslationEntry } from "../translation";

type TranslationCardProps = Pick<TranslationEntry, "title" | "short_description" | "thumbnail_src" | "linkhref">;

const TranslationCard: React.FC<TranslationCardProps> = ({
  title,
  short_description,
  thumbnail_src,
  linkhref,
}) => {
  return (
    <div className="grid grid-cols-2 w-3/4 border mt-10 border-accent rounded-xl bg-white/8 h-55 overflow-hidden transition-all duration-300 hover:scale-101 cursor-pointer">
      <div className=" flex flex-col p-4 mt-2 pr-2">
        <h1 className="font-plex text-white font-bold text-xl">
          {title}
        </h1>
        <p className="font-plex mt-3 text-gray">
          {short_description}
        </p>
        <a
          href={linkhref}
          className="flex text-sm hover:bg-accent hover:text-bg transition-all duration-300 hover:translate-x-1 shadow-lg font-plex font-semibold w-32 items-center justify-center justify-self-center h-8 text-white bg-accent-secondary rounded-xl mt-5"
        >
          Read More
          <i className="fa-solid fa-arrow-right ml-5 rotate-315"></i>
        </a>
      </div>
      <img
        src={thumbnail_src}
        alt=""
        className=" w-64 h-full flex object-cover justify-self-end items-end"
      />
    </div>
  );
};

export default TranslationCard;
