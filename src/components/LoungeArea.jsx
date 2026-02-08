'use client';

import { useEffect, useRef } from 'react';
import './LoungeArea.css';

export default function LoungeArea() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    let animationFrameId;
    let time = 0;
    let hoverOffset = 0;

    const drawChair = (posX) => {
      const centerX = posX;
      const centerY = h * 0.3;
      const scale = 0.45;

      // Animation
      time += 0.02;
      hoverOffset = Math.sin(time) * 2;

      ctx.save();
      ctx.translate(centerX, centerY + hoverOffset);
      ctx.scale(scale, scale);

      // Chair shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 120, 80, 15, 0, 0, Math.PI * 2);
      ctx.fill();

      // Back legs (behind) - wooden dark finish
      const legGradient = ctx.createLinearGradient(-46, 40, -46, 120);
      legGradient.addColorStop(0, '#3a2a1a');
      legGradient.addColorStop(0.5, '#2a1a0a');
      legGradient.addColorStop(1, '#1a0a00');
      ctx.fillStyle = legGradient;
      ctx.fillRect(-50, 40, 10, 80);
      ctx.fillRect(40, 40, 10, 80);

      // Wood grain texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 45; i < 115; i += 5) {
        ctx.beginPath();
        ctx.moveTo(-50, i);
        ctx.lineTo(-40, i);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(40, i);
        ctx.lineTo(50, i);
        ctx.stroke();
      }

      // Left back leg highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(-49, 42, 2, 76);

      // Seat base wooden structure
      const seatBaseGradient = ctx.createLinearGradient(0, 30, 0, 50);
      seatBaseGradient.addColorStop(0, '#4a3a2a');
      seatBaseGradient.addColorStop(0.5, '#3a2a1a');
      seatBaseGradient.addColorStop(1, '#2a1a0a');
      ctx.fillStyle = seatBaseGradient;
      ctx.beginPath();
      ctx.moveTo(-68, 28);
      ctx.lineTo(68, 28);
      ctx.lineTo(62, 52);
      ctx.lineTo(-62, 52);
      ctx.closePath();
      ctx.fill();

      // Seat cushion with leather texture
      const seatCushionGradient = ctx.createRadialGradient(-10, 35, 10, 0, 38, 60);
      seatCushionGradient.addColorStop(0, '#7a6a8a');
      seatCushionGradient.addColorStop(0.5, '#6a5a7a');
      seatCushionGradient.addColorStop(1, '#4a3a5a');
      ctx.fillStyle = seatCushionGradient;
      ctx.beginPath();
      ctx.ellipse(0, 38, 64, 20, 0, 0, Math.PI * 2);
      ctx.fill();


      // Seat cushion depth shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 48, 58, 8, 0, 0, Math.PI);
      ctx.fill();

      // Seat edge stitching
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(0, 38, 60, 18, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Backrest wooden frame
      const frameGradient = ctx.createLinearGradient(-55, -60, -55, 30);
      frameGradient.addColorStop(0, '#3a2a1a');
      frameGradient.addColorStop(0.5, '#4a3a2a');
      frameGradient.addColorStop(1, '#2a1a0a');
      ctx.fillStyle = frameGradient;
      ctx.fillRect(-58, -65, 116, 95);

      // Frame wood texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = -55; i < 55; i += 8) {
        ctx.beginPath();
        ctx.moveTo(i, -60);
        ctx.lineTo(i, 30);
        ctx.stroke();
      }

      // Backrest side shadows for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(-58, -65, 6, 95);
      ctx.fillRect(52, -65, 6, 95);

      // Backrest highlights on frame
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(-52, -63, 2, 93);

      // Backrest padding/cushion with leather texture
      const cushionGradient = ctx.createRadialGradient(-10, -30, 10, 0, -15, 80);
      cushionGradient.addColorStop(0, '#7a6a8a');
      cushionGradient.addColorStop(0.5, '#5a4a6a');
      cushionGradient.addColorStop(1, '#3a2a4a');
      ctx.fillStyle = cushionGradient;
      ctx.beginPath();
      ctx.roundRect(-50, -58, 100, 82, 12);
      ctx.fill();

      // Backrest stitching detail (more realistic)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(-35, -52);
      ctx.lineTo(-35, 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -52);
      ctx.lineTo(0, 18);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(35, -52);
      ctx.lineTo(35, 18);
      ctx.stroke();

      // Button tufting details
      const tuftPositions = [
        [-30, -40], [0, -40], [30, -40],
        [-30, -10], [0, -10], [30, -10],
        [-30, 10], [0, 10], [30, 10]
      ];
      tuftPositions.forEach(([tx, ty]) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Armrests - wooden with depth
      const armrestGradient = ctx.createLinearGradient(-65, 0, -55, 0);
      armrestGradient.addColorStop(0, '#2a1a0a');
      armrestGradient.addColorStop(0.5, '#3a2a1a');
      armrestGradient.addColorStop(1, '#4a3a2a');
      // Left armrest
      ctx.fillStyle = armrestGradient;
      ctx.beginPath();
      ctx.moveTo(-58, -5);
      ctx.lineTo(-70, 0);
      ctx.lineTo(-70, 25);
      ctx.lineTo(-58, 30);
      ctx.closePath();
      ctx.fill();

      // Right armrest
      const armrestGradient2 = ctx.createLinearGradient(55, 0, 65, 0);
      armrestGradient2.addColorStop(0, '#4a3a2a');
      armrestGradient2.addColorStop(0.5, '#3a2a1a');
      armrestGradient2.addColorStop(1, '#2a1a0a');
      ctx.fillStyle = armrestGradient2;
      ctx.beginPath();
      ctx.moveTo(58, -5);
      ctx.lineTo(70, 0);
      ctx.lineTo(70, 25);
      ctx.lineTo(58, 30);
      ctx.closePath();
      ctx.fill();

      // Armrest wood highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(-68, 2, 2, 21);
      ctx.fillRect(68, 2, 2, 21);

      // Front legs (over armrests)
      const frontLegGradient = ctx.createLinearGradient(-46, 40, -46, 120);
      frontLegGradient.addColorStop(0, '#4a3a2a');
      frontLegGradient.addColorStop(0.5, '#3a2a1a');
      frontLegGradient.addColorStop(1, '#2a1a0a');
      ctx.fillStyle = frontLegGradient;
      ctx.fillRect(-50, 40, 10, 80);
      ctx.fillRect(40, 40, 10, 80);

      // Front leg highlights (brighter)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(-47, 42, 2, 76);
      ctx.fillRect(43, 42, 2, 76);

      // Leg caps/feet with metal finish
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(-52, 118, 12, 5);
      ctx.fillRect(40, 118, 12, 5);
      
      // Metal shine on feet
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(-51, 118, 10, 2);
      ctx.fillRect(41, 118, 10, 2);

      ctx.restore();
    };

    const drawSofa = (posX) => {
      const centerX = posX;
      const centerY = h * 0.3;
      const scale = 0.45;

      ctx.save();
      ctx.translate(centerX, centerY + hoverOffset);
      ctx.scale(scale, scale);

      // Sofa shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 140, 130, 18, 0, 0, Math.PI * 2);
      ctx.fill();

      // Sofa base/frame - wooden
      const baseGradient = ctx.createLinearGradient(0, 50, 0, 90);
      baseGradient.addColorStop(0, '#3a2a1a');
      baseGradient.addColorStop(1, '#2a1a0a');
      ctx.fillStyle = baseGradient;
      ctx.fillRect(-130, 50, 260, 40);

      // Base wood texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      ctx.lineWidth = 0.5;
      for (let i = 55; i < 85; i += 5) {
        ctx.beginPath();
        ctx.moveTo(-130, i);
        ctx.lineTo(130, i);
        ctx.stroke();
      }

      // Back legs
      const legGradient = ctx.createLinearGradient(0, 90, 0, 140);
      legGradient.addColorStop(0, '#3a2a1a');
      legGradient.addColorStop(1, '#1a0a00');
      ctx.fillStyle = legGradient;
      ctx.fillRect(-115, 90, 12, 50);
      ctx.fillRect(103, 90, 12, 50);
      ctx.fillRect(-35, 90, 12, 50);
      ctx.fillRect(23, 90, 12, 50);

      // Leg highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(-114, 92, 2, 46);
      ctx.fillRect(104, 92, 2, 46);

      // Sofa backrest frame
      const backrestFrameGradient = ctx.createLinearGradient(-130, -40, -130, 50);
      backrestFrameGradient.addColorStop(0, '#3a2a1a');
      backrestFrameGradient.addColorStop(0.5, '#4a3a2a');
      backrestFrameGradient.addColorStop(1, '#2a1a0a');
      ctx.fillStyle = backrestFrameGradient;
      ctx.fillRect(-135, -40, 270, 90);

      // Frame wood texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
      for (let i = -35; i < 45; i += 8) {
        ctx.beginPath();
        ctx.moveTo(-130, i);
        ctx.lineTo(130, i);
        ctx.stroke();
      }

      // Unified backrest cushion (one continuous piece)
      const backrestGradient = ctx.createRadialGradient(0, -10, 30, 0, 5, 140);
      backrestGradient.addColorStop(0, '#8a7a9a');
      backrestGradient.addColorStop(0.5, '#6a5a7a');
      backrestGradient.addColorStop(1, '#4a3a5a');
      ctx.fillStyle = backrestGradient;
      ctx.beginPath();
      ctx.roundRect(-125, -35, 250, 80, 12);
      ctx.fill();

      // Subtle tufting shadows (not separate cushions)
      ctx.fillStyle = 'rgba(0, 0, 0, 0.15)';
      ctx.beginPath();
      ctx.ellipse(-40, 10, 35, 25, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(40, 10, 35, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Backrest stitching (decorative lines)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(-80, -25);
      ctx.lineTo(-80, 35);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(80, -25);
      ctx.lineTo(80, 35);
      ctx.stroke();

      // Button tufting details on backrest
      const sofaTuftPositions = [
        [-90, -20], [-45, -20], [0, -20], [45, -20], [90, -20],
        [-90, 5], [-45, 5], [0, 5], [45, 5], [90, 5],
        [-90, 25], [-45, 25], [0, 25], [45, 25], [90, 25]
      ];
      sofaTuftPositions.forEach(([tx, ty]) => {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.beginPath();
        ctx.arc(tx, ty, 3, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.stroke();
      });

      // Unified seat cushion (one continuous piece)
      const seatGradient = ctx.createRadialGradient(0, 55, 30, 0, 62, 140);
      seatGradient.addColorStop(0, '#8a7a9a');
      seatGradient.addColorStop(0.5, '#7a6a8a');
      seatGradient.addColorStop(1, '#5a4a6a');
      ctx.fillStyle = seatGradient;
      ctx.beginPath();
      ctx.roundRect(-120, 50, 240, 32, 8);
      ctx.fill();

      // Seat depth shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
      ctx.beginPath();
      ctx.roundRect(-118, 75, 236, 8, 4);
      ctx.fill();

      // Armrests - wooden with padding
      const armrestWoodGradient = ctx.createLinearGradient(-135, 20, -135, 60);
      armrestWoodGradient.addColorStop(0, '#4a3a2a');
      armrestWoodGradient.addColorStop(1, '#2a1a0a');

      // Left armrest
      ctx.fillStyle = armrestWoodGradient;
      ctx.beginPath();
      ctx.moveTo(-135, 15);
      ctx.lineTo(-155, 20);
      ctx.lineTo(-155, 70);
      ctx.lineTo(-135, 75);
      ctx.closePath();
      ctx.fill();

      // Right armrest
      ctx.fillStyle = armrestWoodGradient;
      ctx.beginPath();
      ctx.moveTo(135, 15);
      ctx.lineTo(155, 20);
      ctx.lineTo(155, 70);
      ctx.lineTo(135, 75);
      ctx.closePath();
      ctx.fill();

      // Armrest highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(-153, 22, 2, 46);
      ctx.fillRect(153, 22, 2, 46);

      // Leg caps/feet
      ctx.fillStyle = '#3a3a3a';
      ctx.fillRect(-117, 138, 14, 5);
      ctx.fillRect(103, 138, 14, 5);
      ctx.fillRect(-37, 138, 14, 5);
      ctx.fillRect(23, 138, 14, 5);

      // Metal shine on feet
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(-116, 138, 12, 2);
      ctx.fillRect(104, 138, 12, 2);

      ctx.restore();
    };

    const drawCoffeeTable = (posX, posY) => {
      ctx.save();
      ctx.translate(posX, posY);

      // Table shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.beginPath();
      ctx.ellipse(0, 85, 55, 10, 0, 0, Math.PI * 2);
      ctx.fill();

      // Table top - wooden
      const tableTopGradient = ctx.createLinearGradient(-60, 50, 60, 50);
      tableTopGradient.addColorStop(0, '#5a4a3a');
      tableTopGradient.addColorStop(0.5, '#6a5a4a');
      tableTopGradient.addColorStop(1, '#5a4a3a');
      ctx.fillStyle = tableTopGradient;
      ctx.beginPath();
      ctx.roundRect(-60, 50, 120, 15, 3);
      ctx.fill();

      // Wood grain texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 0.5;
      for (let i = -55; i < 55; i += 10) {
        ctx.beginPath();
        ctx.moveTo(i, 52);
        ctx.lineTo(i + 8, 63);
        ctx.stroke();
      }

      // Table top reflection/shine
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.beginPath();
      ctx.ellipse(0, 55, 45, 6, 0, 0, Math.PI * 2);
      ctx.fill();

      // Table edge highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(-60, 50, 120, 2);

      // Table legs (4 legs)
      const legGradient = ctx.createLinearGradient(0, 65, 0, 85);
      legGradient.addColorStop(0, '#3a2a2a');
      legGradient.addColorStop(1, '#2a1a1a');
      ctx.fillStyle = legGradient;
      
      // Front left leg
      ctx.fillRect(-45, 65, 8, 20);
      // Front right leg
      ctx.fillRect(37, 65, 8, 20);
      // Back left leg
      ctx.fillRect(-45, 65, 8, 20);
      // Back right leg
      ctx.fillRect(37, 65, 8, 20);

      // Leg highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.fillRect(-44, 66, 2, 18);
      ctx.fillRect(38, 66, 2, 18);

      // Decorative item on table (small book or tray)
      ctx.fillStyle = '#4a3a5a';
      ctx.fillRect(-25, 47, 30, 5);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.fillRect(-24, 47, 28, 2);

      ctx.restore();
    };

    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Draw both furniture pieces side by side
      drawChair(w * 0.3);
      drawSofa(w * 0.72);
      
      // Draw coffee table in front of sofa
      drawCoffeeTable(w * 0.72, h * 0.52);

      // Ambient glow
      const glowGradient = ctx.createRadialGradient(w / 2, h * 0.3, 0, w / 2, h * 0.3, w * 0.6);
      glowGradient.addColorStop(0, 'rgba(139, 92, 246, 0.15)');
      glowGradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, w, h);

      animationFrameId = requestAnimationFrame(draw);
    };

    const resizeCanvas = () => {
      const newRect = canvas.getBoundingClientRect();
      canvas.width = newRect.width * dpr;
      canvas.height = newRect.height * dpr;
      ctx.scale(dpr, dpr);
    };

    window.addEventListener('resize', resizeCanvas);
    draw();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="lounge-canvas" />;
}
