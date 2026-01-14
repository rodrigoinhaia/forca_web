"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Header from "@/components/layout/Header";

interface Word {
  id: string;
  word: string;
  category?: string;
  difficulty: "facil" | "medio" | "dificil";
  created_at: string;
}

export default function AdminPage() {
  const { user, token, isAdmin } = useAuth();
  const router = useRouter();
  const [words, setWords] = useState<Word[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingWord, setEditingWord] = useState<Word | null>(null);
  const [formData, setFormData] = useState({
    word: "",
    category: "",
    difficulty: "medio" as "facil" | "medio" | "dificil",
  });

  useEffect(() => {
    if (!isAdmin) {
      router.push("/");
      return;
    }
    fetchWords();
  }, [isAdmin, router]);

  const fetchWords = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/words", {
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar palavras");
      }

      setWords(result.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      const url = editingWord ? `/api/words/${editingWord.id}` : "/api/words";
      const method = editingWord ? "PATCH" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao salvar palavra");
      }

      await fetchWords();
      setShowForm(false);
      setEditingWord(null);
      setFormData({ word: "", category: "", difficulty: "medio" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  const handleEdit = (word: Word) => {
    setEditingWord(word);
    setFormData({
      word: word.word,
      category: word.category || "",
      difficulty: word.difficulty,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Tem certeza que deseja deletar esta palavra?")) return;

    try {
      const response = await fetch(`/api/words/${id}`, {
        method: "DELETE",
        headers: token
          ? {
              Authorization: `Bearer ${token}`,
            }
          : {},
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao deletar palavra");
      }

      await fetchWords();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro desconhecido");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-black/80 border border-red-600 rounded-xl shadow-lg p-8"
        >
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-white">📝 Gerenciar Palavras</h1>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                setShowForm(!showForm);
                setEditingWord(null);
                setFormData({ word: "", category: "", difficulty: "medio" });
              }}
              className="px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors border border-red-500"
            >
              {showForm ? "Cancelar" : "+ Nova Palavra"}
            </motion.button>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-600 text-red-400 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {showForm && (
            <motion.form
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={handleSubmit}
              className="mb-6 p-6 bg-black/50 border border-red-600 rounded-lg space-y-4"
            >
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Palavra *
                </label>
                <input
                  type="text"
                  required
                  value={formData.word}
                  onChange={(e) =>
                    setFormData({ ...formData, word: e.target.value.toUpperCase() })
                  }
                  className="w-full px-4 py-2 bg-black border border-red-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ex: COMPUTADOR"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-black border border-red-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                  placeholder="Ex: Tecnologia"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Dificuldade *
                </label>
                <select
                  required
                  value={formData.difficulty}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      difficulty: e.target.value as "facil" | "medio" | "dificil",
                    })
                  }
                  className="w-full px-4 py-2 bg-black border border-red-600 rounded-lg text-white focus:ring-2 focus:ring-red-500 focus:border-red-500"
                >
                  <option value="facil">Fácil</option>
                  <option value="medio">Médio</option>
                  <option value="dificil">Difícil</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors border border-red-500"
              >
                {editingWord ? "Atualizar" : "Criar"} Palavra
              </button>
            </motion.form>
          )}

          {loading ? (
            <div className="text-center py-8">
              <p className="text-white">Carregando palavras...</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-red-900/50 border-b border-red-600">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Palavra
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Categoria
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Dificuldade
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-white">
                      Ações
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {words.map((word) => (
                    <motion.tr
                      key={word.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="border-b border-red-900/50 hover:bg-red-900/20"
                    >
                      <td className="px-4 py-3 font-semibold text-white">{word.word}</td>
                      <td className="px-4 py-3 text-gray-400">
                        {word.category || "-"}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            word.difficulty === "facil"
                              ? "bg-red-900/50 text-red-300 border border-red-600"
                              : word.difficulty === "medio"
                              ? "bg-red-800/50 text-red-400 border border-red-500"
                              : "bg-red-950 text-red-500 border border-red-700"
                          }`}
                        >
                          {word.difficulty.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleEdit(word)}
                            className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors border border-red-500"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(word.id)}
                            className="px-3 py-1 bg-black text-red-500 rounded text-sm hover:bg-gray-900 transition-colors border border-red-600"
                          >
                            Deletar
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              {words.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                  Nenhuma palavra cadastrada ainda.
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
