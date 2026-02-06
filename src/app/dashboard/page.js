"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { useState, useEffect, Suspense } from "react";
import { Send, Sparkles } from "lucide-react";

function HallwayContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State management to prevent "000" ghosting
  const [isMounted, setIsMounted] = useState(false);
  const [command, setCommand] = useState("");
  const [aiMessage, setAiMessage] = useState("System Authenticating...");

  // 1. Force the app to wait until it's fully loaded in the browser
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const urlUnit = searchParams.get('unit');

  // 2. THE HARD GUARD: If we are in the browser but NO unit is in the URL, go back home.
  // This prevents the "000" from ever being assigned.
  useEffect(() => {
    if (isMounted && !urlUnit) {
      router.push("/");
    }
  }, [isMounted, urlUnit, router]);

  const bgImage = "https://image2url.com/r2/default/images/1770320864965-a1fac360-b36d-483d-9d73-75c8339f9e24.png";

  const doors = [
    { name: "UTILITIES", color: "#00f2ff", path: "/utilities", keywords: ["bill", "electricity", "water", "gas", "energy", "power"] },
    { name: "SECURITY", color: "#ff0055", path: "/security", keywords: ["lock", "camera", "safe", "entrance", "alarm", "door"] },
    { name: "AMENITIES", color: "#00ff88", path: "/amenities", keywords: ["gym", "pool", "park", "lounge", "exercise", "workout"] },
    { name: "COMMUNITY", color: "#ffaa00", path: "/community", keywords: ["chat", "neighbors", "event", "message", "bbq", "hub"] }
  ];

  const handleAiCommand = (e) => {
    e.preventDefault();
    const input = command.toLowerCase();
    
    // FULL ACCESS LOGIC: Extract unit and room
    const numberMatch = input.match(/\d+/); 
    const targetUnit = numberMatch ? numberMatch[0] : urlUnit;

    const targetDoor = doors.find(door => 
      input.includes(door.name.toLowerCase()) || 
      door.keywords.some(keyword => input.includes(keyword))
    );

    if (targetDoor) {
      setAiMessage(`Direct Jump: ${targetDoor.name} (Unit ${targetUnit})...`);
      setTimeout(() => {
        router.push(`${targetDoor.path}?unit=${targetUnit}`);
      }, 500);
    } else if (numberMatch) {
      setAiMessage(`Switching to Unit ${targetUnit}...`);
      router.push(`/dashboard?unit=${targetUnit}`);
    } else {
      setAiMessage("Access Denied. Specify room and unit (e.g. 'Gym 201')");
    }
    setCommand("");
  };

  // 3. RENDER NOTHING until we are mounted and have a valid unit
  if (!isMounted || !urlUnit) {
    return <div style={{ height: '100vh', backgroundColor: '#02040a' }} />;
  }

  return (
    <div style={{ 
      height: '100vh', width: '100vw', backgroundColor: '#02040a',
      backgroundImage: `url('${bgImage}')`, backgroundSize: 'cover', backgroundPosition: 'center',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      perspective: '1500px', overflow: 'hidden'
    }}>
      
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

      <div style={{ display: 'flex', gap: '20px', transformStyle: 'preserve-3d', marginBottom: '60px' }}>
        {doors.map((door) => (
          <motion.div 
            key={door.name}
            whileHover={{ scale: 1.05, borderColor: door.color }}
            style={{
              width: '160px', height: '320px', backgroundColor: 'rgba(0, 0, 0, 0.8)',
              border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '12px',
              cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)'
            }}
            onClick={() => router.push(`${door.path}?unit=${urlUnit}`)}
          >
            <div style={{ width: '3px', height: '40px', backgroundColor: door.color, borderRadius: '4px', marginBottom: '30px', boxShadow: `0 0 15px ${door.color}` }} />
            <span style={{ color: 'white', fontSize: '10px', letterSpacing: '4px' }}>{door.name}</span>
          </motion.div>
        ))}
      </div>

      <motion.div style={{
          width: '500px', backgroundColor: 'rgba(0,0,0,0.85)', padding: '20px',
          borderRadius: '20px', border: '1px solid rgba(0, 242, 255, 0.3)',
          backdropFilter: 'blur(20px)', boxShadow: '0 0 40px rgba(0,242,255,0.1)'
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
            placeholder="Go to room... (e.g. Gym 201)"
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