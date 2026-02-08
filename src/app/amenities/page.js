"use client";
import { useRouter, useSearchParams } from "next/navigation"; // 1. Added useSearchParams
import { motion } from "framer-motion";
import { ArrowLeft, Dumbbell, Waves, Coffee, TreePine } from "lucide-react";
import { Suspense, useEffect, useState } from "react";
import { useAuth } from "../../lib/auth";
import { getUnitSnapshot } from "../../lib/residence-data";
import DumbbellEffect from "../../components/Dumbbell";
import LoungeArea from "../../components/LoungeArea";
import SwimmingPool from "../../components/SwimmingPool";
import ParkScene from "../../components/ParkScene";
import ColorBends from "../../components/ColorBends";

const amenitiesContainerStyle = {
  height: '100vh',
  width: '100vw',
  position: 'relative',
  backgroundColor: '#000000',
  color: 'white',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
};

function AmenitiesRoomContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, logout } = useAuth();
  const [showDumbbell, setShowDumbbell] = useState(false);
  const [showLounge, setShowLounge] = useState(false);
  const [showPool, setShowPool] = useState(false);
  const [showPark, setShowPark] = useState(false);

  // 2. Grabs the unit number from the URL
  const unitNumber = searchParams.get('unit');

  useEffect(() => {
    if (!unitNumber) router.push("/");
  }, [unitNumber, router]);

  useEffect(() => {
    if (!user || !unitNumber) return;
    if (user.role === "user" && user.unit && unitNumber !== user.unit) {
      router.replace(`/amenities?unit=${user.unit}`);
    }
  }, [user, unitNumber, router]);

  if (!unitNumber) {
    return <div className="aura-hqBg" style={amenitiesContainerStyle} />;
  }

  const snapshot = getUnitSnapshot(unitNumber);
  const amenities = snapshot?.amenities;

  const cards = [
    {
      title: "GYM",
      desc: amenities ? `Status • ${amenities.gymAccess}` : "Status • --",
      icon: <Dumbbell />,
      color: "#3b82f6",
    },
    {
      title: "POOL",
      desc: amenities ? `Status • ${amenities.poolStatus}` : "Status • --",
      icon: <Waves />,
      color: "#06b6d4",
    },
    {
      title: "LOUNGE",
      desc: amenities ? `Occupancy • ${amenities.loungeOccupancy}` : "Occupancy • --",
      icon: <Coffee />,
      color: "#8b5cf6",
    },
    {
      title: "PARK",
      desc: amenities ? `Status • ${amenities.parkStatus}` : "Status • --",
      icon: <TreePine />,
      color: "#10b981",
    },
  ];

  return (
    <div className="aura-hqBg" style={amenitiesContainerStyle}>
      <div className="color-bends-layer">
        <ColorBends
          colors={["#07150f", "#0b3d2e", "#00ff88", "#8b5cf6"]}
          speed={0.1}
          warpStrength={0.8}
          frequency={1.05}
          noise={0.08}
          transparent
        />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        {/* 3. UNIT HUD: Shows which resident is accessing amenities */}
        <div style={{ 
          position: 'absolute', top: '30px', right: '40px', 
          color: 'white', border: '1px solid rgba(255,255,255,0.2)', 
          padding: '8px 20px', borderRadius: '4px', fontSize: '10px',
          backgroundColor: 'rgba(0,0,0,0.6)', letterSpacing: '3px',
          backdropFilter: 'none', zIndex: 10
        }}>
          LOGGED IN: UNIT <span style={{ color: '#00f2ff' }}>{unitNumber}</span>
        </div>

        {/* Header */}
        <nav style={{ padding: '30px', display: 'flex', alignItems: 'center', gap: '20px', backdropFilter: 'none', position: 'relative', zIndex: 2 }}>
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
              onMouseEnter={() => {
                if (card.title === 'GYM') setShowDumbbell(true);
                if (card.title === 'LOUNGE') setShowLounge(true);
                if (card.title === 'POOL') setShowPool(true);
                if (card.title === 'PARK') setShowPark(true);
              }}
              onMouseLeave={() => {
                if (card.title === 'GYM') setShowDumbbell(false);
                if (card.title === 'LOUNGE') setShowLounge(false);
                if (card.title === 'POOL') setShowPool(false);
                if (card.title === 'PARK') setShowPark(false);
              }}
              onClick={() => {
                if (card.title === 'GYM') setShowDumbbell(!showDumbbell);
                if (card.title === 'LOUNGE') setShowLounge(!showLounge);
                if (card.title === 'POOL') setShowPool(!showPool);
                if (card.title === 'PARK') setShowPark(!showPark);
              }}
              style={{
                height: '350px',
                backgroundColor: 'rgba(0,0,0,0.7)',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '20px',
                padding: '30px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backdropFilter: 'none',
                boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
                cursor: (card.title === 'GYM' || card.title === 'LOUNGE' || card.title === 'POOL' || card.title === 'PARK') ? 'pointer' : 'default',
                position: 'relative',
                zIndex: 1
              }}
            >
              {card.title === 'GYM' && showDumbbell && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  zIndex: 2
                }}>
                  <DumbbellEffect />
                </div>
              )}
              {card.title === 'LOUNGE' && showLounge && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  zIndex: 2
                }}>
                  <LoungeArea />
                </div>
              )}
              {card.title === 'POOL' && showPool && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  zIndex: 2
                }}>
                  <SwimmingPool />
                </div>
              )}
              {card.title === 'PARK' && showPark && (
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '20px',
                  overflow: 'hidden',
                  zIndex: 2
                }}>
                  <ParkScene />
                </div>
              )}
              <div style={{ color: card.color, position: 'relative', zIndex: (showDumbbell && card.title === 'GYM') || (showLounge && card.title === 'LOUNGE') || (showPool && card.title === 'POOL') || (showPark && card.title === 'PARK') ? 3 : 1 }}>{card.icon}</div>
              <div style={{ position: 'relative', zIndex: (showDumbbell && card.title === 'GYM') || (showLounge && card.title === 'LOUNGE') || (showPool && card.title === 'POOL') || (showPark && card.title === 'PARK') ? 3 : 1 }}>
                <h2 style={{ fontSize: '28px', margin: '0', color: card.color }}>{card.title}</h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '10px' }}>{card.desc}</p>
              </div>
              <div style={{ 
                height: '2px', 
                width: '40px', 
                backgroundColor: card.color, 
                boxShadow: `0 0 10px ${card.color}`,
                position: 'relative',
                zIndex: (showDumbbell && card.title === 'GYM') || (showLounge && card.title === 'LOUNGE') || (showPool && card.title === 'POOL') || (showPark && card.title === 'PARK') ? 3 : 1
              }} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function AmenitiesRoom() {
  return (
    <Suspense fallback={<div style={amenitiesContainerStyle} />}>
      <AmenitiesRoomContent />
    </Suspense>
  );
}
