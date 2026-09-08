import { useState, type ChangeEvent } from "react";
import Popup from "../reusable/Popup";
import MarkdownEditor from "../reusable/MarkdownEditor";
import { adminFetch, uploadImage } from "../../utils/adminApi";

export default function CreateBlog() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL;

  const [popupState, setPopupState] = useState({
    isOpen: false,
    type: "success" as any,
    title: "",
    message: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!title || !content || !thumbnail) {
      setPopupState({
        isOpen: true,
        type: "danger",
        title: "Missing Info",
        message: "Title, Content, and Thumbnail are all required!",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const thumbnailUrl = await uploadImage(baseURL, thumbnail);

      const blogData = {
        title,
        content,
        short_description: content
          .replace(/[#*_`>\-!\[\]()]/g, "")
          .substring(0, 100),
        thumbnail_src: thumbnailUrl,
      };

      const resp = await adminFetch(`${baseURL}/my-blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (resp.ok) {
        setPopupState({
          isOpen: true,
          type: "success",
          title: "Published",
          message:
            "Blog posted! It commits straight to your repo, so it may take ~30-60s to appear live while Vercel redeploys.",
        });
        setTitle("");
        setContent("");
        setThumbnail(null);
        setPreview(null);
      } else {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || "Failed to publish");
      }
    } catch (err: any) {
      setPopupState({
        isOpen: true,
        type: "danger",
        title: "Failed",
        message: err.message || "Something went wrong.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="font-plex max-w-4xl">
      <h1 className="text-white text-3xl md:text-5xl font-bold mb-8">New Post</h1>

      <h1 className="font-plex text-accent text-xl font-bold mb-3">
        Blog Title
      </h1>
      <input
        className="px-4 py-2 bg-white/20 border rounded-md text-white w-full border-accent focus:border-accent-secondary outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write the title here..."
        type="text"
      />

      <h1 className="mt-5 font-plex text-accent text-xl font-bold mb-3">
        Content (Markdown)
      </h1>
      <MarkdownEditor value={content} onChange={setContent} baseURL={baseURL} />

      <h1 className="mt-10 font-plex text-accent text-xl font-bold mb-3">
        Upload Thumbnail
      </h1>
      {preview && (
        <div className="mb-4 w-1/4 aspect-video border-2 border-accent rounded-md overflow-hidden bg-bg-dark">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      <div className="flex flex-row w-1/2 md:w-1/4 text-sm md:text-md">
        <label className="py-1 w-full mr-2 bg-accent-secondary text-center rounded-md text-white font-semibold hover:bg-accent cursor-pointer hover:text-bg">
          Upload
          <input
            type="file"
            className="hidden"
            onChange={handleImageChange}
            accept="image/*"
          />
        </label>
        <button
          onClick={() => {
            setPreview(null);
            setThumbnail(null);
          }}
          className="py-1 w-full bg-gray text-center rounded-md text-primary font-semibold cursor-pointer hover:bg-bg-dark hover:text-accent"
        >
          Delete
        </button>
      </div>

      <button
        onClick={handlePublish}
        disabled={isSubmitting}
        className={`mt-20 w-full text-center py-2 rounded-md font-bold mb-10 transition-all ${
          isSubmitting
            ? "bg-gray-500 cursor-not-allowed text-white"
            : "bg-accent cursor-pointer hover:bg-accent-secondary text-bg hover:text-white"
        }`}
      >
        {isSubmitting ? "Publishing..." : "Publish"}
      </button>
      <Popup
        isOpen={popupState.isOpen}
        onClose={() => setPopupState({ ...popupState, isOpen: false })}
        onConfirm={() => setPopupState({ ...popupState, isOpen: false })}
        title={popupState.title}
        type={popupState.type}
      >
        <p>{popupState.message}</p>
      </Popup>
    </section>
  );
}
