import type { ReactNode } from "react";

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  onConfirm?: () => void;
  type?: "success" | "danger" | "default" | "confirm";
}

const Popup = ({
  isOpen,
  onClose,
  title,
  children,
  onConfirm,
  type = "default",
}: PopupProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-bg-dark border-2 border-accent w-96 font-plex text-white shadow-xl">
        <div className="bg-accent text-black px-4 py-1 flex justify-between items-center font-bold">
          <span>{title}</span>
          <button
            onClick={onClose}
            className="hover:text-accent-secondary cursor-pointer"
          >
            [ X ]
          </button>
        </div>

        <div className="p-4 text-center">{children}</div>

        <div className="py-4 flex justify-center items-center gap-2">
          {(type === "confirm" || type === "danger") && (
            <button
              onClick={onClose}
              className="bg-gray font-bold hover:bg-bg-light hover:cursor-pointer hover:text-white text-black px-3 py-1"
            >
              X
            </button>
          )}
          <button
            onClick={onConfirm || onClose}
            className="bg-accent font-bold hover:cursor-pointer hover:bg-accent-secondary hover:text-white text-black px-3 py-1"
          >
            ✓
          </button>
        </div>
      </div>
    </div>
  );
};

export default Popup;
