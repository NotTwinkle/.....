import React, { useState, useEffect } from "react";
import { FloatingElements } from "./floatinghearts";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import Celebration from "./Celebration";
import { ArrowRight } from "lucide-react";
import PuzzleGame from "./PuzzleGame";

interface EnvelopeProps {
  // onResponse can be added if needed
  onClick: () => void;
}

const Envelope: React.FC<EnvelopeProps> = () => {
  const [isFlapped, setIsFlapped] = useState(false);
  const [audio] = useState(new Audio("/photo/music.mp3"));
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(-1); // Start with -1 to add initial delay
  const [showProposal, setShowProposal] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showLetterContent, setShowLetterContent] = useState(false);
  const [letterExpanded, setLetterExpanded] = useState(false);
  const [showPuzzle, setShowPuzzle] = useState(false);

  useEffect(() => {
    const playAudio = async () => {
      try {
        await audio.play();
        audio.loop = true;
      } catch (err) {
        console.log("Audio autoplay was prevented by browser");
      }
    };
    playAudio();

    return () => {
      audio.pause();
      audio.currentTime = 0;
    };
  }, [audio]);

  useEffect(() => {
    if (isFlapped) {
      const interval = setInterval(() => {
        setCurrentPhotoIndex((prevIndex) => {
          if (prevIndex === 5) {
            clearInterval(interval); // Stop the slideshow at the last item
            // Show letter after all 6 photos are shown
            setTimeout(() => {
              // First hide the last photo
              setCurrentPhotoIndex(-2); // Using -2 as a special value to indicate "hide all photos"

              // First expand the letter
              setLetterExpanded(true);

              // Then show the letter content with a delay to allow the paper to expand first
              setTimeout(() => {
                setShowLetterContent(true);
              }, 600); // Increased to 700ms to ensure expansion is complete
            }, 3000);
            return prevIndex;
          }
          return prevIndex + 1;
        });
      }, 2500);

      // Initial delay before starting the slideshow
      setTimeout(() => {
        setCurrentPhotoIndex(0);
      }, 500);

      return () => clearInterval(interval);
    }
  }, [isFlapped]);

  // When the envelope is clicked, the envelope moves down while the paper moves up
  const handleEnvelopeClick = () => {
    setIsFlapped(true);
  };

  const handleNoHover = () => {
    setNoButtonPosition({
      x: Math.random() * 200 - 100,
      y: Math.random() * 200 - 100,
    });
  };

  const handleNextClick = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    // If we're showing the letter, move directly to proposal
    if (showLetterContent && !showProposal) {
      setShowLetterContent(false);
      setLetterExpanded(false); // Reset letter to original size
      setTimeout(() => {
        setShowProposal(true);
      }, 500);
      return;
    }

    // If we're showing the proposal, proceed to puzzle game
    if (showProposal && !showPuzzle) {
      setTimeout(() => {
        setShowHeart(true);
      }, 500);

      setTimeout(() => {
        setIsFlapped(false);
        setShowPuzzle(true); // Show puzzle instead of celebration
      }, 1500);
      return;
    }
  };

  // Handle puzzle completion
  const handlePuzzleComplete = () => {
    setShowCelebration(true); // Show celebration after puzzle is complete
  };

  const [showHeart, setShowHeart] = useState(false);

  const items = [
    { type: "photo", id: 1, src: "/photo/1.jpg" },
    { type: "photo", id: 2, src: "/photo/2.jpg" },
    { type: "photo", id: 3, src: "/photo/3.jpg" },
    { type: "photo", id: 4, src: "/photo/4.jpg" },
    { type: "photo", id: 5, src: "/photo/5.jpg" },
    { type: "photo", id: 6, src: "/photo/6.jpg" },
  ];

  return (
    <div className="container h-screen grid place-items-center">
      <style>{`
        .envelope-wrapper > .envelope::before {
          content: "";
          position: absolute;
          top: 0;
          z-index: 2;
          border-top: 130px solid #ecdeb8;
          border-right: 150px solid transparent;
          border-left: 150px solid transparent;
          transform-origin: top;
          transition: all 0.5s ease-in-out 0.7s;
        }

        .envelope-wrapper > .envelope::after {
          content: "";
          position: absolute;
          z-index: 2;
          width: 0px;
          height: 0px;
          border-top: 130px solid transparent;
          border-right: 150px solid #e6cfa7;
          border-bottom: 100px solid #e6cfa7;
          border-left: 150px solid #e6cfa7;
        }

        .heart {
          width: 50px;
          height: 50px;
          background: rgb(147, 112, 219);
          position: absolute;
          top: 243px;
          right: 130px;
          transform: translate(-50px, 0) rotate(45deg);
          transition: transform 0.5s ease-in-out 1s;
          z-index: 4;
        }

        .heart:before, 
        .heart:after {
          content: "";
          position: absolute;
          width: 50px;
          height: 50px;
          background-color: rgb(147, 112, 219);
          border-radius: 50%;
        }

        .page-turn-enter {
          transform: rotateY(0deg);
          transform-origin: left center;
        }
        .page-turn-active {
          transform: rotateY(-180deg);
          transition: transform 0.5s ease;
        }
        .page-turn-exit {
          transform: rotateY(-180deg);
          transform-origin: left center;
        }
        .page-turn-exit-active {
          transform: rotateY(0deg);
          transition: transform 0.5s ease;
        }

        .heart:before {
          top: -25px;
          left: 0;
        }

        .heart:after {
          left: 25px;
          top: 0;
        }

        .flap > .envelope:before {
          transform: rotateX(180deg);
          z-index: 0;
        }

        .flap > .envelope > .letter {
          bottom: 100px;
          transition-delay: 1s;
        }

        .envelope > .letter {
          transition: all 1s ease-in-out;
        }
        
        @keyframes fadeInOut {
          0% { opacity: 0; }
          20% { opacity: 1; }
          80% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
      {showCelebration ? (
        <Celebration />
      ) : showPuzzle ? (
        <PuzzleGame
          onComplete={handlePuzzleComplete}
          imageSrc="/photo/mylove.JPG"
        />
      ) : (
        <>
          <FloatingElements />
          <motion.div
            className={`envelope-wrapper bg-[#f5edd1] shadow-lg relative ${
              isFlapped ? "flap" : ""
            }`}
            onClick={!isFlapped ? handleEnvelopeClick : undefined}
            style={{ transformOrigin: "center", scale: 1 }}
            animate={
              isFlapped
                ? {
                    y: showLetterContent ? 300 : showProposal ? 100 : 100,
                    opacity: showHeart ? 0 : 1,
                  }
                : { y: 0 }
            }
            transition={{ duration: 0.8 }}
          >
            <div className="envelope relative w-[300px] h-[200px]">
              <motion.div
                className={`letter absolute right-[10%] bottom-0 w-[80%] bg-white text-center shadow-md p-5`}
                initial={{ y: 0, opacity: 1, height: "90%" }}
                animate={
                  isFlapped
                    ? {
                        y: -120,
                        opacity: 1,
                        height:
                          currentPhotoIndex >= 0 && !letterExpanded
                            ? "130%"
                            : letterExpanded && showLetterContent
                            ? "235%"
                            : showProposal
                            ? "120%"
                            : "90%",
                      }
                    : { height: "90%" }
                }
                transition={{ duration: 0.8 }}
              >
                {isFlapped && (
                  <div
                    style={{
                      transform: "scale(0.8)",
                      transformOrigin: "top center",
                      marginTop: "0px",
                    }}
                    className="text font-sans text-gray-700 text-left text-sm"
                  >
                    {/* Slideshow for photos */}
                    <motion.div
                      className="slideshow relative w-full h-[240px] mb-4 perspective-1000"
                      initial="hidden"
                      animate="visible"
                      variants={{
                        visible: {
                          transition: {
                            staggerChildren: 0.5,
                          },
                        },
                        hidden: {},
                      }}
                    >
                      {items.map((item, i) => {
                        if (i === currentPhotoIndex) {
                          return (
                            <motion.div
                              key={`photo-${item.id}`}
                              className="absolute inset-0 bg-white border rounded-lg flex items-center justify-center overflow-hidden"
                              initial={{ opacity: 0, rotateY: -30 }}
                              animate={{ opacity: 1, rotateY: 0 }}
                              exit={{ opacity: 0, rotateY: 30 }}
                              style={{
                                marginTop: "30px",
                                transformStyle: "preserve-3d",
                                boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
                              }}
                              transition={{
                                opacity: { duration: 0.2 },
                                rotateY: { duration: 0.3 },
                              }}
                            >
                              <img
                                src={item.src}
                                alt={`Photo ${item.id}`}
                                className="object-contain w-full h-full"
                                style={{ maxHeight: "240px", width: "auto" }}
                              />
                              <div className="absolute bottom-2 right-2 bg-purple-500/70 text-white text-xs px-2 py-1 rounded-full">
                                {i + 1}/{items.length}
                              </div>
                            </motion.div>
                          );
                        }
                        return null;
                      })}

                      {/* Love letter appears after photos are done */}
                      {showLetterContent && !showProposal && (
                        <motion.div
                          key="love-letter"
                          className="letter-content relative"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.6 }}
                          style={{ marginTop: "0px" }}
                        >
                          <p
                            className="font-serif text-l text-gray-700 leading-relaxed mb-4 w-full"
                            style={{
                              textAlign: "justify",
                              whiteSpace: "normal",
                              marginTop: "10px",
                              padding: "0px",
                              lineHeight: "1.3",
                              fontWeight: "500",
                              fontSize: "13px",
                              color: "#444444",
                              letterSpacing: "0.5px",
                            }}
                          >
                            You're always doing your best and I'm very proud of
                            you. You deserve to be loved without having to hide
                            the parts of yourself that you think are unlovable.
                            You're always the first & only person I run to
                            whenever I fed up with life & whenever I'm exhausted
                            that all I wanna do is to run away. The first & only
                            person who can bring solace to my whole system, the
                            serenity I longed for.
                          </p>

                          <p
                            className="font-serif text-l text-gray-700 leading-relaxed mb-8 w-full"
                            style={{
                              textAlign: "justify",
                              whiteSpace: "normal",
                              padding: "0px",
                              lineHeight: "1.3",
                              fontWeight: "500",
                              fontSize: "13px",
                              color: "#444444",
                              letterSpacing: "0.5px",
                            }}
                          >
                            Life is suffocating indeed, yet with you, it feels
                            free & magnificent. Thank you for being the one
                            person who understood me when no one else did. Thank
                            you for keeping my trust when everyone else broke
                            it. Thank you for making me laugh when no one could
                            make me smile. Thank you for being the one I fell in
                            love with. Happy Anniversary, Love! See you next
                            month. lloveyousomuch!
                          </p>

                          {/* Floating video */}
                          <motion.div
                            className="floating-video absolute"
                            style={{
                              top: "0%",
                              right: "-83%",
                              width: "120px",
                              height: "200px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              zIndex: 5,
                            }}
                            initial={{ x: 0, y: 0 }}
                            animate={{
                              x: [0, 5, 0, -5, 0],
                              y: [0, -5, 0, 5, 0],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          >
                            <video
                              src="/photo/vid1.mov"
                              autoPlay
                              muted
                              loop
                              className="w-full h-full"
                              style={{
                                width: "200px",
                                height: "200px",
                                scale: "2",
                              }}
                            />
                          </motion.div>

                          {/* Floating video */}
                          <motion.div
                            className="floating-video absolute"
                            style={{
                              top: "0%",
                              right: "125%",
                              width: "120px",
                              height: "200px",
                              borderRadius: "8px",
                              overflow: "hidden",
                              zIndex: 5,
                            }}
                            initial={{ x: 0, y: 0 }}
                            animate={{
                              x: [0, 5, 0, -5, 0],
                              y: [0, -5, 0, 5, 0],
                            }}
                            transition={{
                              duration: 6,
                              repeat: Infinity,
                              repeatType: "reverse",
                            }}
                          >
                            <video
                              src="/photo/vid2.mov"
                              autoPlay
                              muted
                              loop
                              className="w-full h-full"
                              style={{
                                width: "200px",
                                height: "200px",
                                scale: "1.7",
                              }}
                            />
                          </motion.div>

                          <div className="mt-8 flex justify-center">
                            <motion.button
                              onClick={handleNextClick}
                              className="w-16 h-16 bg-purple-400 text-white rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors shadow-md"
                              whileHover={{
                                scale: 1.1,
                                boxShadow: "0 0 15px rgba(147, 112, 219, 0.5)",
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ArrowRight size={24} />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}

                      {/* Anniversary message appears after letter */}
                      {showProposal && (
                        <motion.div
                          key="proposal"
                          className="letter-content relative"
                          initial={{ opacity: 0, y: 50 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 1.8 }}
                          style={{
                            marginTop: "5px",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                          }}
                        >
                          <h1 className="heading-text text-3xl font-bold text-purple-500 mb-12 text-center">
                            Happy 1st Anniversary!
                          </h1>
                          <div className="flex justify-center">
                            <motion.button
                              onClick={handleNextClick}
                              className="w-16 h-16 bg-purple-400 text-white rounded-full flex items-center justify-center hover:bg-purple-500 transition-colors shadow-md"
                              whileHover={{
                                scale: 1.1,
                                boxShadow: "0 0 15px rgba(147, 112, 219, 0.5)",
                              }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <ArrowRight size={24} />
                            </motion.button>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  </div>
                )}
              </motion.div>
            </div>
            <motion.div
              className="heart absolute"
              animate={{
                rotate: isFlapped ? 90 : 45,
                scale: isFlapped ? 1.2 : 1,
              }}
              transition={{ duration: 0.5, delay: 0.4 }}
            />
          </motion.div>

          {/* Heart animation when finished */}
          {showHeart && (
            <motion.div
              className="fixed inset-0 flex items-center justify-center bg-white"
              initial={{ scale: 0 }}
              animate={{ scale: 50 }}
              transition={{ duration: 1 }}
            >
              <div className="w-16 h-16 bg-purple-400 rounded-full relative">
                <div className="absolute top-0 left-0 w-16 h-16 bg-purple-400 rounded-full transform rotate-45"></div>
                <div className="absolute top-0 left-0 w-16 h-16 bg-purple-400 rounded-full transform -rotate-45"></div>
              </div>
            </motion.div>
          )}
        </>
      )}
    </div>
  );
};

export default Envelope;
