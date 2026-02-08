'use client';

import { useEffect, useRef } from 'react';
import './Dumbbell.css';

export default function Dumbbell() {
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

    // Draw metallic weight plate with realistic shading
    const drawMetallicPlate = (x, y, size) => {
      ctx.save();
      ctx.translate(x, y);

      // Heavy shadow for depth - more aggressive
      ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.85, size * 0.7, size * 0.35, 0, 0, Math.PI * 2);
      ctx.fill();

      // Inner dark shadow layer
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.arc(0, 0, size * 0.95, 0, Math.PI * 2);
      ctx.fill();

      // Metallic gradient - dramatically darker
      const metalGradient = ctx.createRadialGradient(
        -size * 0.25, -size * 0.25, size * 0.1,
        0, 0, size * 1.3
      );
      metalGradient.addColorStop(0, '#3a3a3a');
      metalGradient.addColorStop(0.2, '#1a1a1a');
      metalGradient.addColorStop(0.5, '#0a0a0a');
      metalGradient.addColorStop(0.8, '#000000');
      metalGradient.addColorStop(1, '#000000');
      
      ctx.fillStyle = metalGradient;
      ctx.beginPath();
      ctx.arc(0, 0, size, 0, Math.PI * 2);
      ctx.fill();

      // Strong edge rim light - aggressive metallic shine
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(0, 0, size - 1.5, 0, Math.PI * 2);
      ctx.stroke();

      // Bottom shadow on edge
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.beginPath();
      ctx.ellipse(0, size * 0.75, size * 0.85, size * 0.25, 0, 0, Math.PI);
      ctx.fill();

      // Concentric circles - weight plate style
      ctx.strokeStyle = 'rgba(150, 150, 150, 0.2)';
      ctx.lineWidth = 1;
      
      // Draw 3 concentric rings for weight plate appearance
      for (let ring = 1; ring <= 3; ring++) {
        const ringRadius = size * (0.35 + ring * 0.2);
        ctx.beginPath();
        ctx.arc(0, 0, ringRadius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Weight text/number - more prominent
      ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
      ctx.font = 'bold ' + (size * 0.9) + 'px Arial';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('25', 0, 1);

      ctx.restore();
    };

    // Draw realistic leather grip
    const drawLeatherGrip = (x, y, width, height) => {
      ctx.save();
      ctx.translate(x, y);

      // Grip shadow - stronger for depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(-width / 2, -height / 2, width, height + 4);

      // Leather gradient - darker and more aggressive
      const gripGradient = ctx.createLinearGradient(0, -height / 2, 0, height / 2);
      gripGradient.addColorStop(0, '#3a2a3a');
      gripGradient.addColorStop(0.3, '#2a1a3a');
      gripGradient.addColorStop(0.7, '#3a2a4a');
      gripGradient.addColorStop(1, '#1a0a2a');
      ctx.fillStyle = gripGradient;
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, 7);
      ctx.fill();

      // Knurling texture (diagonal cross-hatch) - more aggressive
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.45)';
      ctx.lineWidth = 0.8;

      // Diagonal lines - one direction
      for (let i = -width / 2; i < width / 2; i += 3) {
        ctx.beginPath();
        ctx.moveTo(i, -height / 2);
        ctx.lineTo(i + height * 0.45, height / 2);
        ctx.stroke();
      }

      // Diagonal lines - opposite direction
      ctx.strokeStyle = 'rgba(80, 80, 80, 0.4)';
      for (let i = -width / 2; i < width / 2; i += 3) {
        ctx.beginPath();
        ctx.moveTo(i, height / 2);
        ctx.lineTo(i - height * 0.45, -height / 2);
        ctx.stroke();
      }

      // Grip edge highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-width / 2, -height / 2, width, height, 7);
      ctx.stroke();

      // Center line highlight - stronger for definition
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -height / 2 + 2);
      ctx.lineTo(0, height / 2 - 2);
      ctx.stroke();

      ctx.restore();
    };

    // Draw metallic bar with realistic finish
    const drawMetallicBar = (x1, y1, x2, y2, thickness) => {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const ux = dx / len;
      const uy = dy / len;
      const px = -uy * thickness / 2;
      const py = ux * thickness / 2;

      // Bar body with gradient - darker steel for masculine look
      const barGradient = ctx.createLinearGradient(
        x1 + px, y1 + py,
        x1 - px, y1 - py
      );
      barGradient.addColorStop(0, '#5a5a5a');
      barGradient.addColorStop(0.3, '#8a8a8a');
      barGradient.addColorStop(0.5, '#a0a0a0');
      barGradient.addColorStop(0.7, '#7a7a7a');
      barGradient.addColorStop(1, '#404040');
      
      ctx.fillStyle = barGradient;
      ctx.beginPath();
      ctx.moveTo(x1 + px, y1 + py);
      ctx.lineTo(x2 + px, y2 + py);
      ctx.lineTo(x2 - px, y2 - py);
      ctx.lineTo(x1 - px, y1 - py);
      ctx.closePath();
      ctx.fill();

      // Bar highlight - stronger for angular look
      ctx.fillStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.beginPath();
      ctx.moveTo(x1 - uy * thickness * 0.15, y1 + ux * thickness * 0.15);
      ctx.lineTo(x2 - uy * thickness * 0.15, y2 + ux * thickness * 0.15);
      ctx.lineWidth = thickness * 0.4;
      ctx.stroke();

      // Thread detailing
      ctx.strokeStyle = 'rgba(100, 100, 100, 0.3)';
      ctx.lineWidth = 0.8;
      for (let i = 0; i < 25; i++) {
        const t = i / 25;
        const px_thread = x1 + dx * t;
        const py_thread = y1 + dy * t;
        const tx = -uy * 4;
        const ty = ux * 4;
        ctx.beginPath();
        ctx.moveTo(px_thread - tx, py_thread - ty);
        ctx.lineTo(px_thread + tx, py_thread + ty);
        ctx.stroke();
      }
    };

    const draw = () => {
      time += 0.008;

      // Background
      const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
      bgGradient.addColorStop(0, 'rgba(30, 30, 40, 0.2)');
      bgGradient.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      // Center position with lift animation - positioned higher to avoid text
      const centerX = w / 2;
      const centerY = h * 0.35 + Math.sin(time * 0.025) * 12;
      const rotationZ = Math.sin(time * 0.015) * 0.25;
      const rotationX = Math.sin(time * 0.02) * 0.15;

      // Apply 3D-like transformation with scaling
      ctx.save();

      // Scale the dumbbell - increased for masculine look while avoiding text
      const scale = 0.72;
      ctx.translate(centerX, centerY);
      ctx.scale(scale, scale);

      // Skew effect for perspective
      const skewAmount = rotationX * 0.15;
      ctx.transform(1, skewAmount, 0, 1, 0, 0);

      // Draw left bar (with realistic metallic finish) - thicker for masculine look
      const barStartX = -90;
      const barEndX = -45;
      const barY = Math.sin(rotationZ) * 5;
      
      drawMetallicBar(barStartX, barY, barEndX, barY, 13);

      // Draw right bar
      const barStartX2 = 90;
      const barEndX2 = 45;
      drawMetallicBar(barStartX2, barY, barEndX2, barY, 13);

      // Draw left plate with realistic metallic shading - larger for masculine look
      drawMetallicPlate(barStartX - 40, barY, 42);

      // Draw right plate with realistic metallic shading
      drawMetallicPlate(barStartX2 + 40, barY, 42);

      // Draw grip with realistic leather texture - larger and more aggressive
      drawLeatherGrip(-20, barY, 50, 38);
      drawLeatherGrip(20, barY, 50, 38);

      ctx.restore();

      // Ambient glow
      const glowGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 150);
      glowGradient.addColorStop(0, 'rgba(139, 92, 246, 0.1)');
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

  return <canvas ref={canvasRef} className="dumbbell-canvas" />;
}
