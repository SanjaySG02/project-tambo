"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, Suspense, useMemo, useRef, useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { useTransitionIntent } from "../../components/aura/transition-intent";
import { useAuth } from "../../lib/auth";

function useIsHydrated() {
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // Hydration guard: avoid SSR/CSR mismatch when reading `useSearchParams()`.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setHydrated(true);
  }, []);

  return hydrated;
}

function HallwayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { setIntent } = useTransitionIntent();
  const { user, logout } = useAuth();
  
  const isHydrated = useIsHydrated();

  const [command, setCommand] = useState("");
  const [aiMessage, setAiMessage] = useState("Navigator online. Ask for a room or unit.");
  const [isNavigating, setIsNavigating] = useState(false);

  const urlUnit = searchParams.get("unit");

  const bgImage = "https://image2url.com/r2/default/images/1770320864965-a1fac360-b36d-483d-9d73-75c8339f9e24.png";

  const doors = useMemo(
    () => [
      { name: "UTILITIES", sector: "utilities", color: "#00f2ff", path: "/utilities", keywords: ["bill", "electricity", "water", "gas", "energy"] },
      { name: "SECURITY", sector: "security", color: "#ff0055", path: "/security", keywords: ["lock", "camera", "safe", "alarm", "entrance"] },
      { name: "AMENITIES", sector: "amenities", color: "#00ff88", path: "/amenities", keywords: ["gym", "pool", "park", "lounge", "workout"] },
      { name: "COMMUNITY", sector: "community", color: "#ffaa00", path: "/community", keywords: ["chat", "neighbors", "event", "hub"] }
    ],
    [],
  );
  const allowedUnits = user?.role === "admin"
    ? ["101", "102", "201", "202"]
    : user?.unit
      ? [user.unit]
      : [];

  // 2. THE HARD GUARD: If we are in the browser but NO unit is in the URL, go back home.
  // This prevents the "000" from ever being assigned.
  useEffect(() => {
    if (isHydrated && !urlUnit) {
      router.push("/");
    }
  }, [isHydrated, urlUnit, router]);

  useEffect(() => {
    if (!isHydrated || !user || !urlUnit) return;
    if (user.role === "user" && user.unit && urlUnit !== user.unit) {
      router.replace(`/dashboard?unit=${user.unit}`);
    }
  }, [isHydrated, user, urlUnit, router]);

  useEffect(() => {
    if (!urlUnit) return;
    doors.forEach((door) => {
      router.prefetch(`${door.path}?unit=${urlUnit}`);
    });
  }, [doors, router, urlUnit]);

  const sceneRef = useRef(null);
  const spotlightRef = useRef(null);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const rotateY = useTransform(mx, [-0.5, 0.5], [-8, 8]);
  const rotateX = useTransform(my, [-0.5, 0.5], [6, -6]);

  const rotateYSpring = useSpring(rotateY, { stiffness: 120, damping: 18 });
  const rotateXSpring = useSpring(rotateX, { stiffness: 120, damping: 18 });

  function updateMouse(e) {
    const el = sceneRef.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;

    mx.set(px - 0.5);
    my.set(py - 0.5);

    const spot = spotlightRef.current;
    if (spot) {
      spot.style.setProperty("--spot-x", `${e.clientX - rect.left}px`);
      spot.style.setProperty("--spot-y", `${e.clientY - rect.top}px`);
    }
  }

  function navigateToDoor(door, nextUnit) {
    if (isNavigating) return;
    setIsNavigating(true);
    setIntent({ type: "door", sector: door.sector, unit: nextUnit });
    router.push(`${door.path}?unit=${nextUnit}`);
  }

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
      setAiMessage("Returning Home...");
      if (user?.role === "user" && user.unit) {
        router.push(`/dashboard?unit=${user.unit}`);
      } else {
        router.push("/");
      }
      setCommand("");
      return;
    }
    
    // FULL ACCESS LOGIC: Extract unit and room
    const numberMatch = input.match(/\d+/); 
    const targetUnit = numberMatch ? numberMatch[0] : urlUnit;

    const targetDoor = doors.find(door => 
      input.includes(door.name.toLowerCase()) || 
      door.keywords.some(keyword => input.includes(keyword))
    );

    if (targetDoor) {
      if (!allowedUnits.includes(targetUnit)) {
        setAiMessage(`Unit ${targetUnit} not found. Available: ${allowedUnits.join(", ")}.`);
        setCommand("");
        return;
      }
      setAiMessage(`Direct Jump: ${targetDoor.name} (Unit ${targetUnit})...`);
      navigateToDoor(targetDoor, targetUnit);
    } else if (numberMatch) {
      if (!allowedUnits.includes(targetUnit)) {
        setAiMessage(`Unit ${targetUnit} not found. Available: ${allowedUnits.join(", ")}.`);
        setCommand("");
        return;
      }
      setAiMessage(`Switching to Unit ${targetUnit}...`);
      router.push(`/dashboard?unit=${targetUnit}`);
    } else {
      setAiMessage("Access Denied. Specify room and unit (e.g. 'Gym 201')");
    }
    setCommand("");
  };

  // 3. RENDER NOTHING until we are mounted and have a valid unit
  if (!isHydrated || !urlUnit) {
    return <div style={{ height: '100vh', backgroundColor: '#02040a' }} />;
  }

  return (
    <div
      ref={sceneRef}
      className="aura-hqBg"
      style={{ 
      height: '100vh', width: '100vw', backgroundColor: '#02040a',
      backgroundImage: `url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      perspective: '1500px', overflow: 'hidden', position: 'relative'
    }}
      onMouseMove={updateMouse}
      onMouseLeave={() => {
        mx.set(0);
        my.set(0);
      }}
    >
      <div ref={spotlightRef} className="aura-spotlightOverlay" />
      
      <motion.div 
        key={urlUnit}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{
          position: 'absolute', top: '20px', padding: '10px 30px',
          border: '1px solid #00f2ff', backgroundColor: 'rgba(0,0,0,0.8)',
          borderRadius: '4px', color: '#00f2ff', letterSpacing: '4px', fontSize: '14px', fontWeight: 'bold'
        }}
      >
        RESIDENCE UNIT: {urlUnit}
      </motion.div>

      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', gap: '8px', zIndex: 5 }}>
        {user?.role === "admin" ? (
          <button
            type="button"
            onClick={() => router.push("/")}
            style={{
              background: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(0,242,255,0.5)',
              color: '#eaffff',
              padding: '8px 14px',
              borderRadius: '10px',
              cursor: 'pointer',
              fontSize: '11px',
              letterSpacing: '2px',
              boxShadow: '0 0 14px rgba(0,242,255,0.25)'
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
            background: 'rgba(0,0,0,0.7)',
            border: '1px solid rgba(255,80,120,0.6)',
            color: '#ffe6ef',
            padding: '8px 14px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '11px',
            letterSpacing: '2px',
            boxShadow: '0 0 14px rgba(255,80,120,0.25)'
          }}
        >
          LOG OUT
        </button>
      </div>

      <motion.div
        style={{
          rotateX: rotateXSpring,
          rotateY: rotateYSpring,
          translateZ: 0,
          transformStyle: "preserve-3d",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            transformStyle: "preserve-3d",
            marginBottom: "60px",
          }}
        >
          {doors.map((door) => (
            <motion.div 
              key={door.name}
              whileHover={{ scale: 1.05, borderColor: door.color }}
              style={{
                width: '160px', height: '320px', backgroundColor: 'rgba(0, 0, 0, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px',
                cursor: 'pointer', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(2px)',
                willChange: 'transform', touchAction: 'manipulation'
              }}
              role="button"
              tabIndex={0}
              onPointerDown={() => navigateToDoor(door, urlUnit)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  navigateToDoor(door, urlUnit);
                }
              }}
            >
              <div style={{ width: '3px', height: '40px', backgroundColor: door.color, borderRadius: '4px', marginBottom: '30px', boxShadow: `0 0 15px ${door.color}` }} />
              <span style={{ color: 'white', fontSize: '10px', letterSpacing: '4px' }}>{door.name}</span>
            </motion.div>
          ))}
        </div>

        <motion.div style={{
            width: '500px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '20px',
            borderRadius: '20px', border: '1px solid rgba(0, 242, 255, 0.3)',
            backdropFilter: 'blur(8px)', boxShadow: '0 0 40px rgba(0,242,255,0.1)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
            <Sparkles size={16} color="#00f2ff" />
            <span style={{ fontSize: '12px', color: '#00f2ff', letterSpacing: '2px' }}>{aiMessage}</span>
          </div>

          <form onSubmit={handleAiCommand} style={{ display: 'flex', gap: '10px' }}>
            <input 
              value={command}
              onChange={(e) => setCommand(e.target.value)}
              placeholder="Try: 'Utilities 202' or 'Go to Gym'"
              style={{
                flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                padding: '12px 20px', borderRadius: '12px', color: 'white', outline: 'none'
              }}
            />
            <button type="submit" style={{ background: '#00f2ff', border: 'none', padding: '0 20px', borderRadius: '12px', cursor: 'pointer' }}>
              <Send size={18} color="black" />
            </button>
          </form>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default function Hallway() {
  return (
    <Suspense fallback={null}>
      <HallwayContent />
    </Suspense>
  );
}
