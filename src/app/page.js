"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { Building2, ChevronLeft, ChevronRight, Home, Sparkles, Send } from "lucide-react";
import { useTransitionIntent } from "../components/aura/transition-intent";
import { useAuth } from "../lib/auth";
import Galaxy from "../components/Galaxy";
import LightPillar from "../components/LightPillar";
import { UNIT_IDS, getUnitSnapshot } from "../lib/residence-data";

export default function LobbyPage() {
  const router = useRouter();
  const { setIntent } = useTransitionIntent();
  const { user, logout, getProfileForUnit } = useAuth();
  const [command, setCommand] = useState("");
  const [aiMessage, setAiMessage] = useState("Lobby Terminal Active. Select a Unit.");
  const [hoveredUnit, setHoveredUnit] = useState(null);
  const [pageIndex, setPageIndex] = useState(0);
  const [showProfiles, setShowProfiles] = useState(false);

  const lobbyBg = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

  const flats = useMemo(
    () =>
      UNIT_IDS.map((id) => {
        const snapshot = getUnitSnapshot(id);
        const profile = getProfileForUnit(id);
        const isAssigned = Boolean(
          profile?.name || profile?.mobile || profile?.email,
        );
        const floor = id.slice(0, 1);
        const typeMap = {
          "1": "Studio",
          "2": "Deluxe",
          "3": "Skyline",
          "4": "Penthouse",
          "5": "Executive",
        };
        return {
          id,
          type: typeMap[floor] || "Residence",
          status: isAssigned ? "Occupied" : "Vacant",
        };
      }),
    [getProfileForUnit],
  );

  const pageSize = 4;
  const pageCount = Math.max(1, Math.ceil(flats.length / pageSize));
  const isAdmin = user?.role === "admin";
  const pagedFlats = flats.slice(pageIndex * pageSize, (pageIndex + 1) * pageSize);
  const visibleFlats = isAdmin
    ? pagedFlats
    : flats.filter((flat) => flat.id === user?.unit);
  const allowedUnits = isAdmin
    ? flats.map((flat) => flat.id)
    : flats.filter((flat) => flat.id === user?.unit).map((flat) => flat.id);

  useEffect(() => {
    if (!isAdmin) {
      setPageIndex(0);
      return;
    }
    if (pageIndex > pageCount - 1) {
      setPageIndex(pageCount - 1);
    }
  }, [isAdmin, pageIndex, pageCount]);

  useEffect(() => {
    if (user?.role === "user" && user.unit) {
      router.replace(`/dashboard?unit=${user.unit}`);
    }
  }, [user, router]);

  // 1. DEFINE GLOBAL ROOMS FOR FULL ACCESS
  const rooms = [
    { name: "UTILITIES", sector: "utilities", path: "/utilities", keywords: ["bill", "electricity", "water", "gas", "energy"] },
    { name: "SECURITY", sector: "security", path: "/security", keywords: ["lock", "camera", "safe", "alarm", "entrance"] },
    { name: "AMENITIES", sector: "amenities", path: "/amenities", keywords: ["gym", "pool", "park", "lounge", "workout"] },
    { name: "COMMUNITY", sector: "community", path: "/community", keywords: ["chat", "neighbors", "event", "hub"] }
  ];

  useEffect(() => {
    allowedUnits.forEach((id) => {
      router.prefetch(`/dashboard?unit=${id}`);
    });
  }, [allowedUnits, router]);

  const handleAiCommand = (e) => {
    e.preventDefault();
    const input = command.toLowerCase();

    if (input.includes("login")) {
      setAiMessage("Redirecting to Login...");
      logout();
      router.replace("/login");
      setCommand("");
      return;
    }
    if (input.includes("home")) {
      setAiMessage("Returning to Home...");
      router.push("/");
      setCommand("");
      return;
    }
    
    // 2. EXTRACT UNIT NUMBER (Scans for any digits in the input)
    const numberMatch = input.match(/\d+/);
    const targetUnitId = numberMatch ? numberMatch[0] : null;

    // 3. IDENTIFY TARGET ROOM
    const targetRoom = rooms.find(room => 
      input.includes(room.name.toLowerCase()) || 
      room.keywords.some(k => input.includes(k))
    );

    // 4. MASTER ROUTING LOGIC
    if (targetUnitId && targetRoom) {
      if (!allowedUnits.includes(targetUnitId)) {
        setAiMessage(`Unit ${targetUnitId} not found. Available: ${allowedUnits.join(", ")}.`);
        setCommand("");
        return;
      }
      // Scenario: "Go to Gym of 201"
      setAiMessage(`Direct Access: ${targetRoom.name} - Unit ${targetUnitId}...`);
      setIntent({ type: "door", sector: targetRoom.sector, unit: targetUnitId });
      router.push(`${targetRoom.path}?unit=${targetUnitId}`);
      
    } else if (targetUnitId) {
      if (!allowedUnits.includes(targetUnitId)) {
        setAiMessage(`Unit ${targetUnitId} not found. Available: ${allowedUnits.join(", ")}.`);
        setCommand("");
        return;
      }
      // Scenario: "Go to 201" or "Open 201"
      setAiMessage(`Authenticating Unit ${targetUnitId}... Access Granted.`);
      setIntent({ type: "unit", unit: targetUnitId });
      router.push(`/dashboard?unit=${targetUnitId}`);
      
    } else if (targetRoom) {
      // Scenario: "Show me the Gym" (User forgot unit)
      setAiMessage(`Which unit for ${targetRoom.name}? (e.g., 'Gym 101')`);
      
    } else {
      setAiMessage("Access Denied. Specify Unit and Destination.");
    }

    setCommand("");
  };

  return (
    <div className="aura-hqBg" style={{ 
      height: '100vh', width: '100vw', backgroundColor: '#000',
      backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.4) 0%, rgba(0,0,0,1) 100%), url('${lobbyBg}')`,
      backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      color: 'white', fontFamily: 'sans-serif', overflow: 'hidden', position: 'relative'
    }}>
      {isAdmin ? (
        <div style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <LightPillar
            topColor="#4fd5ff"
            bottomColor="#ff9ffc"
            intensity={0.6}
            rotationSpeed={0.2}
            glowAmount={0.004}
            pillarWidth={2.4}
            pillarHeight={0.35}
            noiseIntensity={0.35}
            mixBlendMode="screen"
            pillarRotation={15}
            quality="medium"
          />
        </div>
      ) : null}
      
      <div style={{ textAlign: 'center', marginBottom: '40px', zIndex: 1 }}>
        <Building2 size={40} color="#00f2ff" style={{ marginBottom: '10px' }} />
        <h1 style={{ letterSpacing: '8px', fontWeight: '200', fontSize: '24px', margin: 0 }}>RESIDENCE DIRECTORY</h1>
      </div>

      <div style={{ position: "absolute", top: "20px", left: "20px", display: "flex", gap: "8px", zIndex: 2 }}>
        {isAdmin ? (
          <button
            type="button"
            onClick={() => setShowProfiles(true)}
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
            PROFILES
          </button>
        ) : null}
        <button
          onClick={logout}
          style={{
            background: "rgba(255,255,255,0.08)",
            border: "1px solid rgba(255,255,255,0.2)",
            color: "white",
            padding: "8px 14px",
            borderRadius: "10px",
            cursor: "pointer",
            fontSize: "11px",
            letterSpacing: "2px",
          }}
        >
          LOG OUT
        </button>
      </div>

      {showProfiles ? (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.6)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 40,
          }}
        >
          <div
            style={{
              width: "640px",
              maxHeight: "80vh",
              overflow: "auto",
              padding: "24px",
              borderRadius: "20px",
              background: "rgba(8, 12, 18, 0.95)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              color: "white",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
              <div style={{ fontSize: "14px", letterSpacing: "2px", color: "#00f2ff" }}>
                UNIT PROFILES
              </div>
              <button
                type="button"
                onClick={() => setShowProfiles(false)}
                style={{
                  background: "transparent",
                  border: "1px solid rgba(255,255,255,0.2)",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "8px",
                  cursor: "pointer",
                  fontSize: "11px",
                }}
              >
                CLOSE
              </button>
            </div>
            <div style={{ display: "grid", gap: "12px" }}>
              {UNIT_IDS.map((unitId) => {
                const profile = getProfileForUnit(unitId);
                return (
                  <div
                    key={unitId}
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(255,255,255,0.04)",
                      border: "1px solid rgba(255,255,255,0.08)",
                    }}
                  >
                    <div style={{ fontSize: "11px", letterSpacing: "2px", color: "#00f2ff" }}>
                      UNIT {unitId}
                    </div>
                    <div style={{ marginTop: "8px", fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>
                      Name: {profile.name || ""}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>
                      Mobile: {profile.mobile || ""}
                    </div>
                    <div style={{ fontSize: "12px", color: "rgba(255,255,255,0.75)" }}>
                      Email: {profile.email || ""}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '24px', zIndex: 1 }}>
        {visibleFlats.map((flat) => (
          <motion.div
            key={flat.id}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 242, 255, 0.1)' }}
            style={{
              width: '260px', padding: '25px', backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px',
              cursor: 'pointer', backdropFilter: 'blur(4px)', touchAction: 'manipulation',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              position: 'relative'
            }}
            onHoverStart={() => setHoveredUnit(flat.id)}
            onHoverEnd={() => setHoveredUnit(null)}
            role="button"
            tabIndex={0}
            onPointerDown={() => {
              setIntent({ type: "unit", unit: flat.id });
              router.push(`/dashboard?unit=${flat.id}`);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                setIntent({ type: "unit", unit: flat.id });
                router.push(`/dashboard?unit=${flat.id}`);
              }
            }}
          >
            {hoveredUnit === flat.id && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '15px',
                  overflow: 'hidden',
                  zIndex: 0,
                  pointerEvents: 'none'
                }}
              >
                <Galaxy
                  density={1.4}
                  hueShift={210}
                  glowIntensity={0.55}
                  saturation={0.25}
                  twinkleIntensity={0.5}
                  rotationSpeed={0.2}
                  speed={1.6}
                  transparent={true}
                />
              </div>
            )}
            <div style={{ position: 'relative', zIndex: 1 }}>
              <h2 style={{ fontSize: '24px', margin: 0 }}>UNIT {flat.id}</h2>
              <span style={{ fontSize: '10px', color: '#00f2ff', opacity: 0.7 }}>{flat.type}</span>
            </div>
            <Home size={20} color="#00f2ff" style={{ position: 'relative', zIndex: 1 }} />
          </motion.div>
        ))}
      </div>

      {isAdmin && pageCount > 1 ? (
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px", zIndex: 1 }}>
          <button
            type="button"
            onClick={() => setPageIndex((prev) => Math.max(prev - 1, 0))}
            disabled={pageIndex === 0}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "10px",
              cursor: pageIndex === 0 ? "not-allowed" : "pointer",
              opacity: pageIndex === 0 ? 0.4 : 1,
            }}
          >
            <ChevronLeft size={16} />
          </button>
          <div style={{ fontSize: "11px", letterSpacing: "2px", color: "rgba(255,255,255,0.7)" }}>
            PAGE {pageIndex + 1} / {pageCount}
          </div>
          <button
            type="button"
            onClick={() => setPageIndex((prev) => Math.min(prev + 1, pageCount - 1))}
            disabled={pageIndex === pageCount - 1}
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "white",
              padding: "8px 12px",
              borderRadius: "10px",
              cursor: pageIndex === pageCount - 1 ? "not-allowed" : "pointer",
              opacity: pageIndex === pageCount - 1 ? 0.4 : 1,
            }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      ) : null}

      {/* AI COMMAND BOX */}
        <motion.div style={{
          width: '450px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '20px',
          borderRadius: '20px', border: '1px solid rgba(0, 242, 255, 0.3)', backdropFilter: 'blur(8px)', zIndex: 1
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
          <Sparkles size={14} color="#00f2ff" />
          <span style={{ fontSize: '11px', color: '#00f2ff', letterSpacing: '1px' }}>{aiMessage}</span>
        </div>
        <form onSubmit={handleAiCommand} style={{ display: 'flex', gap: '10px' }}>
          <input 
            value={command} onChange={(e) => setCommand(e.target.value)}
            placeholder="Search unit or room (e.g. 'Gym 201')"
            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: 'none', padding: '12px', borderRadius: '10px', color: 'white', outline: 'none' }}
          />
          <button type="submit" style={{ background: '#00f2ff', border: 'none', padding: '0 15px', borderRadius: '10px', cursor: 'pointer' }}>
            <Send size={16} color="black" />
          </button>
        </form>
      </motion.div>
    </div>
  );
}
