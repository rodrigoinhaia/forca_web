"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Header from "@/components/layout/Header";
import { useAuth } from "@/lib/contexts/AuthContext";

interface RankingEntry {
  id: string;
  name: string;
  email: string;
  total_score: number;
  games_won: number;
  games_played: number;
  win_rate: number;
  position: number;
}

export default function RankingPage() {
  const { user } = useAuth();
  const [ranking, setRanking] = useState<RankingEntry[]>([]);
  const [userRanking, setUserRanking] = useState<RankingEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchRanking();
    if (user) {
      fetchUserRanking();
    }
  }, [user]);

  const fetchRanking = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/ranking");
      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar ranking");
      }

      setRanking(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserRanking = async () => {
    if (!user) return;

    try {
      const token = localStorage.getItem("auth_token");
      const response = await fetch("/api/ranking/me", {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      const result = await response.json();

      if (result.success) {
        setUserRanking(result.data);
      }
    } catch (err) {
      // Silenciar erro - usuário pode não estar no ranking ainda
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 border border-red-600 rounded-xl shadow-lg p-8"
        >
          <h1 className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
            🏆 Ranking
          </h1>

          {userRanking && (() => {
            const winRate = typeof userRanking.win_rate === 'string' 
              ? parseFloat(userRanking.win_rate) 
              : (userRanking.win_rate || 0);
            const winRateNum = isNaN(winRate) ? 0 : winRate;
            
            return (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-6 p-6 bg-gradient-to-r from-red-900/50 to-black rounded-lg border-2 border-red-600"
              >
                <h2 className="text-xl font-semibold mb-4 text-white">Sua Posição</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Posição</p>
                    <p className="text-2xl font-bold text-red-500">
                      #{userRanking.position}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Pontuação</p>
                    <p className="text-2xl font-bold text-red-400">
                      {userRanking.total_score}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Vitórias</p>
                    <p className="text-2xl font-bold text-red-500">
                      {userRanking.games_won}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-400">Taxa de Vitória</p>
                    <p className="text-2xl font-bold text-red-400">
                      {winRateNum.toFixed(1)}%
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })()}

          {error && (
            <div className="bg-red-900/50 border border-red-600 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-white">Carregando ranking...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-red-900/50 border-b border-red-600">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Posição
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Nome
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Pontuação
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Vitórias
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Jogos
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Taxa de Vitória
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ranking.map((entry, index) => {
                    const winRate = typeof entry.win_rate === 'string' 
                      ? parseFloat(entry.win_rate) 
                      : (entry.win_rate || 0);
                    const winRateNum = isNaN(winRate) ? 0 : winRate;
                    
                    return (
                      <motion.tr
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`border-b border-red-900/50 ${
                          user && entry.id === user.id
                            ? "bg-red-900/30 font-semibold"
                            : "hover:bg-red-900/20"
                        }`}
                      >
                        <td className="px-4 py-3">
                          <span
                            className={`text-lg font-bold ${
                              entry.position === 1
                                ? "text-red-400"
                                : entry.position === 2
                                ? "text-red-500"
                                : entry.position === 3
                                ? "text-red-600"
                                : "text-gray-400"
                            }`}
                          >
                            {entry.position === 1 && "🥇"}
                            {entry.position === 2 && "🥈"}
                            {entry.position === 3 && "🥉"}
                            {entry.position > 3 && `#${entry.position}`}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-white">{entry.name}</td>
                        <td className="px-4 py-3 text-red-500 font-bold">
                          {entry.total_score}
                        </td>
                        <td className="px-4 py-3 text-white">{entry.games_won}</td>
                        <td className="px-4 py-3 text-gray-400">
                          {entry.games_played}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 bg-red-900/50 text-red-400 rounded text-sm font-medium border border-red-600">
                            {winRateNum.toFixed(1)}%
                          </span>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              {ranking.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Nenhum jogador no ranking ainda.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
