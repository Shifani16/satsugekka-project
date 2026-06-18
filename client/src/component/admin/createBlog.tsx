import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useMemo, useRef, useState, type ChangeEvent } from "react";
import Popup from "../reusable/Popup";
import { supabase } from "../../api/supabaseClient";

export default function CreateBlog() {
  const quillRef = useRef<ReactQuill>(null); // Reference to the editor
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
            quill.insertEmbed(range ? range.index : 0, "image", urlData.publicUrl);
          }
        } catch (err) {
          console.error("Image upload failed:", err);
        }
      }
    };
  };

  const modules = useMemo(() => ({
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
  }), []);

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
      const baseURL = import.meta.env.VITE_API_URL;
      const fileExt = thumbnail?.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("blog-thumbnails")
        .upload(filePath, thumbnail);

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("blog-thumbnails")
        .getPublicUrl(filePath);

      const blogData = {
        title,
        content,
        short_description: content.substring(0, 100).replace(/<[^>]*>?/gm, ""),
        linkhref: `/blog/${title.toLowerCase().replace(/\s+/g, "-")}`,
        thumbnail_src: urlData.publicUrl,
      };

      const resp = await fetch(`${baseURL}/my-blog`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(blogData),
      });

      if (resp.ok) {
        setPopupState({
          isOpen: true,
          type: "success",
          title: "Published",
          message: "Blog posted successfully!",
        });
        setTitle("");
        setContent("");
        setThumbnail(null);
        setPreview(null);
      } else {
        throw new Error("Failed to publish");
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
      <h1 className="text-white text-5xl font-bold mb-8">New Post</h1>

      <h1 className="font-plex text-accent text-xl font-bold mb-3">
        Blog Title
      </h1>
      <input
        className="px-4 py-2 bg-white/20 border rounded-md text-white w-full border-accent focus:border-accent-secondary outline-none"
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
        onConfirm={() => setPopupState({ ...popupState, isOpen: false })} // Added this
        title={popupState.title}
        type={popupState.type}
      >
        <p>{popupState.message}</p>
      </Popup>
    </section>
  );
}
