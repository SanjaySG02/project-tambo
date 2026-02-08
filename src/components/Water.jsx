"use client";
import { useRef, useEffect } from 'react';
import './Water.css';

export default function Water({ style = {}, className = '' }) {
  const ref = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    const container = ref.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    let raf = null;

    let width = 0;
    let height = 0;

    const drops = [];
    const splashParticles = [];
    const splashes = [];

    function resize() {
      const rect = container.getBoundingClientRect();
      width = Math.max(100, Math.floor(rect.width));
      height = Math.max(100, Math.floor(rect.height));
      canvas.width = width * devicePixelRatio;
      canvas.height = height * devicePixelRatio;
      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';
      ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    }

    function spawnDrop() {
      const x = Math.random() * width;
      const y = -20;
      const vx = (Math.random() - 0.5) * 2.2;
      const vy = 3 + Math.random() * 4;
      const r = 3 + Math.random() * 7;
      drops.push({ x, y, vx, vy, r, life: 0, rippleCreated: false, deform: 1 });
    }

    function createSplash(x, y, power = 1) {
      // create splash crown effect with particles
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const speed = 3 + Math.random() * 2.5;
        splashParticles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - 2,
          r: 1.5 + Math.random() * 2,
          life: 0,
          alpha: 0.9
        });
      }
      splashes.push({ x, y, r: 2, age: 0, height: 8 + Math.random() * 4 });
    }

    // initial drops
    for (let i = 0; i < 6; i++) spawnDrop();

    // reuse ripples storage on canvas
    if (!canvas._ripples) canvas._ripples = [];

    let spawnTimer = 0;

    function draw() {
      spawnTimer++;
      if (spawnTimer > 22) {
        if (Math.random() < 0.7) spawnDrop();
        spawnTimer = 0;
      }

      ctx.clearRect(0, 0, width, height);

      // background gradient: sky -> sea
      const g = ctx.createLinearGradient(0, 0, 0, height);
      g.addColorStop(0, '#E6F7FF');
      g.addColorStop(0.35, '#63C3FF');
      g.addColorStop(1, '#0066B3');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // subtle horizon seam
      const horizonY = Math.max(0, Math.min(1, 0.35)) * height;
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(0, Math.max(0, horizonY - 2), width, 2);
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, Math.max(0, horizonY), width, 2);

      // draw drops
      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vy += 0.14; // gravity
        d.vx *= 0.999; // air resistance
        d.life++;
        // deformation based on velocity
        d.deform = 1 + Math.abs(d.vy) * 0.08;

        // when hitting water surface create splash & ripples
        if (d.y > height * 0.72 && !d.rippleCreated) {
          d.rippleCreated = true;
          createSplash(d.x, height * 0.72, d.vy);
          canvas._ripples.push({ x: d.x, y: height * 0.72, r: 2 + Math.random() * 4, alpha: 0.9, age: 0 });
        }

        // draw realistic droplet with highlight
        const dropGrad = ctx.createRadialGradient(d.x - d.r/3, d.y - d.r/3, 0, d.x, d.y, d.r);
        dropGrad.addColorStop(0, 'rgba(255,255,255,1)');
        dropGrad.addColorStop(0.6, 'rgba(200,240,255,0.8)');
        dropGrad.addColorStop(1, 'rgba(100,180,220,0.6)');
        ctx.beginPath();
        ctx.fillStyle = dropGrad;
        ctx.ellipse(d.x, d.y, d.r, d.r * d.deform, 0, 0, Math.PI * 2);
        ctx.fill();
        // highlight
        ctx.beginPath();
        ctx.fillStyle = 'rgba(255,255,255,0.7)';
        ctx.ellipse(d.x - d.r/2.5, d.y - d.r/2, d.r/3, d.r/4, -0.4, 0, Math.PI * 2);
        ctx.fill();

        if (d.life > 500 || d.y > height + 50) drops.splice(i, 1);
      }

      // draw splash particles
      for (let i = splashParticles.length - 1; i >= 0; i--) {
        const p = splashParticles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.18;
        p.life++;
        p.alpha = Math.max(0, 0.9 - p.life / 35);
        ctx.beginPath();
        ctx.fillStyle = `rgba(150,210,255,${p.alpha})`;
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        if (p.life > 40) splashParticles.splice(i, 1);
      }

      // draw crown splashes
      for (let i = splashes.length - 1; i >= 0; i--) {
        const s = splashes[i];
        s.age++;
        const progress = Math.min(1, s.age / 8);
        const arch = Math.sin(progress * Math.PI) * s.height;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${0.8 * (1 - progress)})`;
        ctx.lineWidth = 1.5;
        ctx.arc(s.x, s.y - arch, s.r + progress * 6, 0, Math.PI * 2);
        ctx.stroke();
        if (s.age > 12) splashes.splice(i, 1);
      }

      // ripples
      const ripples = canvas._ripples;
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.age++;
        r.r += 0.6 + r.age * 0.02;
        r.alpha *= 0.993;
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,255,255,${Math.max(0, r.alpha * 0.6)})`;
        ctx.lineWidth = Math.max(0.6, 2 * (1 / (1 + r.age * 0.02)));
        ctx.arc(r.x, r.y, r.r, 0, Math.PI * 2);
        ctx.stroke();
        if (r.alpha < 0.02) ripples.splice(i, 1);
      }

      raf = requestAnimationFrame(draw);
    }

    function start() {
      resize();
      window.addEventListener('resize', resize);
      raf = requestAnimationFrame(draw);
    }

    start();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div ref={ref} className={`water-card ${className}`} style={{ position: 'absolute', inset: 0, ...style }}>
      <canvas ref={canvasRef} />
    </div>
  );
}
