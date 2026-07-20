import type { MetadataRoute } from "next";

// PWA / ícone da tela inicial do Android.
// purpose "any" (não "maskable") porque a arte não sangra até a borda.
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Finance Hub — Seu controle financeiro",
    short_name: "Finance Hub",
    description: "Seu controle financeiro completo e inteligente",
    start_url: "/",
    display: "standalone",
    background_color: "#0097b2",
    theme_color: "#0097b2",
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
    ],
  };
}
