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

const DOOR_EXIT_OFFSETS = {
  utilities: { x: -120, y: -10 },
  security: { x: 120, y: -10 },
  amenities: { x: -80, y: 30 },
  community: { x: 80, y: 30 },
};

const ROUTE_ANIMATION = {
  enterDuration: 0.32,
  exitDuration: 0.22,
  ease: [0.22, 1, 0.36, 1],
  enterOffsetY: 6,
  enterScale: 0.98,
};

function buildExit(intent, routeTransition) {
  const base = {
    opacity: 0,
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
    scale: 1.06,
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

  const { enterDuration, exitDuration, ease, enterOffsetY, enterScale } =
    ROUTE_ANIMATION;

  const routeTransition = {
    type: "tween",
    duration: enterDuration,
    ease,
  };

  const exitTransition = {
    type: "tween",
    duration: exitDuration,
    ease,
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
      transition: { duration: exitDuration, ease: "easeOut" },
    });
  }, [transitionKey, lensFlareControls, exitDuration]);

  const transformOrigin =
    {
      utilities: "25% 50%",
      security: "75% 50%",
      amenities: "25% 70%",
      community: "75% 70%",
    }[intent?.sector] || "50% 50%";

  const variants = {
    initial: { opacity: 0, y: enterOffsetY, scale: enterScale },
    animate: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: routeTransition,
    },
    exit: (customIntent) => buildExit(customIntent, exitTransition),
  };

  return (
    <MotionConfig reducedMotion="user">
      <div className="aura-shell">
        <motion.div
          aria-hidden="true"
          className="aura-lensFlare"
          initial={{ opacity: 0.6 }}
          animate={lensFlareControls}
        />

        <AnimatePresence mode="wait" initial={false} onExitComplete={clearIntent}>
          <motion.div
            key={transitionKey}
            custom={intent}
            variants={variants}
            initial="initial"
            animate="animate"
            exit="exit"
            onAnimationComplete={(definition) => {
              if (definition !== "animate") return;
              lensFlareControls.start({
                opacity: 0.6,
                transition: { duration: enterDuration, ease: "easeOut" },
              });
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
            {children}
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
