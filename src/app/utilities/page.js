"use client";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Added useSearchParams
import { motion } from "framer-motion";
import { ArrowLeft, Zap, Droplets, Flame, Sun } from "lucide-react";
import { Suspense, useEffect } from "react";

const backgroundImageLink = "https://image2url.com/r2/default/images/1770320864965-a1fac360-b36d-483d-9d73-75c8339f9e24.png";
const utilitiesBackgroundImage = `radial-gradient(circle at center, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.8) 100%), url('${backgroundImageLink}')`;

const utilitiesContainerStyle = {
  minHeight: '100vh',
  backgroundColor: 'black',
  backgroundImage: utilitiesBackgroundImage,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  color: 'white',
  padding: '40px',
  fontFamily: 'sans-serif',
};

function UtilitiesRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 2. Capture the unit number from the URL
  const unitNumber = searchParams.get('unit');

  useEffect(() => {
    if (!unitNumber) router.push("/");
  }, [unitNumber, router]);

  if (!unitNumber) {
    return <div className="aura-hqBg" style={utilitiesContainerStyle} />;
  }

  const stats = [
    { name: "Electricity", icon: <Zap />, value: "12.4", unit: "kWh", status: "Normal", color: "#facc15" },
    { name: "Water", icon: <Droplets />, value: "450", unit: "Litres", status: "Optimal", color: "#60a5fa" },
    { name: "Natural Gas", icon: <Flame />, value: "0.8", unit: "m³", status: "Low", color: "#fb923c" },
    { name: "Solar Power", icon: <Sun />, value: "+2.1", unit: "kWh", status: "Charging", color: "#4ade80" },
  ];

  return (
    <div className="aura-hqBg" style={utilitiesContainerStyle}>

      {/* 3. DYNAMIC UNIT HUD */}
      <div style={{ 
        position: 'absolute', top: '20px', right: '40px', 
        color: '#facc15', border: '1px solid rgba(250, 204, 21, 0.4)', 
        padding: '5px 15px', borderRadius: '4px', fontSize: '12px',
        backgroundColor: 'rgba(0,0,0,0.5)', letterSpacing: '2px'
      }}>
        MONITORING: UNIT {unitNumber}
      </div>

      {/* Navigation */}
      <nav style={{ 
        display: "flex", 
        alignItems: "center", 
        gap: "20px", 
        marginBottom: "60px",
        backdropFilter: "blur(10px)",
        padding: "10px",
        borderRadius: "15px"
      }}>
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
        {stats.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ y: -5, borderColor: item.color }}
            style={{
              backgroundColor: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(255,255,255,0.1)",
              padding: "30px",
              borderRadius: "24px",
              position: "relative",
              overflow: "hidden",
              backdropFilter: "blur(15px)"
            }}
          >
            <div style={{ 
              position: "absolute", 
              top: "-20px", 
              right: "-20px", 
              width: "100px", 
              height: "100px", 
              background: item.color, 
              filter: "blur(50px)", 
              opacity: 0.2 
            }} />

            <div style={{ color: item.color, marginBottom: "20px" }}>
              {item.icon}
            </div>
            
            <h3 style={{ fontSize: "14px", color: "rgba(255,255,255,0.4)", textTransform: "uppercase", letterSpacing: "1px", margin: "0 0 10px 0" }}>
              {item.name}
            </h3>

            <div style={{ display: "flex", alignItems: "baseline", gap: "10px" }}>
              <span style={{ fontSize: "42px", fontWeight: "bold", letterSpacing: "-2px" }}>{item.value}</span>
              <span style={{ color: "rgba(255,255,255,0.3)", fontWeight: "bold" }}>{item.unit}</span>
            </div>

            <div style={{ marginTop: "20px", display: "flex", alignItems: "center", gap: "8px" }}>
              <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#4ade80", boxShadow: "0 0 10px #4ade80" }} />
              <span style={{ fontSize: "12px", color: "#4ade80", textTransform: "uppercase", fontWeight: "bold" }}>{item.status}</span>
            </div>
          </motion.div>
        ))}
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
