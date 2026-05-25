/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Heart, Calendar, MapPin, Music, Volume2, VolumeX, Mail } from "lucide-react";

// Import custom VIP components
import Loader from "./components/Loader";
import InfoGridSection from "./components/InfoCard";
import Countdown from "./components/Countdown";
import RSVPForm from "./components/RSVPForm";
import CitationSection from "./components/CitationSection";
import Organisateur from "./components/Organisateur";

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
}

export default function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [bgVolume, setBgVolume] = useState(false);
  
  // Custom states for local decorative golden floating background elements
  const [sparkles, setSparkles] = useState<Particle[]>([]);

  // Generate unique positions of background sparkling blessings
  useEffect(() => {
    const list: Particle[] = Array.from({ length: 25 }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 1,
      delay: Math.random() * 5,
      duration: Math.random() * 6 + 4,
    }));
    setSparkles(list);
  }, []);

  // Handle custom mouse pointer coordinates (defensive for mobile)
  useEffect(() => {
    const updateMouse = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };

    const checkClickable = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const isClickable = 
        target.tagName === "BUTTON" || 
        target.tagName === "A" || 
        target.tagName === "INPUT" || 
        target.tagName === "SELECT" || 
        target.tagName === "TEXTAREA" ||
        target.closest(".cursor-pointer") !== null;
      setIsHoveringClickable(isClickable);
    };

    window.addEventListener("mousemove", updateMouse);
    window.addEventListener("mouseover", checkClickable);

    return () => {
      window.removeEventListener("mousemove", updateMouse);
      window.removeEventListener("mouseover", checkClickable);
    };
  }, []);

  // Soft visual audio indicator loops
  const toggleAmbientMusic = () => {
    setBgVolume(!bgVolume);
  };

  // Trigger luxury initial confetti on preloader exit
  const handleLoaderComplete = () => {
    setIsLoading(false);
    setShowConfetti(true);
    setTimeout(() => {
      setShowConfetti(false);
    }, 6000);
  };

  const scrollToRSVP = () => {
    const target = document.getElementById("rsvp-section");
    if (target) {
      target.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0D0D0D] text-[#F8F5F0] overflow-x-hidden font-sans select-none selection:bg-[#D4AF37] selection:text-black">
      
      {/* 1. Custom Gold Cursor Halo (Desktop visual enhancer) */}
      <div 
        className="hidden md:block fixed top-0 left-0 w-8 h-8 rounded-full border border-[#D4AF37] pointer-events-none z-50 mix-blend-difference transition-transform duration-100 ease-out"
        style={{
          transform: `translate3d(${mousePos.x - 16}px, ${mousePos.y - 16}px, 0) scale(${isHoveringClickable ? 1.6 : 1})`,
          backgroundColor: isHoveringClickable ? "rgba(212, 175, 55, 0.15)" : "transparent"
        }}
      />

      {/* 2. Premium Entrance Preloader */}
      <Loader onComplete={handleLoaderComplete} />

      {/* 3. Luxury Confetti System */}
      <AnimatePresence>
        {showConfetti && (
          <div className="fixed inset-0 z-40 pointer-events-none overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => {
              const leftPos = Math.random() * 100;
              const delayTime = Math.random() * 3;
              const durationTime = Math.random() * 4 + 2;
              const rotation = Math.random() * 360;
              return (
                <motion.div
                  key={i}
                  initial={{ y: -50, x: `${leftPos}vw`, rotate: 0, opacity: 1 }}
                  animate={{ y: "110vh", rotate: rotation, opacity: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    delay: delayTime, 
                    duration: durationTime, 
                    ease: "linear"
                  }}
                  className="absolute w-2.5 h-2.5 bg-gradient-to-br from-[#FFF9E6] via-[#D4AF37] to-[#AA7C11] rounded-sm"
                  style={{
                    boxShadow: "0 0 5px rgba(212,175,55,0.7)"
                  }}
                />
              );
            })}
          </div>
        )}
      </AnimatePresence>

      {/* Main Luxury Content Layout */}
      {!isLoading && (
        <div className="relative w-full">
          
          {/* Subtle slow floating background dust particles */}
          <div className="absolute inset-0 bg-african-pattern opacity-10 pointer-events-none" />
          <div className="absolute inset-0 bg-radial-gradient from-transparent via-[#0D0D0D] to-[#0D0D0D] pointer-events-none" />
          
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {sparkles.map((star) => (
              <motion.div
                key={star.id}
                className="absolute rounded-full bg-[#D4AF37]/45"
                style={{
                  left: `${star.x}%`,
                  top: `${star.y}%`,
                  width: `${star.size}px`,
                  height: `${star.size}px`,
                }}
                animate={{
                  y: [0, -30, 0],
                  opacity: [0.15, 0.75, 0.15],
                  scale: [1, 1.4, 1]
                }}
                transition={{
                  duration: star.duration,
                  delay: star.delay,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            ))}
          </div>

          {/* 4. Luxury Top Navigation Rail */}
          <header className="sticky top-0 z-30 glassmorphism py-4 border-b border-[#D4AF37]/10 px-6 backdrop-blur">
            <div className="max-w-7xl mx-auto flex justify-between items-center">
              {/* Monogram branding signature */}
              <div className="flex items-center gap-3">
                <span className="font-serif text-xl font-bold tracking-[0.2em] text-gold-gradient">
                  M.A
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                <span className="font-sans text-[10px] tracking-[0.25em] text-[#F8F5F0]/70 uppercase font-bold hidden sm:inline">
                  50 ANS d'Élégeance
                </span>
              </div>

              {/* VIP Quick Actions Right */}
              <div className="flex items-center gap-4">
                {/* Audio visual decoration loop toggle */}
                <button
                  id="music-toggle-btn"
                  onClick={toggleAmbientMusic}
                  className="flex items-center gap-2 px-3 py-1.5 bg-[#141414] hover:bg-[#D4AF37]/15 border border-[#D4AF37]/25 hover:border-[#D4AF37] text-gold-gradient text-[10px] uppercase tracking-widest font-bold rounded-lg transition-all cursor-pointer"
                >
                  {bgVolume ? (
                    <>
                      <Volume2 className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Musique ON</span>
                    </>
                  ) : (
                    <>
                      <VolumeX className="w-3.5 h-3.5" />
                      <span className="hidden xs:inline">Musique OFF</span>
                    </>
                  )}
                </button>
                
                <button
                  id="header-rsvp-btn"
                  onClick={scrollToRSVP}
                  className="bg-gold-gradient text-black font-extrabold uppercase text-[10px] tracking-[0.18em] px-4 py-2 rounded-lg cursor-pointer hover:shadow-[0_0_15px_rgba(212,175,55,0.4)] transition-all"
                >
                  RSVP VIP
                </button>
              </div>
            </div>
          </header>

          {/* 5. Immersive HERO SECTION */}
          <section className="relative min-h-[92vh] flex items-center justify-center py-20 px-4 z-10 overflow-hidden border-b border-[#D4AF37]/15">
            {/* Visual Gold Asymmetrical Gradient Backings */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[35vh] bg-[#3B2515]/30 rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-1/4 left-1/3 w-[300px] h-[30vh] bg-[#AA7C11]/15 rounded-full blur-[110px] pointer-events-none" />

            <div className="max-w-4xl mx-auto text-center space-y-10 w-full relative z-10">
              
              {/* Textual layout center */}
              <div className="space-y-8 flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="space-y-6 flex flex-col items-center text-center"
                >
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#D4AF37]/15 border border-[#D4AF37]/43 rounded-full text-[#D4AF37] text-xs uppercase tracking-widest font-semibold mb-2">
                    <Sparkles className="w-3.5 h-3.5 animate-pulse" /> Invitation d'Exception
                  </div>

                  <div className="relative pt-12 sm:pt-16 pb-4">
                    <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[180px] sm:text-[280px] md:text-[340px] font-serif leading-none text-[#D4AF37]/6 select-none pointer-events-none font-bold">50</span>
                    <h2 className="text-[#D4AF37] font-serif italic text-2xl sm:text-3xl md:text-4xl mb-2 relative z-10">Célébration de la Vie</h2>
                    <h1 className="font-serif text-5xl sm:text-7.5xl md:text-8xl lg:text-[6.5rem] font-bold uppercase leading-[0.95] tracking-tight relative z-10 text-[#F8F5F0]">
                      Grâce &amp; <br />
                      <span className="text-gold-gradient">Bénédictions</span>
                    </h1>
                  </div>

                  <p className="mt-8 text-base sm:text-lg md:text-xl font-light leading-relaxed max-w-2xl opacity-90 border-t border-b border-[#D4AF37]/30 py-6 px-4 text-center">
                    À l’occasion de ses 50 ans, Mme Alima OUEDRAOGO vous invite à une soirée exceptionnelle placée sous le signe de l’élégance habillée en Faso Danfani et Bazin (Or, Blanc ou Noir).
                  </p>
                </motion.div>

                {/* Hero CTA buttons */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="flex flex-wrap items-center justify-center gap-4"
                >
                  <button
                    id="hero-rsvp-cta-btn"
                    onClick={scrollToRSVP}
                    className="group bg-gold-gradient text-black font-bold uppercase tracking-widest text-xs px-8 py-4.5 rounded-xl cursor-pointer shadow-[0_5px_15px_rgba(212,175,55,0.3)] hover:shadow-[0_10px_25px_rgba(212,175,55,0.5)] transition-all flex items-center gap-2.5"
                  >
                    <Mail className="w-4 h-4 text-black group-hover:scale-110 transition-transform" />
                    Confirmer ma Présence
                  </button>

                  <a
                    href="#details-section"
                    className="font-sans text-xs uppercase tracking-widest font-medium border border-[#D4AF37]/20 hover:border-[#D4AF37] text-[#D4AF37] px-8 py-4.5 rounded-xl transition-all"
                  >
                    Découvrir l'Événement
                  </a>
                </motion.div>

                {/* Event micro data details */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="pt-6 border-t border-[#D4AF37]/15 flex flex-wrap justify-center gap-x-8 gap-y-3 font-serif italic text-[#F8F5F0]/65 text-sm"
                >
                  <span className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    Mardi 26 Mai 2026 à 18h00
                  </span>
                  <span className="flex items-center gap-2 font-noto">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D4AF37]" />
                    Salle KADIOGO, Azalaï Hôtel
                  </span>
                </motion.div>
              </div>

            </div>
          </section>

          {/* 6. INTRODUCTION SECTION */}
          <section id="introduction-section" className="py-20 px-6 bg-[#111111]/45 border-b border-[#D4AF37]/15">
            <div className="max-w-3xl mx-auto text-center space-y-6">
              <span className="font-serif italic text-lg text-[#D4AF37]">
                À l'Aube de ses 50 ans
              </span>
              <p className="font-serif text-3xl sm:text-4xl font-light text-[#F8F5F0] leading-snug">
                « C'est une invitation à se rassembler sous le sceau de l’excellence, de la joie et du partage, pour rendre grâce pour ce beau chemin parcouru. »
              </p>
              <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto pt-2" />
              <p className="font-sans text-sm text-[#F8F5F0]/65 leading-relaxed max-w-xl mx-auto font-light">
                À l’occasion de son cinquantième anniversaire, elle est honorée de vous convier à une soirée mémorable à Ouagadougou. Unissant l'élégance de la culture africaine authentique et le raffinement contemporain, ce moment sera gravé dans nos cœurs.
              </p>
            </div>
          </section>

          {/* 7. EVENT COORDINATES SECTION */}
          <section id="details-section" className="py-24 px-6 relative border-b border-[#D4AF37]/15">
            <div className="max-w-7xl mx-auto space-y-16">
              <div className="text-center space-y-2">
                <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-bold block">
                  Informations de Gala
                </span>
                <h2 className="font-serif text-4xl sm:text-5xl font-light text-[#F8F5F0]">
                  Les Coordonnées de la <span className="text-gold-gradient italic font-bold">Célébration</span>
                </h2>
                <div className="w-16 h-[1.5px] bg-gold-gradient mx-auto mt-4" />
              </div>

              {/* Grid of details */}
              <InfoGridSection />
            </div>
          </section>

          {/* 9. COUNTDOWN CLOCK SECTION */}
          <section id="countdown-section" className="py-20 px-6 border-b border-[#D4AF37]/15 bg-gradient-to-b from-transparent to-[#141414]/23">
            <Countdown />
          </section>

          {/* 10. RSVP ACTION FORM SECTION */}
          <section className="py-24 px-6 relative bg-[#111111]/15 border-b border-[#D4AF37]/15">
            <RSVPForm />
          </section>

          {/* 10.5 SECURE ORGANIZER PANEL SECTION */}
          <section className="py-20 px-6 relative bg-[#0d0d0d] border-b border-[#D4AF37]/15">
            <Organisateur />
          </section>

          {/* 11. INSPIRATION CITATION SECTION */}
          <section className="py-16 px-6 bg-[#0D0D0D]">
            <CitationSection />
          </section>

          {/* 12. GOLDEN PREMIUM FOOTER */}
          <footer className="bg-black py-16 px-6 border-t-2 border-double border-[#D4AF37]/35 relative overflow-hidden text-center text-[#F8F5F0]/60 space-y-6">
            <div className="absolute inset-0 bg-african-pattern opacity-5 pointer-events-none" />
            
            <div className="relative z-10 max-w-md mx-auto space-y-4">
              <h3 className="font-serif text-4xl text-gold-gradient font-bold tracking-widest whitespace-nowrap">
                M.A • 50 ANS
              </h3>
              <p className="font-serif italic text-base text-[#F8F5F0] max-w-sm mx-auto leading-relaxed">
                « Votre précieuse présence rendra cette soirée encore plus magique et mémorable. »
              </p>
              
              <div className="pt-6 border-t border-[#D4AF37]/15 text-[10px] uppercase tracking-widest font-mono space-y-2 text-[#D4AF37]/75">
                <p>Mardi 26 Mai, Salle KADIOGO à Ouagadougou</p>
                <p className="text-xxs text-[#F8F5F0]/40">© 2026 Tous Droits Réservés • Grâce et Bénédictions</p>
              </div>
            </div>
          </footer>

        </div>
      )}
    </div>
  );
}
