"use client";

import { useContext, useState } from "react";
import { LayoutRouterContext } from "next/dist/shared/lib/app-router-context.shared-runtime";

export default function FrozenRoute({ children }) {
  const context = useContext(LayoutRouterContext);
  const [frozen] = useState(context);

  return (
    <LayoutRouterContext.Provider value={frozen}>
      {children}
    </LayoutRouterContext.Provider>
  );
}
