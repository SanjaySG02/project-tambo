'use client';
import { useEffect, useRef } from 'react';

export default function SwimmingPool() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    let time = 0;
    let animationFrameId;

    // Wave simulation
    const waveAmplitude = 8;
    const waveFrequency = 0.05;
    const waveSpeed = 0.03;

    const getWaveHeight = (x, t) => {
      return Math.sin(x * waveFrequency + t * waveSpeed) * waveAmplitude +
             Math.sin(x * waveFrequency * 0.5 + t * waveSpeed * 1.3) * (waveAmplitude * 0.6);
    };

    const drawPool = () => {
      time += 0.5;

      // Draw quartz surround and pool base
      drawPoolBottom();

      // Draw water shimmer effects
      drawWaterSurface();

      // Draw pool steps
      drawLanes();

      // Draw water ripples
      drawRipples();

      animationFrameId = requestAnimationFrame(drawPool);
    };

    const drawPoolBottom = () => {
      const poolMargin = 40;
      
      // Dark background with subtle gradient
      const bgGradient = ctx.createLinearGradient(0, 0, 0, h);
      bgGradient.addColorStop(0, 'rgba(25, 30, 40, 0.4)');
      bgGradient.addColorStop(1, 'rgba(15, 20, 30, 0.6)');
      
      ctx.fillStyle = bgGradient;
      ctx.fillRect(0, 0, w, h);

      // Pool water area - top down view
      const poolX = poolMargin;
      const poolY = poolMargin;
      const poolWidth = w - poolMargin * 2;
      const poolHeight = h - poolMargin * 2;

      // Realistic water gradient with depth - enhanced like dumbbell metallic effect
      const waterGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, poolWidth / 2);
      waterGradient.addColorStop(0, 'rgba(120, 210, 245, 0.85)');
      waterGradient.addColorStop(0.3, 'rgba(85, 180, 230, 0.9)');
      waterGradient.addColorStop(0.6, 'rgba(60, 150, 210, 0.92)');
      waterGradient.addColorStop(1, 'rgba(40, 120, 180, 0.95)');
      
      ctx.fillStyle = waterGradient;
      ctx.beginPath();
      ctx.roundRect(poolX, poolY, poolWidth, poolHeight, 40);
      ctx.fill();

      // Pool floor tiles with realistic texture - like lounge wood grain
      const tileSize = 30;
      
      for (let x = poolX; x < poolX + poolWidth; x += tileSize) {
        for (let y = poolY; y < poolY + poolHeight; y += tileSize) {
          // Tile base with gradient
          const tileGradient = ctx.createLinearGradient(x, y, x + tileSize, y + tileSize);
          tileGradient.addColorStop(0, 'rgba(35, 90, 140, 0.4)');
          tileGradient.addColorStop(0.5, 'rgba(45, 105, 155, 0.35)');
          tileGradient.addColorStop(1, 'rgba(30, 85, 135, 0.45)');
          
          ctx.fillStyle = tileGradient;
          ctx.fillRect(x, y, tileSize, tileSize);
          
          // Tile edge with depth
          ctx.strokeStyle = 'rgba(25, 70, 120, 0.5)';
          ctx.lineWidth = 1.5;
          ctx.strokeRect(x, y, tileSize, tileSize);
          
          // Tile highlight for 3D effect
          ctx.strokeStyle = 'rgba(150, 200, 230, 0.15)';
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x + tileSize, y);
          ctx.stroke();
        }
      }

      // Thin white line around the water - enhanced with glow
      ctx.shadowColor = 'rgba(255, 255, 255, 0.4)';
      ctx.shadowBlur = 4;
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.roundRect(poolX, poolY, poolWidth, poolHeight, 40);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Inner pool edge shadow for depth - enhanced
      ctx.strokeStyle = 'rgba(0, 40, 80, 0.4)';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.roundRect(poolX + 2, poolY + 2, poolWidth - 4, poolHeight - 4, 39);
      ctx.stroke();
      
      // Additional inner shadow for more depth
      ctx.strokeStyle = 'rgba(0, 30, 60, 0.2)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(poolX + 4, poolY + 4, poolWidth - 8, poolHeight - 8, 38);
      ctx.stroke();
    };

    const drawWaterSurface = () => {
      const poolMargin = 40;
      const poolX = poolMargin;
      const poolY = poolMargin;
      const poolWidth = w - poolMargin * 2;
      const poolHeight = h - poolMargin * 2;

      // Subtle overall water shimmer without visible bubbles
      const shimmerGradient = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, poolWidth / 2);
      shimmerGradient.addColorStop(0, 'rgba(220, 245, 255, 0.08)');
      shimmerGradient.addColorStop(0.5, 'rgba(200, 235, 250, 0.04)');
      shimmerGradient.addColorStop(1, 'rgba(180, 220, 240, 0)');
      
      ctx.fillStyle = shimmerGradient;
      ctx.fillRect(poolX, poolY, poolWidth, poolHeight);
    };

    const drawLanes = () => {
      const poolMargin = 40;
      const poolX = poolMargin;
      const poolY = poolMargin;
      const poolWidth = w - poolMargin * 2;
      const poolHeight = h - poolMargin * 2;
      
      // Draw pool steps - top down view
      drawPoolSteps(poolX, poolY, poolWidth, poolHeight);
    };

    const drawPoolSteps = (poolX, poolY, poolWidth, poolHeight) => {
      // Entry steps on the left side - realistic texture like lounge furniture
      const stepWidth = 60;
      const stepDepth = 15;
      const numSteps = 4;
      
      const leftStepsX = poolX + poolWidth * 0.2;
      const leftStepsY = poolY;
      
      for (let i = 0; i < numSteps; i++) {
        // Step heavy shadow for depth
        ctx.fillStyle = 'rgba(0, 40, 80, 0.5)';
        ctx.fillRect(leftStepsX + 3, leftStepsY + i * stepDepth + 3, stepWidth, stepDepth);
        
        // Step surface with realistic gradient - like lounge wood texture
        const stepGradient = ctx.createLinearGradient(leftStepsX, leftStepsY + i * stepDepth, leftStepsX + stepWidth, leftStepsY + i * stepDepth);
        stepGradient.addColorStop(0, `rgba(${110 - i * 15}, ${190 - i * 20}, ${230 - i * 25}, 0.75)`);
        stepGradient.addColorStop(0.5, `rgba(${95 - i * 15}, ${175 - i * 20}, ${215 - i * 25}, 0.78)`);
        stepGradient.addColorStop(1, `rgba(${85 - i * 15}, ${165 - i * 20}, ${205 - i * 25}, 0.8)`);
        
        ctx.fillStyle = stepGradient;
        ctx.fillRect(leftStepsX, leftStepsY + i * stepDepth, stepWidth, stepDepth);
        
        // Step inner shadow
        ctx.fillStyle = `rgba(0, 30, 60, ${0.2 + i * 0.05})`;
        ctx.fillRect(leftStepsX, leftStepsY + i * stepDepth + stepDepth - 3, stepWidth, 3);
        
        // Step edge highlight - bright like metallic shine
        ctx.strokeStyle = 'rgba(220, 245, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(leftStepsX, leftStepsY + i * stepDepth);
        ctx.lineTo(leftStepsX + stepWidth, leftStepsY + i * stepDepth);
        ctx.stroke();
        
        // Step frame/border
        ctx.strokeStyle = `rgba(40, ${100 - i * 10}, ${150 - i * 15}, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(leftStepsX, leftStepsY + i * stepDepth, stepWidth, stepDepth);
        
        // Top highlight stripe
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(leftStepsX + 2, leftStepsY + i * stepDepth + 1, stepWidth - 4, 2);
      }
      
      // Exit steps on the right side
      const rightStepsX = poolX + poolWidth * 0.7;
      const rightStepsY = poolY;
      
      for (let i = 0; i < numSteps; i++) {
        // Step heavy shadow
        ctx.fillStyle = 'rgba(0, 40, 80, 0.5)';
        ctx.fillRect(rightStepsX + 3, rightStepsY + i * stepDepth + 3, stepWidth, stepDepth);
        
        // Step surface with gradient
        const stepGradient = ctx.createLinearGradient(rightStepsX, rightStepsY + i * stepDepth, rightStepsX + stepWidth, rightStepsY + i * stepDepth);
        stepGradient.addColorStop(0, `rgba(${110 - i * 15}, ${190 - i * 20}, ${230 - i * 25}, 0.75)`);
        stepGradient.addColorStop(0.5, `rgba(${95 - i * 15}, ${175 - i * 20}, ${215 - i * 25}, 0.78)`);
        stepGradient.addColorStop(1, `rgba(${85 - i * 15}, ${165 - i * 20}, ${205 - i * 25}, 0.8)`);
        
        ctx.fillStyle = stepGradient;
        ctx.fillRect(rightStepsX, rightStepsY + i * stepDepth, stepWidth, stepDepth);
        
        // Step inner shadow
        ctx.fillStyle = `rgba(0, 30, 60, ${0.2 + i * 0.05})`;
        ctx.fillRect(rightStepsX, rightStepsY + i * stepDepth + stepDepth - 3, stepWidth, 3);
        
        // Step edge highlight
        ctx.strokeStyle = 'rgba(220, 245, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(rightStepsX, rightStepsY + i * stepDepth);
        ctx.lineTo(rightStepsX + stepWidth, rightStepsY + i * stepDepth);
        ctx.stroke();
        
        // Step frame
        ctx.strokeStyle = `rgba(40, ${100 - i * 10}, ${150 - i * 15}, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(rightStepsX, rightStepsY + i * stepDepth, stepWidth, stepDepth);
        
        // Top highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(rightStepsX + 2, rightStepsY + i * stepDepth + 1, stepWidth - 4, 2);
      }
      
      // Bottom steps (far end)
      const bottomStepsX = poolX + poolWidth / 2 - stepWidth / 2;
      const bottomStepsY = poolY + poolHeight - numSteps * stepDepth;
      
      for (let i = 0; i < numSteps; i++) {
        // Step heavy shadow
        ctx.fillStyle = 'rgba(0, 40, 80, 0.5)';
        ctx.fillRect(bottomStepsX + 3, bottomStepsY + i * stepDepth + 3, stepWidth, stepDepth);
        
        // Step surface with gradient
        const stepGradient = ctx.createLinearGradient(bottomStepsX, bottomStepsY + i * stepDepth, bottomStepsX + stepWidth, bottomStepsY + i * stepDepth);
        stepGradient.addColorStop(0, `rgba(${110 - i * 15}, ${190 - i * 20}, ${230 - i * 25}, 0.75)`);
        stepGradient.addColorStop(0.5, `rgba(${95 - i * 15}, ${175 - i * 20}, ${215 - i * 25}, 0.78)`);
        stepGradient.addColorStop(1, `rgba(${85 - i * 15}, ${165 - i * 20}, ${205 - i * 25}, 0.8)`);
        
        ctx.fillStyle = stepGradient;
        ctx.fillRect(bottomStepsX, bottomStepsY + i * stepDepth, stepWidth, stepDepth);
        
        // Step inner shadow
        ctx.fillStyle = `rgba(0, 30, 60, ${0.2 + i * 0.05})`;
        ctx.fillRect(bottomStepsX, bottomStepsY + i * stepDepth + stepDepth - 3, stepWidth, 3);
        
        // Step edge highlight
        ctx.strokeStyle = 'rgba(220, 245, 255, 0.6)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(bottomStepsX, bottomStepsY + i * stepDepth);
        ctx.lineTo(bottomStepsX + stepWidth, bottomStepsY + i * stepDepth);
        ctx.stroke();
        
        // Step frame
        ctx.strokeStyle = `rgba(40, ${100 - i * 10}, ${150 - i * 15}, 0.6)`;
        ctx.lineWidth = 1.5;
        ctx.strokeRect(bottomStepsX, bottomStepsY + i * stepDepth, stepWidth, stepDepth);
        
        // Top highlight
        ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
        ctx.fillRect(bottomStepsX + 2, bottomStepsY + i * stepDepth + 1, stepWidth - 4, 2);
      }
      
      // Enhanced handrails with metallic texture
      drawHandrail(leftStepsX - 8, leftStepsY, leftStepsX - 8, leftStepsY + numSteps * stepDepth);
      drawHandrail(leftStepsX + stepWidth + 8, leftStepsY, leftStepsX + stepWidth + 8, leftStepsY + numSteps * stepDepth);
      
      drawHandrail(rightStepsX - 8, rightStepsY, rightStepsX - 8, rightStepsY + numSteps * stepDepth);
      drawHandrail(rightStepsX + stepWidth + 8, rightStepsY, rightStepsX + stepWidth + 8, rightStepsY + numSteps * stepDepth);
    };

    const drawHandrail = (x1, y1, x2, y2) => {
      // Handrail heavy shadow - like dumbbell shadow
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.moveTo(x1 + 2, y1 + 2);
      ctx.lineTo(x2 + 2, y2 + 2);
      ctx.stroke();
      
      // Handrail dark base
      ctx.strokeStyle = 'rgba(140, 145, 150, 0.85)';
      ctx.lineWidth = 6;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Handrail body - metallic chrome gradient like dumbbell bar
      const railGradient = ctx.createLinearGradient(x1 - 3, y1, x1 + 3, y1);
      railGradient.addColorStop(0, 'rgba(180, 185, 195, 0.9)');
      railGradient.addColorStop(0.3, 'rgba(220, 225, 230, 0.95)');
      railGradient.addColorStop(0.5, 'rgba(240, 245, 250, 1)');
      railGradient.addColorStop(0.7, 'rgba(210, 215, 225, 0.95)');
      railGradient.addColorStop(1, 'rgba(170, 175, 185, 0.9)');
      
      ctx.strokeStyle = railGradient;
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
      
      // Handrail top highlight - bright metallic shine
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(x1 - 1.5, y1);
      ctx.lineTo(x2 - 1.5, y2);
      ctx.stroke();
      
      // Handrail edge shine
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(x1 - 2, y1);
      ctx.lineTo(x2 - 2, y2);
      ctx.stroke();
    };

    const drawRipples = () => {
      const poolMargin = 40;
      const poolX = poolMargin;
      const poolY = poolMargin;
      const poolWidth = w - poolMargin * 2;
      const poolHeight = h - poolMargin * 2;
      
      // Subtle ripple lines without bubble appearance
      const centerX = w / 2;
      const centerY = h / 2;
      
      for (let ripple = 0; ripple < 3; ripple++) {
        const rippleRadius = ((time * 2 + ripple * 50) % 130) + 30;
        const rippleOpacity = Math.max(0, 1 - (rippleRadius / 160));
        
        ctx.globalAlpha = rippleOpacity * 0.12;
        ctx.strokeStyle = 'rgba(200, 240, 255, 0.5)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, rippleRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.globalAlpha = 1;
      }
    };

    drawPool();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
      }}
    />
  );
}
