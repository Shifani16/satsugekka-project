import type { ReactNode } from "react";

interface PopupCharProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
}

const PopupChar = ({ isOpen, onClose, title }: PopupCharProps) => {
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
          <div className="w-24 h-24 bg-gray-300 rounded-2xl flex items-center justify-center cursor-pointer hover:bg-gray-400 transition-colors">
            <i className="fa-solid fa-plus text-3xl text-bg-dark"></i>
          </div>

          <div className="flex flex-col gap-3 w-1/2">
            <input
              className="bg-white/5 w-full text-white border border-accent py-2 rounded-md px-2"
              placeholder="Character ID"
              type="text"
            />
            <input
              className="bg-white/5 w-full text-white border border-accent py-2 rounded-md px-2"
              placeholder="Display Name"
              type="text"
            />
          </div>

          <button className="w-14 h-14 bg-accent rounded-md flex items-center justify-center hover:bg-accent/80 transition-all shrink-0">
            <i className="fa-solid fa-plus text-2xl text-bg-dark"></i>
          </button>
        </div>

      </div>
    </div>
  );
};

export default PopupChar;
