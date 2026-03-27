import { useState } from "react";
import PopupChar from "../reusable/PopupChar";
import Popup from "../reusable/Popup";

export default function Setting() {
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [isDeleteOpen, setDeleteOpen] = useState(false);

  const handleEditPopup = () => {
    console.log("Edit");
    setShowEditPopup(true);
  };

  const handleDelete = () => {
    console.log("Delete");
    setDeleteOpen(true);
  };

  return (
    <section className="font-plex">
      <h1 className="text-white text-5xl font-bold">Setting</h1>

      <h1 className="mt-10 font-plex text-accent text-xl font-bold mb-3">
        Character Making
      </h1>

      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
          <i className="fa-solid fa-plus text-3xl text-bg-dark"></i>
        </div>

        <div className="flex flex-col gap-3 w-1/2">
          <input
            className="bg-white/5 w-1/2 text-white border border-accent py-2 rounded-md px-2"
            placeholder="Character ID"
            type="text"
          />
          <input
            className="bg-white/5 w-3/4 text-white border border-accent py-2 rounded-md px-2"
            placeholder="Display Name"
            type="text"
          />
        </div>

        <button className=" w-14 h-14 bg-accent rounded-md flex items-center justify-center hover:bg-accent/80 transition-all">
          <i className="fa-solid fa-plus text-2xl text-bg-dark"></i>
        </button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Search by ID or Name"
          className="mt-10 text-white border border-accent px-2 py-2 rounded-md bg-white/5 w-1/4"
        />
      </div>

      <div className="mt-10 flex gap-2 w-3/4">
        <img
          src="img/oshi/haru.png"
          className="w-15 h-auto object-cover rounded-full shrink-0 aspect-square"
          alt=""
        />
        <div className="opacity-90 bg-primary border w-1/2 border-accent-secondary px-4 py-2  rounded-2xl rounded-tl-none">
          <h1 className="font-plex text-accent-secondary font-bold text-sm">
            Character Name
          </h1>
          <p className="font-plex font-semibold text-sm text-bg">
            Character Dialogue or Description
          </p>
        </div>
        <div className="flex flex-row items-center gap-4 ml-40">
          <i
            onClick={() => setShowEditPopup(true)}
            className="fa-regular fa-pen-to-square text-primary text-2xl hover:text-accent-secondary cursor-pointer"
          ></i>
          <i
            onClick={() => setDeleteOpen(true)}
            className="fa-solid fa-trash text-2xl text-primary hover:text-accent-secondary cursor-pointer"
          ></i>
        </div>

        <PopupChar
          isOpen={showEditPopup}
          onClose={() => setShowEditPopup(false)}
          title="Edit"
        >
          <p className="text-lg">Are you sure to delete?</p>
        </PopupChar>
        <Popup
          isOpen={isDeleteOpen}
          onClose={() => setDeleteOpen(false)}
          title="Delete"
          onConfirm={handleDelete}
          type="confirm"
        >
          <p className="text-lg">Are you sure to delete?</p>
        </Popup>
      </div>
    </section>
  );
}
