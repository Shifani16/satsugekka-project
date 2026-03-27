import { motion } from "framer-motion";

export default function Intro() {
  return (
    <div className="relative overflow-hidden  ">
      <div>
        <motion.img
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 10, x: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="absolute bottom-0 w-64 opacity-70 h-auto -z-10"
          src="/img/flower-set-1.png"
          alt="flower"
        />
        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="absolute top-0 w-sm -z-10"
          src="/img/leaf-set-1-intro.png"
          alt="leaf-set-intro"
        />
        <motion.img
          initial={{ opacity: 0, y: -50 }}
          whileInView={{ opacity: 1, y: 5 }}
          transition={{ duration: 1, ease: "easeOut" }}
          viewport={{ once: false, margin: "-50px" }}
          className="absolute right-0 bottom-20 -z-10"
          src="/img/leaf-intro.png"
          alt="leaf-intro"
        />
      </div>

      <div className="flex h-screen w-screen items-center justify-center">
        <h1 className="font-maru font-bold text-3xl md:text-6xl text-primary animate-handwritten">
          "SNOW. MOON. FLOWER"
        </h1>
      </div>
    </div>
  );
}
