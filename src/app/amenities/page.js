"use client";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Added useSearchParams
import { motion } from "framer-motion";
import { ArrowLeft, Dumbbell, Waves, Coffee, TreePine } from "lucide-react";

export default function AmenitiesRoom() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // 2. Grabs the unit number from the URL
  const unitNumber = searchParams.get('unit') || "000";

  const backgroundImageLink = "https://image2url.com/r2/default/images/1770320864965-a1fac360-b36d-483d-9d73-75c8339f9e24.png";

  const cards = [
    { title: "GYM", desc: "Level 2 • 24/7", icon: <Dumbbell />, color: "#3b82f6" },
    { title: "POOL", desc: "Rooftop • 28°C", icon: <Waves />, color: "#06b6d4" },
    { title: "LOUNGE", desc: "Level 1 • Quiet Zone", icon: <Coffee />, color: "#8b5cf6" },
    { title: "PARK", desc: "Ground • Pet Friendly", icon: <TreePine />, color: "#10b981" }
  ];

  return (
    <div style={{ 
      height: '100vh', 
      width: '100vw',
      backgroundColor: 'black',
      backgroundImage: `radial-gradient(circle at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.9) 100%), url('${backgroundImageLink}')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      color: 'white',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column'
    }}>
      
      {/* 3. UNIT HUD: Shows which resident is accessing amenities */}
      <div style={{ 
        position: 'absolute', top: '30px', right: '40px', 
        color: 'white', border: '1px solid rgba(255,255,255,0.2)', 
        padding: '8px 20px', borderRadius: '4px', fontSize: '10px',
        backgroundColor: 'rgba(0,0,0,0.6)', letterSpacing: '3px',
        backdropFilter: 'blur(5px)', zIndex: 10
      }}>
        RESIDENT AUTH: <span style={{ color: '#00f2ff' }}>{unitNumber}</span>
      </div>

      {/* Header */}
      <nav style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', backdropFilter: 'blur(10px)' }}>
        <button 
          // 4. PERSISTENCE: Return to Dashboard with the Unit ID
          onClick={() => router.push(`/dashboard?unit=${unitNumber}`)}
          style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.2)", color: "white", padding: "10px", borderRadius: "12px", cursor: "pointer" }}
        >
          <ArrowLeft size={20} />
        </button>
        <h1 style={{ fontSize: "20px", fontWeight: "200", letterSpacing: "4px", margin: 0 }}>AMENITIES</h1>
      </nav>

      {/* Grid Container */}
      <div style={{ 
        flex: 1, 
        display: 'grid', 
        gridTemplateColumns: 'repeat(4, 1fr)', 
        gap: '20px', 
        padding: '40px',
        alignItems: 'center' 
      }}>
        {cards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.05, borderColor: card.color }}
            style={{
              height: '350px',
              backgroundColor: 'rgba(0,0,0,0.7)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '20px',
              padding: '30px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              backdropFilter: 'blur(15px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              cursor: 'default'
            }}
          >
            <div style={{ color: card.color }}>{card.icon}</div>
            <div>
              <h2 style={{ fontSize: '28px', margin: '0', color: card.color }}>{card.title}</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '10px' }}>{card.desc}</p>
            </div>
            <div style={{ 
              height: '2px', 
              width: '40px', 
              backgroundColor: card.color, 
              boxShadow: `0 0 10px ${card.color}` 
            }} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}