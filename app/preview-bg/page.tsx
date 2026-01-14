"use client";

import Image from "next/image";

export default function PreviewBG() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-4xl w-full p-4">
        <h1 className="text-white text-2xl font-bold mb-4 text-center">
          Preview da Imagem de Fundo (bg.jpeg)
        </h1>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-2xl">
          <Image
            src="/bg.jpeg"
            alt="Background Image"
            fill
            className="object-cover"
            priority
          />
        </div>
        <p className="text-white text-center mt-4 text-sm opacity-75">
          Esta é a imagem que será usada como fundo na landing page
        </p>
      </div>
    </div>
  );
}
