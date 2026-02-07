"use client";

import {
  AnimatePresence,
  MotionConfig,
  motion,
  useAnimationControls,
} from "framer-motion";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { TamboProvider } from "@tambo-ai/react";
import {
  TransitionIntentProvider,
  useTransitionIntent,
} from "../components/aura/transition-intent";
import { AuthProvider, useAuth } from "../lib/auth";
import { AppAssistant } from "../components/tambo/app-assistant";
import { components } from "../lib/tambo";
import { UNIT_IDS, getUnitSnapshot } from "../lib/residence-data";

const DOOR_EXIT_OFFSETS = {
  utilities: { x: -120, y: -10 },
  security: { x: 120, y: -10 },
  amenities: { x: -80, y: 30 },
  community: { x: 80, y: 30 },
};

function buildExit(intent, routeTransition) {
  const base = {
    opacity: 0,
    scale: 1.1,
    transition: routeTransition,
  };

  if (!intent || intent.type !== "door") return base;
  const offset = DOOR_EXIT_OFFSETS[intent.sector];
  if (!offset) return base;

  return {
    ...base,
    x: offset.x,
    y: offset.y,
    scale: 1.18,
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: 1,
              scale: 1,
              transition: routeTransition,
            }}
            exit={buildExit(intent, routeTransition)}
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
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { user, isReady } = useAuth();
  const lastPathRef = useRef("");
  const currentPathRef = useRef(pathname);
  const roomPaths = useRef([
    "/utilities",
    "/security",
    "/amenities",
    "/community",
  ]);
  const currentIdxRef = useRef(0);

  useEffect(() => {
    currentPathRef.current = pathname;
    const queryString = searchParams.toString();
    lastPathRef.current = queryString
      ? `${pathname}?${queryString}`
      : pathname;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const key = "tambo.history.idx";
    const raw = window.sessionStorage.getItem(key);
    const nextIdx = raw ? Number(raw) + 1 : 1;
    window.sessionStorage.setItem(key, String(nextIdx));
    const state = window.history.state || {};
    window.history.replaceState(
      { ...state, __app: true, __idx: nextIdx },
      "",
      window.location.href,
    );
    currentIdxRef.current = nextIdx;
  }, [pathname, searchParams]);

  useEffect(() => {
    if (!isReady) return undefined;
    if (typeof window === "undefined") return undefined;

    const handlePopState = () => {
      const prevPath = (lastPathRef.current || "").split("?")[0];
      const nextPath = window.location.pathname;
      const currentPath = currentPathRef.current;
      const isRoom = roomPaths.current.includes(nextPath);
      const nextIdx = window.history.state?.__idx ?? -1;
      const direction = nextIdx < currentIdxRef.current ? "back" : "forward";
      currentIdxRef.current = nextIdx;

      if (currentPath === "/login" && direction === "forward") {
        router.replace("/login");
        return;
      }

      if (prevPath === "/login" && direction === "back") {
        window.location.href = "https://www.google.com";
        return;
      }

      if (prevPath === "/login" && direction === "forward") {
        router.replace("/login");
        return;
      }

      if (nextPath === "/login" && direction === "forward") {
        router.replace("/login");
        return;
      }

      if (user?.role === "user") {
        if (prevPath === "/dashboard" && direction === "back") {
          router.replace("/login");
          return;
        }
        if (roomPaths.current.includes(prevPath) && direction === "back") {
          router.replace(`/dashboard?unit=${user.unit}`);
          return;
        }
        if (nextPath === "/" && direction === "back") {
          router.replace("/login");
          return;
        }
        if (isRoom && prevPath === "/login") {
          router.replace("/login");
          return;
        }
      }

      if (user?.role === "admin") {
        if (prevPath === "/" && direction === "back") {
          router.replace("/login");
        }
      }
    };

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isReady, user, router]);

  return null;
}

function TamboShell({ children }) {
  const { user } = useAuth();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const apiKey = process.env.NEXT_PUBLIC_TAMBO_API_KEY;

  const unitIds = useMemo(() => {
    if (user?.role === "admin") return UNIT_IDS;
    if (user?.unit) return [user.unit];
    return [];
  }, [user]);

  const listResources = useCallback(
    async (search) => {
      const query = search?.toLowerCase() || "";
      return unitIds
        .filter((id) => id.includes(query))
        .map((id) => ({
          uri: `file:///units/${id}.json`,
          name: `Unit ${id} Snapshot`,
          description: `Current snapshot data for unit ${id}.`,
          mimeType: "application/json",
        }));
    },
    [unitIds],
  );

  const getResource = useCallback(async (uri) => {
    const unitId = uri.split("/").pop()?.replace(".json", "");
    const snapshot = unitId ? getUnitSnapshot(unitId) : null;
    const payload = snapshot
      ? JSON.stringify(snapshot, null, 2)
      : JSON.stringify({ error: "Unit not found" }, null, 2);

    return {
      contents: [
        {
          uri,
          mimeType: "application/json",
          text: payload,
        },
      ],
    };
  }, []);

  const activeUnitId = useMemo(() => {
    const unitFromUrl = searchParams.get("unit");
    if (unitFromUrl) return unitFromUrl;
    if (user?.unit) return user.unit;
    return null;
  }, [searchParams, user]);

  const activeSnapshot = useMemo(() => {
    if (!activeUnitId) return null;
    return getUnitSnapshot(activeUnitId);
  }, [activeUnitId]);

  const tamboContextKey = useMemo(() => {
    if (user?.role === "admin") return "role:admin";
    if (user?.role === "user") return `role:user:unit:${user.unit || "none"}`;
    return "role:guest";
  }, [user]);

  const allSnapshots = useMemo(() => {
    if (user?.role !== "admin") return null;
    return UNIT_IDS.map((id) => getUnitSnapshot(id)).filter(Boolean);
  }, [user]);

  const electricityChartItems = useMemo(() => {
    const snapshots =
      user?.role === "admin"
        ? allSnapshots ?? []
        : activeSnapshot
          ? [activeSnapshot]
          : [];
    return snapshots.map((snapshot) => ({
      label: snapshot?.unitId ? `Unit ${snapshot.unitId}` : "Unknown",
      value: snapshot.utilities?.electricityKwh ?? 0,
      unit: "kWh",
    }));
  }, [user, allSnapshots, activeSnapshot]);

  const contextHelpers = useMemo(
    () => ({
      userRole: () => ({ key: "userRole", value: user?.role || "guest" }),
      userUnit: () => ({ key: "userUnit", value: user?.unit || "none" }),
      activeUnit: () => ({ key: "activeUnit", value: activeUnitId || "none" }),
      activeUnitSnapshot: () => ({
        key: "activeUnitSnapshot",
        value: activeSnapshot
          ? JSON.stringify(activeSnapshot)
          : "No active unit snapshot available.",
      }),
      allUnitSnapshots: () => ({
        key: "allUnitSnapshots",
        value: allSnapshots ? JSON.stringify(allSnapshots) : "User-only scope.",
      }),
      assistantGuidance: () => ({
        key: "assistantGuidance",
        value:
          "User speaks in plain English. Provide a concise analysis report using only on-site snapshot data. When a report is requested, always include an AnalyticsBarChart with items derived from electricityKwh per unit. Do not ask follow-up questions about time ranges or extra requirements.",
      }),
      electricityChartItems: () => ({
        key: "electricityChartItems",
        value: JSON.stringify(
          {
            title: "Electricity Usage (kWh)",
            subtitle: "Latest snapshot across units",
            items: electricityChartItems,
          },
          null,
          2,
        ),
      }),
      currentPage: () => ({ key: "page", value: window.location.pathname }),
    }),
      [user, activeUnitId, activeSnapshot, allSnapshots, electricityChartItems],
  );

  if (!apiKey) {
    return children;
  }

  if (pathname === "/login") {
    return children;
  }

  return (
    <TamboProvider
      apiKey={apiKey}
      components={components}
      listResources={listResources}
      getResource={getResource}
      contextHelpers={contextHelpers}
      contextKey={tamboContextKey}
    >
      {children}
      <AppAssistant />
    </TamboProvider>
  );
}

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <TransitionIntentProvider>
        <AuthGate>
          <TamboShell>
            <HistoryGuard />
            <AnimatedRoute>{children}</AnimatedRoute>
          </TamboShell>
        </AuthGate>
      </TransitionIntentProvider>
    </AuthProvider>
  );
}
