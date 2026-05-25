/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Quote, Heart } from "lucide-react";

export default function CitationSection() {
  return (
    <div className="relative w-full max-w-4xl mx-auto px-6 py-12">
      {/* Decorative center gold crest */}
      <div className="flex justify-center mb-8">
        <div className="relative flex items-center justify-center">
          <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-[#D4AF37]" />
          <div className="mx-4 p-1.5 bg-[#0D0D0D] border border-[#D4AF37] rounded-full text-[#D4AF37]">
            <Heart className="w-3.5 h-3.5 fill-[#D4AF37]/20" />
          </div>
          <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-[#D4AF37]" />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center relative space-y-6"
      >
        {/* Giant quotation marks */}
        <div className="absolute -top-6 left-4 md:-left-4 text-gold-luxe/10 font-serif text-8xl pointer-events-none select-none">
          “
        </div>
        <div className="absolute -bottom-10 right-4 md:-right-4 text-gold-luxe/10 font-serif text-8xl pointer-events-none select-none">
          ”
        </div>

        <p className="font-serif italic text-2xl sm:text-3xl font-light text-[#F8F5F0] leading-relaxed max-w-2xl mx-auto px-4">
          « À cinquante ans, la grâce n’est plus seulement un cadeau que l’on reçoit ; elle devient une bénédiction que l’on rayonne sur toute sa famille et sa communauté. »
        </p>

        <div className="space-y-1">
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="w-16 h-[1.5px] bg-gold-gradient mx-auto"
          />
          <h4 className="font-sans text-[10px] uppercase tracking-[0.4em] text-[#D4AF37] mt-3 font-bold">
            Sagesse Africaine Contemporaine
          </h4>
        </div>
      </motion.div>
    </div>
  );
}
