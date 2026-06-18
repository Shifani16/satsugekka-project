import { motion } from "framer-motion";
import { playClickSound } from "../utils/playClickSound";

export default function Home() {
  return (
    <section className="h-full flex flex-col w-full items-center mt-10 px-2 md:px-4 overflow-x-hidden">
      <div className="relative grid grid-cols-1 md:grid-cols-2 max-w-6xl justify-between items-center md:py-4 md:gap-30">
        <div className="text-left z-10 justify-self-start">
          <h1 className="font-plex text-accent font-bold text-3xl md:text-6xl">
            Translation & <br /> Personal Blog
          </h1>
          <p className="font-maru text-primary mt-5 mb-5 text-sm md:text-xl">
            N4 and WebDev Learner. I love anime, manga, <br /> and game.
          </p>
          <div className="">
            <a
              href="#books"
              onClick={() => { playClickSound() }}
              className="font-plex font-semibold text-white bg-accent-secondary px-2 md:px-4 py-1 text-xs md:text-lg md:py-2 rounded-lg md:rounded-2xl mr-1 md:mr-3 hover:bg-accent hover:text-bg inline-block transform-all duration-300 hover:translate-x-1 shadow-lg"
            >
              Explore <span></span>
              <i className="fa-solid fa-arrow-right"></i>
            </a>
            <a
              target="_blank"
              onClick={() => { playClickSound() }}
              href="https://shifani-portfolio-website.vercel.app/#home"
              className="font-plex text-primary font-semibold bg-gray px-2 md:px-4 py-1 text-xs md:text-lg md:py-2 rounded-lg md:rounded-2xl mr-1 md:mr-3 hover:bg-dark-gray inline-block transform-all duration-300 hover:translate-x-1"
            >
              Portofolio
            </a>
          </div>
        </div>
        <div className="w-full max-w-xs mt-10 md:max-w-md flex justify-center md:justify-self-end">
          <img
            className="w-full h-50 md:h-100 object-contain"
            src="img/logo-jp.png"
            alt="logo-jp"
          />
        </div>
      </div>

      <div className="h-full">
        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="absolute left-1/2 -z-10 top-[20%] md:top-[60%] md:left-50 mt-5 md:mt-10 w-32 md:w-64 object-contain"
          src="img/leaf-set-1-home.png"
          alt="leaf-set-1"
        />

        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="absolute -z-10 right-0 md:mt-100 w-32 md:w-lg"
          src="img/leaf-1-home.png"
          alt="leaf-home"
        />
      </div>

      <div className="mt-5 md:mt-30 items-center justify-center">
        <div className="relative flex items-center justify-center top-30 md:top-100 h-auto w-auto">
          <a className="block -mr-42 md:-mr-130" href="\about" onClick={() => { playClickSound() }}>
            <img
              className="rotate-45 block transition-all duration-300 hover:translate-5"
              src="img/book-about.png"
              alt="About"
            />
          </a>
          <a className="block -mr-42 md:-mr-130" href="\blog" onClick={() => { playClickSound() }}>
            <img
              className="rotate-45 block transition-all duration-300 hover:translate-5"
              src="img/book-blog.png"
              alt="Blog"
            />
          </a>
          <a className="block" href="\translation" onClick={() => { playClickSound() }}>
            <img
              className=" rotate-45 block transition-all duration-300 hover:translate-5"
              src="img/book-translation.png"
              alt="Translation"
            />
          </a>
        </div>
        <div className="relative inset-0 object-contain -z-10">
          <p className="absolute font-maru text-primary text-xs md:text-3xl md:right-10 right-0 md:top-20 text-center">
            "I just couldn't resist
            <br />
            dreaming for a bit"
          </p>
          <img
            className="w-full bottom-0 h-full"
            id="books"
            src="img/frame-flower.png"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
