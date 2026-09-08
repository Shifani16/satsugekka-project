import { useRef, useState, type ChangeEvent } from "react";
import ReactMarkdown from "react-markdown";
import { uploadImage } from "../../utils/adminApi";

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  baseURL: string;
}

export default function MarkdownEditor({ value, onChange, baseURL }: MarkdownEditorProps) {
  const [tab, setTab] = useState<"write" | "preview">("write");
  const [uploading, setUploading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertAtCursor = (snippet: string) => {
    const textarea = textareaRef.current;
    if (!textarea) {
      onChange(value + snippet);
      return;
    }
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newValue = value.slice(0, start) + snippet + value.slice(end);
    onChange(newValue);

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
    });
  };

  const handleImagePick = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    setUploading(true);
    try {
      const url = await uploadImage(baseURL, file);
      insertAtCursor(`![${file.name}](${url})`);
    } catch (err: any) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border border-accent rounded-md overflow-hidden">
      <div className="flex items-center justify-between bg-white/10 px-3 py-2 border-b border-accent/50">
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setTab("write")}
            className={`text-sm font-plex font-semibold px-2 py-1 rounded ${
              tab === "write" ? "bg-accent text-bg" : "text-white/70 hover:text-white"
            }`}
          >
            Write
          </button>
          <button
            type="button"
            onClick={() => setTab("preview")}
            className={`text-sm font-plex font-semibold px-2 py-1 rounded ${
              tab === "preview" ? "bg-accent text-bg" : "text-white/70 hover:text-white"
            }`}
          >
            Preview
          </button>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="text-sm font-plex text-accent hover:text-accent-secondary disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "+ Insert image"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleImagePick}
        />
      </div>

      {tab === "write" ? (
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full min-h-100 p-4 bg-white/5 text-white outline-none resize-y font-mono text-sm"
          placeholder="Write your post in Markdown... e.g. **bold**, _italic_, ## heading, - list item"
        />
      ) : (
        <div className="min-h-100 p-4 bg-bg-dark/40 text-primary prose prose-invert max-w-none">
          {value ? (
            <ReactMarkdown>{value}</ReactMarkdown>
          ) : (
            <p className="italic opacity-50">Nothing to preview yet.</p>
          )}
        </div>
      )}
    </div>
  );
}
