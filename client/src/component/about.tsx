import { motion } from "framer-motion";
import useEmblaCarousel from "embla-carousel-react";
import { useState, useEffect } from "react";
import { playClickSound } from "../utils/playClickSound";

export default function About() {
  const [emblaRefFav, emblaApiFav] = useEmblaCarousel({
    align: "start",
    loop: true,
  });
  const [selectedFav, setSelectedFav] = useState(0);

  const [emblaRefGames, emblaApiGames] = useEmblaCarousel({
    align: "start",
    loop: true,
  });
  const [selectedGames, setSelectedGames] = useState(0);

  useEffect(() => {
    if (!emblaApiFav) return;
    const onSelect = () => setSelectedFav(emblaApiFav.selectedScrollSnap());
    emblaApiFav.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApiFav]);

  useEffect(() => {
    if (!emblaApiGames) return;
    const onSelect = () => setSelectedGames(emblaApiGames.selectedScrollSnap());
    emblaApiGames.on("select", onSelect).on("reInit", onSelect);
  }, [emblaApiGames]);

  const favorites = [
    { src: "img/oshi/gil.png", name: "Gilbert Nightray" },
    { src: "img/oshi/haru.png", name: "Haruka Isumi" },
    { src: "img/oshi/lumen.png", name: "Lumen" },
    { src: "img/oshi/my.png", name: "Mydei" },
    { src: "img/oshi/there.png", name: "Theresa" },
    { src: "img/oshi/allen.png", name: "Allen Walker" },
    { src: "img/oshi/break.png", name: "Xerxes Break" },
    { src: "img/oshi/suzu.png", name: "Orimaki Suzu" },
    { src: "img/oshi/kisa.png", name: "Tachibana Kisa" },
    { src: "img/oshi/yuta.png", name: "Okkotsu Yuta" },
    { src: "img/oshi/kadoc.png", name: "Kadoc Zemlupus" },
  ];

  const games = [
    { src: "img/games/ark.png", name: "Arknights" },
    { src: "img/games/hsr.png", name: "Honkai: Star Rail" },
    { src: "img/games/ake.png", name: "Arknights: Endfield" },
    { src: "img/games/AA.png", name: "Ace Attorney Trilogy" },
    { src: "img/games/TGAA.png", name: "The Great Ace Attorney" },
    { src: "img/games/stardew.png", name: "Stardew Valley" },
  ];

  return (
    <section className="px-15 py-5 h-full">
      <div className="flex flex-row gap-10">
        <h1 className="font-plex text-6xl md:text-8xl font-bold text-transparent opacity-50 [-webkit-text-stroke:1px_var(--color-accent)]">
          私
        </h1>
        <h1 className="font-plex text-accent text-6xl md:text-8xl font-bold">
          M E
        </h1>
      </div>
      <div className="grid md:grid-cols-2">
        <p className="text-lg mt-10 font-maru text-primary">
          An avid Japanese media enjoyer.I pass my N4 JLPT back in 2023. I love
          anime particularly shounen anime. I also love manga and reading
          anything that catch my interest. I played a good amount of games and I
          HUGE FAN of otome game! and for the rest of my games are visual novel,
          cozy games, and... gacha games... <br />
          <br /> Im building this website as one of my personal project before
          graduating college. As i need to learn some of the stuff before the
          work hunt (scary...) <br />
          <br /> All of the content here gonna be made by me. Do aware that my
          translation is not the most professional one as I just make them for
          fun. Sometimes you just need to face the evil and intimidating kanji
          to improve... <br />
          <br />
          Im listing some of my favorite characters and media. If you have spare
          time. feel free to peek at them:D
        </p>
        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="w-lg"
          src="img/flower-set-2.png"
          alt=""
        />
      </div>
      <div className="flex flex-col md:flex-row md:gap-50 md:mt-10 items-center">
        <h1 className="font-plex font-bold w-full md:w-1/2 text-primary text-xl md:text-4xl mb-5 ">
          For my personal website and contact you can visit
        </h1>
        <a
          target="_blank"
          onClick={() => { playClickSound() }}
          href="https://shifani-portfolio-website.vercel.app/#home"
          className="flex hover:bg-accent hover:text-bg transition-all duration-300 hover:translate-x-1 shadow-lg font-plex font-bold w-40 items-center justify-center justify-self-center h-10 text-white bg-accent-secondary rounded-2xl"
        >
          Portofolio
          <i className="fa-solid fa-arrow-right ml-5 rotate-315"></i>
        </a>
      </div>
      <div className="flex flex-row mt-20 mb-20 justify-center items-center transition-all duration-300">
        <a target="_blank" href="https://github.com/Shifani16" onClick={() => { playClickSound() }}>
          <i className="fa-brands fa-github text-gray text-6xl mr-10 hover:text-accent ease-out hover:scale-110"></i>
        </a>
        <a
          target="_blank"
          onClick={() => { playClickSound() }}
          href="https://open.spotify.com/user/98af5iyop8bt1kvjqfxy8155p?si=5b03222c12624493"
        >
          <i className="fa-brands fa-spotify text-gray text-6xl hover:text-accent ease-out hover:scale-110"></i>
        </a>
      </div>
      <motion.img
        initial={{ opacity: 0, y: -50 }}
        whileInView={{ opacity: 1, y: 5 }}
        transition={{ duration: 1, ease: "easeOut" }}
        viewport={{ once: false, margin: "-50px" }}
        className="-z-10 absolute right-0 w-40"
        src="img/Emotion1.png"
        alt=""
      />

      <div className="mt-10 mb-12 md:mb-30 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-10 border-b border-gray/10 pb-3">
          <div className="flex flex-row gap-4 items-baseline">
            <h1 className="font-plex text-xl md:text-5xl font-bold text-transparent opacity-50 text-shadow-none [-webkit-text-stroke:1px_var(--color-accent)]">
              推し
            </h1>
            <h1 className="font-plex text-accent text-xl md:text-5xl font-bold">
              Favorite Characters
            </h1>
          </div>

          <motion.p
            key={selectedFav}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="font-maru text-primary text-base md:text-2xl sm:ml-auto border-b-2 border-accent pb-1 self-start sm:self-auto"
          >
            {favorites[selectedFav % favorites.length].name}
          </motion.p>
        </div>
        <div className="embla mt-6 md:mt-10 max-w-5xl mx-auto overflow-hidden relative">
          <div className="embla__viewport" ref={emblaRefFav}>
            <div className="embla__container flex items-center py-6 md:py-10">
              {favorites.map((item, index) => (
                <div
                  key={index}
                  onClick={() => emblaApiFav?.scrollTo(index)}
                  className="embla__slide flex-[0_0_85%] sm:flex-[0_0_50%] md:flex-[0_0_33.33%] min-w-0 pr-4 md:pr-10 cursor-pointer"
                >
                  <div
                    className="transition-transform duration-500 ease-in-out origin-center"
                    style={{
                      transform:
                        selectedFav === index ? "scale(1.03)" : "scale(0.92)",
                      opacity: selectedFav === index ? 1 : 0.5,
                    }}
                  >
                    <img
                      src={item.src}
                      alt={item.name}
                      className="w-full aspect-3/4 md:h-100 object-cover rounded-2xl shadow-lg ml-0 md:ml-2"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-10 mb-12 md:mb-30 w-full">
        <div className="flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-10 border-b border-gray/10 pb-3">
          <div className="flex flex-row gap-4 items-baseline">
            <h1 className="font-plex text-xl md:text-5xl font-bold text-transparent opacity-50 text-shadow-none [-webkit-text-stroke:1px_var(--color-accent)]">
              ゲーム
            </h1>
            <h1 className="font-plex text-accent text-xl md:text-5xl font-bold">
              Games
            </h1>
          </div>
          <motion.p
            key={selectedGames}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="font-maru text-primary text-base md:text-2xl sm:ml-auto border-b-2 border-accent pb-1 self-start sm:self-auto"
          >
            {games[selectedGames % games.length]?.name}
          </motion.p>
        </div>

        <div className="embla mt-6 md:mt-10 max-w-5xl mx-auto overflow-hidden relative">
          <div className="embla__viewport" ref={emblaRefGames}>
            <div className="embla__container flex items-center py-6 md:py-10">
              {games.map((title, index) => (
                <div
                  key={index}
                  onClick={() => emblaApiGames?.scrollTo(index)}
                  className="embla__slide flex-[0_0_33%] min-w-0 pr-10 cursor-pointer"
                >
                  <div
                    className="transition-transform duration-500 ease-in-out"
                    style={{
                      transform:
                        selectedGames === index ? "scale(1.05)" : "scale(0.9)",
                      opacity: selectedGames === index ? 1 : 0.5,
                    }}
                  >
                    <img
                      src={title.src}
                      alt={title.name}
                      className="w-full aspect-3/4 md:h-100 object-cover rounded-2xl shadow-lg ml-0 md:ml-2"
                    />
                  </div>
                </div>
              ))}
            </div>
            <motion.img
              initial={{ opacity: 0, y: -30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, ease: "easeOut" }}
              viewport={{ once: false, margin: "-50px" }}
              className="absolute -z-10 rotate-350 left-0 bottom-0 w-24 md:w-40 pointer-events-none opacity-40 md:opacity-100"
              src="img/Emotion2.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
