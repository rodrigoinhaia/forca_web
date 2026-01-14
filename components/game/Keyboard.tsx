"use client";

import { motion, AnimatePresence } from "framer-motion";

interface KeyboardProps {
  guessedLetters: string[];
  onLetterClick: (letter: string) => void;
  disabled?: boolean;
}

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export default function Keyboard({
  guessedLetters,
  onLetterClick,
  disabled = false,
}: KeyboardProps) {
  const isGuessed = (letter: string) => guessedLetters.includes(letter);

  const handleClick = (letter: string) => {
    if (!disabled && !isGuessed(letter)) {
      onLetterClick(letter);
    }
  };

  return (
    <div className="bg-black/80 border border-red-600 rounded-xl shadow-lg p-3 sm:p-4 md:p-6">
      <div className="grid grid-cols-7 sm:grid-cols-9 gap-1.5 sm:gap-2 max-w-2xl mx-auto">
        <AnimatePresence>
          {letters.map((letter) => {
            const guessed = isGuessed(letter);

            return (
              <motion.button
                key={letter}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{
                  opacity: 1,
                  scale: 1,
                  backgroundColor: guessed ? "#991b1b" : "#dc2626",
                  color: "#ffffff",
                }}
                whileHover={
                  !guessed && !disabled
                    ? { scale: 1.05, backgroundColor: "#b91c1c" }
                    : {}
                }
                whileTap={!guessed && !disabled ? { scale: 0.95 } : {}}
                onClick={() => handleClick(letter)}
                disabled={guessed || disabled}
                className={`
                  px-2 py-2 sm:px-3 sm:py-2.5 md:px-4 md:py-3 rounded-lg font-bold text-sm sm:text-base md:text-lg
                  transition-all duration-200
                  ${guessed ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
                  ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
                style={{
                  transition: "background-color 0.2s, transform 0.1s",
                }}
              >
                {letter}
              </motion.button>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}
