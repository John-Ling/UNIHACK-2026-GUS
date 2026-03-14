"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    const nodes: Node[] = [];
    const nodeCount = 40;
    const connectionDistance = 150;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 3 + 2,
      });
    }

    let mouseX = canvas.width / 2;
    let mouseY = canvas.height / 2;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    };
    window.addEventListener("mousemove", handleMouseMove);

    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        const dx = mouseX - node.x;
        const dy = mouseY - node.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          node.x += dx * 0.01;
          node.y += dy * 0.01;
        }
      });

      nodes.forEach((node, i) => {
        for (let j = i + 1; j < nodes.length; j++) {
          const other = nodes[j];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            const alpha = (1 - dist / connectionDistance) * 0.4;
            ctx.beginPath();
            ctx.strokeStyle = `oklch(0.53 0.16 254.20 / ${alpha})`;
            ctx.lineWidth = 1;
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        }
      });

      nodes.forEach((node) => {
        ctx.beginPath();
        ctx.fillStyle = "oklch(0.53 0.16 254.20)";
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(animationId);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    let targetProgress = 0;

    const handleScroll = () => {
      targetProgress = Math.min(window.scrollY / (window.innerHeight * 1.5), 1);

      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollProgress(targetProgress);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollProgress >= 1) {
      router.push("/app");
    }
  }, [scrollProgress, router]);

  return (
    <main
      className="h-[300vh] w-full relative"
      style={{ background: "oklch(0.23 0.07 254.08)" }}
    >
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-auto"
      />

      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1
              className="text-6xl md:text-8xl font-bold mb-4 tracking-tight"
              style={{ color: "oklch(0.80 0.05 66.97)" }}
            >
              Graph surf
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-xl md:text-2xl mb-12 font-light"
            style={{ color: "oklch(0.72 0.04 67.03)" }}
          >
            A more fun way to browse the web
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          >
            <span
              className="inline-block px-10 py-4 text-lg font-medium rounded-full pointer-events-auto"
              style={{
                background: "oklch(0.53 0.16 254.20)",
                color: "oklch(0.80 0.05 66.97)",
                boxShadow: "0 0 40px oklch(0.53 0.16 254.20 / 0.3)",
              }}
            >
              Scroll to explore
            </span>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        <div
          className="w-6 h-10 rounded-full flex justify-center overflow-hidden transition-all duration-200 ease-out relative"
          style={{
            border: `2px solid ${scrollProgress > 0 ? "oklch(0.53 0.16 254.20)" : "oklch(0.31 0.06 253.41)"}`,
            boxShadow:
              scrollProgress > 0
                ? `0 0 20px oklch(0.53 0.16 254.20 / ${0.3 + scrollProgress * 0.7})`
                : "none",
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${scrollProgress * 100}%`,
              background: "oklch(0.53 0.16 254.20)",
              opacity: 0.8,
            }}
          />
          <motion.div
            className="w-1.5 h-1.5 rounded-full relative z-10"
            style={{
              background: "oklch(0.53 0.16 254.20)",
              boxShadow:
                scrollProgress > 0
                  ? `0 0 10px oklch(0.53 0.16 254.20 / ${0.5 + scrollProgress * 0.5})`
                  : "none",
            }}
            animate={{
              y: scrollProgress > 0 ? 0 : [0, 12, 0],
              opacity: scrollProgress > 0 ? 0 : 1,
            }}
            transition={{
              y: { duration: 1.5, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        </div>
      </motion.div>
    </main>
  );
}
