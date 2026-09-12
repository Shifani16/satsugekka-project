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

type Entry =
  | { type: "note"; text: string }
  | { type: "narration"; text: string; originalText?: string }
  | { type: "dialogue"; char: Character | null; text: string; originalText?: string };

function parseEntries(lines: string[], chars: Character[]): Entry[] {
  const entries: Entry[] = [];

  for (const line of lines) {
    // "^ original text" attaches as the original-language line for whatever
    // came right before it (dialogue or narration). Optional — most lines
    // won't have one.
    const ogMatch = line.match(/^\^\s*(.*)/);
    if (ogMatch) {
      const last = entries[entries.length - 1];
      if (last && (last.type === "narration" || last.type === "dialogue")) {
        last.originalText = ogMatch[1].trim();
      }
      continue;
    }

    const noteMatch = line.match(/^\/\/\s*(.*)/);
    if (noteMatch) {
      entries.push({ type: "note", text: noteMatch[1].trim() });
      continue;
    }

    const specialMatch = line.match(/^\*(.*)\*$/);
    if (specialMatch) {
      entries.push({ type: "narration", text: specialMatch[1].trim() });
      continue;
    }

    const match = line.match(/^([^:]*):\s*(.*)/);
    let char: Character | null = null;
    let message = line;

    if (match) {
      const charId = match[1].trim();
      const potentialMessage = match[2].trim();
      const found = chars.find((c) => c.char_id === charId) || null;

      if (found) {
        char = found;
        message = potentialMessage;
      } else if (line.startsWith(":")) {
        message = potentialMessage;
      }
    }

    entries.push({ type: "dialogue", char, text: message });
  }

  return entries;
}

export default function ChatBox() {
  const params = useParams();
  const { translation_id } = params;
  const [chars, setChars] = useState<Character[]>([]);
  const [post, setPost] = useState<TranslationPost | null>(null);
  const baseURL = import.meta.env.VITE_API_URL;

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
        .split("\n")
        .map((line: string) => line.trim())
        .filter(Boolean)
    : [];

  const entries = parseEntries(lines, chars);

  return (
    <section className="py-6 px-4 flex flex-col gap-4 mx-auto">
      <div className="w-full flex justify-center">
        <img
          className="max-w-2xl w-full h-auto mb-5 object-cover"
          src={post.thumbnail_src}
          alt={post.title}
        />
      </div>
      {entries.map((entry, index) => {
        if (entry.type === "note") {
          return (
            <div
              key={index}
              className="w-full text-left my-1 mt-10 md:mt-20 items-end"
            >
              <p className="font-plex text-primary font-bold italic text-sm">
                {entry.text}
              </p>
            </div>
          );
        }

        if (entry.type === "narration") {
          return (
            <div key={index} className="flex justify-center w-full my-1">
              <div className="text-center">
                <p className="font-plex text-accent font-semibold tracking-wide text-sm">
                  {entry.text}
                </p>
                {entry.originalText && (
                  <p className="font-plex text-primary/40 text-xs italic mt-1">
                    {entry.originalText}
                  </p>
                )}
              </div>
            </div>
          );
        }

        const char = entry.char;

        return (
          <div
            key={index}
            className={`flex items-start justify-center gap-4 ${!char ? "justify-center" : ""}`}
          >
            {char && (
              <img
                src={char.char_img}
                className="w-15 h-auto object-cover rounded-full shrink-0 aspect-square mt-2"
                alt={char.char_name}
              />
            )}

            <div className="flex flex-col w-3/4">
              {char && (
                <h1 className="font-plex text-accent-secondary font-bold text-sm md:text-md mb-2">
                  {char.char_name}
                </h1>
              )}

              <div
                className={`px-6 py-4 rounded-md ${char ? "rounded-tl-none bg-bg-dark" : "items-center w-full rounded-sm bg-bg-dark text-center italic opacity-90"} `}
              >
                <p
                  className={`font-plex font-semibold text-sm md:text-md ${char ? "bg-bg-dark text-primary" : " italic text-primary"}`}
                >
                  {entry.text}
                </p>
                {entry.originalText && (
                  <p
                    className={`font-plex text-primary/40 text-xs mt-1 ${!char ? "italic" : ""}`}
                  >
                    {entry.originalText}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </section>
  );
}

