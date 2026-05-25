/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";

interface CelebrantPortraitProps {
  imageSrc?: string;
  name?: string;
}

export default function CelebrantPortrait({
  imageSrc = "/src/assets/images/celebrant_portrait_1779649898310.png",
  name = "Mme Alima OUEDRAOGO",
}: CelebrantPortraitProps) {
  return (
    <div className="relative w-full max-w-[340px] md:max-w-[400px] aspect-[3/4] mx-auto">
      {/* Background African gold glowing halo */}
      <div className="absolute -inset-4 bg-gradient-to-tr from-[#AA7C11]/30 via-[#D4AF37]/10 to-[#8C5333]/20 rounded-2xl blur-2xl opacity-75 animate-pulse" />

      {/* Extreme Outer Accent Borders (Asymmetrical design for African Modern Luxe) */}
      <div className="absolute -top-3 -left-3 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]" />
      <div className="absolute -bottom-3 -right-3 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]" />
      <div className="absolute -top-3 -right-3 w-4 h-4 border-t-2 border-r-2 border-[#8C5333]" />
      <div className="absolute -bottom-3 -left-3 w-4 h-4 border-b-2 border-l-2 border-[#8C5333]" />

      {/* Main Container - Framed */}
      <div className="relative w-full h-full p-2.5 rounded-2xl bg-[#141414] border border-[#D4AF37]/35 overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
        {/* Inside Shiny Gold Overlay */}
        <div className="absolute inset-0 border border-[#D4AF37]/10 m-1 rounded-xl pointer-events-none z-10" />

        {/* Shimmer Light Reflection Effect */}
        <div className="absolute inset-0 shimmer-effect opacity-35 mix-blend-overlay z-10 pointer-events-none" />

        {/* High-resolution Image Wrapper */}
        <div className="relative w-full h-full overflow-hidden rounded-xl bg-[#0D0D0D]">
          <motion.img
            src={imageSrc}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center"
            initial={{ scale: 1.15, filter: "brightness(0.85) contrast(1.05)" }}
            animate={{ scale: 1, filter: "brightness(1) contrast(1)" }}
            whileHover={{ scale: 1.05 }}
            transition={{
              duration: 2.5,
              ease: [0.16, 1, 0.3, 1],
            }}
          />

          {/* Smooth black-to-golden gradient over the bottom of image */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-transparent to-transparent opacity-90" />

          {/* Golden Subheader Title inside the photo wrapper absolute bottom */}
          <div className="absolute bottom-5 left-0 right-0 text-center px-4 z-10">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="space-y-0.5"
            >
              <h3 className="font-serif text-2xl font-semibold tracking-wide text-white drop-shadow-md">
                {name}
              </h3>
              <p className="font-sans text-[10px] tracking-[0.3em] text-[#D4AF37] uppercase font-bold">
                Mère, Guide et Inspiration
              </p>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Miniature Floating gold crest overlay (subtle brand element) */}
      <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 bg-[#0D0D0D] border border-[#D4AF37] px-4 py-1.5 rounded-full z-20 shadow-[0_4px_15px_rgba(212,175,55,0.4)]">
        <span className="font-serif text-[10px] uppercase tracking-[0.25em] text-gold-gradient font-bold whitespace-nowrap">
          50 ANS DE GRÂCE
        </span>
      </div>
    </div>
  );
}
