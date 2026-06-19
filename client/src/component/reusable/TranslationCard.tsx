import type React from "react";
import type { TranslationEntry } from "../translation";
import { playClickSound } from "../../utils/playClickSound";

type TranslationCardProps = Pick<TranslationEntry, "title" | "short_description" | "thumbnail_src" | "linkhref">;

const TranslationCard: React.FC<TranslationCardProps> = ({
  title,
  thumbnail_src,
  linkhref,
}) => {
  return (
    <div className="grid grid-cols-2 w-full md:w-3/4 border mt-8 md:mt-10 border-accent rounded-xl bg-white/8 h-45 overflow-hidden transition-all duration-300 hover:scale-101 cursor-pointer">
      <div className=" flex flex-col p-3 md:p-4 md:mt-2 md:pr-2 mt-1 pr-1">
        <h1 className="font-plex text-white font-bold text-sm md:text-xl">
          {title}
        </h1>
        <a
          href={linkhref}
          onClick={() => { playClickSound() }}
          className="flex text-xs md:text-sm p-1 md:p-2 hover:bg-accent hover:text-bg transition-all duration-300 hover:translate-x-1 shadow-lg font-plex font-semibold w-25 md:w-32 items-center justify-center justify-self-center h-6 md:h-8 text-white bg-accent-secondary rounded-md md:rounded-xl mt-5"
        >
          Read More
          <i className="fa-solid fa-arrow-right ml-2 md:ml-5 rotate-315"></i>
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
