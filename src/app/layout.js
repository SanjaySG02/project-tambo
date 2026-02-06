"use client";
import { Geist, Geist_Mono } from "next/font/google";
import { Suspense } from "react";
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
            {children}
          </Providers>
        </Suspense>
      </body>
    </html>
  );
}
