"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimationControls,
  useIsPresent,
} from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  TransitionIntentProvider,
  useTransitionIntent,
} from "../components/aura/transition-intent";
import { AuthProvider, useAuth } from "../lib/auth";

const DOOR_EXIT_OFFSETS = {
  utilities: { x: -120, y: -10 },
  security: { x: 120, y: -10 },
  amenities: { x: -80, y: 30 },
  community: { x: 80, y: 30 },
};

const CAMERA_PERSPECTIVE = 1400;

const SMASH_EASE_OUT = [0.16, 1, 0.3, 1];
const SMASH_EASE_IN = [0.7, 0, 0.84, 0];

function getIntentDrift(intent) {
  if (!intent || intent.type !== "door") return { x: 0, y: 0 };
  return DOOR_EXIT_OFFSETS[intent.sector] || { x: 0, y: 0 };
}

function buildVariants(intent) {
  const drift = getIntentDrift(intent);
  const enterDrift = { x: drift.x * -0.18, y: drift.y * -0.18 };

  return {
    enter: {
      opacity: 0,
      scale: 0.985,
      x: enterDrift.x,
      y: enterDrift.y,
      z: -140,
      filter: "blur(1.5px)",
    },
    center: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      z: 0,
      filter: "blur(0px)",
      transition: {
        type: "tween",
        duration: 0.78,
        ease: SMASH_EASE_OUT,
        opacity: { duration: 0.5, ease: SMASH_EASE_OUT },
        filter: { duration: 0.42, ease: SMASH_EASE_OUT },
      },
    },
    exit: {
      opacity: 0,
      scale: 1.045,
      x: drift.x,
      y: drift.y,
      z: 190,
      filter: "blur(3px)",
      transition: {
        type: "tween",
        duration: 0.86,
        ease: SMASH_EASE_IN,
        opacity: { duration: 0.5, ease: SMASH_EASE_IN },
        filter: { duration: 0.35, ease: SMASH_EASE_IN },
      },
    },
  };
}

function FrozenRoute({ children }) {
  const context = useContext(LayoutRouterContext);
  const [frozen] = useState(context);
  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}

function RouteLayer({
  children,
  variants,
  transformOrigin,
  initial,
  onEntered,
}) {
  const isPresent = useIsPresent();

  return (
    <motion.div
      initial={initial}
      animate="center"
      exit="exit"
      variants={variants}
      onAnimationComplete={(definition) => {
        if (definition !== "center") return;
        if (!isPresent) return;
        onEntered();
      }}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        overflow: "hidden",
        pointerEvents: isPresent ? "auto" : "none",
        willChange: "transform, opacity, filter",
        backfaceVisibility: "hidden",
        transformOrigin,
        transformStyle: "preserve-3d",
      }}
    >
      <FrozenRoute>{children}</FrozenRoute>
    </motion.div>
  );
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

  const lensFlareControls = useAnimationControls();
  const hasMounted = useRef(false);

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      return;
    }

    lensFlareControls.start({
      opacity: 0.22,
      y: -14,
      scale: 1.06,
      transition: { duration: 0.25, ease: SMASH_EASE_OUT },
    });
  }, [transitionKey, lensFlareControls]);

  const transformOrigin =
    {
      utilities: "25% 50%",
      security: "75% 50%",
      amenities: "25% 70%",
      community: "75% 70%",
    }[intent?.sector] || "50% 50%";

  const variants = useMemo(() => buildVariants(intent), [intent]);

  return (
    <MotionConfig reducedMotion="user">
      <div className="aura-shell">
        <motion.div
          aria-hidden="true"
          className="aura-lensFlare"
          initial={{ opacity: 0.6, y: 0, scale: 1 }}
          animate={lensFlareControls}
        />

        <div
          style={{
            position: "relative",
            height: "100vh",
            width: "100%",
            perspective: `${CAMERA_PERSPECTIVE}px`,
          }}
        >
          <AnimatePresence mode="sync" initial={false} onExitComplete={clearIntent}>
            <RouteLayer
              key={transitionKey}
              variants={variants}
              transformOrigin={transformOrigin}
              initial="enter"
              onEntered={() => {
                lensFlareControls.start({
                  opacity: 0.6,
                  y: 0,
                  scale: 1,
                  transition: { duration: 0.35, ease: SMASH_EASE_OUT },
                });
              }}
            >
              {children}
            </RouteLayer>
          </AnimatePresence>
        </div>
      </div>
    </MotionConfig>
  );
}

function AuthGate({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (!isReady) return;
    if (!user && pathname !== "/login") {
      router.replace("/login");
      return;
    }
    if (user && user.role === "user" && user.unit && pathname === "/") {
      router.replace(`/dashboard?unit=${user.unit}`);
      return;
    }
  }, [isReady, user, pathname, router]);

  if (!isReady) return null;
  if (!user && pathname !== "/login") return null;
  return children;
}

function HistoryGuard() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const markerKey = "tambo.history.guard";
    if (!window.sessionStorage.getItem(markerKey)) {
      window.sessionStorage.setItem(markerKey, "1");
      window.history.pushState(
        { ...(window.history.state || {}), __app: true, __guard: true },
        "",
        window.location.href,
      );
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const state = window.history.state || {};
    if (!state.__app) {
      window.history.replaceState(
        { ...state, __app: true },
        "",
        window.location.href,
      );
    }
  }, [pathname, searchParams]);

  return null;
}

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <TransitionIntentProvider>
        <AuthGate>
          <HistoryGuard />
          <AnimatedRoute>{children}</AnimatedRoute>
        </AuthGate>
      </TransitionIntentProvider>
    </AuthProvider>
  );
}
