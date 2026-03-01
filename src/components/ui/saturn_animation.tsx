"use client";

import React, { useEffect, useRef } from "react";
import { motion } from "framer-motion";

export function SaturnAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);
  const timeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener("resize", resize);

    const draw = (t: number) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      ctx.clearRect(0, 0, w, h);

      const cx = w * 0.5;
      const cy = h * 0.55;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(0);

      const planetR = Math.min(w, h) * 0.11;
      const spinAngle = t * 0.00005; // slower self-rotation

      ctx.save();
      ctx.rotate(spinAngle);

      const glow = ctx.createRadialGradient(0, 0, planetR * 0.08, 0, 0, planetR * 1.7);
      glow.addColorStop(0, "rgba(139, 92, 246, 0.28)");
      glow.addColorStop(0.55, "rgba(99, 102, 241, 0.16)");
      glow.addColorStop(1, "rgba(34, 211, 238, 0)");
      ctx.fillStyle = glow;
      ctx.beginPath();
      ctx.arc(0, 0, planetR * 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Planet banding patterns (rotate with planet)
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, planetR * 1.4, 0, Math.PI * 2);
      ctx.clip();
      const bands = [
        { y: -0.75, h: 0.18, c1: "rgba(5, 31, 92, 0.28)", c2: "rgba(5, 23, 66, 0.24)" },  // #051F5C to #051742
        { y: -0.45, h: 0.12, c1: "rgba(5, 23, 66, 0.26)", c2: "rgba(15, 31, 68, 0.22)" },  // #051742 to #0F1F44
        { y: -0.2, h: 0.18, c1: "rgba(15, 31, 68, 0.26)", c2: "rgba(10, 21, 46, 0.22)" }, // #0F1F44 to #0A152E
        { y: 0.05, h: 0.22, c1: "rgba(10, 21, 46, 0.24)", c2: "rgba(6, 12, 26, 0.2)" },   // #0A152E to #060C1A
        { y: 0.32, h: 0.16, c1: "rgba(5, 31, 92, 0.22)", c2: "rgba(15, 31, 68, 0.2)" },    // return to deeper blue
      ];

      bands.forEach((b) => {
        const grad = ctx.createLinearGradient(0, planetR * b.y, 0, planetR * (b.y + b.h));
        grad.addColorStop(0, b.c1);
        grad.addColorStop(1, b.c2);
        ctx.fillStyle = grad;
        ctx.fillRect(-planetR * 1.5, planetR * b.y, planetR * 3, planetR * b.h);
      });
      ctx.restore();
      ctx.restore();

      const rings = [
        // D (faint inner)
        { rx: planetR * 2.9, ry: planetR * 1.3, alpha: 0.12, wobble: 0.10, speed: 0.11 },
        // C (main bright)
        { rx: planetR * 3.6, ry: planetR * 1.6, alpha: 0.46, wobble: 0.10, speed: 0.10 },
        // B (main bright)
        { rx: planetR * 4.5, ry: planetR * 2.0, alpha: 0.52, wobble: 0.12, speed: 0.09 },
        // A (main bright)
        { rx: planetR * 5.4, ry: planetR * 2.35, alpha: 0.36, wobble: 0.14, speed: 0.08 },
        // F (narrow)
        { rx: planetR * 5.9, ry: planetR * 2.55, alpha: 0.28, wobble: 0.12, speed: 0.095 },
        // G (faint)
        { rx: planetR * 6.5, ry: planetR * 2.85, alpha: 0.14, wobble: 0.16, speed: 0.07 },
        // E (diffuse outer)
        { rx: planetR * 7.4, ry: planetR * 3.25, alpha: 0.09, wobble: 0.18, speed: 0.06 },
      ];

      rings.forEach((ring, i) => {
        const wobble = Math.sin(t * 0.00012 + i * 0.8) * planetR * ring.wobble;
        const rx = ring.rx + wobble;
        const ry = ring.ry + wobble * 0.65;

        const grad = ctx.createLinearGradient(-rx, 0, rx, 0);
        grad.addColorStop(0, "rgba(139, 92, 246, 0)");
        grad.addColorStop(0.18, "rgba(139, 92, 246, 0.5)");
        grad.addColorStop(0.5, "rgba(99, 102, 241, 0.6)");
        grad.addColorStop(0.78, "rgba(34, 211, 238, 0.55)");
        grad.addColorStop(1, "rgba(34, 211, 238, 0)");

        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.3 + i * 0.45;
        ctx.globalAlpha = ring.alpha;
        ctx.setLineDash([]);
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      // Orbit particles (previous motion)
      ctx.globalAlpha = 0.78;
      const particles = Array.from({ length: 10 }, (_, i) => ({
        band: 3.6 + i * 0.35,
        phase: i * 0.7,
        speed: 0.00005 + i * 0.00001,
        size: 1.0 + (i % 3) * 0.35,
      }));

      particles.forEach((p, idx) => {
        const angle = p.phase + t * p.speed;
        const radius = planetR * p.band;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius * 0.6;
        const size = p.size;

        ctx.save();
        ctx.rotate(-0.08 * idx);
        const grad = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        grad.addColorStop(0, "rgba(255, 255, 255, 0.65)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0)");
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(x, y, size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      ctx.globalAlpha = 1;
      ctx.restore();
    };

    const animate = () => {
      timeRef.current += 16;
      draw(timeRef.current);
      rafRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <motion.canvas
      ref={canvasRef}
      className="fixed inset-0 z-[2] pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.5 }}
    />
  );
}
