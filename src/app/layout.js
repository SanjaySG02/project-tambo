"use client";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimatePresence, motion } from "framer-motion";
import { usePathname } from "next/navigation";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export default function RootLayout({ children }) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`} style={{ backgroundColor: "black", margin: 0, overflow: "hidden" }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={pathname}
            // Step 1: Animation Logic
            // initial = stepping INTO the room (scale up from small)
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px)" }}
            // animate = current view
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            // exit = zooming THROUGH the door (scale up to huge)
            exit={{ opacity: 0, scale: 2, filter: "blur(20px)" }}
            transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
            style={{ width: "100%", height: "100vh" }}
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </body>
    </html>
  );
}