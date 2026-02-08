"use client";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Added useSearchParams
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Droplets, Flame, Sun } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { getUnitSnapshot } from "../../lib/residence-data";
import Lightning from "../../components/Lightning";
import Water from "../../components/Water";
import GasEffect from "../../components/GasEffect";
import SunRays from "../../components/SunRays";
import ColorBends from "../../components/ColorBends";

const utilitiesContainerStyle = {
  minHeight: '100vh',
  position: 'relative',
  backgroundColor: '#000000',
  color: 'white',
  padding: '40px',
  fontFamily: 'sans-serif',
};

function UtilitiesRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const [showLightning, setShowLightning] = useState(false);
  const [showWater, setShowWater] = useState(false);
  const [showGas, setShowGas] = useState(false);
  const [showSolar, setShowSolar] = useState(false);

  // 2. Capture the unit number from the URL
  const unitNumber = searchParams.get('unit');

  useEffect(() => {
    if (!unitNumber) router.push("/");
  }, [unitNumber, router]);

  useEffect(() => {
    if (!user || !unitNumber) return;
    if (user.role === "user" && user.unit && unitNumber !== user.unit) {
      router.replace(`/utilities?unit=${user.unit}`);
    }
  }, [user, unitNumber, router]);

  if (!unitNumber) {
    return <div className="aura-hqBg" style={utilitiesContainerStyle} />;
  }

  const snapshot = getUnitSnapshot(unitNumber);
  const utilities = snapshot?.utilities;

  const stats = [
    {
      name: "Electricity",
      icon: <Zap />,
      value: utilities ? String(utilities.electricityKwh) : "--",
      unit: "kWh",
      status: "Normal",
      color: "#facc15",
    },
    {
      name: "Water",
      icon: <Droplets />,
      value: utilities ? String(utilities.waterLitres) : "--",
      unit: "Litres",
      status: "Optimal",
      color: "#60a5fa",
    },
    {
      name: "Natural Gas",
      icon: <Flame />,
      value: utilities ? String(utilities.gasM3) : "--",
      unit: "m³",
      status: "Low",
      color: "#fb923c",
    },
    {
      name: "Solar Power",
      icon: <Sun />,
      value: utilities ? `+${utilities.solarKwh}` : "--",
      unit: "kWh",
      status: "Charging",
      color: "#4ade80",
    },
  ];

  return (
    <div className="aura-hqBg" style={utilitiesContainerStyle}>
      <div className="color-bends-layer">
        <ColorBends
          colors={["#0b0f17", "#10304a", "#0f6b7a", "#10c6d0"]}
          speed={0.12}
          warpStrength={0.85}
          frequency={1.1}
          noise={0.08}
          transparent
        />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 3. DYNAMIC UNIT HUD */}
        <div style={{ 
          position: 'absolute', top: '20px', right: '40px', 
          color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.4)', 
          padding: '5px 15px', borderRadius: '4px', fontSize: '12px',
          backgroundColor: 'rgba(0,0,0,0.5)', letterSpacing: '2px'
        }}>
          LOGGED IN: UNIT {unitNumber}
        </div>

        {/* Navigation */}
        <nav style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "20px", 
          marginBottom: "60px",
          backdropFilter: "none",
          padding: "10px",
          borderRadius: "15px",
          position: "relative",
          zIndex: 2
        }}>
          <div style={{ display: "flex", gap: "8px" }}>
            {user?.role === "admin" ? (
              <button
                type="button"
                onClick={() => router.push("/")}
                style={{
                  background: "rgba(0,0,0,0.7)",
                  border: "1px solid rgba(0,242,255,0.5)",
                  color: "#eaffff",
                  padding: "8px 14px",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontSize: "11px",
                  letterSpacing: "2px",
                  boxShadow: "0 0 14px rgba(0,242,255,0.25)",
                }}
              >
                HOME
              </button>
            ) : null}
            <button
              type="button"
              onClick={() => {
                logout();
                router.replace("/login");
              }}
              style={{
                background: "rgba(0,0,0,0.7)",
                border: "1px solid rgba(255,80,120,0.6)",
                color: "#ffe6ef",
                padding: "8px 14px",
                borderRadius: "10px",
                cursor: "pointer",
                fontSize: "11px",
                letterSpacing: "2px",
                boxShadow: "0 0 14px rgba(255,80,120,0.25)",
              }}
            >
              LOG OUT
            </button>
          </div>
          <button 
            // 4. PERSISTENCE: Return to Dashboard while keeping the unit number
            onClick={() => router.push(`/dashboard?unit=${unitNumber}`)}
            style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px", borderRadius: "12px", cursor: "pointer" }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: "200", letterSpacing: "4px", margin: 0 }}>UTILITIES CONTROL</h1>
        </nav>

        {/* Stats Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "25px" }}>
          {stats.map((item, index) => {
            const isBordered = item.name === "Water" || item.name === "Natural Gas";
            const isWaterActive = item.name === "Water" && showWater;
            const isSolarActive = item.name === "Solar Power" && showSolar;
            const isTextBoosted = isWaterActive || isSolarActive;
            return (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5, borderColor: item.color }}
                onMouseEnter={() => {
                  if (item.name === "Electricity") setShowLightning(true);
                  if (item.name === "Water") setShowWater(true);
                  if (item.name === "Natural Gas") setShowGas(true);
                  if (item.name === "Solar Power") setShowSolar(true);
                }}
                onMouseLeave={() => {
                  if (item.name === "Electricity") setShowLightning(false);
                  if (item.name === "Water") setShowWater(false);
                  if (item.name === "Natural Gas") setShowGas(false);
                  if (item.name === "Solar Power") setShowSolar(false);
                }}
                onClick={() => {
                  if (item.name === "Electricity") setShowLightning(!showLightning);
                  if (item.name === "Water") setShowWater(!showWater);
                  if (item.name === "Natural Gas") setShowGas((s) => !s);
                  if (item.name === "Solar Power") setShowSolar((s) => !s);
                }}
                onPointerEnter={() => {
                  if (item.name === "Electricity") setShowLightning(true);
                  if (item.name === "Water") setShowWater(true);
                }}
                onPointerLeave={() => {
                  if (item.name === "Electricity") setShowLightning(false);
                  if (item.name === "Water") setShowWater(false);
                }}
                onPointerDown={() => {
                  if (item.name === "Electricity") setShowLightning((s) => !s);
                  if (item.name === "Water") setShowWater((s) => !s);
                }}
                style={{
                  backgroundColor: "rgba(0,0,0,0.6)",
                  border: isBordered ? `2px solid ${item.color}` : "1px solid rgba(255,255,255,0.1)",
                  padding: "30px",
                  borderRadius: "24px",
                  position: "relative",
                  overflow: "hidden",
                  backdropFilter: "none",
                  cursor:
                    item.name === "Electricity" ||
                    item.name === "Water" ||
                    item.name === "Natural Gas" ||
                    item.name === "Solar Power"
                      ? "pointer"
                      : "default",
                  boxShadow: isBordered ? `0 10px 30px ${item.color}22` : undefined,
                }}
              >
                {item.name === "Electricity" && showLightning && (
                  <>
                    {/* Inside fill */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                      }}
                    >
                      <Lightning hue={60} speed={2} intensity={0.6} size={2} />
                    </div>
                    {/* Top edge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: "20px",
                        zIndex: 2,
                        clipPath: "inset(0 0 calc(100% - 2px) 0)",
                      }}
                    >
                      <Lightning hue={60} speed={2} intensity={1} size={2} />
                    </div>
                    {/* Right edge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        bottom: 0,
                        width: "20px",
                        zIndex: 2,
                        clipPath: "inset(0 0 0 calc(100% - 2px))",
                      }}
                    >
                      <Lightning hue={60} speed={2} intensity={1} size={2} />
                    </div>
                    {/* Bottom edge */}
                    <div
                      style={{
                        position: "absolute",
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: "20px",
                        zIndex: 2,
                        clipPath: "inset(calc(100% - 2px) 0 0 0)",
                      }}
                    >
                      <Lightning hue={60} speed={2} intensity={1} size={2} />
                    </div>
                    {/* Left edge */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        bottom: 0,
                        width: "20px",
                        zIndex: 2,
                        clipPath: "inset(0 calc(100% - 2px) 0 0)",
                      }}
                    >
                      <Lightning hue={60} speed={2} intensity={1} size={2} />
                    </div>
                  </>
                )}
                {item.name === "Water" && showWater && (
                  <>
                    {/* Inside water droplet splash effect */}
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                      }}
                    >
                      <Water />
                    </div>
                  </>
                )}
                {item.name === "Natural Gas" && showGas && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                      }}
                    >
                      <GasEffect intensity={0.9} />
                    </div>
                  </>
                )}
                {item.name === "Solar Power" && showSolar && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        zIndex: 1,
                      }}
                    >
                      <SunRays intensity={0.9} />
                    </div>
                  </>
                )}
                <div
                  style={{
                    position: "absolute",
                    top: "-20px",
                    right: "-20px",
                    width: "100px",
                    height: "100px",
                    background: item.color,
                    filter: "blur(50px)",
                    opacity: 0.2,
                  }}
                />

                <div
                  style={{
                    color: item.color,
                    marginBottom: "20px",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  {item.icon}
                </div>

                <h3
                  style={{
                    fontSize: "14px",
                    color: isTextBoosted
                      ? "rgba(255,255,255,0.9)"
                      : "rgba(255,255,255,0.4)",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    margin: "0 0 10px 0",
                    position: "relative",
                    zIndex: 2,
                    textShadow: isTextBoosted
                      ? "0 2px 10px rgba(0,0,0,0.8)"
                      : "none",
                  }}
                >
                  {item.name}
                </h3>

                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  <span
                    style={{
                      fontSize: "42px",
                      fontWeight: "bold",
                      letterSpacing: "-2px",
                      color: isTextBoosted ? "#ffffff" : "inherit",
                      textShadow: isTextBoosted
                        ? "0 3px 12px rgba(0,0,0,0.85)"
                        : "none",
                    }}
                  >
                    {item.value}
                  </span>
                  <span
                    style={{
                      color: isTextBoosted
                        ? "rgba(255,255,255,0.7)"
                        : "rgba(255,255,255,0.3)",
                      fontWeight: "bold",
                      textShadow: isTextBoosted
                        ? "0 2px 8px rgba(0,0,0,0.8)"
                        : "none",
                    }}
                  >
                    {item.unit}
                  </span>
                </div>

                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    position: "relative",
                    zIndex: 2,
                    textShadow: isTextBoosted
                      ? "0 2px 8px rgba(0,0,0,0.8)"
                      : "none",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      background: "#4ade80",
                      boxShadow: "0 0 10px #4ade80",
                    }}
                  />
                  <span
                    style={{
                      fontSize: "12px",
                      color: "#4ade80",
                      textTransform: "uppercase",
                      fontWeight: "bold",
                    }}
                  >
                    {item.status}
                  </span>
                </div>
              </motion.div>
            );
        })}
      </div>
    </div>
    </div>
  );
}

export default function UtilitiesRoom() {
  return (
    <Suspense fallback={<div style={utilitiesContainerStyle} />}>
      <UtilitiesRoomContent />
    </Suspense>
  );
}
