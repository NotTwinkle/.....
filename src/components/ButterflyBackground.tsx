import React from "react";
import { motion } from "framer-motion";

const ButterflyBackground: React.FC = () => {
  const width = typeof window !== "undefined" ? window.innerWidth : 800;
  const height = typeof window !== "undefined" ? window.innerHeight : 600;

  const butterfly = React.useMemo(
    () => ({
      key: 0,
      initialX: Math.random() * width,
      initialY: height + 50,
      xAnimation: [
        Math.random() * width,
        Math.random() * width,
        Math.random() * width,
      ],
      duration: Math.random() * 10 + 15,
      delay: Math.random() * 20,
    }),
    [width, height]
  );

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      <motion.div
        key={butterfly.key}
        className="absolute"
        initial={{ x: butterfly.initialX, y: butterfly.initialY }}
        animate={{ x: butterfly.xAnimation, y: [-50, -50] }}
        transition={{
          duration: butterfly.duration,
          repeat: Infinity,
          delay: butterfly.delay,
        }}
      >
        <svg
          width="30"
          height="30"
          viewBox="0 0 24 24"
          fill="none"
          className="text-purple-400 opacity-70"
        >
          <path
            d="M12 2C8 6 8 10 12 14C16 10 16 6 12 2Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M12 14C8 18 8 22 12 22C16 22 16 18 12 14Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </motion.div>
    </div>
  );
};

export default ButterflyBackground;
