import type { Metadata } from "next";
import { Mulish } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { Toaster } from "sonner";

const mulish = Mulish({
  subsets: ["latin-ext"],
});

export const metadata: Metadata = {
  title: "Finance Hub",
  description: "Seu controle financeiro completo e inteligente",
  icons: {
    icon: "/icons/icon.png",
    apple: "/icons/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${mulish.className} dark antialiased`}>
        <ClerkProvider
          appearance={{
            baseTheme: dark,
          }}
        >
          <div
            aria-hidden
            className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
          >
            <div className="absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/[0.12] blur-[140px]" />
            <div className="absolute -bottom-40 -right-32 h-[460px] w-[460px] rounded-full bg-emerald-500/[0.07] blur-[140px]" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
          </div>
          <div className="relative flex h-full flex-col overflow-hidden">
            {children}
          </div>
        </ClerkProvider>

        <Toaster />
      </body>
    </html>
  );
}
