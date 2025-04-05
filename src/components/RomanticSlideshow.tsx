
import React from "react";
import { motion } from "framer-motion";

interface RomanticSlideshowProps {
  images: string[];
}

const RomanticSlideshow: React.FC<RomanticSlideshowProps> = ({ images }) => {
  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {images.map((image, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="relative"
          >
            <div className="absolute inset-0 border-4 border-romantic-red/20 -rotate-3"></div>
            <div className="absolute inset-0 border-4 border-romantic-red/20 rotate-3"></div>
            <img
              src={image}
              alt={`Romantic moment ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg shadow-xl transform hover:scale-105 transition-transform duration-300"
              style={{
                boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
              }}
            />
            <div className="absolute bottom-0 left-0 right-0 h-1/4 bg-gradient-to-t from-black/50 to-transparent rounded-b-lg"></div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default RomanticSlideshow;
