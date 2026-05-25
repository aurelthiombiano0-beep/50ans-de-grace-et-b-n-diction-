/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isCompleted: boolean;
}

export default function Countdown() {
  const targetDate = new Date("2026-05-26T18:00:00Z");

  const calculateTimeRemaining = (): TimeRemaining => {
    const now = new Date();
    const difference = targetDate.getTime() - now.getTime();

    if (difference <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isCompleted: true };
    }

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { days, hours, minutes, seconds, isCompleted: false };
  };

  const [timeLeft, setTimeLeft] = useState<TimeRemaining>(calculateTimeRemaining());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeRemaining());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const timeBlocks = [
    { label: "Jours", value: timeLeft.days },
    { label: "Heures", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Secondes", value: timeLeft.seconds },
  ];

  return (
    <div className="flex flex-col items-center justify-center space-y-8 w-full max-w-4xl mx-auto py-6">
      <div className="text-center space-y-1.5 px-4">
        <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-bold">
          L'Incontournable Rendez-vous
        </span>
        <h3 className="font-serif text-3xl font-light text-[#F8F5F0]">
          Le Compte à Rebours de la <span className="text-gold-gradient italic font-bold">Grâce</span>
        </h3>
      </div>

      {timeLeft.isCompleted ? (
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="p-8 text-center bg-gradient-to-r from-[#20130B] via-[#0D0D0D] to-[#20130B] border border-[#D4AF37] rounded-2xl shadow-[0_10px_30px_rgba(212,175,55,0.2)]"
        >
          <h4 className="font-serif text-3xl font-medium text-gold-gradient tracking-wide mb-2">
            La célébration a commencé !
          </h4>
          <p className="font-sans text-sm text-[#F8F5F0]/80">
            Rejoignez-nous dès maintenant à la Salle KADIOGO de l'Azalaï Hôtel Ouagadougou.
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full px-4 max-w-2xl">
          {timeBlocks.map((block, idx) => (
            <motion.div
              key={block.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="relative group overflow-hidden p-6 rounded-2xl bg-[#141414]/93 border border-[#D4AF37]/15 flex flex-col items-center text-center shadow-lg hover:border-[#D4AF37]/50 transition-colors"
            >
              {/* Subtle visual glow on block highlight */}
              <div className="absolute inset-0 bg-gradient-to-b from-[#D4AF37]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

              {/* Number with individual key animations */}
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={block.value}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="font-serif text-4xl sm:text-5xl font-semibold text-gold-gradient leading-none mb-1 tracking-tight"
                >
                  {block.value.toString().padStart(2, "0")}
                </motion.span>
              </AnimatePresence>

              {/* Label */}
              <span className="font-sans text-[10px] font-bold tracking-[0.25em] text-[#F8F5F0]/65 uppercase mt-1">
                {block.label}
              </span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Detail Date Stamp */}
      <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#D4AF37]/70 py-1 border-y border-[#D4AF37]/15 px-6">
        Ouagadougou Time • Mardi 26 Mai, 18h00 UTC
      </p>
    </div>
  );
}
