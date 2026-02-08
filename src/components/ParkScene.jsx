"use client";
import { useEffect, useRef } from "react";
import "./ParkScene.css";

export default function ParkScene() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    const w = rect.width;
    const h = rect.height;

    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);

    let animationFrameId;
    let time = 0;




    const drawBench = () => {
      const benchWidth = 120;
      const benchX = w * 0.5 - benchWidth / 2;
      const benchY = h * 0.5;
      const benchHeight = 18;

      // Bench shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
      ctx.fillRect(benchX + 6, benchY + 18, benchWidth, 12);

      // Bench seat
      const seatGradient = ctx.createLinearGradient(benchX, benchY, benchX, benchY + benchHeight);
      seatGradient.addColorStop(0, '#5a3b24');
      seatGradient.addColorStop(0.6, '#6a4a30');
      seatGradient.addColorStop(1, '#3d2616');
      ctx.fillStyle = seatGradient;
      ctx.fillRect(benchX, benchY, benchWidth, benchHeight);

      // Seat slats
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.lineWidth = 1;
      for (let i = 6; i < benchWidth; i += 18) {
        ctx.beginPath();
        ctx.moveTo(benchX + i, benchY + 2);
        ctx.lineTo(benchX + i, benchY + benchHeight - 2);
        ctx.stroke();
      }

      // Backrest
      const backHeight = 38;
      ctx.fillStyle = seatGradient;
      ctx.fillRect(benchX, benchY - backHeight, benchWidth, backHeight - 6);

      // Legs
      ctx.fillStyle = '#2a1a0f';
      ctx.fillRect(benchX + 8, benchY + benchHeight, 8, 24);
      ctx.fillRect(benchX + benchWidth - 16, benchY + benchHeight, 8, 24);

      // Arm rest hint
      ctx.fillStyle = '#3b2716';
      ctx.fillRect(benchX - 6, benchY - backHeight + 6, 8, backHeight - 2);
      ctx.fillRect(benchX + benchWidth - 2, benchY - backHeight + 6, 8, backHeight - 2);
    };


    const drawLamp = () => {
      const lampX = w * 0.7;
      const lampHeight = h * 0.5;
      const lampY = h * 0.5 + 18 + 24 - lampHeight;

      // Lamp pole
      const poleGradient = ctx.createLinearGradient(lampX, lampY, lampX, lampY + lampHeight);
      poleGradient.addColorStop(0, '#3a3f46');
      poleGradient.addColorStop(0.5, '#5a616a');
      poleGradient.addColorStop(1, '#2a2f35');

      ctx.strokeStyle = poleGradient;
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(lampX, lampY);
      ctx.lineTo(lampX, lampY + lampHeight);
      ctx.stroke();

      // Lamp head
      ctx.fillStyle = '#4a515a';
      ctx.beginPath();
      ctx.roundRect(lampX - 18, lampY - 18, 36, 20, 6);
      ctx.fill();

      // Lamp glow
      const glow = ctx.createRadialGradient(lampX, lampY + 6, 0, lampX, lampY + 6, 60);
      glow.addColorStop(0, 'rgba(255, 230, 170, 0.45)');
      glow.addColorStop(0.6, 'rgba(255, 230, 170, 0.12)');
      glow.addColorStop(1, 'rgba(255, 230, 170, 0)');
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(lampX, lampY + 8, 60, 0, Math.PI * 2);
      ctx.fill();
    };


    const draw = () => {
      time = Date.now();

      // Clear canvas
      ctx.clearRect(0, 0, w, h);

      // Park elements
      drawBench();
      drawLamp();

      // Ambient glow
      const glowGradient = ctx.createRadialGradient(w / 2, h * 0.5, 0, w / 2, h * 0.5, w * 0.5);
      glowGradient.addColorStop(0, 'rgba(16, 185, 129, 0.1)');
      glowGradient.addColorStop(1, 'rgba(16, 185, 129, 0)');
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

  return <canvas ref={canvasRef} className="park-canvas" />;
}
