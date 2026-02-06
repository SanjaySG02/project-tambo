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
import FrozenRoute from "../components/FrozenRoute";

const DOOR_EXIT_OFFSETS = {
  utilities: { x: -120, y: -10 },
  security: { x: 120, y: -10 },
  amenities: { x: -80, y: 30 },
  community: { x: 80, y: 30 },
};

function buildEnter(intent) {
  const base = {
    opacity: 0,
    y: 10,
    scale: 0.985,
  };

  if (!intent || intent.type !== "door") return base;
  const offset = DOOR_EXIT_OFFSETS[intent.sector];
  if (!offset) return base;

  return {
    opacity: 0,
    x: offset.x,
    y: offset.y,
    scale: 1.1,
  };
}

function buildExit(intent, routeTransition) {
  const base = {
    opacity: 0,
    y: -10,
    scale: 1.02,
    transition: routeTransition,
  };

  if (!intent || intent.type !== "door") return base;
  const offset = DOOR_EXIT_OFFSETS[intent.sector];
  if (!offset) return base;

  return {
    ...base,
    x: offset.x,
    y: offset.y,
    scale: 1.12,
  };
}

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
    duration: 0.38,
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
      <div className="aura-shell">
        <motion.div
          aria-hidden="true"
          className="aura-lensFlare"
          initial={{ opacity: 0.6 }}
          animate={lensFlareControls}
        />

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={transitionKey}
            initial={buildEnter(intent)}
            animate={{
              opacity: 1,
              scale: 1,
              x: 0,
              y: 0,
              transition: routeTransition,
            }}
            exit={buildExit(intent, routeTransition)}
            onAnimationComplete={(definition) => {
              if (definition !== "animate") return;
              lensFlareControls.start({
                opacity: 0.6,
                transition: { duration: 0.25, ease: "easeOut" },
              });

              if (intent) clearIntent();
            }}
            style={{
              width: "100%",
              height: "100vh",
              overflow: "hidden",
              willChange: "transform, opacity",
              backfaceVisibility: "hidden",
              transformOrigin,
              transformStyle: "preserve-3d",
            }}
          >
            <FrozenRoute>{children}</FrozenRoute>
          </motion.div>
        </AnimatePresence>
      </div>
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
