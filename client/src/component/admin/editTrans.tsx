import { useEffect, useState, type ChangeEvent } from "react";
import { supabase } from "../../api/supabaseClient";
import Popup from "../reusable/Popup";
import { useNavigate, useParams } from "react-router-dom";

export default function EditTrans() {
  const [content, setContent] = useState("");
  const { slug } = useParams();
  const navigate = useNavigate();
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

  useEffect(() => {
    const fetchPost = async () => {
      const res = await fetch(`${baseURL}/translation-posts/${slug}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setPreview(data.thumbnail_src);
      }
    };
    if (slug) fetchPost();
  }, [slug]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      let finalThumbnail = preview;

      if (thumbnail) {
        const fileExt = thumbnail?.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from("post-thumbnail")
          .upload(`thumbnails/${fileName}`, thumbnail);
        if (error) throw error;
        const { data } = supabase.storage
          .from("post-thumbnail")
          .getPublicUrl(`thumbnails/${fileName}`);
        finalThumbnail = data.publicUrl;
      }

      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, "-");

      const updatedData = {
        title,
        content,
        thumbnail_src: finalThumbnail,
        linkhref: `/translation/${slug}`,
      };

      const resp = await fetch(`${baseURL}/translation-posts/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (resp.ok) {
        setStatusPopup({
          isOpen: true,
          type: "success",
          title: "Updated",
          message: "Post updated successfully!",
        });
        setTimeout(() => navigate("/my-translation"), 1500);
        
      } else {
        throw new Error("Failed to update");
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

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (preview) URL.revokeObjectURL(preview);

      setThumbnail(file);
      setPreview(URL.createObjectURL(file));
    }
  };



  return (
    <section className="font-plex max-w-4xl">
      <h1 className="text-white text-5xl font-bold mb-8">Create New</h1>

      <h1 className="font-plex text-accent text-xl font-bold mb-3">Title</h1>
      <input
        className="px-4 py-2 bg-white/20 border rounded-md text-white w-full border-accent focus:border-accent-secondary outline-none"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Write the title here..."
        type="text"
      />

      <h1 className="mt-5 font-plex text-accent text-xl font-bold mb-3">
        Content
      </h1>
      <textarea
        onChange={(e) => setContent(e.target.value)}
        value={content}
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
      <div className="flex flex-row w-1/4">
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
        onClick={handleUpdate}
        disabled={isSubmitting}
        className={`mt-20 w-full text-center py-2 rounded-md font-bold mb-10 transition-all ${
          isSubmitting
            ? "bg-gray-500 cursor-not-allowed text-white"
            : "bg-accent cursor-pointer hover:bg-accent-secondary text-bg hover:text-white"
        }`}
      >
        {isSubmitting ? "Updating..." : "Update Post"}
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
