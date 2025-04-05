import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";

interface PuzzleGameProps {
  onComplete: () => void;
  imageSrc?: string;
}

interface PuzzlePiece {
  id: number;
  row: number;
  col: number;
  correctRow: number;
  correctCol: number;
  inCorrectPosition: boolean;
}

const PuzzleGame: React.FC<PuzzleGameProps> = ({
  onComplete,
  imageSrc = "/photo/mpin.jpg",
}) => {
  const GRID_SIZE = 3;
  const [pieceSize, setPieceSize] = useState(100);
  const [imageSize, setImageSize] = useState({ width: 300, height: 300 });

  const [pieces, setPieces] = useState<PuzzlePiece[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [draggedPiece, setDraggedPiece] = useState<number | null>(null);
  const [showInstructions, setShowInstructions] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  // Preload image to get dimensions
  useEffect(() => {
    const img = new Image();
    img.onload = () => {
      // Calculate aspect ratio
      const aspectRatio = img.width / img.height;

      // Set image size based on aspect ratio
      if (aspectRatio > 1) {
        // Landscape image
        const width = Math.min(300, window.innerWidth - 40);
        setImageSize({ width, height: width / aspectRatio });
      } else {
        // Portrait or square image
        const height = Math.min(300, window.innerHeight - 300);
        setImageSize({ width: height * aspectRatio, height });
      }
    };
    img.src = imageSrc;
  }, [imageSrc]);

  // Handle responsive sizing
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        const containerWidth = containerRef.current.offsetWidth;
        // Calculate piece size based on container width, accounting for gaps
        const maxGridWidth = Math.min(containerWidth - 40, imageSize.width);
        const newPieceSize = Math.floor(maxGridWidth / GRID_SIZE);
        setPieceSize(newPieceSize);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [GRID_SIZE, imageSize.width]);

  useEffect(() => {
    initializePuzzle();
  }, []);

  useEffect(() => {
    if (pieces.length > 0 && pieces.every((piece) => piece.inCorrectPosition)) {
      setIsComplete(true);

      confetti({
        particleCount: 150,
        spread: 90,
        origin: { y: 0.6 },
      });

      setTimeout(() => {
        onComplete();
      }, 3000);
    }
  }, [pieces, onComplete]);

  const initializePuzzle = () => {
    const newPieces: PuzzlePiece[] = [];
    const positions: { row: number; col: number }[] = [];

    // Create all possible positions
    for (let row = 0; row < GRID_SIZE; row++) {
      for (let col = 0; col < GRID_SIZE; col++) {
        positions.push({ row, col });
      }
    }

    // Shuffle positions
    const shuffledPositions = [...positions].sort(() => Math.random() - 0.5);

    // Create pieces with shuffled positions
    positions.forEach((pos, index) => {
      const shuffledPos = shuffledPositions[index];
      newPieces.push({
        id: pos.row * GRID_SIZE + pos.col,
        row: shuffledPos.row,
        col: shuffledPos.col,
        correctRow: pos.row,
        correctCol: pos.col,
        inCorrectPosition:
          shuffledPos.row === pos.row && shuffledPos.col === pos.col,
      });
    });

    setPieces(newPieces);
    setIsComplete(false);
    setDraggedPiece(null);
    setShowInstructions(true);
  };

  const handleDragStart = (id: number) => {
    setDraggedPiece(id);
    setShowInstructions(false);
  };

  const handleDragEnd = (id: number) => {
    setDraggedPiece(null);
  };

  const swapPieces = (
    pieceId: number,
    targetRow: number,
    targetCol: number
  ) => {
    if (isComplete) return;

    const pieceIndex = pieces.findIndex((p) => p.id === pieceId);
    if (pieceIndex === -1) return;

    const piece = pieces[pieceIndex];
    const targetIndex = pieces.findIndex(
      (p) => p.row === targetRow && p.col === targetCol
    );

    if (targetIndex === -1) return;

    const newPieces = [...pieces];

    // Swap positions
    const tempRow = newPieces[pieceIndex].row;
    const tempCol = newPieces[pieceIndex].col;

    newPieces[pieceIndex].row = newPieces[targetIndex].row;
    newPieces[pieceIndex].col = newPieces[targetIndex].col;
    newPieces[targetIndex].row = tempRow;
    newPieces[targetIndex].col = tempCol;

    // Update whether pieces are in correct positions
    newPieces[pieceIndex].inCorrectPosition =
      newPieces[pieceIndex].row === newPieces[pieceIndex].correctRow &&
      newPieces[pieceIndex].col === newPieces[pieceIndex].correctCol;

    newPieces[targetIndex].inCorrectPosition =
      newPieces[targetIndex].row === newPieces[targetIndex].correctRow &&
      newPieces[targetIndex].col === newPieces[targetIndex].correctCol;

    setPieces(newPieces);
    setShowInstructions(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-8 bg-gradient-to-b from-purple-100 to-purple-50 overflow-hidden">
      <div
        ref={containerRef}
        className="relative w-full max-w-md px-4 md:px-6 py-6 mx-auto"
      >
        <h1 className="text-xl md:text-2xl font-bold text-purple-600 mb-4 text-center">
          Complete the Puzzle!
        </h1>

        {/* Game Instructions */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <h2 className="text-lg font-semibold text-purple-700 mb-2">
            How to Play:
          </h2>
          <ol className="list-decimal pl-5 space-y-1 text-sm md:text-base text-gray-700">
            <li>
              Click on a puzzle piece to select it (it will be highlighted)
            </li>
            <li>Click on another piece to swap their positions</li>
            <li>Arrange all pieces to match the complete image</li>
            <li>Green glowing pieces are in their correct position</li>
            <li>Use the "Show Hint" button if you need help</li>
          </ol>
        </div>

        <div className="mb-4 flex flex-wrap gap-2 justify-center">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-3 py-2 text-sm md:text-base bg-purple-300 text-white rounded-lg hover:bg-purple-400 transition-colors shadow-sm"
          >
            {showHint ? "Hide Hint" : "Show Hint"}
          </button>
          <button
            onClick={initializePuzzle}
            className="px-3 py-2 text-sm md:text-base bg-purple-500 text-white rounded-lg hover:bg-purple-600 transition-colors shadow-sm"
          >
            Reset Puzzle
          </button>
        </div>

        <div className="flex flex-col items-center justify-center">
          {/* Original image for reference */}
          <div className="mb-6 w-full flex justify-center">
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Original puzzle image"
              className={`rounded-lg shadow-md border border-purple-200 ${
                showHint ? "block" : "hidden"
              }`}
              style={{
                maxWidth: "100%",
                maxHeight: "250px",
                objectFit: "contain",
              }}
            />
          </div>

          {/* Puzzle board */}
          <div
            className="grid gap-0.5 relative rounded-lg shadow-lg overflow-hidden border-2 border-purple-200 bg-purple-100"
            style={{
              gridTemplateColumns: `repeat(${GRID_SIZE}, ${pieceSize}px)`,
              gridTemplateRows: `repeat(${GRID_SIZE}, ${pieceSize}px)`,
              width: `${GRID_SIZE * pieceSize + (GRID_SIZE - 1) * 2}px`,
              height: `${GRID_SIZE * pieceSize + (GRID_SIZE - 1) * 2}px`,
            }}
          >
            {/* Grid cells */}
            {Array.from({ length: GRID_SIZE * GRID_SIZE }).map((_, index) => {
              const row = Math.floor(index / GRID_SIZE);
              const col = index % GRID_SIZE;

              // Find piece at this position
              const piece = pieces.find((p) => p.row === row && p.col === col);

              return (
                <div
                  key={`cell-${row}-${col}`}
                  className="relative bg-white"
                  style={{
                    width: pieceSize,
                    height: pieceSize,
                  }}
                  onClick={() => {
                    if (draggedPiece !== null) {
                      swapPieces(draggedPiece, row, col);
                    }
                  }}
                >
                  {piece && (
                    <motion.div
                      layoutId={`piece-${piece.id}`}
                      className={`absolute inset-0 cursor-pointer ${
                        draggedPiece === piece.id ? "ring-2 ring-blue-500" : ""
                      }`}
                      onClick={() => {
                        if (draggedPiece === null) {
                          handleDragStart(piece.id);
                        } else if (draggedPiece === piece.id) {
                          handleDragEnd(piece.id);
                        } else {
                          swapPieces(draggedPiece, row, col);
                        }
                      }}
                      animate={{
                        borderColor: piece.inCorrectPosition
                          ? "rgb(74, 222, 128)"
                          : "transparent",
                        boxShadow: piece.inCorrectPosition
                          ? "0 0 8px rgba(74, 222, 128, 0.4)"
                          : "none",
                        scale: draggedPiece === piece.id ? 0.95 : 1,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div
                        className="w-full h-full relative"
                        style={{
                          backgroundImage: `url(${imageSrc})`,
                          backgroundSize: `${GRID_SIZE * 100}%`,
                          backgroundPosition: `${-piece.correctCol * 100}% ${
                            -piece.correctRow * 100
                          }%`,
                          border: "1px solid rgba(0, 0, 0, 0.1)",
                          borderRadius: "4px",
                        }}
                      />
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {draggedPiece !== null && (
          <div className="mt-4 text-center text-purple-500 text-sm md:text-base">
            Click on another piece to swap positions
          </div>
        )}

        {isComplete && (
          <motion.div
            className="mt-6 text-lg md:text-xl font-bold text-green-600 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Congratulations! You completed the puzzle!
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PuzzleGame;
