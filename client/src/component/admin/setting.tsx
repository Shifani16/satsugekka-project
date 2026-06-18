import { useEffect, useState } from "react";
import PopupChar from "../reusable/PopupChar";
import Popup from "../reusable/Popup";
import { supabase } from "../../api/supabaseClient";

export interface CharacterEntry {
  id: number;
  char_id: string;
  char_name: string;
  char_img: string;
  created_at: string;
  updated_at: string;
}

export default function Setting() {
  const [characters, setCharacters] = useState<CharacterEntry[]>([]);
  const [newChar, setNewChar] = useState({ char_id: "", char_name: "" });

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [editingChar, setEditingChar] = useState<CharacterEntry | null>(null);

  const [statusPopup, setStatusPopup] = useState({
    isOpen: false,
    type: "success" as "success" | "danger",
    title: "",
    message: "",
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const baseURL = import.meta.env.VITE_API_URL;

  const handleUpdateCharacter = async (
    updatedData: Partial<CharacterEntry> & { imageFile?: File | null },
  ) => {
    if (!selectedId || !editingChar) return;

    try {
      setIsLoading(true); 
      let finalImageUrl = editingChar.char_img;

      if (updatedData.imageFile) {
        const file = updatedData.imageFile;
        const fileExt = file.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("char-img")
          .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("char-img")
          .getPublicUrl(filePath);

        finalImageUrl = urlData.publicUrl;
      }

      const updatePayload = {
        char_id: updatedData.char_id,
        char_name: updatedData.char_name,
        char_img: finalImageUrl,
      };

      const resp = await fetch(`${baseURL}/characters/${selectedId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatePayload),
      });

      if (!resp.ok) throw new Error("Failed to update character in database");

      const updatedResult = await resp.json();

      setCharacters((prev) =>
        prev.map((c) => (c.id === selectedId ? updatedResult : c)),
      );

      setShowEditPopup(false);
      setEditingChar(null);
      setSelectedId(null);

      setStatusPopup({
        isOpen: true,
        type: "success",
        title: "Updated",
        message: "Character has been updated successfully!",
      });
    } catch (err: any) {
      console.error("UPDATE ERROR:", err);
      setStatusPopup({
        isOpen: true,
        type: "danger",
        title: "Update Failed",
        message: err.message || "An error occurred while saving changes.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedId) {
      console.log("No ID selected");
      return;
    }

    try {
      const resp = await fetch(`${baseURL}/characters/${selectedId}`, {
        method: "DELETE",
      });

      setDeleteOpen(false);

      if (resp.ok) {
        setCharacters(characters.filter((b) => b.id !== selectedId));
        setDeleteOpen(false);
        setStatusPopup({
          isOpen: true,
          type: "success",
          title: "Deleted",
          message: "The character has been removed successfully.",
        });
        setSelectedId(null);
      } else {
        setStatusPopup({
          isOpen: true,
          type: "danger",
          title: "Error",
          message: "Failed to delete the character. Please try again.",
        });
      }
    } catch (err: any) {
      console.error(err);
      setStatusPopup({
        isOpen: true,
        type: "danger",
        title: "Network Error",
        message: "Could not connect to the server.",
      });
    }
  };

  const fetchCharacters = async () => {
    try {
      const res = await fetch(`${baseURL}/characters`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setCharacters(Array.isArray(data) ? data : data.characters || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCharacter = async () => {
    if (!newChar.char_id || !newChar.char_name) {
      setStatusPopup({
        isOpen: true,
        type: "danger",
        title: "Missing Info",
        message: "Please fill in ID and Name",
      });
      return;
    }

    try {
      let publicUrl = "";
      if (imageFile) {
        const fileExt = imageFile.name.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;
        const filePath = `avatars/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("char-img")
          .upload(filePath, imageFile);

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("char-img")
          .getPublicUrl(filePath);
        publicUrl = urlData.publicUrl;
      }

      const resp = await fetch(`${baseURL}/characters`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          char_id: newChar.char_id.trim(),
          char_name: newChar.char_name,
          char_img: publicUrl,
        }),
      });

      if (resp.ok) {
        const addedChar = await resp.json();
        setStatusPopup({
          isOpen: true,
          type: "success",
          title: "Added",
          message: "Character added successfully!",
        });
        setCharacters((prev) => [...prev, addedChar]);
        setNewChar({ char_id: "", char_name: "" });
        setImageFile(null);
        setPreviewUrl(null);
      }
    } catch (err) {
      console.error(err);
      setStatusPopup({
        isOpen: true,
        type: "danger",
        title: "Error",
        message: "Something went wrong",
      });
    }
  };

  const filteredChars = characters.filter(
    (c) =>
      c.char_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.char_id.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <section className="font-plex max-w-5xl mx-auto px-2 sm:px-4">
      {/* Title Adjustments */}
      <h1 className="text-white text-3xl sm:text-5xl font-bold">Setting</h1>

      <h1 className="md:mt-8 mt-2 font-plex text-accent text-lg sm:text-xl font-bold mb-4">
        Character Making
      </h1>

      {/* --- FORM SECTION --- */}
      {/* Stack vertically on mobile, row on desktop */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 bg-white/5 sm:bg-transparent p-4 sm:p-0 rounded-xl">
        <div className="flex items-center gap-4 w-full sm:w-auto">
          <label className="w-20 h-20 sm:w-24 sm:h-24 bg-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-all overflow-hidden border-2 border-dashed border-accent/50 shrink-0 relative">
            {previewUrl ? (
              <img
                src={previewUrl}
                className="w-full h-full object-cover"
                alt="Preview"
              />
            ) : (
              <i className="fa-solid fa-plus text-2xl sm:text-3xl text-bg-dark"></i>
            )}

            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>
          
          {/* Mobile Submit Button inside the inner row wrapper */}
          <button
            onClick={handleAddCharacter}
            className="sm:hidden ml-auto cursor-pointer w-14 h-14 bg-accent rounded-xl flex items-center justify-center hover:bg-accent/80 transition-all shrink-0"
          >
            <i className="fa-solid fa-plus text-xl text-bg-dark"></i>
          </button>
        </div>

        {/* Inputs take full width on mobile */}
        <div className="flex flex-col gap-3 w-full sm:flex-1 max-w-xl">
          <input
            className="bg-white/5 sm:bg-white/5 w-full sm:w-1/2 text-white border border-accent py-2 rounded-md px-2 text-sm sm:text-base"
            placeholder="Character ID"
            value={newChar.char_id}
            onChange={(e) =>
              setNewChar({ ...newChar, char_id: e.target.value })
            }
          />
          <input
            className="bg-white/5 sm:bg-white/5 w-full sm:w-3/4 text-white border border-accent py-2 rounded-md px-2 text-sm sm:text-base"
            placeholder="Display Name"
            value={newChar.char_name}
            onChange={(e) =>
              setNewChar({ ...newChar, char_name: e.target.value })
            }
          />
        </div>

        {/* Desktop Submit Button */}
        <button
          onClick={handleAddCharacter}
          className="hidden sm:flex cursor-pointer w-14 h-14 bg-accent rounded-md items-center justify-center hover:bg-accent/80 transition-all shrink-0"
        >
          <i className="fa-solid fa-plus text-2xl text-bg-dark"></i>
        </button>
      </div>

      {/* --- SEARCH BAR --- */}
      <div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by ID or Name"
          className="mt-8 text-white border border-accent px-3 py-2 rounded-md bg-white/5 w-full sm:w-1/2 md:w-1/4 text-sm sm:text-base"
        />
      </div>

      {/* --- CHARACTER LIST --- */}
      <div className="mt-8 flex flex-col gap-4">
        {isLoading ? (
          <p className="text-white">Loading...</p>
        ) : filteredChars.length > 0 ? (
          filteredChars.map((char) => (
            <div key={char.id} className="flex gap-3 w-full md:w-3/4 items-center justify-between sm:justify-start">
              <div className="flex gap-3 items-center flex-1 min-w-0">
                <img
                  src={char.char_img || "img/oshi/default.png"}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-full shrink-0 aspect-square"
                  alt={char.char_name}
                />
                {/* Bubble Container expands fluidly */}
                <div className="opacity-90 bg-primary border flex-1 border-accent-secondary px-3 py-2 sm:px-4 rounded-2xl rounded-tl-none min-w-0">
                  <h1 className="font-plex text-accent-secondary font-bold text-xs sm:text-sm truncate">
                    {char.char_name}
                  </h1>
                  <p className="font-plex font-semibold text-[10px] sm:text-xs text-bg opacity-70 truncate">
                    ID: {char.char_id}
                  </p>
                </div>
              </div>

              {/* Action Icons spacing compressed slightly on small viewports */}
              <div className="flex flex-row items-center gap-4 sm:gap-6 ml-3 sm:ml-10 shrink-0">
                <i
                  onClick={() => {
                    setSelectedId(char.id);
                    setEditingChar(char);
                    setShowEditPopup(true);
                  }}
                  className="fa-regular fa-pen-to-square text-primary text-xl sm:text-2xl hover:text-accent-secondary cursor-pointer"
                ></i>
                <i
                  onClick={() => {
                    setSelectedId(char.id);
                    setDeleteOpen(true);
                  }}
                  className="fa-solid fa-trash text-xl sm:text-2xl text-primary hover:text-accent-secondary cursor-pointer"
                ></i>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 italic text-sm">No characters found.</p>
        )}
      </div>

      {/* Popups */}
      <PopupChar
        isOpen={showEditPopup}
        onClose={() => setShowEditPopup(false)}
        title="Edit Character"
        character={editingChar}
        onSave={handleUpdateCharacter}
      />

      <Popup
        isOpen={isDeleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Delete"
        onConfirm={handleDelete}
        type="confirm"
      >
        <p className="text-base sm:text-lg">
          Are you sure you want to delete this character?
        </p>
      </Popup>

      <Popup
        isOpen={statusPopup.isOpen}
        onClose={() => setStatusPopup({ ...statusPopup, isOpen: false })}
        onConfirm={() => setStatusPopup({ ...statusPopup, isOpen: false })}
        title={statusPopup.title}
        type={statusPopup.type}
      >
        <p className="text-base sm:text-lg">{statusPopup.message}</p>
      </Popup>
    </section>
  );
}