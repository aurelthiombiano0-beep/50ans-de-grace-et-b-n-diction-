/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { User, Phone, Users, CheckCircle, Ticket, Sparkles, AlertCircle } from "lucide-react";
import { RSVPEntry } from "../types";

export default function RSVPForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [isAttending, setIsAttending] = useState<boolean | null>(null);
  const [notes, setNotes] = useState("");
  
  const [submitted, setSubmitted] = useState(false);
  const [recentRSVP, setRecentRSVP] = useState<RSVPEntry | null>(null);
  const [allRSVPs, setAllRSVPs] = useState<RSVPEntry[]>([]);
  const [formError, setFormError] = useState("");

  // Load existing RSVPs
  useEffect(() => {
    const list = localStorage.getItem("graces_50_rsvps");
    if (list) {
      try {
        setAllRSVPs(JSON.parse(list));
      } catch (e) {
        console.error("Failed parsing localStorage RSVPs", e);
      }
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (!name.trim()) {
      setFormError("Veuillez saisir votre nom complet.");
      return;
    }
    if (!phone.trim()) {
      setFormError("Veuillez saisir votre numéro de téléphone.");
      return;
    }
    if (isAttending === null) {
      setFormError("Veuillez indiquer si vous serez présent(e).");
      return;
    }

    const newRsvp: RSVPEntry = {
      id: "vip-" + Math.floor(100000 + Math.random() * 900000),
      name: name.trim(),
      phone: phone.trim(),
      guestsCount: isAttending ? guestsCount : 0,
      isAttending,
      timestamp: new Date().toLocaleDateString("fr-FR", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }),
      notes: notes.trim(),
    };

    // Load fresh, update and store
    const list = localStorage.getItem("graces_50_rsvps");
    let currentList: RSVPEntry[] = [];
    if (list) {
      try {
        currentList = JSON.parse(list);
      } catch (e) {
        console.error("Failed parsing list", e);
      }
    }
    const updated = [newRsvp, ...currentList];
    setAllRSVPs(updated);
    localStorage.setItem("graces_50_rsvps", JSON.stringify(updated));

    setRecentRSVP(newRsvp);
    setSubmitted(true);

    // Reset fields except for success screen display
    setName("");
    setPhone("");
    setGuestsCount(1);
    setIsAttending(null);
    setNotes("");
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div id="rsvp-section" className="w-full max-w-4xl mx-auto px-4 py-8">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start"
          >
            {/* Explanatory elegant text left */}
            <div className="md:col-span-12 lg:col-span-5 space-y-6 text-left">
              <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold block">
                Participer à la Magie
              </span>
              <h3 className="font-serif text-3xl font-light text-[#F8F5F0] leading-tight">
                Réservez Votre Table pour le <span className="text-gold-gradient italic font-bold">Chic Royal</span>
              </h3>
              <p className="font-sans text-xs text-[#F8F5F0]/70 leading-relaxed font-light">
                Chaque convive recevra un carton d'invitation virtuel muni d'un code d'identification VIP unique, à présenter le soir de l'événement à la Salle KADIOGO à l'Azalaï Hôtel.
              </p>
              
              <div className="p-5 rounded-2xl bg-[#141414]/90 border border-[#D4AF37]/10 space-y-4">
                <h4 className="font-serif text-base text-gold-gradient font-medium">Bénédictions &amp; Vœux</h4>
                <p className="font-sans text-xs text-[#F8F5F0]/60 leading-relaxed">
                  Laissez un mot d'amour, un verset, ou une bénédiction de 50 ans pour Tata Alima Dao directement dans le formulaire. Vos messages accompagneront sa marche de célébration.
                </p>
              </div>
            </div>

            {/* Form layout right */}
            <form
              onSubmit={handleSubmit}
              className="md:col-span-12 lg:col-span-7 p-8 rounded-2xl bg-[#F8F5F0] border-2 border-[#D4AF37]/50 relative overflow-hidden space-y-6 shadow-2xl text-[#0D0D0D]"
            >
              <div className="absolute inset-0 bg-african-pattern opacity-3 pointer-events-none" />

              {formError && (
                <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 text-red-900 text-xs rounded-xl text-left">
                  <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
                  <p>{formError}</p>
                </div>
              )}

              {/* Step 1: Presence Indicator Box */}
              <div className="space-y-3 text-left">
                <label className="font-sans text-xs uppercase tracking-widest text-[#0D0D0D] font-bold block">
                  Serez-vous des nôtres ?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setIsAttending(true)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                      isAttending === true
                        ? "bg-gradient-to-br from-[#FFF9E6] via-[#D4AF37] to-[#AA7C11] text-black font-semibold border-[#AA7C11] shadow-lg"
                        : "bg-[#F8F5F0] border-[#0D0D0D]/15 text-[#0D0D0D]/60 hover:border-[#0D0D0D] hover:text-[#0D0D0D]"
                    }`}
                  >
                    <span className="font-serif text-lg font-medium">Oui, j'honore</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest font-bold">Ma Présence</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsAttending(false)}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer ${
                      isAttending === false
                        ? "bg-[#8C5333]/15 border-[#8C5333] text-black font-semibold shadow-inner"
                        : "bg-[#F8F5F0] border-[#0D0D0D]/15 text-[#0D0D0D]/60 hover:border-[#0D0D0D] hover:text-[#0D0D0D]"
                    }`}
                  >
                    <span className="font-serif text-lg font-medium">Non, à regret</span>
                    <span className="text-[10px] uppercase font-mono tracking-widest font-bold">Je ne peux pas</span>
                  </button>
                </div>
              </div>

              {/* Fields */}
              <div className="space-y-4">
                {/* Full name input */}
                <div className="relative border-b border-[#0D0D0D]/20 focus-within:border-[#D4AF37] transition-colors py-1">
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[#0D0D0D]/60">
                    <User className="w-4 h-4" />
                  </span>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Votre nom complet"
                    className="w-full bg-transparent text-[#0D0D0D] outline-none pl-10 pr-4 py-3.5 text-sm placeholder-[#0D0D0D]/45"
                  />
                </div>

                {/* Telephone input */}
                <div className="relative border-b border-[#0D0D0D]/20 focus-within:border-[#D4AF37] transition-colors py-1">
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 text-[#0D0D0D]/60">
                    <Phone className="w-4 h-4" />
                  </span>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Numéro de téléphone (e.g., +226 xx xx xx xx)"
                    className="w-full bg-transparent text-[#0D0D0D] outline-none pl-10 pr-4 py-3.5 text-sm placeholder-[#0D0D0D]/45"
                  />
                </div>

                {/* Number of accompanying people */}
                {isAttending === true && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="space-y-2 overflow-hidden text-left"
                  >
                    <label className="font-sans text-xs uppercase tracking-widest text-[#0D0D0D]/80 font-bold block mb-1">
                      Nombre d'accompagnants
                    </label>
                    <div className="flex items-center gap-3 border-b border-[#0D0D0D]/20 py-1">
                      <div className="p-2 text-[#0D0D0D]/70">
                        <Users className="w-4 h-4" />
                      </div>
                      <select
                        value={guestsCount}
                        onChange={(e) => setGuestsCount(Number(e.target.value))}
                        className="flex-1 bg-transparent text-[#0D0D0D] outline-none px-2 py-3 text-sm transition-all"
                      >
                        {[1, 2, 3, 4, 5].map((num) => (
                          <option key={num} value={num} className="bg-[#F8F5F0]">
                            {num} personne{num > 1 ? "s" : ""} (Moi inclus{num > 1 ? "e et invité" : ""})
                          </option>
                        ))}
                      </select>
                    </div>
                  </motion.div>
                )}

                {/* Custom notes - Congratulations & blessings */}
                <div className="space-y-1 border-b border-[#0D0D0D]/20 focus-within:border-[#D4AF37] transition-colors py-1 text-left">
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    maxLength={140}
                    placeholder="Votre message d'amour, vœu ou bénédiction..."
                    rows={2}
                    className="w-full bg-transparent text-[#0D0D0D] outline-none p-2 text-sm placeholder-[#0D0D0D]/40 resize-none h-24"
                  />
                  <span className="text-[10px] text-right block text-[#0D0D0D]/50 font-mono">
                    {notes.length}/140 caractères
                  </span>
                </div>
              </div>

              {/* Submit button layout */}
              <motion.button
                type="submit"
                id="rsvp-submit-btn"
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                className="w-full bg-[#0D0D0D] hover:bg-[#1C1C1C] text-[#D4AF37] font-bold uppercase tracking-widest py-4 rounded-xl cursor-pointer shadow-xl transition-all flex items-center justify-center gap-2 text-xs"
              >
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-spin-slow" />
                Envoyer l'Invitation VIP
              </motion.button>
            </form>
          </motion.div>
        ) : (
          /* Submitted and displaying Ticket VIP */
          <motion.div
            key="success-ticket"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", damping: 25 }}
            className="flex flex-col items-center space-y-8 py-4"
          >
            {/* Visual Header confirmation */}
            <div className="text-center space-y-2">
              <div className="inline-flex p-3 bg-green-500/10 border border-green-500/30 rounded-full text-green-400 mb-2">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h3 className="font-serif text-3xl font-light text-[#F8F5F0]">
                Invitation <span className="text-gold-gradient italic font-bold">Validée !</span>
              </h3>
              <p className="font-sans text-xs text-[#F8F5F0]/70 max-w-md mx-auto">
                {recentRSVP?.isAttending 
                  ? "Votre présence a été enregistrée avec succès. Voici votre précieux sésame VIP." 
                  : "Votre absence excusée a bien été enregistrée. Merci pour vos tendres pensées."}
              </p>
            </div>

            {/* Luxury VIP digital printable pass */}
            {recentRSVP?.isAttending && (
              <div id="print-ticket-area" className="relative w-full max-w-md p-6 rounded-2xl bg-[#0D0D0D] border-2 border-dashed border-[#D4AF37]/50 shadow-[0_15px_40px_rgba(212,175,55,0.15)] overflow-hidden">
                {/* Visual authenticating lines */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-[#D4AF37]/10 to-transparent blur" />

                {/* Ticket sides notch details */}
                <div className="absolute top-1/2 -left-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#111111] border-r border-[#D4AF37]/43 z-10" />
                <div className="absolute top-1/2 -right-3.5 -translate-y-1/2 w-7 h-7 rounded-full bg-[#111111] border-l border-[#D4AF37]/43 z-10" />

                <div className="flex flex-col space-y-6">
                  {/* Ticket Badge */}
                  <div className="flex justify-between items-center text-[10px] font-mono tracking-widest text-[#D4AF37]/65 pb-4 border-b border-[#D4AF37]/15">
                    <span>ANNIVERSAIRE ROYALE</span>
                    <span className="font-bold flex items-center gap-1">
                      <Ticket className="w-3 h-3 text-[#D4AF37]" /> PASS VIP #{recentRSVP.id}
                    </span>
                  </div>

                  {/* Main Event information on card */}
                  <div className="text-center space-y-1">
                    <span className="font-serif italic text-sm text-[#F8F5F0]/65">
                      Invitation Spéciale pour
                    </span>
                    <h4 className="font-serif text-2xl font-bold text-gold-gradient tracking-wide uppercase">
                      {recentRSVP.name}
                    </h4>
                    <p className="font-sans text-xxs tracking-[0.2em] text-[#D4AF37]">
                      {recentRSVP.guestsCount} {recentRSVP.guestsCount > 1 ? "PERSONNES ADMISES" : "CONVIVE ADMIS"}
                    </p>
                  </div>

                  {/* Fine design grid */}
                  <div className="grid grid-cols-2 gap-4 py-4 border-y border-[#D4AF37]/15 text-left text-xs">
                    <div className="space-y-1 text-left">
                      <span className="text-[#D4AF37]/60 block uppercase font-mono text-[9px] tracking-wider">Date &amp; Heure</span>
                      <p className="font-serif font-semibold text-[#F8F5F0]">Mardi 26 Mai, 18H00</p>
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="text-[#D4AF37]/60 block uppercase font-mono text-[9px] tracking-wider">Lieu</span>
                      <p className="font-serif font-semibold text-[#F8F5F0]">Salle Kadiogo, Azalaï</p>
                    </div>
                    <div className="space-y-1 text-left">
                      <span className="text-[#D4AF37]/60 block uppercase font-mono text-[9px] tracking-wider">Dress Code</span>
                      <p className="font-serif font-semibold text-[#F8F5F0]">Faso Danfani, Bazin (Or, Blanc, Noir)</p>
                    </div>
                    <div className="space-y-1 flex flex-col justify-end text-left">
                      <span className="text-[#D4AF37]/60 block uppercase font-mono text-[9px] tracking-wider">Téléphone</span>
                      <p className="font-sans text-[11px] font-medium text-[#F8F5F0]">{recentRSVP.phone}</p>
                    </div>
                  </div>

                  {/* Simulated security vector graphics stamp */}
                  <div className="flex justify-between items-center bg-[#141414] p-3 rounded-xl border border-[#D4AF37]/10">
                    <div className="text-left">
                      <span className="text-[#D4AF37]/65 uppercase font-mono text-[8px] tracking-widest block">Signature de sécurité</span>
                      <p className="font-serif italic text-white text-sm font-semibold">Grâce et Bénédictions</p>
                    </div>
                    {/* Simulated elegant golden QR indicator box */}
                    <div className="w-12 h-12 bg-gold-gradient p-0.5 rounded flex items-center justify-center shadow-lg">
                      <div className="grid grid-cols-6 gap-[1.5px] w-full h-full bg-black p-1">
                        {Array.from({ length: 36 }).map((_, i) => (
                          <div
                            key={i}
                            className={`rounded-[1px] ${
                              (i % 3 === 0 || i % 4 === 1 || i < 6 || i > 30) ? "bg-[#D4AF37]" : "bg-transparent"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Interactive choices success */}
            <div className="flex flex-wrap justify-center gap-4 pt-1 print:hidden">
              {recentRSVP?.isAttending && (
                <button
                  onClick={handlePrint}
                  className="bg-[#141414] hover:bg-[#D4AF37] border border-[#D4AF37] text-[#D4AF37] hover:text-black font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Ticket className="w-4 h-4" /> Imprimer mon Carton
                </button>
              )}
              <button
                onClick={() => {
                  setSubmitted(false);
                  setRecentRSVP(null);
                }}
                className="bg-[#D4AF37] text-black font-semibold text-xs uppercase tracking-widest px-6 py-3 rounded-xl transition-colors hover:bg-[#AA7C11] cursor-pointer shadow"
              >
                Nouvelle Inscription / Annuler
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
