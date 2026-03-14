"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

interface Node {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
}

export default function LandingPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isDarkening, setIsDarkening] = useState(false);
  const [bubbles, setBubbles] = useState<Bubble[]>([]);

  /*
  =========================
  Scroll progress
  =========================
  */

  useEffect(() => {
    let ticking = false;
    let targetProgress = 0;

    const handleScroll = () => {
      targetProgress = Math.min(
        window.scrollY / (window.innerHeight * 1.5),
        1
      );

      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollProgress(targetProgress);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /*
  =========================
  Start transition
  =========================
  */

  useEffect(() => {
    if (scrollProgress >= 1 && !isTransitioning) {
      setIsTransitioning(true);
    }
  }, [scrollProgress]);

  /*
  =========================
  Spawn bubbles
  =========================
  */

  useEffect(() => {
    if (!isTransitioning) return;

    let id = 0;

    const spawn = () => {
      setBubbles((prev) => [
        ...prev,
        {
          id: id++,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: 40 + Math.random() * 80,
        },
      ]);
    };

    const interval = setInterval(spawn, 50);

    setTimeout(() => {
      clearInterval(interval);
      setIsDarkening(true);
    }, 1000);

    return () => clearInterval(interval);
  }, [isTransitioning]);

  /*
  =========================
  Redirect
  =========================
  */

  useEffect(() => {
    if (!isDarkening) return;

    const timer = setTimeout(() => {
      router.push("/app");
    }, 700);

    return () => clearTimeout(timer);
  }, [isDarkening, router]);

  return (
    <main
      className="h-[300vh] w-full relative background-pattern bg-background"
    >
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-full h-full pointer-events-auto"
      />

      {/* Center content */}
      <div className="fixed inset-0 z-10 flex items-center justify-center pointer-events-none">
        <div className="text-center px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1
              className="text-6xl font-barlow md:text-8xl font-bold mb-4"
            >
              GRAPH SURF
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl mb-12 font-light font-geist"
          >
            novel, graph-based web exploration
          </motion.p>

          {/* Scroll CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isTransitioning ? 0 : 1 }}
            className="flex flex-col items-center gap-3"
          >
            <span
              className="text-lg font-light font-jet"
              style={{ color: "oklch(0.72 0.04 67.03 / 0.6)" }}
            >
              Scroll
            </span>

            <motion.svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="oklch(0.72 0.04 67.03 / 0.6)"
              strokeWidth="2"
              animate={{ y: [0, 8, 0] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
              }}
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </motion.svg>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-20"
        animate={{ opacity: isTransitioning ? 0 : 1 }}
      >
        <div
          className="w-6 h-10 rounded-full flex justify-center overflow-hidden relative"
          style={{
            border: `2px solid oklch(0.53 0.16 254.20)`,
          }}
        >
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: `${scrollProgress * 100}%`,
              background: "oklch(0.53 0.16 254.20)",
            }}
          />
        </div>
      </motion.div>

      {/* Bubble animation */}
      <AnimatePresence>
        {isTransitioning &&
          bubbles.map((bubble) => (
            <motion.div
              key={bubble.id}
              initial={{ scale: 0 }}
              animate={{ scale: 20 }}
              transition={{ duration: 1.1 }}
              className="fixed rounded-full z-40"
              style={{
                left: bubble.x,
                top: bubble.y,
                width: bubble.size,
                height: bubble.size,
                background: "#01438d",
              }}
            />
          ))}
      </AnimatePresence>

      {/* Darkening */}
      <AnimatePresence>
        {isDarkening && (
          <motion.div
            className="fixed inset-0 z-50"
            style={{ background: "oklch(0.23 0.07 254.08)" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        )}
      </AnimatePresence>
    </main>
  );
}