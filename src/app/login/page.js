"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User } from "lucide-react";
import { useAuth } from "../../lib/auth";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const backgroundImageLink =
    "https://image2url.com/r2/default/images/1770320864965-a1fac360-b36d-483d-9d73-75c8339f9e24.png";

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
        height: "100vh",
        width: "100vw",
        backgroundColor: "#03060f",
        backgroundImage: `radial-gradient(circle at center, rgba(3,6,15,0.3) 0%, rgba(3,6,15,0.9) 100%), url('${backgroundImageLink}')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "white",
        fontFamily: "sans-serif",
      }}
    >
      <div
        style={{
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
