import type { CharacterEntry } from "../admin/setting";
import { useEffect, useState } from "react";

interface PopupCharProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  character: CharacterEntry | null;
  onSave: (updatedData: Partial<CharacterEntry> & { imageFile?: File | null }) => void;
}

const PopupChar = ({
  isOpen,
  onClose,
  title,
  character,
  onSave,
}: PopupCharProps) => {
  const [formData, setFormData] = useState({ char_id: "", char_name: "" });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (character) {
      setFormData({
        char_id: character.char_id,
        char_name: character.char_name,
      });
      setPreviewUrl(character.char_img);
      setImageFile(null);
    }
  }, [character]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-dark border-2 border-accent w-1/2 min-h-64 flex flex-col font-plex text-white shadow-xl">
        <div className="bg-accent text-black px-4 py-1 flex justify-between items-center font-bold shrink-0">
          <span>{title}</span>
          <button
            onClick={onClose}
            className="hover:text-accent-secondary cursor-pointer"
          >
            [ X ]
          </button>
        </div>

        <div className="flex-1 flex justify-center items-center gap-4 p-6">
          <label className="w-24 h-24 bg-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
            {previewUrl ? (
              <img
                src={previewUrl}
                className="w-full h-full object-cover rounded-2xl"
                alt="Preview"
              />
            ) : (
              <i className="fa-solid fa-plus text-3xl text-bg-dark"></i>
            )}

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          <div className="flex flex-col gap-3 w-1/2">
            <input
              className="bg-white/5 w-full text-white border border-accent py-2 rounded-md px-2"
              placeholder="Character ID"
              value={formData.char_id}
              onChange={(e) =>
                setFormData({ ...formData, char_id: e.target.value })
              }
            />
            <input
              className="bg-white/5 w-full text-white border border-accent py-2 rounded-md px-2"
              placeholder="Display Name"
              value={formData.char_name}
              onChange={(e) =>
                setFormData({ ...formData, char_name: e.target.value })
              }
            />
          </div>

          <button
            onClick={() => onSave({ ...formData, imageFile })}
            className="w-14 h-14 bg-accent rounded-md flex items-center justify-center hover:bg-accent/80 transition-all shrink-0"
          >
            <i className="fa-solid fa-plus text-2xl text-bg-dark"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PopupChar;
