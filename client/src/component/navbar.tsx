import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { playClickSound } from "../utils/playClickSound";

export default function Navbar() {
  const [showBorder, setShowBorder] = useState(false);

  useEffect(() => {
    const handleScroll = (e: WheelEvent) => {
      if (e.deltaY > 0) {
        setShowBorder(true);
      } else {
        setShowBorder(false);
      }
    };

    window.addEventListener('wheel', handleScroll);

    return () => window.addEventListener('wheel', handleScroll);
  }, []);

  return (
    <nav className={`z-10 top-0 flex items-center justify-center ${showBorder ? 'shadow-md ' : 'shadow-none'}`}>
      <div className="grid grid-cols-3 w-full mt-4 ml-4">
        <a href="#" onClick={() => { playClickSound() }}>
          <img className="w-20" src="/satsugekka-logo.svg" alt="logo-home" />
        </a>
        <div className="grid grid-cols-3 md:gap-5 gap-10 mt-4">
          <NavLink to="/" className={({isActive}) => 
            `font-plex font-semibold text-md md:text-xl hover:text-accent transform-all duration-300 hover:translate-x-1 ${isActive ? 'text-accent' : 'text-white'}`
          }>
            Home
          </NavLink>
          <NavLink to="/blog" className={({ isActive }) =>
            `font-plex font-semibold text-md md:text-xl hover:text-accent transform-all duration-300 hover:translate-x-1 ${isActive ? 'text-accent' : 'text-white'}`
          }>
            Blog
          </NavLink>
          <NavLink to='/translation' className={({isActive}) => 
            `font-plex font-semibold text-md md:text-xl hover:text-accent transform-all duration-300 hover:translate-x-1 ${isActive ? 'text-accent' : 'text-white'}`
          }>
            Translation
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
