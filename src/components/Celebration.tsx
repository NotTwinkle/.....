import { motion } from "framer-motion";
import { useEffect } from "react";
import confetti from "canvas-confetti";
import { FloatingElements } from "./floatinghearts";

const gifMemes = [
  "https://media.giphy.com/media/xlNDtecvg6zLrXvOaa/giphy.gif?cid=790b7611igw19zgxuryh2o038w4tlyp4zxgyue6mg7hivkny&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWd3MTl6Z3h1cnloMm8wMzh3NHRseXA0enhneXVlNm1nN2hpdmtueSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/ynpS4KW1JHMI31orRT/giphy.gif",
  "https://media.giphy.com/media/3o7TKoWXm3okO1kgHC/giphy.gif?cid=790b7611igw19zgxuryh2o038w4tlyp4zxgyue6mg7hivkny&ep=v1_gifs_search&rid=giphy.gif&ct=g",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExaWd3MTl6Z3h1cnloMm8wMzh3NHRseXA0enhneXVlNm1nN2hpdmtueSZlcD12MV9naWZzX3NlYXJjaCZjdD1n/VIKa3CjZDCoymNcBY5/giphy.gif",
];

export const Celebration = () => {
  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        clearInterval(interval);
        return;
      }

      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
      });
    }, 150);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="text-center px-4"
    >
      <h1 className="text-4xl md:text-6xl mb-8 text-purple-400 font-serif">
        Yay! 💖
      </h1>
      <FloatingElements />
      <div className="max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 gap-3 mx-auto">
          {gifMemes.map((gif, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.2 }}
              className="rounded-lg shadow-md overflow-hidden hover:scale-105 transition-transform bg-purple-100 flex items-center justify-center"
              style={{
                maxWidth: "180px",
                maxHeight: "180px",
                margin: "0 auto",
              }}
            >
              <img
                src={gif}
                alt="Celebration gif"
                className="w-full h-auto object-contain"
                style={{ maxHeight: "160px" }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default Celebration;
