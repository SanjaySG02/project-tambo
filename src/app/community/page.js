"use client";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Added useSearchParams
import { motion } from "framer-motion";
import { ArrowLeft, Calendar, Users, Bell, Send } from "lucide-react";
import { Suspense, useEffect } from "react";
import { useAuth } from "../../lib/auth";
import { UNIT_IDS, getUnitSnapshot } from "../../lib/residence-data";
import ColorBends from "../../components/ColorBends";

const communityContainerStyle = {
  minHeight: '100vh',
  position: 'relative',
  backgroundColor: '#000000',
  color: 'white',
  padding: '40px',
  fontFamily: 'sans-serif',
};

function CommunityRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();

  // 2. Capture the unit number from the URL
  const unitNumber = searchParams.get('unit');

  useEffect(() => {
    if (!unitNumber) router.push("/");
  }, [unitNumber, router]);

  useEffect(() => {
    if (!user || !unitNumber) return;
    if (user.role === "user" && user.unit && unitNumber !== user.unit) {
      router.replace(`/community?unit=${user.unit}`);
    }
  }, [user, unitNumber, router]);

  if (!unitNumber) {
    return <div className="aura-hqBg" style={communityContainerStyle} />;
  }

  const snapshot = getUnitSnapshot(unitNumber);
  const announcements = snapshot?.community?.announcements || [];
  const mood = snapshot?.community?.mood || "--";

  const otherUnits = UNIT_IDS.filter((id) => id !== unitNumber).slice(0, 2);
  const neighborA = otherUnits[0] || unitNumber;
  const neighborB = otherUnits[1] || unitNumber;
  const neighborASnapshot = getUnitSnapshot(neighborA);
  const neighborBSnapshot = getUnitSnapshot(neighborB);
  const neighborAName = neighborASnapshot?.resident || `Resident ${neighborA}`;
  const neighborBName = neighborBSnapshot?.resident || `Resident ${neighborB}`;

  const announcementCards = announcements.map((text, index) => {
    const fallback = { icon: <Calendar size={18} />, color: "#ffaa00" };
    if (text.toLowerCase().includes("maintenance")) {
      return { id: index + 1, title: text, icon: <Bell size={18} />, color: "#ef4444" };
    }
    if (text.toLowerCase().includes("yoga") || text.toLowerCase().includes("class")) {
      return { id: index + 1, title: text, icon: <Users size={18} />, color: "#00ff88" };
    }
    return { id: index + 1, title: text, ...fallback };
  });

  return (
    <div className="aura-hqBg" style={communityContainerStyle}>
      <div className="color-bends-layer">
        <ColorBends
          colors={["#1a1207", "#402a0c", "#ffaa00", "#ffdd99"]}
          speed={0.11}
          warpStrength={0.85}
          frequency={1.15}
          noise={0.08}
          transparent
        />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 3. DYNAMIC UNIT HUD (Shows who is chatting) */}
        <div style={{ 
          position: 'absolute', top: '20px', right: '40px', 
          color: '#ffaa00', border: '1px solid rgba(255, 170, 0, 0.4)', 
          padding: '5px 15px', borderRadius: '4px', fontSize: '11px',
          backgroundColor: 'rgba(0,0,0,0.6)', letterSpacing: '2px', backdropFilter: 'none'
        }}>
          LOGGED IN: UNIT {unitNumber}
        </div>

        {/* Navigation */}
        <nav style={{ 
          display: "flex", 
          alignItems: "center", 
          gap: "20px", 
          marginBottom: "40px",
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
          <h1 style={{ fontSize: "24px", fontWeight: "200", letterSpacing: "4px", color: "#ffaa00", margin: 0 }}>COMMUNITY HUB</h1>
        </nav>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "40px" }}>
        
        {/* LEFT: NOTICE BOARD */}
        <div>
          <h2 style={{ fontSize: "12px", color: "rgba(255,255,255,0.5)", letterSpacing: "2px", marginBottom: "20px" }}>NOTICE BOARD</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
            {announcementCards.map((item) => (
              <motion.div 
                key={item.id}
                whileHover={{ x: 10, backgroundColor: "rgba(255,255,255,0.1)" }}
                style={{ 
                  backgroundColor: "rgba(0,0,0,0.6)", 
                  border: "1px solid rgba(255,255,255,0.1)", 
                  borderRadius: "20px", 
                  padding: "20px", 
                  display: "flex", 
                  gap: "20px", 
                  alignItems: "center",
                  backdropFilter: "none"
                }}
              >
                <div style={{ color: item.color }}>{item.icon}</div>
                <div>
                  <h3 style={{ margin: 0, fontSize: "16px" }}>{item.title}</h3>
                  <p style={{ margin: "5px 0 0", fontSize: "12px", color: "rgba(255,255,255,0.4)" }}>Unit mood: {mood}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* RIGHT: CHAT BOX */}
        <div style={{ 
          backgroundColor: "rgba(0,0,0,0.7)", 
          border: "1px solid rgba(255,255,255,0.1)", 
          borderRadius: "30px", 
          padding: "30px", 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "space-between", 
          height: "450px",
          backdropFilter: "none"
        }}>
          <div style={{ overflowY: "auto", paddingRight: "10px" }}>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ color: "#ffaa00", fontSize: "12px", fontWeight: "bold" }}>
                {neighborAName} (Unit {neighborA})
              </span>
              <p style={{ margin: "5px 0", color: "#ddd" }}>
                Anyone else attending the rooftop BBQ?
              </p>
            </div>
            <div style={{ marginBottom: "20px" }}>
              <span style={{ color: "#00ff88", fontSize: "12px", fontWeight: "bold" }}>
                {neighborBName} (Unit {neighborB})
              </span>
              <p style={{ margin: "5px 0", color: "#ddd" }}>
                I can bring chairs if needed.
              </p>
            </div>
            {/* 5. USER'S OWN MESSAGE CONTEXT */}
            <div>
              <span style={{ color: "#00f2ff", fontSize: "12px", fontWeight: "bold" }}>You (Unit {unitNumber})</span>
              <p style={{ margin: "5px 0", color: "#ddd", fontStyle: "italic" }}>
                Connected to the Unit {unitNumber} community feed.
              </p>
            </div>
          </div>

          <div style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
            <input 
              type="text" 
              placeholder={`Message as Unit ${unitNumber}...`} 
              style={{ 
                flex: 1, 
                padding: "12px", 
                borderRadius: "10px", 
                border: "1px solid rgba(255,255,255,0.2)", 
                backgroundColor: "rgba(255,255,255,0.05)", 
                color: "white", 
                outline: "none" 
              }} 
            />
            <button style={{ background: "#ffaa00", border: "none", padding: "10px 20px", borderRadius: "10px", cursor: "pointer" }}>
              <Send size={18} color="black" />
            </button>
          </div>
        </div>

        </div>
      </div>
    </div>
  );
}

export default function CommunityRoom() {
  return (
    <Suspense fallback={<div style={communityContainerStyle} />}>
      <CommunityRoomContent />
    </Suspense>
  );
}
