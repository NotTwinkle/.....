import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Flower = ({
  x,
  y,
  scale,
  rotation,
  delay,
}: {
  x: number;
  y: number;
  scale: number;
  rotation: number;
  delay: number;
}) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="absolute text-purple-300 opacity-50"
    style={{ x, y }}
    initial={{ scale: 0, rotate: 0 }}
    animate={{
      scale: [scale * 0.8, scale * 1.2, scale],
      rotate: rotation,
      y: y + 20,
    }}
    transition={{
      duration: 3,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    <motion.path
      d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"
      fill="currentColor"
    />
    {[0, 72, 144, 216, 288].map((angle, i) => (
      <motion.path
        key={i}
        d="M12 2C13.1 2 14 2.9 14 4C14 5.1 13.1 6 12 6C10.9 6 10 5.1 10 4C10 2.9 10.9 2 12 2Z"
        fill="currentColor"
        style={{
          transformOrigin: "center",
          transform: `rotate(${angle}deg) translate(8px, 0)`,
        }}
      />
    ))}
  </motion.svg>
);

const Heart = ({
  x,
  y,
  scale,
  delay,
}: {
  x: number;
  y: number;
  scale: number;
  delay: number;
}) => (
  <motion.svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    className="absolute text-purple-300 opacity-50"
    style={{ x, y }}
    initial={{ scale: 0 }}
    animate={{
      scale: [scale * 0.8, scale * 1.2, scale],
      y: y + 20,
    }}
    transition={{
      duration: 2,
      delay,
      repeat: Infinity,
      repeatType: "reverse",
    }}
  >
    <path
      d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
      fill="currentColor"
    />
  </motion.svg>
);

export const FloatingElements = () => {
  const [elements, setElements] = useState<
    Array<{
      type: "heart" | "flower";
      x: number;
      y: number;
      scale: number;
      rotation?: number;
      delay: number;
    }>
  >([]);

  useEffect(() => {
    const generateElements = () => {
      const newElements = [];
      const numElements = Math.floor(window.innerWidth / 50); // Responsive number of elements

      for (let i = 0; i < numElements; i++) {
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        const scale = 0.5 + Math.random() * 1;
        const delay = Math.random() * 2;
        const rotation = Math.random() * 360;

        // Alternate between hearts and flowers
        newElements.push({
          type: i % 2 === 0 ? "heart" : "flower",
          x,
          y,
          scale,
          rotation,
          delay,
        });
      }
      setElements(newElements);
    };

    generateElements();
    window.addEventListener("resize", generateElements);
    return () => window.removeEventListener("resize", generateElements);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {elements.map((element, i) =>
        element.type === "heart" ? (
          <Heart
            key={`heart-${i}`}
            x={element.x}
            y={element.y}
            scale={element.scale}
            delay={element.delay}
          />
        ) : (
          <Flower
            key={`butterfly-${i}`}
            x={element.x}
            y={element.y}
            scale={element.scale}
            rotation={element.rotation || 0}
            delay={element.delay}
          />
        )
      )}
    </div>
  );
};
