"use client";

import { motion } from "framer-motion";
import { useAuth } from "@/lib/contexts/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Header() {
  const { user, logout, isAdmin } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <header className="w-full bg-black/90 backdrop-blur-sm shadow-lg border-b border-red-600 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 py-2 sm:py-3 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-red-600 to-red-500 bg-clip-text text-transparent">
          🎮 Jogo da Forca
        </Link>

        <nav className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-wrap">
          {user ? (
            <>
              <span className="text-white text-xs sm:text-sm">
                Olá, <span className="font-semibold text-red-400">{user.name}</span>
              </span>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors border border-red-500"
                >
                  📝 Admin
                </Link>
              )}
              <Link
                href="/ranking"
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors border border-red-500"
              >
                🏆 Ranking
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-black text-red-500 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-900 transition-colors border border-red-600"
              >
                Sair
              </motion.button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-red-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-red-700 transition-colors border border-red-500"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-black text-red-500 rounded-lg text-xs sm:text-sm font-medium hover:bg-gray-900 transition-colors border border-red-600"
              >
                Cadastrar
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
