
import React, { useState } from "react";
import { motion } from "framer-motion";
import { PartyPopper } from "lucide-react";

interface ProposalLetterProps {
  onResponse: (response: boolean) => void;
}

const ProposalLetter: React.FC<ProposalLetterProps> = ({ onResponse }) => {
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [showPartyPopper, setShowPartyPopper] = useState(false);

  const handleNoHover = () => {
    setNoButtonPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
  };

  const handleYesClick = () => {
    setShowPartyPopper(true);
    setTimeout(() => onResponse(true), 1000);
  };

  return (
    <div className="max-w-lg mx-auto p-8 bg-white rounded-sm shadow-lg animate-fade-in"
      style={{
        backgroundImage: "linear-gradient(0deg, #f9f9f9 1px, transparent 1px)",
        backgroundSize: "100% 2rem",
        boxShadow: "0 2px 15px rgba(0,0,0,0.1)",
        border: "1px solid #eee"
      }}
    >
      <div className="text-center mb-8 relative">
        {showPartyPopper && (
          <div 
            className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full animate-scale-in"
          >
            <PartyPopper className="w-12 h-12 text-romantic-red" />
          </div>
        )}
        <h1 className="heading-text text-3xl font-bold text-romantic-red mb-10">
          Will you be my Valentine?
        </h1>
        <p className="romantic-text text-xl text-gray-700 leading-relaxed mb-8 animate-fade-in">
          I'll be your best friend and you'll be my valentine<br />
          Yes, you can hold my hand if you want to<br />
          'Cause I want to hold yours too<br />
          We'll be playmates and lovers<br />
          And share our secret worlds
        </p>
      </div>
      <div className="flex justify-center gap-6">
        <button
          onClick={handleYesClick}
          className="px-8 py-3 bg-romantic-red text-white rounded-lg romantic-text text-xl hover:bg-romantic-red/90 transition-colors"
        >
          Yes
        </button>
        <motion.button
          animate={noButtonPosition}
          onHoverStart={handleNoHover}
          className="px-8 py-3 bg-gray-300 text-gray-700 rounded-lg romantic-text text-xl hover:bg-gray-400"
        >
          No
        </motion.button>
      </div>
    </div>
  );
};

export default ProposalLetter;
