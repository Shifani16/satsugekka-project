import { Link, useParams } from "react-router-dom";
import ChatBox from "./ChatBox";
import { useEffect, useState } from "react";
import type { TranslationEntry } from "../translation";

export default function TranslationDetail() {
  const params = useParams();
  console.log(params);

  const { translation_id } = params;
  const [translations, setTranslations] = useState<TranslationEntry | null>(
    null,
  );
  const [prevPost, setPrevPost] = useState<TranslationEntry | null>(null);
  const [nextPost, setNextPost] = useState<TranslationEntry | null>(null);

  useEffect(() => {
    const baseURL = import.meta.env.VITE_API_URL;

    fetch(`${baseURL}/translation-posts`)
      .then((res) => res.json())
      .then((data) => {
        const postArray = Array.isArray(data) ? data : data.translations;

        const currentIndex = postArray.findIndex((b: any) =>
          b.linkhref.endsWith(`/${translation_id}`),
        );

        if (currentIndex !== -1) {
          setTranslations(postArray[currentIndex]);
          setPrevPost(postArray[currentIndex - 1] || null);
          setNextPost(postArray[currentIndex + 1] || null);
        }
      });
  }, [translation_id]);

  return (
    <section className="px-10 py-10">
      <div className="flex flex-col">
        <h1 className="font-bold text-4xl text-white">{translations?.title}</h1>
        <p className="font-dogica mb-5 text-primary mt-5 text-xs text-right">
          {translations?.updated_at &&
            new Date(translations.updated_at).toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "long",
              year: "numeric",
            })}
        </p>
      </div>
      <div className="bg-bg-light rounded-lg">
        <ChatBox />
      </div>

      <div className="mt-30 flex flex-row text-primary gap-10 mb-30">
        {prevPost ? (
          <Link
            className="px-4 py-2 w-1/2 border border-accent-secondary opacity-70 rounded-md transition-all duration-300 hover:scale-102 hover:opacity-100 flex items-center justify-between"
            to={prevPost.linkhref}
          >
            <i className="fa-solid fa-arrow-left text-white mr-4"></i>
            <div className="text-right flex-1">
              <span className="text-[10px] block opacity-50 uppercase">
                Previous
              </span>
              <h1 className="truncate text-sm font-bold">{prevPost.title}</h1>
            </div>
          </Link>
        ) : (
          <div className="w-1/2 opacity-20 border border-dashed border-accent-secondary rounded-md px-4 py-2 flex items-center italic text-xs"></div>
        )}

        {nextPost ? (
          <Link
            className="px-4 py-2 w-1/2 border border-accent-secondary opacity-70 rounded-md text-right transition-all duration-300 hover:scale-102 hover:opacity-100 flex items-center justify-between"
            to={nextPost.linkhref}
          >
            <div className="text-left flex-1">
              <span className="text-[10px] block opacity-50 uppercase">
                Next Up
              </span>
              <h1 className="truncate text-sm font-bold">{nextPost.title}</h1>
            </div>
            <i className="fa-solid fa-arrow-right text-white ml-4"></i>
          </Link>
        ) : (
          <div className="w-1/2 opacity-20 border border-dashed border-accent-secondary rounded-md px-4 py-2 flex items-center justify-end italic text-xs"></div>
        )}
      </div>
    </section>
  );
}
