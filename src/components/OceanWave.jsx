import { useEffect, useRef } from 'react';
import './OceanWave.css';

// Canvas-based adaptive ocean wave component
export default function OceanWave({ colorTop = '#E6F7FF', colorMid = '#63C3FF', colorBottom = '#0066B3', horizon = 0.35, showSun = true }) {
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
    let t = 0;

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

    function draw() {
      t += 0.02;
      // clear
      ctx.clearRect(0, 0, width, height);
      // background gradient sea
      const g = ctx.createLinearGradient(0, 0, 0, height);
      // top: light sky, mid: sea surface at `horizon`, bottom: deep sea
      g.addColorStop(0, colorTop);
      g.addColorStop(Math.max(0, Math.min(1, horizon)), colorMid);
      g.addColorStop(1, colorBottom);
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, width, height);

      // draw a subtle horizon seam to separate sky and sea
      const horizonY = Math.max(0, Math.min(1, horizon)) * height;
      // thin highlight above horizon
      ctx.fillStyle = 'rgba(255,255,255,0.12)';
      ctx.fillRect(0, Math.max(0, horizonY - 2), width, 2);
      // slight darker band below horizon for depth
      ctx.fillStyle = 'rgba(0,0,0,0.06)';
      ctx.fillRect(0, Math.max(0, horizonY), width, 2);

      // optional sun: draw near the upper-right area with soft halo
      if (showSun) {
        const sx = width * 0.78;
        const sy = Math.max(20, height * 0.12);
        const sr = Math.min(width, height) * 0.08;

        const halo = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr * 3);
        halo.addColorStop(0, 'rgba(255,250,210,0.9)');
        halo.addColorStop(0.4, 'rgba(255,200,90,0.5)');
        halo.addColorStop(1, 'rgba(255,180,60,0.0)');
        ctx.fillStyle = halo;
        ctx.beginPath();
        ctx.arc(sx, sy, sr * 3, 0, Math.PI * 2);
        ctx.fill();

        const core = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        core.addColorStop(0, '#fffbe6');
        core.addColorStop(0.5, '#fff0b8');
        core.addColorStop(1, 'rgba(255,200,90,0.0)');
        ctx.fillStyle = core;
        ctx.beginPath();
        ctx.arc(sx, sy, sr, 0, Math.PI * 2);
        ctx.fill();
      }

      // multiple layered sine waves
      const layers = [
        { amp: Math.max(6, height * 0.02), freq: 0.008, speed: 0.6, alpha: 0.35, yOff: height * 0.6 },
        { amp: Math.max(10, height * 0.03), freq: 0.01, speed: 0.9, alpha: 0.25, yOff: height * 0.65 },
        { amp: Math.max(16, height * 0.05), freq: 0.015, speed: 1.2, alpha: 0.18, yOff: height * 0.72 },
      ];

      layers.forEach((L, idx) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 2) {
          const y = L.yOff + Math.sin((x * L.freq) + (t * L.speed)) * L.amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = `rgba(255,255,255,${L.alpha * 0.12})`;
        // subtle highlight fill
        ctx.fill();
      });

      // white foam crest on topmost wave
      const top = layers[layers.length - 1];
      ctx.beginPath();
      for (let x = 0; x <= width; x += 2) {
        const y = top.yOff + Math.sin((x * top.freq) + (t * top.speed)) * top.amp;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.lineWidth = 2;
      ctx.strokeStyle = 'rgba(255,255,255,0.9)';
      ctx.stroke();

      raf = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    raf = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(raf);
    };
  }, [colorTop, colorMid, colorBottom]);

  return (
    <div ref={ref} className="ocean-wave-container">
      <canvas ref={canvasRef} />
    </div>
  );
}
