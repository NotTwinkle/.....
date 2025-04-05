import React, { useState, useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";
import { FloatingElements } from "./floatinghearts";
import {
  LockKeyhole,
  X,
  Heart,
  Gift,
  Sparkles,
  Music,
  Lightbulb,
} from "lucide-react";
import confetti from "canvas-confetti";

interface MPINScreenProps {
  onSuccess: () => void;
}

const MPINScreen: React.FC<MPINScreenProps> = ({ onSuccess }) => {
  const [mpin, setMpin] = useState("");
  const [error, setError] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [attemptCount, setAttemptCount] = useState(0);
  const [hint, setHint] = useState("");
  const [showHint, setShowHint] = useState(false);
  const correctMPIN = "040724";
  const PIN_LENGTH = 6;

  const imgRef = useRef<HTMLImageElement>(null);
  const buttonControls = useAnimation();
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useTransform(mouseY, [-100, 100], [5, -5]);
  const rotateY = useTransform(mouseX, [-100, 100], [-5, 5]);

  // Audio setup
  const keypadSoundRef = useRef<HTMLAudioElement | null>(null);
  const successSoundRef = useRef<HTMLAudioElement | null>(null);
  const errorSoundRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Create audio elements - using empty Audio objects to prevent errors when files don't exist
    keypadSoundRef.current = new Audio();
    keypadSoundRef.current.volume = 0.2;

    successSoundRef.current = new Audio();
    successSoundRef.current.volume = 0.3;

    errorSoundRef.current = new Audio();
    errorSoundRef.current.volume = 0.2;

    // Clean up on unmount
    return () => {
      keypadSoundRef.current = null;
      successSoundRef.current = null;
      errorSoundRef.current = null;
    };
  }, []);

  // Photo parallax effect when mouse moves
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, currentTarget } = event;
    const { left, top, width, height } = currentTarget.getBoundingClientRect();

    // Calculate mouse position relative to element
    const x = clientX - left - width / 2;
    const y = clientY - top - height / 2;

    mouseX.set(x);
    mouseY.set(y);
  };

  const handleNumberClick = (number: string) => {
    // Play sound effect
    if (keypadSoundRef.current) {
      keypadSoundRef.current.currentTime = 0;
      keypadSoundRef.current.play().catch(() => {
        // Handle autoplay restrictions
        console.log("Audio play prevented by browser");
      });
    }

    // Add confetti for certain numbers
    if (["1", "0", "3"].includes(number)) {
      const colors = ["#D8BFD8", "#9370DB", "#8A2BE2"];
      confetti({
        particleCount: 5,
        spread: 50,
        origin: { y: 0.6, x: 0.5 },
        colors,
        shapes: ["circle"],
        scalar: 0.5,
        gravity: 0.3,
      });
    }

    if (mpin.length < PIN_LENGTH) {
      setMpin((prev) => prev + number);

      // Pulse the button
      buttonControls.start({
        scale: [1, 1.1, 1],
        transition: { duration: 0.3 },
      });
    }
  };

  const handleDelete = () => {
    setMpin((prev) => prev.slice(0, -1));

    // Play sound effect
    if (keypadSoundRef.current) {
      keypadSoundRef.current.currentTime = 0;
      keypadSoundRef.current.play().catch(() => {});
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (mpin === correctMPIN) {
      // Play success sound
      if (successSoundRef.current) {
        successSoundRef.current.play().catch(() => {});
      }

      // Launch victory confetti
      const end = Date.now() + 1000;
      const colors = ["#D8BFD8", "#9370DB", "#8A2BE2", "#BA55D3"];

      const frame = () => {
        confetti({
          particleCount: 2,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.65 },
          colors,
        });

        confetti({
          particleCount: 2,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.65 },
          colors,
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();

      // Delay success to allow for animation
      setTimeout(() => {
        onSuccess();
      }, 1000);
    } else {
      // Play error sound
      if (errorSoundRef.current) {
        errorSoundRef.current.play().catch(() => {});
      }

      setError(true);
      setShowToast(true);
      setAttemptCount((prev) => prev + 1);

      // Show appropriate hint based on attempt count
      if (attemptCount >= 2) {
        const wrongDigits = [];
        for (let i = 0; i < Math.min(mpin.length, PIN_LENGTH); i++) {
          if (mpin[i] !== correctMPIN[i]) {
            wrongDigits.push(i + 1);
          }
        }

        if (wrongDigits.length > 0) {
          setHint(
            `Digit${wrongDigits.length > 1 ? "s" : ""} ${wrongDigits.join(
              ", "
            )} incorrect. Think special date!`
          );
        } else {
          setHint("So close! Keep trying with a meaningful date!");
        }
        setShowHint(true);
      }

      setTimeout(() => {
        setError(false);
        setShowToast(false);
      }, 1500);

      setMpin("");
    }
  };

  const triggerImageEffect = () => {
    // Apply a subtle pulse effect to the image
    if (imgRef.current) {
      imgRef.current.classList.add("pulse-effect");
      setTimeout(() => {
        imgRef.current?.classList.remove("pulse-effect");
      }, 1000);
    }

    // Show little hearts around the image
    const imgContainer = imgRef.current?.parentElement;
    if (imgContainer) {
      for (let i = 0; i < 5; i++) {
        const heart = document.createElement("div");
        heart.className = "mini-heart";
        heart.innerHTML = "💜";
        heart.style.left = `${Math.random() * 100}%`;
        heart.style.top = `${Math.random() * 100}%`;
        heart.style.animationDelay = `${Math.random() * 0.5}s`;
        heart.style.fontSize = `${Math.random() * 10 + 10}px`;
        imgContainer.appendChild(heart);

        setTimeout(() => {
          heart.remove();
        }, 2000);
      }
    }
  };

  const renderNumber = (num: string) => (
    <motion.button
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      animate={buttonControls}
      type="button"
      onClick={() => handleNumberClick(num)}
      className={`w-14 h-14 rounded-full bg-white border border-purple-200 text-purple-500 text-2xl font-semibold transition-colors duration-200 shadow-md ${
        error ? "ring-4 ring-red-500" : ""
      } hover:bg-purple-300 hover:text-white relative overflow-hidden`}
    >
      {num}
    </motion.button>
  );

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-center p-4">
      <style>
        {`
        .pulse-effect {
          animation: pulse 1s ease-in-out;
        }
        
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); }
        }
        
        .mini-heart {
          position: absolute;
          animation: float-up 2s ease-out forwards;
          z-index: 10;
          pointer-events: none;
        }
        
        @keyframes float-up {
          0% { transform: translateY(0) scale(0); opacity: 0; }
          10% { transform: translateY(0) scale(1); opacity: 1; }
          100% { transform: translateY(-50px) scale(0); opacity: 0; }
        }
        
        .number-button:before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(216,191,216,0.7) 0%, rgba(216,191,216,0) 70%);
          opacity: 0;
          transition: opacity 0.3s;
          transform: scale(0.5);
        }
        
        .number-button:hover:before {
          opacity: 1;
          transform: scale(1.5);
        }
        
        .disco-light {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          filter: blur(4px);
          opacity: 0.7;
        }
        `}
      </style>

      <FloatingElements />

      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg w-full bg-white/50 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-purple-200 relative overflow-hidden"
      >
        <div className="text-center mb-6">
          <motion.div
            animate={{
              rotateY: [0, 360],
              boxShadow: [
                "0 0 0 0 rgba(147, 112, 219, 0.4)",
                "0 0 0 15px rgba(147, 112, 219, 0)",
                "0 0 0 0 rgba(147, 112, 219, 0)",
              ],
            }}
            transition={{
              rotateY: { duration: 2, repeat: Infinity, repeatDelay: 5 },
              boxShadow: { duration: 1.5, repeat: Infinity, repeatDelay: 1 },
            }}
            className="mx-auto w-16 h-16 bg-purple-400 rounded-full flex items-center justify-center mb-4"
          >
            <Heart className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="mt-4 text-3xl font-extrabold text-purple-500">
            Our Special Lock
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            the day I said yes (MMDDYY)
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-center">
          {/* Image on the left with interactive effects */}
          <motion.div
            className="w-full md:w-1/2 aspect-square overflow-hidden rounded-2xl border-4 border-purple-300 bg-white shadow-lg relative"
            whileHover={{ scale: 1.02 }}
            style={{
              rotateX,
              rotateY,
              transformStyle: "preserve-3d",
              perspective: 1000,
            }}
            onMouseMove={handleMouseMove}
            onClick={triggerImageEffect}
            whileTap={{ scale: 0.98 }}
          >
            <img
              ref={imgRef}
              src="/photo/mylove.jpg"
              alt="Our memorable moment"
              className="w-full h-full object-cover transition-all duration-200"
              onError={(e) => {
                e.currentTarget.src =
                  "https://placehold.co/400x400/D8BFD8/9370DB?text=Us+Together";
              }}
            />
            <motion.div
              className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-transparent"
              whileHover={{ opacity: [0, 0.2, 0] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
            <div className="absolute bottom-2 right-2 bg-purple-500/70 text-white p-1 rounded-lg text-xs backdrop-blur-sm opacity-70">
              Tap for sparkles ✨
            </div>
          </motion.div>

          {/* PIN pad on the right */}
          <div className="w-full md:w-1/2">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="rounded-md shadow-sm">
                <input
                  type="password"
                  maxLength={6}
                  value={mpin}
                  readOnly
                  className="appearance-none rounded-lg relative block w-full px-3 py-4 border border-purple-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-purple-400 focus:border-purple-400 text-center text-2xl tracking-widest"
                  placeholder="••••••"
                  required
                />
              </div>

              {showHint && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-purple-600 bg-purple-100 p-2 rounded-lg flex items-center justify-center"
                >
                  <Lightbulb className="w-4 h-4 mr-1 text-yellow-500" />
                  {hint}
                </motion.div>
              )}

              <div className="flex flex-col items-center space-y-3">
                <div className="grid grid-cols-3 gap-3">
                  {["1", "2", "3"].map((num) => renderNumber(num))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["4", "5", "6"].map((num) => renderNumber(num))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {["7", "8", "9"].map((num) => renderNumber(num))}
                </div>
                <div className="grid grid-cols-3 gap-3">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: [0, 5, -5, 0] }}
                    transition={{ rotate: { duration: 0.5, repeat: Infinity } }}
                    className="w-14 h-14 flex items-center justify-center cursor-pointer"
                    onClick={() => {
                      // Easter egg - when clicked, generate celebratory confetti
                      confetti({
                        particleCount: 30,
                        spread: 70,
                        origin: { y: 0.6 },
                        colors: ["#D8BFD8", "#9370DB", "#8A2BE2"],
                      });
                    }}
                  >
                    <Gift className="w-6 h-6 text-purple-400" />
                  </motion.div>
                  {renderNumber("0")}
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="button"
                    onClick={handleDelete}
                    className={`w-14 h-14 rounded-full bg-white/90 border border-purple-200 text-purple-500 transition-colors duration-200 shadow-md flex items-center justify-center ${
                      error ? "ring-4 ring-red-500" : ""
                    } hover:bg-purple-300 hover:text-white`}
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              <div>
                <motion.button
                  type="submit"
                  whileHover={{
                    scale: 1.02,
                    boxShadow: "0 5px 15px rgba(147, 112, 219, 0.4)",
                  }}
                  className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-purple-500 hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 transition-all duration-200"
                >
                  <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                    <LockKeyhole className="h-5 w-5 text-purple-300 group-hover:text-purple-200" />
                  </span>
                  Unlock Our Memory
                </motion.button>
              </div>
            </form>
          </div>
        </div>
      </motion.div>

      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-purple-500/90 text-white px-6 py-3 rounded-full shadow-md flex items-center"
        >
          <Sparkles className="w-4 h-4 mr-2" />
          Incorrect PIN. Please try again with our special date! 💜
        </motion.div>
      )}
    </div>
  );
};

export default MPINScreen;
