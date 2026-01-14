"use client";

import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface LandingPageProps {
  onQRCodeFound?: () => void;
}

export default function LandingPage({ onQRCodeFound }: LandingPageProps) {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isQRCodeVisible, setIsQRCodeVisible] = useState(false);
  const [isQRCodeClicked, setIsQRCodeClicked] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const qrCodeRef = useRef<HTMLDivElement>(null);

  // Posição do QR code (pode ser ajustada - valores em porcentagem)
  // Ajuste estes valores para posicionar o QR code onde desejar na imagem
  const qrCodePosition = { x: 75, y: 60 }; // porcentagem (75% da esquerda, 60% do topo)
  const qrCodeSize = 250; // pixels
  const flashlightRadius = 100; // raio da lanterna em pixels (reduzido)

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      setMousePosition({ x, y });

      // Verificar se o mouse está próximo do QR code
      if (qrCodeRef.current) {
        const qrRect = qrCodeRef.current.getBoundingClientRect();
        const qrCenterX = qrRect.left + qrRect.width / 2 - rect.left;
        const qrCenterY = qrRect.top + qrRect.height / 2 - rect.top;

        const distance = Math.sqrt(
          Math.pow(x - qrCenterX, 2) + Math.pow(y - qrCenterY, 2)
        );

        // Área de ativação muito pequena - centro do raio deve estar a 5px do centro do QR code
        const threshold = 5; // Apenas 5px de tolerância
        setIsQRCodeVisible(distance < threshold);
      }
    };

    const container = containerRef.current;
    if (container) {
      container.addEventListener("mousemove", handleMouseMove);
      return () => container.removeEventListener("mousemove", handleMouseMove);
    }
  }, [isMounted]);

  const handleQRCodeClick = () => {
    setIsQRCodeClicked(true);
    setShowModal(true);
    if (onQRCodeFound) {
      onQRCodeFound();
    }
  };

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative w-full h-screen overflow-hidden cursor-none"
      >
        {/* Imagem de fundo original - camada base */}
        <div
          className="absolute inset-0 bg-black"
          style={{
            backgroundImage: "url('/bg.jpeg')",
            backgroundSize: "contain",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Efeito de lanterna (máscara circular com gradiente suave) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(
              circle ${flashlightRadius}px at ${mousePosition.x}px ${mousePosition.y}px,
              transparent 0%,
              transparent 40%,
              rgba(0, 0, 0, 0.6) 60%,
              rgba(0, 0, 0, 0.85) 80%,
              rgba(0, 0, 0, 0.95) 100%
            )`,
          }}
        />

        {/* QR Code */}
        <div
          ref={qrCodeRef}
          className={`absolute transition-all duration-300 ${
            isQRCodeVisible ? "opacity-100 z-20" : "opacity-0 z-10"
          }`}
          style={{
            left: `${qrCodePosition.x}%`,
            top: `${qrCodePosition.y}%`,
            transform: "translate(-50%, -50%)",
            width: `${qrCodeSize}px`,
            height: `${qrCodeSize}px`,
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{
              scale: isQRCodeVisible ? 1 : 0.9,
              opacity: isQRCodeVisible ? 1 : 0,
            }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full h-full cursor-pointer group"
            onClick={handleQRCodeClick}
            whileHover={{ scale: 1.05 }}
          >
            <Image
              src="/qrcode.jpeg"
              alt="QR Code"
              fill
              className="object-contain drop-shadow-2xl"
              style={{
                filter: isQRCodeVisible
                  ? "drop-shadow(0 0 15px rgba(255, 255, 255, 0.6))"
                  : "none",
              }}
            />
            {isQRCodeVisible && !isQRCodeClicked && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -bottom-10 left-1/2 transform -translate-x-1/2 whitespace-nowrap text-white text-sm font-semibold bg-black/80 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20"
              >
                ✨ Clique para ler
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Indicador visual da lanterna no cursor */}
        {isMounted && (
          <div
            className="fixed pointer-events-none z-50 transition-opacity duration-200"
            style={{
              left: `${mousePosition.x}px`,
              top: `${mousePosition.y}px`,
              transform: "translate(-50%, -50%)",
              width: `${flashlightRadius * 2}px`,
              height: `${flashlightRadius * 2}px`,
              borderRadius: "50%",
              border: "2px solid rgba(255, 255, 255, 0.4)",
              boxShadow: `
                0 0 ${flashlightRadius}px rgba(255, 255, 255, 0.3),
                inset 0 0 ${flashlightRadius}px rgba(255, 255, 255, 0.1)
              `,
            }}
          />
        )}

        {/* Conteúdo da landing page */}
        <div className="relative z-30 flex flex-col items-center justify-center h-full text-white pointer-events-none">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center px-4"
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-2xl">
              Descubra o Segredo
            </h1>
            <p className="text-xl md:text-2xl mb-8 drop-shadow-lg">
              Mova o mouse para encontrar o QR Code escondido
            </p>
            {isQRCodeClicked && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-black/60 rounded-lg backdrop-blur-md border border-white/20"
              >
                <p className="text-lg font-semibold">QR Code encontrado! 🎉</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Modal para exibir o QR Code quando clicado */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl"
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
              >
                ×
              </button>
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">
                  QR Code Encontrado!
                </h2>
                <div className="relative w-64 h-64 mx-auto mb-4">
                  <Image
                    src="/qrcode.jpeg"
                    alt="QR Code"
                    fill
                    className="object-contain"
                  />
                </div>
                <p className="text-gray-600 mb-4">
                  Escaneie o QR Code com seu dispositivo
                </p>
                <button
                  onClick={closeModal}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
