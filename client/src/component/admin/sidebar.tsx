import { NavLink, useNavigate } from "react-router-dom";

export default function Sidebar() {
  const isAdmin = localStorage.getItem("is_admin") === "true";
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("is_admin");

    navigate("/");
  };
  return (
    <aside className="w-1/6 bg-bg-dark border-r border-accent/20 flex flex-col p-6 sticky top-0 h-screen">
      <a href="/">
        <img
          src="/satsugekka-logo.svg"
          alt="logo"
          className="w-32 items-center flex justify-center"
        />
      </a>
      <hr className="text-white opacity-50" />

      <div className="font-plex flex flex-col">
        <h1 className="mt-5 mb-3 text-white font-bold text-xl">Blog</h1>
        {isAdmin && (
          <NavLink
            to="/create-blog"
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
          className=" mt-3 font-plex text-xl text-accent-secondary hover:text-white cursor-pointer font-bold text-left w-full"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}
