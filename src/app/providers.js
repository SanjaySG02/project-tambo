"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimationControls,
} from "framer-motion";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import {
  TransitionIntentProvider,
  useTransitionIntent,
} from "../components/aura/transition-intent";

function AnimatedRoute({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { intent, clearIntent } = useTransitionIntent();

  const queryString = searchParams.toString();
  const transitionKey = useMemo(
    () => (queryString ? `${pathname}?${queryString}` : pathname),
    [pathname, queryString],
  );

  const routeTransition = {
    type: "tween",
    duration: 0.4,
    ease: [0.22, 1, 0.36, 1],
  };

  const lensFlareControls = useAnimationControls();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    lensFlareControls.start({
      opacity: 0.2,
      transition: { duration: 0.2, ease: "easeOut" },
    });
  }, [transitionKey, lensFlareControls]);

  const transformOrigin =
    {
      utilities: "25% 50%",
      security: "75% 50%",
      amenities: "25% 70%",
      community: "75% 70%",
    }[intent?.sector] || "50% 50%";

  return (
    <MotionConfig reducedMotion="user">
      <motion.div
        aria-hidden="true"
        className="aura-lensFlare"
        initial={{ opacity: 0.6 }}
        animate={lensFlareControls}
      />

      <AnimatePresence mode="wait" initial={false} onExitComplete={clearIntent}>
        <motion.div
          key={transitionKey}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: 1,
            scale: 1,
            transition: routeTransition,
          }}
          exit={{ opacity: 0, scale: 1.1, transition: routeTransition }}
          onAnimationComplete={(definition) => {
            if (definition !== "animate") return;
            lensFlareControls.start({
              opacity: 0.6,
              transition: { duration: 0.25, ease: "easeOut" },
            });
          }}
          style={{
            width: "100%",
            height: "100vh",
            willChange: "transform, opacity",
            backfaceVisibility: "hidden",
            transformOrigin,
            transformStyle: "preserve-3d",
            translateZ: 0,
          }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </MotionConfig>
  );
}

export default function Providers({ children }) {
  return (
    <TransitionIntentProvider>
      <AnimatedRoute>{children}</AnimatedRoute>
    </TransitionIntentProvider>
  );
}
