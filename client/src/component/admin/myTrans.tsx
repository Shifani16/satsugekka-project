import { useState } from "react";
import Popup from "../reusable/Popup";

export default function MyTrans() {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const handleDelete = () => {
    console.log("Deleted");
    setIsDeleteOpen(false);
  };
  return (
    <section className="font-plex">
      <h1 className="text-white text-5xl font-bold">My Translation</h1>

      <div className="mt-10 overflow-x-auto">
        <table className="w-full">
          <thead className="border-b border-white">
            <tr className="">
              <th className="mt-5 py-3 text-left text-accent font-bold">
                Title
              </th>
              <th className="py-3 text-left text-accent font-bold">
                Uploaded Date
              </th>
              <th className="py-3 text-left text-accent font-bold"></th>
            </tr>
          </thead>
          <tbody>
            <tr className="text-primary shadow-bg border-b border-bg-dark hover:text-white">
              <td className="py-3">Lorem Ipsum</td>
              <td className="py-3">12/03/2026</td>

              <td className="py-3">
                <div className="flex flex-row gap-3">
                  <i className="fa-regular fa-pen-to-square text-xl hover:text-accent-secondary cursor-pointer"></i>

                  <i
                    onClick={() => setIsDeleteOpen(true)}
                    className="fa-solid fa-trash text-xl hover:text-accent-secondary cursor-pointer"
                  ></i>

                  <i className="fa-solid fa-arrow-right rotate-315 text-2xl hover:text-accent-secondary cursor-pointer"></i>
                </div>
              </td>
            </tr>
            <tr className="text-primary shadow-bg border-b border-bg-dark hover:text-white">
              <td className="py-3">Lorem Ipsum</td>
              <td className="py-3">12/03/2026</td>
              <div className="flex flex-row py-3 gap-3">
                <td>
                  <i className="fa-regular fa-pen-to-square text-xl hover:text-accent-secondary cursor-pointer"></i>
                </td>
                <td>
                  <i className="fa-solid fa-trash text-xl hover:text-accent-secondary cursor-pointer"></i>
                </td>
                <td>
                  <i className="fa-solid fa-arrow-right rotate-315 text-2xl hover:text-accent-secondary cursor-pointer"></i>
                </td>
              </div>
            </tr>
          </tbody>
        </table>
        <Popup
          isOpen={isDeleteOpen}
          onClose={() => setIsDeleteOpen(false)}
          onConfirm={handleDelete}
          title="Delete"
          type="confirm"
        >
          <p className="text-lg">Are you sure to delete?</p>
        </Popup>
      </div>
    </section>
  );
}
