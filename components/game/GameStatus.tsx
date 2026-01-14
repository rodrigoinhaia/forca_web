"use client";

import { motion } from "framer-motion";
import { GameStatus as GameStatusType } from "@/lib/types/game";

interface GameStatusProps {
  status: GameStatusType;
  wrongGuesses: number;
  maxWrongGuesses: number;
}

export default function GameStatus({
  status,
  wrongGuesses,
  maxWrongGuesses,
}: GameStatusProps) {
  const getStatusColor = () => {
    switch (status) {
      case "won":
        return "bg-red-900/50 border-red-500 text-red-400";
      case "lost":
        return "bg-black border-red-600 text-red-500";
      default:
        return "bg-black border-red-600 text-red-500";
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "won":
        return "🎉 Vitória!";
      case "lost":
        return "😢 Derrota!";
      default:
        return "🎮 Em Jogo";
    }
  };

  const remainingGuesses = maxWrongGuesses - wrongGuesses;

  return (
    <div className="space-y-3 sm:space-y-4">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`border-2 rounded-lg p-3 sm:p-4 text-center font-semibold text-base sm:text-lg ${getStatusColor()}`}
      >
        {getStatusText()}
      </motion.div>

      {status === "playing" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-black/80 border border-red-600 rounded-lg p-3 sm:p-4 shadow-md"
        >
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs sm:text-sm font-medium text-white">
              Tentativas Restantes:
            </span>
            <span className="text-xl sm:text-2xl font-bold text-red-500">
              {remainingGuesses}
            </span>
          </div>
          <div className="w-full bg-gray-800 rounded-full h-2 sm:h-3">
            <motion.div
              className="bg-red-600 h-2 sm:h-3 rounded-full"
              initial={{ width: "100%" }}
              animate={{
                width: `${(remainingGuesses / maxWrongGuesses) * 100}%`,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </motion.div>
      )}
    </div>
  );
}
