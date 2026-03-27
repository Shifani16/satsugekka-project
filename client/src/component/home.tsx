import { motion } from "framer-motion";

export default function Home() {
  return (
    <section className="h-full flex flex-col w-full items-center mt-10 overflow-x-hidden">
      <div className="relative grid grid-cols-2 w-full justify-items-center items-center py-4">
        <div>
          <h1 className="font-plex text-accent font-bold text-4xl md:text-6xl">
            Translation & <br /> Personal Blog
          </h1>
          <p className="font-maru text-primary mt-5 mb-5 text-md md:text-xl">
            N4 and WebDev Learner. I love anime, manga, <br /> and game.
          </p>
          <div className="grid-cold-2">
            <a
              href="#books"
              className="font-plex font-semibold text-white bg-accent-secondary px-4 py-2 rounded-2xl mr-3 hover:bg-accent hover:text-bg inline-block transform-all duration-300 hover:translate-x-1 shadow-lg"
            >
              Explore <span></span>
              <i className="fa-solid fa-arrow-right"></i>
            </a>
            <a
              target="_blank"
              href="https://shifani-portfolio-website.vercel.app/#home"
              className="font-plex text-primary font-semibold bg-gray px-4 py-2 rounded-2xl hover:bg-dark-gray inline-block transform-all duration-300 hover:translate-x-1"
            >
              Portofolio
            </a>
          </div>
        </div>
        <img className="w-md" src="img/logo-jp.png" alt="logo-jp" />
      </div>

      <div className="h-full">
        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="absolute -z-10 left-50 mt-10 w-md object-contain"
          src="img/leaf-set-1-home.png"
          alt="leaf-set-1"
        />

        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="absolute -z-10 right-0 mt-100"
          src="img/leaf-1-home.png"
          alt="leaf-home"
        />
      </div>

      <div className="mt-50 items-center justify-center">
        <div className="relative flex items-center justify-center top-100">
          <a className="block -mr-130" href="\about">
            <img
              className="rotate-45 block transition-all duration-300 hover:translate-5"
              src="img/book-about.png"
              alt="About"
            />
          </a>
          <a className="block -mr-130" href="\blog">
            <img
              className="rotate-45 block transition-all duration-300 hover:translate-5"
              src="img/book-blog.png"
              alt="Blog"
            />
          </a>
          <a className="block" href="\translation">
            <img
              className=" rotate-45 block transition-all duration-300 hover:translate-5"
              src="img/book-translation.png"
              alt="Translation"
            />
          </a>
        </div>
        <div className="relative inset-0 object-contain -z-10">
          <p className="absolute font-maru text-primary text-3xl right-10 top-20 text-center">"I just couldn't resist<br></br>dreaming for a bit"</p>
          <img
            className="w-full bottom-0 h-full "
            id="books"
            src="img/frame-flower.png"
            alt=""
          />
        </div>
      </div>
    </section>
  );
}
