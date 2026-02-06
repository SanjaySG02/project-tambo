"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const TransitionIntentContext = createContext(null);

export function TransitionIntentProvider({ children }) {
  const [intent, setIntentState] = useState(null);

  const setIntent = useCallback((nextIntent) => {
    setIntentState(nextIntent);
  }, []);

  const clearIntent = useCallback(() => {
    setIntentState(null);
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
