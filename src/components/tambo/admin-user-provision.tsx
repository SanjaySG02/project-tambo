"use client";

import * as React from "react";
import { UNIT_IDS } from "@/lib/residence-data";
import { useAuth } from "@/lib/auth";

export type AdminUserProvisionProps = {
  title?: string;
  subtitle?: string;
  preferredUnit?: string;
};

export function AdminUserProvision({
  title = "Create a new resident",
  subtitle = "Enter profile details.",
  preferredUnit,
}: AdminUserProvisionProps) {
  const { getAvailableUnits, addUser } = useAuth();
  const [fullName, setFullName] = React.useState("");
  const [mobile, setMobile] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [assignedUnit, setAssignedUnit] = React.useState("");
  const [isComplete, setIsComplete] = React.useState(false);

  const availableUnits = React.useMemo(() => getAvailableUnits(), [getAvailableUnits]);

  React.useEffect(() => {
    if (availableUnits.length === 0) {
      setAssignedUnit("");
      return;
    }
    setAssignedUnit((current) => {
      if (preferredUnit && availableUnits.includes(preferredUnit)) {
        return preferredUnit;
      }
      if (current && availableUnits.includes(current)) {
        return current;
      }
      return availableUnits[Math.floor(Math.random() * availableUnits.length)];
    });
  }, [availableUnits, preferredUnit]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!assignedUnit) {
      setStatus("No units available.");
      return;
    }
    const autoUsername = `unit${assignedUnit}`;
    const autoPassword = `Unit@${assignedUnit}`;
    const result = addUser({
      username: autoUsername,
      password: autoPassword,
      profile: { name: fullName, mobile, email },
      unitId: assignedUnit,
    });
    if (!result.ok) {
      setStatus(result.message || "Unable to create user.");
      return;
    }
    setStatus(
      `User ${result.user.username} created for Unit ${result.user.unit}.`,
    );
    setFullName("");
    setMobile("");
    setEmail("");
    setIsComplete(true);
    requestAnimationFrame(() => {
      const editorEl = document.querySelector(".tiptap");
      if (editorEl instanceof HTMLElement) {
        editorEl.focus();
      }
    });
  };

  if (isComplete) {
    return null;
  }

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
      {assignedUnit ? (
        <div
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.55)",
            marginBottom: "12px",
          }}
        >
          Credentials auto-set: unit{assignedUnit} / Unit@{assignedUnit}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: "10px" }}>
        <input
          value={fullName}
          onChange={(event) => setFullName(event.target.value)}
          placeholder="Full name"
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
          }}
        />
        <input
          value={mobile}
          onChange={(event) => setMobile(event.target.value)}
          placeholder="Mobile number"
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
          }}
        />
        <input
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email address"
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "1px solid rgba(255,255,255,0.15)",
            background: "rgba(255,255,255,0.05)",
            color: "white",
          }}
        />
        <button
          type="submit"
          style={{
            padding: "10px",
            borderRadius: "10px",
            border: "none",
            background: "#22d3ee",
            color: "#0b0f14",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Create user
        </button>
      </form>

      {status ? (
        <div style={{ marginTop: "10px", fontSize: "12px", color: "#a5f3fc" }}>
          {status}
        </div>
      ) : null}
    </div>
  );
}
