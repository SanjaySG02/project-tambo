"use client";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { Building2, Home, Sparkles, Send } from "lucide-react";
import { useTransitionIntent } from "../components/aura/transition-intent";
import { useAuth } from "../lib/auth";

export default function LobbyPage() {
  const router = useRouter();
  const { setIntent } = useTransitionIntent();
  const { user, logout } = useAuth();
  const [command, setCommand] = useState("");
  const [aiMessage, setAiMessage] = useState("Lobby Terminal Active. Select a Unit.");

  const lobbyBg = "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2072&auto=format&fit=crop";

  const flats = [
    { id: "101", type: "Studio", status: "Occupied" },
    { id: "102", type: "Penthouse", status: "Vacant" },
    { id: "201", type: "Deluxe", status: "Occupied" },
    { id: "202", type: "Studio", status: "Maintenance" },
  ];
  const visibleFlats = user?.role === "admin"
    ? flats
    : flats.filter((flat) => flat.id === user?.unit);
  const allowedUnits = visibleFlats.map((flat) => flat.id);

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
    flats.forEach((flat) => {
      router.prefetch(`/dashboard?unit=${flat.id}`);
    });
  }, [flats, router]);

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
      color: 'white', fontFamily: 'sans-serif', overflow: 'hidden'
    }}>
      
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <Building2 size={40} color="#00f2ff" style={{ marginBottom: '10px' }} />
        <h1 style={{ letterSpacing: '8px', fontWeight: '200', fontSize: '24px', margin: 0 }}>RESIDENCE DIRECTORY</h1>
      </div>

      <button
        onClick={logout}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
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

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '40px' }}>
        {visibleFlats.map((flat) => (
          <motion.div
            key={flat.id}
            whileHover={{ scale: 1.05, backgroundColor: 'rgba(0, 242, 255, 0.1)' }}
            style={{
              width: '260px', padding: '25px', backgroundColor: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px',
              cursor: 'pointer', backdropFilter: 'blur(4px)', touchAction: 'manipulation',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}
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
            <div>
              <h2 style={{ fontSize: '24px', margin: 0 }}>UNIT {flat.id}</h2>
              <span style={{ fontSize: '10px', color: '#00f2ff', opacity: 0.7 }}>{flat.type}</span>
            </div>
            <Home size={20} color="#00f2ff" />
          </motion.div>
        ))}
      </div>

      {/* AI COMMAND BOX */}
      <motion.div style={{
          width: '450px', backgroundColor: 'rgba(0,0,0,0.8)', padding: '20px',
          borderRadius: '20px', border: '1px solid rgba(0, 242, 255, 0.3)', backdropFilter: 'blur(8px)'
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
