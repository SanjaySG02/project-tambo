"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

const TransitionIntentContext = createContext(null);

export function TransitionIntentProvider({ children }) {
  const [intent, setIntentState] = useState(null);
  const fallbackClearTimer = useRef(null);

  useEffect(() => {
    return () => {
      if (fallbackClearTimer.current) {
        clearTimeout(fallbackClearTimer.current);
        fallbackClearTimer.current = null;
      }
    };
  }, []);

  const setIntent = useCallback((nextIntent) => {
    setIntentState(nextIntent);

    if (fallbackClearTimer.current) {
      clearTimeout(fallbackClearTimer.current);
      fallbackClearTimer.current = null;
    }

    if (nextIntent) {
      fallbackClearTimer.current = setTimeout(() => {
        setIntentState(null);
        fallbackClearTimer.current = null;
      }, 2000);
    }
  }, []);

  const clearIntent = useCallback(() => {
    setIntentState(null);

    if (fallbackClearTimer.current) {
      clearTimeout(fallbackClearTimer.current);
      fallbackClearTimer.current = null;
    }
  }, []);

  const value = useMemo(
    () => ({ intent, setIntent, clearIntent }),
    [intent, setIntent, clearIntent],
  );

  return (
    <TransitionIntentContext.Provider value={value}>
      {children}
    </TransitionIntentContext.Provider>
  );
}

export function useTransitionIntent() {
  const ctx = useContext(TransitionIntentContext);
  if (!ctx) {
    throw new Error(
      "useTransitionIntent must be used within <TransitionIntentProvider>",
    );
  }
  return ctx;
}
