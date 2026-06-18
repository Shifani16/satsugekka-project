import { useState, type ChangeEvent } from "react";
import { supabase } from "../../api/supabaseClient";
import Popup from "../reusable/Popup";

export default function CreateTrans() {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [preview, setPreview] = useState<string | null>(null);
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseURL = import.meta.env.VITE_API_URL;

  const [statusPopup, setStatusPopup] = useState({
    isOpen: false,
    type: "success" as "success" | "danger",
    title: "",
    message: "",
  });

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);

      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handlePublish = async () => {
    if (!title || !content || !thumbnail) {
      setStatusPopup({
        isOpen: true,
        type: "danger",
        title: "Missing Info",
        message: "Title, Content, and Thumbnail are all required!",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const fileExt = thumbnail?.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("post-thumbnail")
        .upload(filePath, thumbnail);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("post-thumbnail")
        .getPublicUrl(filePath);

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      const postData = {
        title,
        content,
        short_description: content.substring(0, 100).replace(/<[^>]*>?/gm, ""),
        linkhref: `/translation/${slug}`,
        thumbnail_src: urlData.publicUrl,
      };

      const resp = await fetch(`${baseURL}/translation-posts`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      });

      if (resp.ok) {
        setStatusPopup({
          isOpen: true,
          type: "success",
          title: "Published",
          message: "Post posted successfully!",
        });
        setTitle("");
        setContent("");
        setThumbnail(null);
        setPreview(null);
      } else {
        throw new Error("Failed to publish");
      }
    } catch (err: any) {
      setStatusPopup({
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
      <h1 className="text-white text-3xl md:text-5xl font-bold mb-8">Create New</h1>

      <h1 className="font-plex text-accent text-xl font-bold mb-3">Title</h1>
      <input
        className="px-4 py-2 bg-white/20 border rounded-md text-white w-full border-accent focus:border-accent-secondary outline-none"
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write the title here..."
        type="text"
      />

      <h1 className="mt-5 font-plex text-accent text-xl font-bold mb-3">
        Content
      </h1>
      <textarea
        onChange={(e) => setContent(e.target.value)}
        className="px-4 py-4 min-h-125 bg-white/20 border rounded-md text-white w-full border-accent focus:border-accent-secondary outline-none resize-none"
        placeholder="Write ur content here fellas"
      />

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
      <div className="flex flex-row w-1/2 md:w-1/4 text-sm md:text-md ">
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
        isOpen={statusPopup.isOpen}
        onClose={() => setStatusPopup({ ...statusPopup, isOpen: false })}
        onConfirm={() => setStatusPopup({ ...statusPopup, isOpen: false })} // Added this
        title={statusPopup.title}
        type={statusPopup.type}
      >
        <p>{statusPopup.message}</p>
      </Popup>
    </section>
  );
}
