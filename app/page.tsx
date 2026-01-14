"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hangman from "@/components/game/Hangman";
import WordDisplay from "@/components/game/WordDisplay";
import Keyboard from "@/components/game/Keyboard";
import GameStatus from "@/components/game/GameStatus";
import Header from "@/components/layout/Header";

interface GameState {
  word: string;
  displayWord: string;
  guessedLetters: string[];
  wrongGuesses: number;
  maxWrongGuesses: number;
  status: "playing" | "won" | "lost";
}

export default function Home() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [victoryMessage, setVictoryMessage] = useState("🎉 Você Ganhou!");

  const startGame = async (difficulty?: "facil" | "medio" | "dificil") => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/game/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ difficulty }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao iniciar jogo");
      }

      setGameState({
        word: result.data.word,
        displayWord: result.data.word
          .split("")
          .map((char: string) => (char === " " ? " " : "_"))
          .join(" "),
        guessedLetters: result.data.guessedLetters || [],
        wrongGuesses: result.data.wrongGuesses || 0,
        maxWrongGuesses: result.data.maxWrongGuesses || 6,
        status: result.data.status || "playing",
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const makeGuess = async (letter: string) => {
    if (!gameState || gameState.status !== "playing" || loading) return;
    if (gameState.guessedLetters.includes(letter.toUpperCase())) return;

    setLoading(true);

    try {
      const response = await fetch("/api/game/guess", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameState: {
            word: gameState.word,
            guessedLetters: gameState.guessedLetters,
            wrongGuesses: gameState.wrongGuesses,
            maxWrongGuesses: gameState.maxWrongGuesses,
            status: gameState.status,
          },
          letter,
        }),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao fazer tentativa");
      }

      setGameState({
        word: result.data.word,
        displayWord: result.data.displayWord,
        guessedLetters: result.data.guessedLetters,
        wrongGuesses: result.data.wrongGuesses,
        maxWrongGuesses: result.data.maxWrongGuesses,
        status: result.data.status,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Buscar mensagem de vitória personalizada
    fetch("/api/settings/victory-message")
      .then((res) => res.json())
      .then((result) => {
        if (result.success && result.data?.message) {
          setVictoryMessage(result.data.message);
        }
      })
      .catch((err) => {
        console.error("Erro ao buscar mensagem de vitória:", err);
      });

    // Iniciar jogo automaticamente ao carregar
    startGame();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      <main className="flex flex-col items-center justify-center p-2 sm:p-4 py-4 sm:py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-6xl"
        >

        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-red-900/50 border border-red-600 text-red-400 px-3 sm:px-4 py-2 sm:py-3 rounded mb-3 sm:mb-4 text-sm sm:text-base"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {!gameState ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center"
            >
              <p className="text-lg sm:text-xl text-white">Carregando jogo...</p>
            </motion.div>
          ) : (
            <motion.div
              key="game"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-4 sm:space-y-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <Hangman wrongGuesses={gameState.wrongGuesses} />
                <div className="space-y-3 sm:space-y-4">
                  <GameStatus
                    status={gameState.status}
                    wrongGuesses={gameState.wrongGuesses}
                    maxWrongGuesses={gameState.maxWrongGuesses}
                  />
                  <WordDisplay
                    word={gameState.displayWord}
                    status={gameState.status}
                  />
                </div>
              </div>

              {gameState.status === "playing" && (
                <Keyboard
                  guessedLetters={gameState.guessedLetters}
                  onLetterClick={makeGuess}
                  disabled={loading}
                />
              )}

              {gameState.status !== "playing" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center space-y-3 sm:space-y-4"
                >
                  <p className="text-xl sm:text-2xl font-semibold text-white">
                    {gameState.status === "won" ? victoryMessage : "😢 Você Perdeu!"}
                  </p>
                  {gameState.status === "lost" && (
                    <p className="text-sm sm:text-base md:text-lg text-gray-400">
                      A palavra era: <span className="font-bold text-red-400">{gameState.word}</span>
                    </p>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGame()}
                    className="px-4 sm:px-6 py-2 sm:py-3 bg-red-600 text-white rounded-lg text-sm sm:text-base font-semibold hover:bg-red-700 transition-colors border border-red-500"
                  >
                    Jogar Novamente
                  </motion.button>
                </motion.div>
              )}

              {gameState.status === "playing" && (
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => startGame()}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-black text-red-500 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-900 transition-colors border border-red-600"
                  >
                    Novo Jogo
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </main>
    </div>
  );
}
