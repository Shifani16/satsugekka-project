import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
import Popup from "../reusable/Popup";
import { supabase } from "../../api/supabaseClient";
import { useNavigate, useParams } from "react-router-dom";

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const quillRef = useRef<ReactQuill>(null);
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const baseURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      const res = await fetch(`${baseURL}/my-blog/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTitle(data.title);
        setContent(data.content);
        setPreview(data.thumbnail_src);
      }
    };
    if (id) fetchBlog();
  }, [id]);

  const handleUpdate = async () => {
    setIsSubmitting(true);
    try {
      let finalThumbnail = preview;

      if (thumbnail) {
        const fileExt = thumbnail.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const { error } = await supabase.storage
          .from("blog-thumbnails")
          .upload(`thumbnails/${fileName}`, thumbnail);
        if (error) throw error;
        const { data } = supabase.storage
          .from("blog-thumbnails")
          .getPublicUrl(`thumbnails/${fileName}`);
        finalThumbnail = data.publicUrl;
      }

      const updatedData = {
        title,
        content,
        thumbnail_src: finalThumbnail,
        short_description: content.substring(0, 100).replace(/<[^>]*>?/gm, ""),
        linkhref: `/blog/${title.toLowerCase().replace(/\s+/g, "-")}`,
      };

      const resp = await fetch(`${baseURL}/my-blog/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedData),
      });

      if (resp.ok) {
        setPopupState({
          isOpen: true,
          type: "success",
          title: "Updated",
          message: "Blog updated!",
        });
        setTimeout(() => navigate("/my-blog"), 1500);
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

  const [popupState, setPopupState] = useState({
    isOpen: false,
    type: "success" as any,
    title: "",
    message: "",
  });

  const imageHandler = () => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file = input.files?.[0];
      if (file) {
        try {
          const fileName = `${Date.now()}-${file.name}`;
          const filePath = `blog-content/${fileName}`;

          const { error } = await supabase.storage
            .from("blog-thumbnails")
            .upload(filePath, file);

          if (error) throw error;

          const { data: urlData } = supabase.storage
            .from("blog-thumbnails")
            .getPublicUrl(filePath);

          // Get the editor instance correctly
          const quill = quillRef.current?.getEditor();
          if (quill) {
            const range = quill.getSelection();
            quill.insertEmbed(
              range ? range.index : 0,
              "image",
              urlData.publicUrl,
            );
          }
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      }
    };
  };

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["image", "link"],
          ["clean"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
    }),
    [],
  );

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
      <h1 className="text-white text-5xl font-bold mb-8">New Post</h1>

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
        Content
      </h1>
      <div>
        <ReactQuill
          theme="snow"
          value={content}
          onChange={setContent}
          modules={modules}
          className="text-white"
        ></ReactQuill>
      </div>

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
        isOpen={popupState.isOpen}
        onClose={() => setPopupState({ ...popupState, isOpen: false })}
        onConfirm={() => setPopupState({ ...popupState, isOpen: false })} // Added this
        title={popupState.title}
        type={popupState.type}
      >
        <p>{popupState.message}</p>
      </Popup>
    </section>
  );
}
