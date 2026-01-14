"use client";

import LandingPage from "@/components/LandingPage";

export default function LandingPageRoute() {
  const handleQRCodeFound = () => {
    // Aqui você pode adicionar lógica adicional quando o QR code for encontrado
    console.log("QR Code encontrado e clicado!");
  };

  return <LandingPage onQRCodeFound={handleQRCodeFound} />;
}
