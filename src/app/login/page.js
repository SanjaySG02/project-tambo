"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { GridScan } from "../../components/GridScan";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    const result = login(username.trim(), password);
    if (!result.ok) {
      setError(result.message);
      return;
    }
    setError("");
    if (result.user.role === "admin") {
      router.push("/");
      return;
    }
    router.push(`/dashboard?unit=${result.user.unit}`);
  };

  return (
    <div
      className="aura-hqBg"
      style={{
        position: "relative",
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#04070f",
        color: "white",
        fontFamily: "sans-serif",
        overflow: "hidden",
      }}
    >
      <GridScan
        className="gridscan"
        style={{ zIndex: 0 }}
        enableWebcam={false}
        showPreview={false}
        scanColor="#2ad9ff"
        linesColor="#0f1a2b"
        gridScale={0.1}
        lineThickness={0.8}
        scanOpacity={0.22}
        scanGlow={0.35}
        scanSoftness={2.8}
        scanDuration={3.2}
        scanDelay={2.6}
        noiseIntensity={0.006}
        bloomIntensity={0.08}
        chromaticAberration={0.0006}
      />
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "420px",
          padding: "40px",
          borderRadius: "24px",
          background: "rgba(0,0,0,0.7)",
          border: "1px solid rgba(255,255,255,0.12)",
          backdropFilter: "blur(8px)",
          boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <Lock size={32} color="#00f2ff" style={{ marginBottom: "10px" }} />
          <h1 style={{ margin: 0, fontSize: "22px", letterSpacing: "6px" }}>ACCESS LOGIN</h1>
          <p style={{ margin: "8px 0 0", color: "rgba(255,255,255,0.6)", fontSize: "12px" }}>
            Enter authorized credentials to continue.
          </p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: "grid", gap: "16px" }}>
          <label style={{ display: "grid", gap: "8px", fontSize: "12px", letterSpacing: "2px" }}>
            USERNAME
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                padding: "12px 14px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <User size={16} color="#00f2ff" />
              <input
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="username"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>
          </label>

          <label style={{ display: "grid", gap: "8px", fontSize: "12px", letterSpacing: "2px" }}>
            PASSWORD
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                background: "rgba(255,255,255,0.05)",
                borderRadius: "12px",
                padding: "12px 14px",
                border: "1px solid rgba(255,255,255,0.12)",
              }}
            >
              <Lock size={16} color="#00f2ff" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="password"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  color: "white",
                  outline: "none",
                }}
              />
            </div>
          </label>

          {error ? (
            <div style={{ color: "#ff5c8a", fontSize: "12px" }}>{error}</div>
          ) : null}

          <button
            type="submit"
            style={{
              marginTop: "8px",
              background: "#00f2ff",
              border: "none",
              color: "#02040a",
              padding: "12px",
              borderRadius: "12px",
              fontWeight: "bold",
              letterSpacing: "2px",
              cursor: "pointer",
            }}
          >
            SIGN IN
          </button>
        </form>
      </div>
    </div>
  );
}
