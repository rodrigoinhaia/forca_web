"use client";

import { motion } from "framer-motion";

interface HangmanProps {
  wrongGuesses: number;
}

const HangmanParts = [
  { name: "base", showAt: 0 },
  { name: "pole", showAt: 0 },
  { name: "top", showAt: 0 },
  { name: "rope", showAt: 1 },
  { name: "head", showAt: 2 },
  { name: "body", showAt: 3 },
  { name: "leftArm", showAt: 4 },
  { name: "rightArm", showAt: 5 },
  { name: "leftLeg", showAt: 6 },
  { name: "rightLeg", showAt: 6 },
];

export default function Hangman({ wrongGuesses }: HangmanProps) {
  const shouldShow = (partName: string) => {
    const part = HangmanParts.find((p) => p.name === partName);
    if (!part) return false;
    return wrongGuesses >= part.showAt;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const partVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15,
      },
    },
  };

  return (
    <div className="flex items-center justify-center p-4 sm:p-6 bg-black/80 border border-red-600 rounded-xl shadow-lg">
      <motion.svg
        width="200"
        height="260"
        viewBox="0 0 300 400"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="stroke-red-600 stroke-2 fill-none w-full max-w-[200px] h-auto"
      >
        {/* Base */}
        {shouldShow("base") && (
          <motion.line
            x1="50"
            y1="380"
            x2="150"
            y2="380"
            variants={partVariants}
            className="stroke-4"
          />
        )}

        {/* Pole */}
        {shouldShow("pole") && (
          <motion.line
            x1="100"
            y1="380"
            x2="100"
            y2="50"
            variants={partVariants}
          />
        )}

        {/* Top */}
        {shouldShow("top") && (
          <motion.line
            x1="100"
            y1="50"
            x2="200"
            y2="50"
            variants={partVariants}
          />
        )}

        {/* Rope */}
        {shouldShow("rope") && (
          <motion.line
            x1="200"
            y1="50"
            x2="200"
            y2="100"
            variants={partVariants}
          />
        )}

        {/* Head */}
        {shouldShow("head") && (
          <motion.circle
            cx="200"
            cy="130"
            r="30"
            variants={partVariants}
            className="stroke-2"
          />
        )}

        {/* Body */}
        {shouldShow("body") && (
          <motion.line
            x1="200"
            y1="160"
            x2="200"
            y2="280"
            variants={partVariants}
          />
        )}

        {/* Left Arm */}
        {shouldShow("leftArm") && (
          <motion.line
            x1="200"
            y1="200"
            x2="160"
            y2="240"
            variants={partVariants}
          />
        )}

        {/* Right Arm */}
        {shouldShow("rightArm") && (
          <motion.line
            x1="200"
            y1="200"
            x2="240"
            y2="240"
            variants={partVariants}
          />
        )}

        {/* Left Leg */}
        {shouldShow("leftLeg") && (
          <motion.line
            x1="200"
            y1="280"
            x2="160"
            y2="340"
            variants={partVariants}
          />
        )}

        {/* Right Leg */}
        {shouldShow("rightLeg") && (
          <motion.line
            x1="200"
            y1="280"
            x2="240"
            y2="340"
            variants={partVariants}
          />
        )}
      </motion.svg>
    </div>
  );
}
