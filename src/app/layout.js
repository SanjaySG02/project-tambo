"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense, useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import "./globals.css";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// --- HELPER: FREEZES THE OLD PAGE TO REMOVE OVERLAP ---
function FrozenRoute({ children }) {
  const context = useContext(LayoutRouterContext);
  const [frozen] = useState(context);
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

// --- TRANSITION WRAPPER: HANDLES BLUR FIX & SMOOTHNESS ---
function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ 
          width: "100%", 
          height: "100%", 
          imageRendering: "high-quality",
          backfaceVisibility: "hidden"
        }}
      >
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  );
}

// --- THE MAIN LAYOUT ---
export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        style={{ 
          margin: 0, 
          background: "black", // Ensuring dark mode feel
          color: "white",
          overflowX: "hidden" 
        }}
      >
        <Suspense
          fallback={
            <div
              className="aura-hqBg"
              style={{
                height: "100vh",
                width: "100vw",
                background: "black",
              }}
            />
          }
        >
          <Providers>
            <PageTransition>
              {children}
            </PageTransition>
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}