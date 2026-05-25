/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { ShieldAlert, Key, Search, Users, Check, X, Trash2, ShieldCheck, Download, Ban, MessageSquare, Bell, BellRing, Volume2, VolumeX, Sparkles, CheckCircle } from "lucide-react";
import { RSVPEntry } from "../types";

interface NotificationItem {
  id: string;
  name: string;
  isAttending: boolean;
  guestsCount: number;
  timestamp: string;
}

export default function Organisateur() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [allRSVPs, setAllRSVPs] = useState<RSVPEntry[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "attending" | "absent">("all");

  // Notifications State & Refs
  const rsvpIdsSetRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Valid codes: 50ANS, 2026, or KADIOGO
  const VALID_CODES = ["50ANS", "2026", "KADIOGO", "ALIMA", "DAO"];

  // Web Audio Synth Chime
  const playNotificationSound = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass();
      
      const playChime = (time: number, freq: number, duration: number) => {
        const osc = audioCtx.createOscillator();
        const gainNode = audioCtx.createGain();
        
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, time);
        
        gainNode.gain.setValueAtTime(0.12, time);
        gainNode.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        
        osc.connect(gainNode);
        gainNode.connect(audioCtx.destination);
        
        osc.start(time);
        osc.stop(time + duration);
      };

      const now = audioCtx.currentTime;
      playChime(now, 587.33, 0.35); // D5
      playChime(now + 0.12, 880, 0.55); // A5
    } catch (err) {
      console.warn("AudioContext not allowed or not supported", err);
    }
  };

  // Force play sound to test and unlock context
  const testSound = () => {
    playNotificationSound();
  };

  // Load registered RSVPs and detect new confirmations
  const loadRSVPs = () => {
    const list = localStorage.getItem("graces_50_rsvps");
    if (list) {
      try {
        const parsed: RSVPEntry[] = JSON.parse(list);
        setAllRSVPs(parsed);
        
        // Check for new RSVPs
        const newDetections: RSVPEntry[] = [];
        parsed.forEach((item) => {
          if (!rsvpIdsSetRef.current.has(item.id)) {
            rsvpIdsSetRef.current.add(item.id);
            if (!isFirstLoadRef.current) {
              newDetections.push(item);
            }
          }
        });

        // Trigger notifications if there are new RSVPs
        if (newDetections.length > 0) {
          if (soundEnabled) {
            playNotificationSound();
          }

          const newlyAdded: NotificationItem[] = newDetections.map((item) => ({
            id: item.id,
            name: item.name,
            isAttending: item.isAttending,
            guestsCount: item.guestsCount || 1,
            timestamp: new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", second: "2-digit" }),
          }));

          setNotifications((prev) => [...newlyAdded, ...prev].slice(0, 5));
        }

        isFirstLoadRef.current = false;
      } catch (e) {
        console.error("Failed parsing localStorage RSVPs", e);
      }
    } else {
      isFirstLoadRef.current = false;
    }
  };

  // Keep checking localStorage updates when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      // First load: populate set of existing IDs so they don't trigger alerts
      const list = localStorage.getItem("graces_50_rsvps");
      if (list) {
        try {
          const parsed: RSVPEntry[] = JSON.parse(list);
          parsed.forEach((item) => rsvpIdsSetRef.current.add(item.id));
        } catch (e) {
          console.error(e);
        }
      }
      isFirstLoadRef.current = false;
      loadRSVPs();

      const interval = setInterval(loadRSVPs, 2000);
      return () => clearInterval(interval);
    } else {
      // Clear tracking if logged out
      rsvpIdsSetRef.current.clear();
      isFirstLoadRef.current = true;
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const normalized = passcode.trim().toUpperCase();
    if (VALID_CODES.includes(normalized)) {
      setIsAuthenticated(true);
      setErrorMsg("");
    } else {
      setErrorMsg("Code d'accès incorrect. Veuillez réessayer.");
      setIsAuthenticated(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir retirer cet invité de la liste ?")) {
      const filtered = allRSVPs.filter((r) => r.id !== id);
      setAllRSVPs(filtered);
      localStorage.setItem("graces_50_rsvps", JSON.stringify(filtered));
    }
  };

  const handleExportCSV = () => {
    if (allRSVPs.length === 0) return;
    
    // Create CSV content (UTF-8 with BOM for correct French accents in Excel)
    let csvContent = "\uFEFF";
    csvContent += "ID;Nom complet;Telephone;Reponse;Invites;Date;Messages\n";
    
    allRSVPs.forEach((entry) => {
      const row = [
        entry.id,
        entry.name.replace(/;/g, ","),
        entry.phone,
        entry.isAttending ? "PRESENT" : "ABSENT",
        entry.isAttending ? entry.guestsCount : 0,
        entry.timestamp,
        (entry.notes || "").replace(/;/g, ",").replace(/\n/g, " ")
      ].join(";");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `confirmations_50ans_dao.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalGuestsAdmitted = allRSVPs
    .filter((entry) => entry.isAttending)
    .reduce((acc, current) => acc + (current.guestsCount || 1), 0);

  const attendingCount = allRSVPs.filter((entry) => entry.isAttending).length;
  const absentCount = allRSVPs.filter((entry) => !entry.isAttending).length;

  const filteredRSVPs = allRSVPs
    .filter((entry) => {
      const matchesSearch =
        entry.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        entry.phone.includes(searchQuery) ||
        entry.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (filterType === "attending") {
        return matchesSearch && entry.isAttending;
      }
      if (filterType === "absent") {
        return matchesSearch && !entry.isAttending;
      }
      return matchesSearch;
    });

  return (
    <div id="organisateur-section" className="w-full max-w-5xl mx-auto px-4 py-12 scroll-mt-24">
      {/* Decorative Title */}
      <div className="text-center space-y-2 mb-12">
        <span className="font-sans text-[10px] uppercase tracking-[0.35em] text-[#D4AF37] font-bold block">
          Espace de Supervision
        </span>
        <h2 className="font-serif text-4xl font-light text-[#F8F5F0]">
          Secrétariat et <span className="text-gold-gradient italic font-bold">Organisateur</span>
        </h2>
        <div className="w-16 h-[1.5px] bg-gold-gradient mx-auto mt-4" />
      </div>

      <AnimatePresence mode="wait">
        {!isAuthenticated ? (
          <motion.div
            key="lock-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="max-w-md mx-auto p-8 rounded-2xl bg-[#141414] border border-[#D4AF37]/30 shadow-[0_20px_50px_rgba(0,0,0,0.6)] space-y-6 text-center"
          >
            <div className="inline-flex p-4 bg-[#D4AF37]/10 border border-[#D4AF37]/30 rounded-full text-[#D4AF37] mb-2">
              <Key className="w-6 h-6 animate-pulse" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-light text-[#F8F5F0]">Accès Restreint</h3>
              <p className="font-sans text-xs text-[#F8F5F0]/60 max-w-xs mx-auto leading-relaxed">
                Veuillez entrer le code d'accès organisateur pour consulter les fiches de confirmation d’invités.
              </p>
            </div>

            {errorMsg && (
              <div className="flex items-center gap-2 p-3.5 bg-red-950/40 border border-red-800/30 text-red-300 text-xs rounded-xl text-left">
                <ShieldAlert className="w-4 h-4 text-red-400 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative border-b border-[#D4AF37]/35 focus-within:border-[#D4AF37] transition-all py-1.5 font-mono">
                <input
                  type="password"
                  id="passcode-input"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="CODE DE SÉCURITÉ"
                  className="w-full bg-transparent text-[#F8F5F0] text-center font-bold tracking-[0.4em] outline-none placeholder:opacity-40 uppercase text-sm"
                />
              </div>

              <button
                type="submit"
                id="passcode-submit"
                className="w-full bg-gold-gradient text-black font-bold uppercase tracking-widest text-xs py-3.5 rounded-xl cursor-pointer hover:shadow-[0_4px_20px_rgba(212,175,55,0.3)] transition-all"
              >
                Déverrouiller la Console
              </button>
            </form>


          </motion.div>
        ) : (
          <motion.div
            key="dashboard-view"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            className="space-y-8"
          >
            {/* Header section with credentials check and logs */}
            <div className="flex flex-col sm:flex-row justify-between items-center bg-[#141414] border border-[#D4AF37]/30 p-6 rounded-2xl gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-lg">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-sans text-xs uppercase tracking-widest text-[#D4AF37] font-bold">Console Autorisée</div>
                  <div className="font-mono text-[10px] text-emerald-400">SESSION ORGANISATEUR ACTIVE</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={handleExportCSV}
                  disabled={allRSVPs.length === 0}
                  className="px-4 py-2 bg-[#D4AF37] text-black font-bold uppercase tracking-widest text-[10px] rounded-lg transition-all hover:bg-[#AA7C11] disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" /> EXPORTER EXCEL
                </button>
                <button
                  onClick={() => setIsAuthenticated(false)}
                  className="px-4 py-2 bg-transparent border border-red-500/30 text-red-400 font-bold uppercase tracking-widest text-[10px] rounded-lg transition-colors hover:bg-red-950/20 cursor-pointer"
                >
                  Déconnexion
                </button>
              </div>
            </div>

            {/* Real-time Confirmation Notifications Feed */}
            <div className="bg-[#141414] border border-[#D4AF37]/30 rounded-2xl p-6 space-y-4 text-left">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-[#D4AF37]/15 pb-4">
                <div className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <div className="text-left">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-[#D4AF37]" />
                      <span className="font-sans text-xs uppercase tracking-[0.15em] text-[#F8F5F0] font-bold">
                        Notifications en Direct
                      </span>
                    </div>
                    <span className="text-[10px] text-[#F8F5F0]/40 font-mono block mt-0.5">Écoute en temps réel des fiches et participations</span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 self-stretch sm:self-auto justify-end">
                  <button
                    onClick={testSound}
                    className="px-3 py-1.5 bg-[#D4AF37]/10 hover:bg-[#D4AF37]/20 border border-[#D4AF37]/20 text-[#D4AF37] text-[10px] uppercase tracking-wider font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
                    title="Tester le son de notification"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> TESTER SON
                  </button>

                  <button
                    onClick={() => setSoundEnabled(!soundEnabled)}
                    className={`px-3 py-1.5 border rounded-lg text-[10px] uppercase tracking-wider font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                      soundEnabled
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20"
                        : "bg-red-500/15 text-red-400 border-red-500/20 hover:bg-red-500/25"
                    }`}
                  >
                    {soundEnabled ? (
                      <>
                        <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> SON ACTIF
                      </>
                    ) : (
                      <>
                        <VolumeX className="w-3.5 h-3.5 text-red-400" /> SON MUET
                      </>
                    )}
                  </button>
                </div>
              </div>

              {notifications.length === 0 ? (
                <div className="py-2 flex items-center gap-2 text-[#F8F5F0]/50 text-xs italic">
                  <Sparkles className="w-4 h-4 text-[#D4AF37] shrink-0 animate-pulse" />
                  <p>En attente de nouvelles fiches de confirmation d’invités... L’écran sonnera et affichera une alerte dès qu’un invité s’inscrira.</p>
                </div>
              ) : (
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto pr-1">
                  <AnimatePresence initial={false}>
                    {notifications.map((notif) => (
                      <motion.div
                        key={notif.id}
                        initial={{ opacity: 0, y: -10, scale: 0.98 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="p-4 bg-[#1F1912] border border-[#D4AF37]/30 rounded-xl text-white text-xs flex justify-between items-center gap-4 shadow-lg"
                      >
                        <div className="flex items-center gap-3">
                          <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
                          <div className="text-left space-y-1">
                            <span className="font-serif font-bold text-[#F8F5F0] text-sm">{notif.name}</span>
                            <span className="text-gray-300"> s'est inscrit : </span>
                            {notif.isAttending ? (
                              <span className="text-emerald-400 uppercase font-mono font-bold text-[9px] tracking-wide bg-emerald-500/15 px-2 py-0.5 rounded border border-emerald-500/25">
                                Présent ({notif.guestsCount} pers.)
                              </span>
                            ) : (
                              <span className="text-orange-400 uppercase font-mono font-bold text-[9px] tracking-wide bg-orange-500/15 px-2 py-0.5 rounded border border-orange-500/25">
                                Absent
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="font-mono text-[10px] text-[#D4AF37] bg-[#D4AF37]/15 px-2.5 py-1 rounded-md border border-[#D4AF37]/20 font-semibold">
                            {notif.timestamp}
                          </span>
                          <button
                            onClick={() => setNotifications((prev) => prev.filter((n) => n.id !== notif.id))}
                            className="text-[#F8F5F0]/40 hover:text-white transition-colors cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-[#141414] border border-[#D4AF37]/15 rounded-xl space-y-1 text-left">
                <span className="text-[#D4AF37]/60 uppercase font-mono text-[9px] tracking-wider block">Fiches reçues</span>
                <p className="font-serif text-3xl font-bold text-[#F8F5F0]">{allRSVPs.length}</p>
                <span className="text-[10px] text-[#F8F5F0]/40 font-sans block">Total formulaires</span>
              </div>

              <div className="p-5 bg-[#141414] border border-[#D4AF37]/15 rounded-xl space-y-1 text-left">
                <span className="text-[#D4AF37]/60 uppercase font-mono text-[9px] tracking-wider block">Acceptations</span>
                <p className="font-serif text-3xl font-bold text-emerald-400">{attendingCount}</p>
                <span className="text-[10px] text-emerald-400/60 font-sans block">Ont dit Oui</span>
              </div>

              <div className="p-5 bg-[#141414] border border-[#D4AF37]/15 rounded-xl space-y-1 text-left">
                <span className="text-[#D4AF37]/60 uppercase font-mono text-[9px] tracking-wider block">Absences</span>
                <p className="font-serif text-3xl font-bold text-[#8C5333]">{absentCount}</p>
                <span className="text-[10px] text-[#F8F5F0]/40 font-sans block">À regret</span>
              </div>

              <div className="p-5 bg-[#141414] border border-2 border-[#D4AF37]/35 rounded-xl space-y-1 text-left bg-[#1D1711]">
                <span className="text-[#D4AF37] uppercase font-mono text-[9px] tracking-widest font-bold block">TOTAL PARTICIPANTS</span>
                <p className="font-serif text-4xl font-bold text-gold-gradient">{totalGuestsAdmitted}</p>
                <span className="text-[10px] text-[#F8F5F0]/60 font-sans block">Admissions autorisées</span>
              </div>
            </div>

            {/* Live Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between pt-4">
              {/* Search text */}
              <div className="relative w-full md:max-w-md">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#D4AF37]/50">
                  <Search className="w-4 h-4" />
                </span>
                <input
                  type="text"
                  id="organizer-search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher par nom, téléphone, Code VIP..."
                  className="w-full bg-[#141414] text-[#F8F5F0] border border-[#D4AF37]/15 focus:border-[#D4AF37] rounded-xl pl-12 pr-4 py-3 outline-none text-xs transition-all"
                />
              </div>

              {/* Filtering Toggles */}
              <div className="flex border border-[#D4AF37]/15 rounded-xl p-1 bg-[#141414]/85 w-full md:w-auto">
                <button
                  onClick={() => setFilterType("all")}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    filterType === "all"
                      ? "bg-gold-gradient text-black"
                      : "text-[#F8F5F0]/60 hover:text-white"
                  }`}
                >
                  Tous ({allRSVPs.length})
                </button>
                <button
                  onClick={() => setFilterType("attending")}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    filterType === "attending"
                      ? "bg-[#D4AF37]/15 text-[#D4AF37] border border-[#D4AF37]/30"
                      : "text-[#F8F5F0]/60 hover:text-white"
                  }`}
                >
                  Présents ({attendingCount})
                </button>
                <button
                  onClick={() => setFilterType("absent")}
                  className={`flex-1 md:flex-initial px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-colors ${
                    filterType === "absent"
                      ? "bg-[#8C5333]/20 text-[#F8F5F0]/80"
                      : "text-[#F8F5F0]/60 hover:text-white"
                  }`}
                >
                  Absents ({absentCount})
                </button>
              </div>
            </div>

            {/* List Table / Card View as responsive wrapper */}
            {filteredRSVPs.length === 0 ? (
              <div className="p-12 text-center border border-dashed border-[#D4AF37]/15 rounded-2xl bg-[#141414]/40">
                <p className="font-serif italic text-[#F8F5F0]/60">Aucun enregistrement ne correspond aux filtres.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredRSVPs.map((guest, idx) => (
                  <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.02 }}
                    key={guest.id}
                    className="p-6 rounded-2xl bg-[#141414] border border-[#D4AF37]/15 hover:border-[#D4AF37]/45 transition-colors text-left flex flex-col justify-between h-full space-y-4"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="font-mono text-[9px] text-[#D4AF37] font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded-full">
                          PASS #{guest.id}
                        </span>
                        
                        {guest.isAttending ? (
                          <span className="inline-flex items-center gap-1 text-[9px] uppercase font-mono tracking-widest text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                            <Check className="w-3 h-3" /> Présent ({guest.guestsCount})
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[9px] uppercase font-mono tracking-widest text-[#8C5333] bg-[#8C5333]/15 px-2.5 py-0.5 rounded-full border border-[#8C5333]/20">
                            <X className="w-3 h-3" /> Absent
                          </span>
                        )}
                      </div>

                      <div>
                        <h4 className="font-serif text-xl font-bold text-[#F8F5F0]">{guest.name}</h4>
                        <p className="font-sans text-xs text-[#F8F5F0]/60 font-light mt-0.5">{guest.phone}</p>
                      </div>

                      {guest.notes && (
                        <div className="p-3 bg-[#0D0D0D] rounded-lg border border-[#D4AF37]/5 flex gap-2">
                          <MessageSquare className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 mt-0.5" />
                          <p className="font-sans text-xs italic text-[#F8F5F0]/85 leading-relaxed">
                            {guest.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-3 border-t border-[#D4AF37]/5 text-xxs text-[#F8F5F0]/40 font-mono">
                      <span>Inscrit le : {guest.timestamp}</span>
                      
                      <button
                        onClick={() => handleDelete(guest.id)}
                        className="flex items-center gap-1 text-red-400 hover:text-red-300 font-bold transition-all px-2 py-1 bg-red-950/20 border border-red-950 rounded cursor-pointer"
                        title="Supprimer la confirmation"
                      >
                        <Trash2 className="w-3 h-3" /> RETIRER
                      </button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
