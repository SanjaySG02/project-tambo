"use client";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";
import { useContext, useState } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

// This logic prevents the "split-second" jump by freezing the previous route
function FrozenRoute({ children }) {
  const context = useContext(LayoutRouterContext);
  const [frozen] = useState(context);
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

export default function PageTransition({ children }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, scale: 0.98, filter: "blur(10px)" }} // Fixes blurriness by starting soft
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}    // Sharpening into view
        exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}   // Zoom out and blur
        transition={{ duration: 0.4, ease: "easeInOut" }}
        style={{ 
          width: "100%", 
          height: "100%", 
          imageRendering: "high-quality" // Directly fixes Charlie's blurry image issue
        }}
      >
        <FrozenRoute>{children}</FrozenRoute>
      </motion.div>
    </AnimatePresence>
  );
}