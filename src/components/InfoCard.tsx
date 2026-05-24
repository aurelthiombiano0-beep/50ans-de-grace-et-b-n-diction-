/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from "react";
import { motion } from "motion/react";
import { Calendar, Clock, MapPin, Sparkles, Smile } from "lucide-react";

interface InfoCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  subtitle?: string;
  badge?: string;
}

export function InfoItemCard({ icon, title, value, subtitle, badge }: InfoCardProps) {
  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative p-6 rounded-2xl bg-[#141414]/90 border border-[#D4AF37]/20 hover:border-[#D4AF37]/60 group transition-colors overflow-hidden"
    >
      {/* Decorative Gold Light Beam */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#D4AF37]/10 to-transparent rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />
      
      {/* Visual content */}
      <div className="relative z-10 flex flex-col h-full justify-between space-y-4">
        <div className="flex justify-between items-start">
          <div className="p-3.5 bg-gradient-to-br from-[#20130B] to-[#0D0D0D] border border-[#D4AF37]/30 rounded-xl text-[#D4AF37] group-hover:bg-[#D4AF37] group-hover:text-black transition-all duration-500 shadow-md">
            {icon}
          </div>
          {badge && (
            <span className="text-[10px] uppercase tracking-widest bg-gradient-to-r from-[#AA7C11] to-[#D4AF37] text-black font-semibold px-2.5 py-0.5 rounded-full shadow-sm">
              {badge}
            </span>
          )}
        </div>

        <div className="space-y-1.5">
          <h4 className="font-sans text-xs tracking-[0.25em] text-[#D4AF37] uppercase font-bold">
            {title}
          </h4>
          <p className="font-serif text-xl font-medium text-[#F8F5F0] leading-snug group-hover:text-white transition-colors">
            {value}
          </p>
          {subtitle && (
            <p className="font-sans text-xs text-[#F8F5F0]/60 leading-relaxed font-light">
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function InfoGridSection() {
  const coordinates = [
    {
      icon: <Calendar className="w-5 h-5" />,
      title: "Date",
      value: "Mardi 26 Mai 2026",
      subtitle: "Un jour mémorable célébrant un demi-siècle de bénédictions",
      badge: "Présence essentielle",
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Heure d'arrivée",
      value: "À partir de 18h00",
      subtitle: "Cocktail d'accueil VIP et séance photo sur tapis or",
      badge: "Cocktail VIP",
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Lieu prestigieux",
      value: "Salle KADIOGO",
      subtitle: "Azalaï Hôtel, Ouagadougou, Burkina Faso",
      badge: "Hôtel 5 Etoiles",
    },
    {
      icon: <Sparkles className="w-5 h-5" />,
      title: "Thématique",
      value: "Faso Danfani & Bazin",
      subtitle: "Tenues d'honneur en Or, Blanc ou Noir",
      badge: "Thème Signature",
    },
  ];

  return (
    <div className="space-y-10">
      {/* 4 Cards Coordinates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {coordinates.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ delay: index * 0.1, duration: 0.8, ease: "easeOut" }}
          >
            <InfoItemCard {...item} />
          </motion.div>
        ))}
      </div>

      {/* Exquisite Dress Code Details Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative p-8 rounded-2xl bg-gradient-to-br from-[#1A110A]/95 to-[#0D0D0D]/95 border border-[#D4AF37]/30 overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.5)]"
      >
        <div className="absolute inset-0 bg-african-pattern opacity-5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start md:justify-between gap-6">
          <div className="flex-1 space-y-4 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/10 border border-[#D4AF37]/35 rounded-full text-[#D4AF37] text-xs uppercase tracking-widest font-semibold">
              <Smile className="w-3.5 h-3.5" /> Code Vestimentaire Recommandé
            </div>
            <h3 className="font-serif text-3xl font-light text-[#F8F5F0]">
              Célébrer en <span className="font-serif italic text-gold-gradient font-bold">Dress Code Royal</span>
            </h3>
            <p className="font-sans text-sm text-[#F8F5F0]/70 max-w-2xl leading-relaxed">
              Pour magnifier ce moment unique, nous invitons nos hôtes d’exception à se vêtir de leurs plus belles créations traditionnelles ou de gala, reflétant la fierté et le prestige de notre cher continent.
            </p>
          </div>

          {/* Luxury visual labels for dress codes */}
          <div className="flex flex-wrap justify-center gap-3 max-w-md">
            {["Faso Danfani", "Bazin", "Or", "Blanc", "Noir"].map((code, idx) => (
              <span
                key={idx}
                className="font-sans text-xs uppercase tracking-widest font-medium text-[#F8F5F0] bg-[#221710] border border-[#D4AF37]/25 px-5 py-3 rounded-xl hover:border-[#D4AF37] transition-all duration-300"
              >
                {code}
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
