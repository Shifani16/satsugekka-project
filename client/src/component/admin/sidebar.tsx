import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { playClickSound } from "../../utils/playClickSound";

export default function Sidebar() {
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const navigate = useNavigate();
  
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("is_admin");
    navigate("/");
    setIsOpen(false); 
  };

  const toggleSidebar = () => {
    playClickSound();
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="bg-bg-dark border-b border-accent/20 p-2 md:p-4 flex justify-between items-center md:hidden sticky top-0 z-50 w-full">
        <a href="/">
          <img src="/satsugekka-logo.svg" alt="logo" className="w-24" />
        </a>
        <button
          onClick={toggleSidebar}
          className="text-white focus:outline-none p-2"
          aria-label="Toggle Menu"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden" 
          onClick={toggleSidebar}
        />
      )}

      <aside 
        className={`
          fixed top-0 left-0 h-screen bg-bg-dark border-r border-accent/20 flex flex-col p-6 z-40
          transition-transform duration-300 ease-in-out w-64
          md:sticky md:translate-x-0 md:w-1/6
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        <a href="/" className="hidden md:block">
          <img
            src="/satsugekka-logo.svg"
            alt="logo"
            className="w-32 items-center flex justify-center"
          />
        </a>
        <hr className="text-white opacity-50 hidden md:block" />

        <div className="font-plex flex flex-col mt-20 md:mt-0">
          <h1 className="mt-5 mb-3 text-white font-bold text-xl">Blog</h1>
          {isAdmin && (
            <NavLink
              to="/create-blog"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `hover:text-accent cursor-pointer ${isActive ? "text-accent" : "text-primary"}`
              }
            >
              New Post
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/my-blog"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `mt-3 mb-6 hover:text-accent cursor-pointer ${isActive ? "text-accent" : "text-primary"}`
              }
            >
              My Blog
            </NavLink>
          )}
        </div>
        
        <hr className="text-white opacity-50" />

        <div className="font-plex flex flex-col">
          <h1 className="mt-5 text-white font-bold text-xl">Translation</h1>
          {isAdmin && (
            <NavLink
              to="/setting-char"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `mt-3 hover:text-accent cursor-pointer ${isActive ? "text-accent" : "text-primary"}`
              }
            >
              Setting
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/create-translation"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `mt-3 hover:text-accent cursor-pointer ${isActive ? "text-accent" : "text-primary"}`
              }
            >
              Create
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/my-translation"
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                `mt-3 hover:text-accent cursor-pointer ${isActive ? "text-accent" : "text-primary"}`
              }
            >
              My Translation
            </NavLink>
          )}
        </div>

        <div className="mt-auto pt-10">
          <hr className="text-primary/50 shadow-2xl" />
          <button
            onClick={handleLogout}
            className="mt-3 font-plex text-xl text-accent-secondary hover:text-white cursor-pointer font-bold text-left w-full"
          >
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}