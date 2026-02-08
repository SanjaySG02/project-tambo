'use client';

import { useEffect, useRef } from 'react';
import './GymEquipment.css';

export default function GymEquipment() {
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

    const drawDumbbell = (x, y, rotation, weight) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rotation);

      // Bar
      ctx.fillStyle = '#c0c0c0';
      ctx.fillRect(-70, -4, 140, 8);
      
      // Bar highlights
      ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
      ctx.fillRect(-70, -4, 140, 3);

      // Left weight plate
      const plateColor = weight === 'heavy' ? '#e74c3c' : '#3498db';
      ctx.fillStyle = plateColor;
      ctx.fillRect(-90, -15, 20, 30);
      
      // Weight plate lines (grip)
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      for (let i = -15; i <= 15; i += 4) {
        ctx.beginPath();
        ctx.moveTo(-90, i);
        ctx.lineTo(-70, i);
        ctx.stroke();
      }

      // Left weight label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(weight === 'heavy' ? '25' : '10', -80, 3);

      // Right weight plate
      ctx.fillStyle = plateColor;
      ctx.fillRect(70, -15, 20, 30);
      
      // Weight plate lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.lineWidth = 1;
      for (let i = -15; i <= 15; i += 4) {
        ctx.beginPath();
        ctx.moveTo(70, i);
        ctx.lineTo(90, i);
        ctx.stroke();
      }

      // Right weight label
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.font = 'bold 8px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(weight === 'heavy' ? '25' : '10', 80, 3);

      // Grip area (textured)
      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(-30, -6, 60, 12);
      
      // Grip texture
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 0.5;
      for (let i = -30; i <= 30; i += 5) {
        ctx.beginPath();
        ctx.moveTo(i, -6);
        ctx.lineTo(i, 6);
        ctx.stroke();
      }

      ctx.restore();
    };

    const draw = () => {
      time += 0.01;

      // Background gradient (gym floor)
      const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
      bgGradient.addColorStop(0, '#1a1a2e');
      bgGradient.addColorStop(0.5, '#16213e');
      bgGradient.addColorStop(1, '#0f2a3f');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      // Floor with gym mat pattern
      ctx.fillStyle = 'rgba(50, 50, 60, 0.5)';
      ctx.fillRect(0, h * 0.7, w, h * 0.3);

      // Mat pattern
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      for (let i = 0; i < w; i += 30) {
        for (let j = h * 0.7; j < h; j += 30) {
          ctx.strokeRect(i, j, 30, 30);
        }
      }

      // Wall background
      ctx.fillStyle = 'rgba(60, 40, 80, 0.2)';
      ctx.fillRect(0, 0, w, h * 0.7);

      // Horizontal mirror/wall line
      ctx.strokeStyle = 'rgba(150, 100, 200, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(0, h * 0.3);
      ctx.lineTo(w, h * 0.3);
      ctx.stroke();

      // Light reflections
      const lightGradient = ctx.createRadialGradient(w / 2, h * 0.2, 0, w / 2, h * 0.2, w);
      lightGradient.addColorStop(0, 'rgba(100, 200, 255, 0.1)');
      lightGradient.addColorStop(0.5, 'rgba(100, 150, 255, 0.05)');
      lightGradient.addColorStop(1, 'rgba(100, 100, 255, 0)');
      ctx.fillStyle = lightGradient;
      ctx.fillRect(0, 0, w, h);

      // Draw equipment rack
      const rackX = w * 0.15;
      const rackY = h * 0.55;
      
      // Rack poles
      ctx.fillStyle = '#2c2c2c';
      ctx.fillRect(rackX, rackY, 15, 60);
      ctx.fillRect(rackX + 120, rackY, 15, 60);

      // Dumbbells on rack
      drawDumbbell(rackX + 25, rackY + 20, 0, 'light');
      drawDumbbell(rackX + 25, rackY + 40, 0, 'heavy');
      drawDumbbell(rackX + 105, rackY + 20, 0, 'light');
      drawDumbbell(rackX + 105, rackY + 40, 0, 'heavy');

      // Main dumbbell (being lifted with animation)
      const liftY = h * 0.45 - Math.sin(time * 0.03) * 15;
      const liftRotation = Math.sin(time * 0.02) * 0.2;
      drawDumbbell(w * 0.5, liftY, liftRotation, 'heavy');

      // Hand grip (simplified)
      ctx.fillStyle = 'rgba(220, 180, 140, 0.6)';
      ctx.beginPath();
      ctx.ellipse(w * 0.5 - 5, liftY + 25, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(w * 0.5 + 5, liftY + 25, 12, 8, 0, 0, Math.PI * 2);
      ctx.fill();

      // Arm representation (subtle)
      ctx.strokeStyle = 'rgba(220, 180, 140, 0.4)';
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(w * 0.5 - 5, liftY + 33);
      ctx.lineTo(w * 0.35, h * 0.25);
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(w * 0.5 + 5, liftY + 33);
      ctx.lineTo(w * 0.65, h * 0.25);
      ctx.stroke();

      // Kettlebell on floor
      const kettleX = w * 0.8;
      const kettleY = h * 0.65;
      
      // Kettlebell body
      ctx.fillStyle = '#2c2c2c';
      ctx.beginPath();
      ctx.ellipse(kettleX, kettleY, 20, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Kettlebell highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.beginPath();
      ctx.ellipse(kettleX - 8, kettleY - 10, 8, 12, 0, 0, Math.PI * 2);
      ctx.fill();

      // Kettlebell handle
      ctx.strokeStyle = '#444';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(kettleX, kettleY, 22, 0.3, Math.PI - 0.3);
      ctx.stroke();

      // Kettlebell weight label
      ctx.fillStyle = 'rgba(255, 100, 100, 0.8)';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('20KG', kettleX, kettleY + 3);

      // Glowing effect around equipment
      const glowGradient = ctx.createRadialGradient(w * 0.5, h * 0.4, 0, w * 0.5, h * 0.4, w * 0.6);
      glowGradient.addColorStop(0, 'rgba(59, 130, 246, 0.15)');
      glowGradient.addColorStop(1, 'rgba(59, 130, 246, 0)');
      ctx.fillStyle = glowGradient;
      ctx.fillRect(0, 0, w, h);

      // Ambient particles (energy/sweat effect)
      ctx.fillStyle = 'rgba(100, 200, 255, 0.2)';
      for (let i = 0; i < 3; i++) {
        const x = (w * 0.5 + Math.sin(time * 0.05 + i) * 40) % w;
        const y = (h * 0.4 + Math.cos(time * 0.04 + i * 0.5) * 30) % h;
        ctx.beginPath();
        ctx.arc(x, y, 1, 0, Math.PI * 2);
        ctx.fill();
      }

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

  return (
    <div className="gym-equipment">
      <canvas ref={canvasRef} className="gym-canvas" />
      <div className="gym-info">
        <h3>GYM</h3>
        <p>Full Equipment Setup</p>
      </div>
    </div>
  );
}
