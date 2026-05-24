/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface LoaderProps {
  onComplete: () => void;
}

export default function Loader({ onComplete }: LoaderProps) {
  const [progress, setProgress] = useState(0);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Elegant incremental counting that slows down near the end
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsDone(true);
            setTimeout(onComplete, 800); // Allow time for exit animation
          }, 600);
          return 100;
        }
        
        // Dynamic increments to look organic
        const remaining = 100 - prev;
        const increment = Math.max(1, Math.min(12, Math.floor(Math.random() * remaining * 0.25) + 1));
        return prev + increment;
      });
    }, 70);

    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          id="premium-loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0D0D0D] text-[#F8F5F0] overflow-hidden"
        >
          {/* Subtle moving light particles representing blessings */}
          <div className="absolute inset-0 bg-african-pattern opacity-10 pointer-events-none" />
          
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D0D0D] to-[#0D0D0D]" />

          {/* Luxury Seal Container */}
          <div className="relative flex flex-col items-center max-w-md px-6 text-center z-10">
            {/* Spinning Golden Geometric African Ring */}
            <div className="relative w-44 h-44 flex items-center justify-center mb-8">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 25, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-dashed border-[#D4AF37]/43"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                className="absolute inset-2 rounded-full border border-[#D4AF37]/20"
              />
              <motion.div
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                className="absolute inset-4 rounded-full bg-gradient-to-br from-[#20130B]/80 to-[#0D0D0D]/90 border border-[#D4AF37]/50 flex flex-col items-center justify-center shadow-[0_0_40px_rgba(212,175,55,0.25)]"
              />
              
              {/* Central Age Symbol */}
              <div className="relative z-10 flex flex-col items-center justify-center">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="font-serif text-5xl font-bold text-gold-gradient tracking-tight"
                >
                  50
                </motion.span>
                <span className="font-sans text-[9px] uppercase tracking-[0.3em] text-[#D4AF37]/80 mt-1">
                  ANS
                </span>
              </div>
            </div>

            {/* Glowing Text Group */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="space-y-2 mt-4"
            >
              <h1 className="font-serif text-3xl font-light tracking-wide text-[#F8F5F0]">
                Grâce &amp; Bénédictions
              </h1>
              <p className="font-sans text-xs tracking-[0.25em] text-[#D4AF37] uppercase">
                Chic Africain • 2026
              </p>
            </motion.div>

            {/* Progress counter & bar */}
            <div className="w-48 mt-12 space-y-2">
              <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#D4AF37]/75">
                <span>VIP ENTRANCE</span>
                <span>{progress}%</span>
              </div>
              <div className="h-[2px] w-full bg-[#D4AF37]/10 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gold-gradient rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Side quotes fading in sequence based on progress */}
          <div className="absolute bottom-12 text-center max-w-xs px-4">
            <p className="font-serif italic text-sm text-[#F8F5F0]/60">
              {progress < 40 && "Célébrer la sagesse..."}
              {progress >= 40 && progress < 80 && "Honorer le parcours d'une vie..."}
              {progress >= 80 && "Bienvenue à la soirée d'une vie."}
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
