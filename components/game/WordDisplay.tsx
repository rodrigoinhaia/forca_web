"use client";

import { motion } from "framer-motion";
import { GameStatus } from "@/lib/types/game";

interface WordDisplayProps {
  word: string;
  status: GameStatus;
}

export default function WordDisplay({ word, status }: WordDisplayProps) {
  const letters = word.split(" ");

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  const getLetterColor = (letter: string) => {
    if (letter === "_") {
      return "text-gray-500";
    }
    if (status === "won") {
      return "text-red-400";
    }
    if (status === "lost") {
      return "text-red-600";
    }
    return "text-red-500";
  };

  return (
    <div className="bg-black/80 border border-red-600 rounded-xl shadow-lg p-4 sm:p-6">
      <motion.div
        className="flex flex-wrap justify-center gap-2 sm:gap-3 items-center min-h-[80px] sm:min-h-[100px]"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {letters.map((letter, index) => (
          <motion.div
            key={index}
            variants={letterVariants}
            className={`text-3xl sm:text-4xl md:text-5xl font-bold ${getLetterColor(letter)} ${
              letter === " " ? "w-4 sm:w-6" : "w-8 sm:w-10 md:w-12"
            } text-center`}
          >
            {letter === " " ? "\u00A0" : letter}
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
