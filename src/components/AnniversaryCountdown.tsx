import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FloatingElements } from "./floatinghearts";
import { Calendar, Clock, Heart, ArrowRight } from "lucide-react";
import confetti from "canvas-confetti";

interface AnniversaryCountdownProps {
  onNext: () => void;
  anniversaryDate?: Date; // Optional prop to specify the anniversary date
}

const AnniversaryCountdown: React.FC<AnniversaryCountdownProps> = ({
  onNext,
  anniversaryDate = new Date(2025, 3, 7), // Default to April 7, 2025
}) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [showConfetti, setShowConfetti] = useState(false);
  const [animateFlip, setAnimateFlip] = useState({
    days: false,
    hours: false,
    minutes: false,
    seconds: false,
  });

  const prevTimeRef = useRef({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Function to calculate time left until the anniversary
  const calculateTimeLeft = () => {
    // If the anniversary has passed this year, use next year's date
    let targetDate = new Date(anniversaryDate);
    if (targetDate < new Date()) {
      targetDate = new Date(anniversaryDate);
      targetDate.setFullYear(targetDate.getFullYear() + 1);
    }

    const difference = targetDate.getTime() - new Date().getTime();
    let newTimeLeft = {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
    };

    if (difference > 0) {
      newTimeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      };
    }

    return newTimeLeft;
  };

  useEffect(() => {
    // Initial calculation
    const initialTime = calculateTimeLeft();
    setTimeLeft(initialTime);
    prevTimeRef.current = initialTime;

    // Set up interval to update countdown
    const timer = setInterval(() => {
      const newTime = calculateTimeLeft();

      // Check which values changed to trigger specific animations
      const newAnimateState = {
        days: prevTimeRef.current.days !== newTime.days,
        hours: prevTimeRef.current.hours !== newTime.hours,
        minutes: prevTimeRef.current.minutes !== newTime.minutes,
        seconds: prevTimeRef.current.seconds !== newTime.seconds,
      };

      setAnimateFlip(newAnimateState);
      setTimeLeft(newTime);

      // After animation, reset the animation trigger
      setTimeout(() => {
        setAnimateFlip({
          days: false,
          hours: false,
          minutes: false,
          seconds: false,
        });
      }, 800);

      prevTimeRef.current = newTime;
    }, 1000);

    // Random confetti bursts
    const confettiTimer = setInterval(() => {
      if (Math.random() > 0.7) {
        // 30% chance of confetti every interval
        setShowConfetti(true);
        confetti({
          particleCount: 30,
          spread: 70,
          origin: { y: 0.6, x: Math.random() },
          colors: ["#D8BFD8", "#9370DB", "#8A2BE2"],
        });

        setTimeout(() => setShowConfetti(false), 500);
      }
    }, 3000);

    return () => {
      clearInterval(timer);
      clearInterval(confettiTimer);
    };
  }, [anniversaryDate]);

  // Calculate which anniversary it is
  const getAnniversaryNumber = () => {
    const today = new Date();
    const firstDate = new Date(anniversaryDate);
    firstDate.setFullYear(2025); // Using 2025 as the first anniversary year

    let years = today.getFullYear() - firstDate.getFullYear();

    // Adjust if anniversary hasn't occurred yet this year
    if (
      today.getMonth() < firstDate.getMonth() ||
      (today.getMonth() === firstDate.getMonth() &&
        today.getDate() < firstDate.getDate())
    ) {
      years--;
    }

    return years + 2; // +1 because the first anniversary is the 1st, not the 0th
  };

  // Flip calendar component that creates the paper-folding animation
  const FlipCalendar = ({
    value,
    label,
    isFlipping,
  }: {
    value: number;
    label: string;
    isFlipping: boolean;
  }) => {
    const formatValue = (val: number) => val.toString().padStart(2, "0");

    return (
      <div className="flex flex-col items-center">
        <div className="relative w-20 h-24 mb-2 perspective-500">
          {/* Calendar Top - Static Part */}
          <div className="w-full h-6 bg-purple-200 rounded-t-md flex items-center justify-center shadow-sm">
            <span className="text-xs font-medium text-purple-700">{label}</span>
          </div>

          {/* Calendar Body - Flip Part */}
          <div className="relative w-full h-[4.5rem] bg-white rounded-b-md shadow-md overflow-hidden">
            <AnimatePresence>
              {/* Current Value (Bottom Half Static) */}
              <div className="absolute inset-0 flex items-center justify-center bg-white">
                <span className="text-3xl font-bold text-purple-500">
                  {formatValue(value)}
                </span>
              </div>

              {/* Flipping Card Animation */}
              {isFlipping && (
                <>
                  {/* Top Half (flips down) */}
                  <motion.div
                    key={`top-${value}`}
                    initial={{ rotateX: 0 }}
                    animate={{ rotateX: 90 }}
                    exit={{ rotateX: 90 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                    className="absolute top-0 left-0 w-full h-1/2 bg-white origin-bottom"
                    style={{
                      backfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                      zIndex: 10,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <span
                        className="text-3xl font-bold text-purple-500"
                        style={{ transform: "translateY(50%)" }}
                      >
                        {formatValue(value + 1)}
                      </span>
                    </div>
                    {/* Shadow effect */}
                    <motion.div
                      className="absolute inset-0 bg-black/20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 0.2 }}
                      exit={{ opacity: 0 }}
                    />
                  </motion.div>

                  {/* Bottom Half (appears) */}
                  <motion.div
                    key={`bottom-${value}`}
                    initial={{ rotateX: -90 }}
                    animate={{ rotateX: 0 }}
                    exit={{ rotateX: 0 }}
                    transition={{
                      duration: 0.5,
                      ease: "easeInOut",
                      delay: 0.2,
                    }}
                    className="absolute top-1/2 left-0 w-full h-1/2 bg-white origin-top"
                    style={{
                      backfaceVisibility: "hidden",
                      transformStyle: "preserve-3d",
                      zIndex: 5,
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                      <span
                        className="text-3xl font-bold text-purple-500"
                        style={{ transform: "translateY(-50%)" }}
                      >
                        {formatValue(value)}
                      </span>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>

            {/* Calendar fold/crease line */}
            <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-purple-200 z-20"></div>

            {/* Calendar shadow effect */}
            <div className="absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-black/5 to-transparent"></div>
          </div>
        </div>
        <motion.div
          initial={{ scale: 1 }}
          animate={{ scale: isFlipping ? [1, 1.1, 1] : 1 }}
          transition={{ duration: 0.5 }}
          className="w-6 h-6 -mt-2 flex items-center justify-center"
        >
          {label === "Days" && <Calendar className="w-5 h-5 text-purple-400" />}
          {label === "Hours" && <Clock className="w-5 h-5 text-purple-400" />}
        </motion.div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-purple-100 flex flex-col items-center justify-center p-6">
      <style>
        {`
        .perspective-500 {
          perspective: 500px;
        }
        `}
      </style>
      <FloatingElements />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        className="max-w-lg w-full bg-white/50 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-purple-200"
      >
        <div className="text-center mb-8">
          <motion.div
            className="mx-auto w-20 h-20 bg-purple-400 rounded-full flex items-center justify-center mb-4"
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          >
            <Heart className="w-10 h-10 text-white" />
          </motion.div>

          <h1 className="text-3xl font-bold text-purple-600 mb-2">
            Our {getAnniversaryNumber()}
            {getOrdinalSuffix(getAnniversaryNumber())} Anniversary
          </h1>

          <p className="text-purple-500 text-lg mb-8">
            Counting down to our special day!
          </p>

          <div className="flex flex-wrap justify-center gap-4 mb-10">
            <FlipCalendar
              value={timeLeft.days}
              label="Days"
              isFlipping={animateFlip.days}
            />
            <FlipCalendar
              value={timeLeft.hours}
              label="Hours"
              isFlipping={animateFlip.hours}
            />
            <FlipCalendar
              value={timeLeft.minutes}
              label="Minutes"
              isFlipping={animateFlip.minutes}
            />
            <FlipCalendar
              value={timeLeft.seconds}
              label="Seconds"
              isFlipping={animateFlip.seconds}
            />
          </div>

          <motion.p
            className="text-purple-600 italic mb-8 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
          >
            Our love grows stronger with each passing moment ❤️
          </motion.p>

          <motion.button
            onClick={onNext}
            className="bg-purple-500 hover:bg-purple-600 text-white py-3 px-6 rounded-full flex items-center justify-center mx-auto shadow-lg transition-all duration-300"
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(147, 112, 219, 0.6)",
            }}
            whileTap={{ scale: 0.95 }}
          >
            <span className="mr-2">Continue to the exciting part</span>
            <ArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
};

// Helper function to get ordinal suffix (1st, 2nd, 3rd, etc.)
function getOrdinalSuffix(n: number): string {
  if (n > 3 && n < 21) return "th";
  switch (n % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}

export default AnniversaryCountdown;
