"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Suspense, useEffect, useState } from "react";
import { ArrowLeft, Lock, Unlock } from "lucide-react";
import { useAuth } from "../../lib/auth";
import { getUnitSnapshot } from "../../lib/residence-data";
import Dither from "../../components/Dither";

const backgroundImageLink = "https://image2url.com/r2/default/images/1770320864965-a1fac360-b36d-483d-9d73-75c8339f9e24.png";
const securityBackgroundImage = `radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.9) 100%), url('${backgroundImageLink}')`;

const securityContainerStyle = {
  minHeight: '100vh',
  position: 'relative',
  backgroundColor: '#050505',
  backgroundImage: securityBackgroundImage,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: '40px',
  fontFamily: 'sans-serif',
};

function SecurityRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  
  const unitNumber = searchParams.get('unit');
  const [isLocked, setIsLocked] = useState(true);

  const snapshot = unitNumber ? getUnitSnapshot(unitNumber) : null;
  const security = snapshot?.security;

  useEffect(() => {
    if (!unitNumber) router.push("/");
  }, [unitNumber, router]);

  useEffect(() => {
    if (!user || !unitNumber) return;
    if (user.role === "user" && user.unit && unitNumber !== user.unit) {
      router.replace(`/security?unit=${user.unit}`);
    }
  }, [user, unitNumber, router]);

  if (!unitNumber) {
    return <div className="aura-hqBg" style={securityContainerStyle} />;
  }

  return (
    <div className="aura-hqBg" style={securityContainerStyle}>
      <div className="dither-layer">
        <Dither enableMouseInteraction={false} />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* DYNAMIC HUD */}
        <div style={{ 
          position: 'absolute', top: '20px', right: '40px', 
          color: '#ff0055', border: '1px solid #ff0055', 
          padding: '5px 20px', borderRadius: '4px', fontSize: '12px',
          letterSpacing: '2px', backgroundColor: 'rgba(0, 0, 0, 0.7)',
          backdropFilter: 'blur(3px)'
        }}>
          SECURE CHANNEL: UNIT_{unitNumber}
        </div>

        {/* Navigation Header */}
        <nav style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "20px", 
          marginBottom: "60px",
          backdropFilter: "blur(4px)",
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
            onClick={() => router.push(`/dashboard?unit=${unitNumber}`)}
            style={{ 
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", 
              color: "white", padding: "10px", borderRadius: "12px", cursor: "pointer" 
            }}
          >
            <ArrowLeft size={20} />
          </button>
          <h1 style={{ fontSize: "24px", fontWeight: "200", letterSpacing: "4px", margin: 0 }}>SECURITY COMMAND</h1>
        </nav>

        {/* Security Interface Content */}
        <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
          <motion.div 
            animate={{ scale: isLocked ? 1 : 1.05 }}
            style={{ 
              width: '220px', height: '220px', margin: '0 auto 40px',
              borderRadius: '50%', border: `2px solid ${isLocked ? '#ff0055' : '#00ff88'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: `0 0 40px ${isLocked ? 'rgba(255, 0, 85, 0.3)' : 'rgba(0, 255, 136, 0.3)'}`,
              backgroundColor: 'rgba(0,0,0,0.6)',
              backdropFilter: 'blur(4px)'
            }}
          >
            {isLocked ? <Lock size={90} color="#ff0055" /> : <Unlock size={90} color="#00ff88" />}
          </motion.div>

          <h2 style={{ fontSize: '32px', marginBottom: '10px', textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>
            Main Entrance: {isLocked ? "LOCKED" : "UNLOCKED"}
          </h2>
          <p style={{ color: '#aaa', marginBottom: '10px', letterSpacing: '1px' }}>
            Biometric Authorization for Unit {unitNumber} Verified
          </p>
          <p style={{ color: '#888', marginBottom: '40px', letterSpacing: '1px' }}>
            Last Scan: {security?.lastScan || "--"} • Cameras Online: {security?.camerasOnline ?? "--"} • Alerts: {security?.alerts ?? "--"}
          </p>

          <motion.button 
            onClick={() => setIsLocked(!isLocked)}
            whileHover={{ scale: 1.05 }}
            style={{
              padding: '18px 50px', borderRadius: '50px', border: 'none',
              backgroundColor: isLocked ? '#00ff88' : '#ff0055',
              color: 'black', fontWeight: 'bold', cursor: 'pointer', fontSize: '16px',
              boxShadow: '0 10px 20px rgba(0,0,0,0.3)',
              transition: 'background-color 0.3s ease, box-shadow 0.3s ease'
            }}
          >
            {isLocked ? "UNLOCK DOOR" : "SECURE DOOR"}
          </motion.button>
        </div>
      </div>
    </div>
  );
}

export default function SecurityRoom() {
  return (
    <Suspense fallback={<div style={securityContainerStyle} />}>
      <SecurityRoomContent />
    </Suspense>
  );
}
