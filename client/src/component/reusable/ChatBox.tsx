import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface Character {
  char_id: string;
  char_name: string;
  char_img: string;
}

interface TranslationPost {
  translation_id: number;
  title: string;
  short_description: string;
  content: string;
  thumbnail_src: string;
}

export default function ChatBox() {
  const params = useParams();
  const { translation_id } = params;
  const [chars, setChars] = useState<Character[]>([]);
  const [post, setPost] = useState<TranslationPost | null>(null);
  const baseURL = import.meta.env.VITE_API_URL;

  console.log(params);
  useEffect(() => {
    Promise.all([
      fetch(`${baseURL}/characters`).then((res) => res.json()),
      fetch(`${baseURL}/translation-posts/${translation_id}`).then((res) => {
        if (!res.ok) throw new Error("Failed to fetch post");
        return res.json();
      }),
    ])
      .then(([charData, postData]) => {
        setChars(charData);
        setPost(postData);
      })
      .catch((err) => console.log("Error loading:", err));
  }, [translation_id, baseURL]);

  if (!post)
    return <div className="p-4 text-white">Loading translation...</div>;

  const lines = post?.content
    ? post.content
        .split(";")
        .map((line: string) => line.trim())
        .filter(Boolean)
    : [];

  return (
    <section className="py-6 px-4 flex flex-col gap-4 mx-auto">
      <div className="w-full flex justify-center">
        <img
          className="max-w-2xl w-full h-auto mb-5 object-cover"
          src={post.thumbnail_src}
          alt={post.title}
        />
      </div>
      {lines.map((line, index) => {
        const noteMatch = line.match(/^\/\/\s*(.*)/);

        if (noteMatch) {
          const noteText = noteMatch[1].trim();
          return (
            <div key={index} className="w-full text-left my-1 mt-10 md:mt-20 items-end">
              <p className="font-plex text-primary font-bold italic text-sm">{noteText}</p>
            </div>
          )
        }
        
        const specialMatch = line.match(/^\*(.*)\*$/);

        if (specialMatch) {
          const innerText = specialMatch[1].trim();
          return (
            <div key={index} className="flex justify-center w-full my-1">
              <div className="text-center">
                <p className="font-plex text-accent font-semibold tracking-wide text-sm">
                  {innerText}
                </p>
              </div>
            </div>
          );
        }

        

        const match = line.match(/^([^:]*):\s*(.*)/);

        let char = null;
        let message = line;

        if (match) {
          const charId = match[1].trim();
          const potentialMessage = match[2].trim();

          char = chars.find((c) => c.char_id === charId);

          if (char) {
            message = potentialMessage;
          } else if (line.startsWith(":")) {
            message = potentialMessage;
          }
        }
        return (
          <div
            key={index}
            className={`flex items-start gap-4 ${!char ? "justify-center" : ""}`}
          >
            {char && (
              <img
                src={char.char_img}
                className="w-15 h-auto object-cover rounded-full shrink-0 aspect-square"
                alt={char.char_name}
              />
            )}

            <div
              className={`border border-accent-secondary px-4 py-2  rounded-2xl ${char ? "rounded-tl-none w-3/4 bg-primary" : "items-center w-full rounded-sm bg-bg text-center italic opacity-90"} `}
            >
              {char && (
                <h1 className="font-plex text-accent-secondary font-bold text-sm">
                  {char.char_name}
                </h1>
              )}
              <p
                className={`font-plex font-semibold text-sm ${char ? "bg-primary text-bg" : " italic text-primary"}`}
              >
                {message}
              </p>
            </div>
          </div>
        );
      })}
    </section>
  );
}
