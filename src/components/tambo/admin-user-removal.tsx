"use client";

import * as React from "react";
import { useAuth } from "@/lib/auth";

export type AdminUserRemovalProps = {
  title?: string;
  subtitle?: string;
};

export function AdminUserRemoval({
  title = "Remove a resident",
  subtitle = "Select a unit to remove its assigned user.",
}: AdminUserRemovalProps) {
  const { credentials, removeUserFromUnit } = useAuth();
  const [unitId, setUnitId] = React.useState("");
  const [status, setStatus] = React.useState("");

  const assignedUnits = React.useMemo(
    () =>
      credentials
        .filter((entry) => entry.role === "user" && entry.unit)
        .map((entry) => entry.unit),
    [credentials],
  );

  React.useEffect(() => {
    if (!unitId && assignedUnits.length > 0) {
      setUnitId(assignedUnits[0]);
    }
  }, [assignedUnits, unitId]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const result = removeUserFromUnit(unitId);
    if (!result.ok) {
      setStatus(result.message || "Unable to remove user.");
      return;
    }
    setStatus(`User removed from Unit ${unitId}.`);
  };

  return (
    <div
      style={{
        width: "100%",
        borderRadius: "16px",
        padding: "16px",
        background: "rgba(10, 10, 14, 0.85)",
        border: "1px solid rgba(255,255,255,0.1)",
        color: "white",
      }}
    >
      <div style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
        {title}
      </div>
      <div
        style={{
          fontSize: "12px",
          color: "rgba(255,255,255,0.65)",
          marginBottom: "12px",
        }}
      >
        {subtitle}
      </div>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <select
          value={unitId}
          onChange={(event) => setUnitId(event.target.value)}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
          }}
        >
          {assignedUnits.length === 0 ? (
            <option value="">No assigned units</option>
          ) : (
            assignedUnits.map((id) => (
              <option key={id} value={id}>
                Unit {id}
              </option>
            ))
          )}
        </select>
        <button
          type="submit"
          disabled={!unitId}
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#f97316",
            color: "#0b0f14",
            fontWeight: 600,
            cursor: unitId ? "pointer" : "not-allowed",
            opacity: unitId ? 1 : 0.5,
          }}
        >
          Remove user
        </button>
      </form>

      {status ? (
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#fde68a" }}>
          {status}
        </div>
      ) : null}
    </div>
  );
}
