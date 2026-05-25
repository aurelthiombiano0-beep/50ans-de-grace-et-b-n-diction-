/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, ChevronLeft, ChevronRight, Music, Heart } from "lucide-react";

interface GalleryItem {
  id: string;
  url: string;
  title: string;
  category: "Traditional" | "Elegance" | "Sagesse" | "Famille";
}

export default function PhotoGallery() {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [filter, setFilter] = useState<string>("All");

  const galleryItems: GalleryItem[] = [
    {
      id: "gal-1",
      url: "/src/assets/images/celebrant_portrait_1779649898310.png",
      title: "Céleste Antoinette - Portrait de Grâce",
      category: "Elegance",
    },
    {
      id: "gal-2",
      url: "https://picsum.photos/seed/wax/800/1000",
      title: "Subptilité des fils d'or - Faso Danfani",
      category: "Traditional",
    },
    {
      id: "gal-3",
      url: "https://picsum.photos/seed/kadiogo/850/600",
      title: "Atmosphère chic - Salle Kadiogo",
      category: "Elegance",
    },
    {
      id: "gal-4",
      url: "https://picsum.photos/seed/bazin/800/800",
      title: "Bazin Royal & Broderies Fines",
      category: "Traditional",
    },
    {
      id: "gal-5",
      url: "https://picsum.photos/seed/african-grace/750/950",
      title: "50 ans de Sourires Partagés",
      category: "Famille",
    },
    {
      id: "gal-6",
      url: "https://picsum.photos/seed/ouaga-lights/800/550",
      title: "Éclats d'Or et Festivités",
      category: "Sagesse",
    },
  ];

  const categories = ["All", "Traditional", "Elegance", "Sagesse", "Famille"];

  const filteredItems = filter === "All" 
    ? galleryItems 
    : galleryItems.filter(item => item.category === filter);

  const openLightbox = (indexInFiltered: number) => {
    const originalItem = filteredItems[indexInFiltered];
    const originalIndex = galleryItems.findIndex(i => i.id === originalItem.id);
    setSelectedIdx(originalIndex);
  };

  const nextImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx + 1) % galleryItems.length);
    }
  };

  const prevImage = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (selectedIdx !== null) {
      setSelectedIdx((selectedIdx - 1 + galleryItems.length) % galleryItems.length);
    }
  };

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto px-4 py-6">
      {/* Short contextual subtitle explaining the photo curation */}
      <div className="text-center space-y-2">
        <span className="font-sans text-[10px] uppercase tracking-[0.3em] text-[#D4AF37] font-bold block">
          Souvenirs &amp; Héritage
        </span>
        <h3 className="font-serif text-3xl font-light text-[#F8F5F0]">
          La Galerie <span className="text-gold-gradient italic font-bold">Africaine Chic</span>
        </h3>
        <p className="font-sans text-xs text-[#F8F5F0]/60 max-w-xl mx-auto">
          Un aperçu poétique des textiles traditionnels burkinabè, de l'élégance de nos coutures et de moments chaleureux de complicité.
        </p>
      </div>

      {/* Decorative Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-2.5 pt-2">
        {categories.map((cat) => (
          <button
            key={cat}
            id={`filter-btn-${cat.toLowerCase()}`}
            onClick={() => setFilter(cat)}
            className={`font-sans text-xs uppercase tracking-widest px-4 py-2 rounded-full border transition-all duration-300 ${
              (filter === cat)
                ? "bg-gold-gradient text-black font-semibold border-[#D4AF37] shadow-[0_4px_12px_rgba(212,175,55,0.3)]"
                : "bg-[#141414]/90 text-[#F8F5F0]/70 border-[#D4AF37]/15 hover:border-[#D4AF37]/50 hover:text-white"
            }`}
          >
            {cat === "All" ? "Tout" : cat}
          </button>
        ))}
      </div>

      {/* Grid with custom masonry-like properties */}
      <motion.div 
        layout
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6"
      >
        <AnimatePresence mode="popLayout">
          {filteredItems.map((item, localIdx) => {
            const hasTallRatio = item.id === "gal-1" || item.id === "gal-2" || item.id === "gal-5";
            return (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
                onClick={() => openLightbox(localIdx)}
                className={`relative group cursor-pointer overflow-hidden rounded-2xl bg-[#141414] border border-[#D4AF37]/15 hover:border-[#D4AF37]/50 transition-all duration-500 shadow-lg ${
                  hasTallRatio ? "row-span-2 aspect-[3/4]" : "aspect-video sm:aspect-square"
                }`}
              >
                {/* Image */}
                <img
                  src={item.url}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-700 ease-[0.16, 1, 0.3, 1] group-hover:scale-110"
                />

                {/* Dark Hover Layer with Golden Icons */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex flex-col justify-end p-5">
                  <div className="flex justify-between items-center transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <div className="space-y-1">
                      <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4AF37] bg-[#D4AF37]/10 px-2.5 py-0.5 rounded-full">
                        {item.category}
                      </span>
                      <h4 className="font-serif text-base font-medium text-white drop-shadow">
                        {item.title}
                      </h4>
                    </div>
                    <div className="p-2.5 bg-[#D4AF37] text-[#0D0D0D] rounded-full shadow-[0_5px_15px_rgba(212,175,55,0.4)]">
                      <Search className="w-4 h-4" />
                    </div>
                  </div>
                </div>

                {/* Delicate corner ornaments */}
                <div className="absolute top-3 left-3 w-3 h-3 border-t border-l border-[#D4AF37]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
                <div className="absolute bottom-3 right-3 w-3 h-3 border-b border-r border-[#D4AF37]/30 opacity-0 group-hover:opacity-100 transition-opacity duration-350" />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </motion.div>

      {/* Lightbox Backdrop */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedIdx(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          >
            {/* Close button top right */}
            <button
              id="close-lightbox-btn"
              onClick={() => setSelectedIdx(null)}
              className="absolute top-6 right-6 p-3 bg-[#141414] hover:bg-[#D4AF37] border border-[#D4AF37]/45 text-[#D4AF37] hover:text-black rounded-full transition-colors z-50 cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Left Nav Arrow */}
            <button
              id="lightbox-prev-btn"
              onClick={prevImage}
              className="absolute left-6 p-4 bg-[#141414]/80 hover:bg-[#D4AF37] border border-[#D4AF37]/30 text-[#D4AF37] hover:text-black rounded-full transition-all z-40 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Content Core */}
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center bg-[#141414] border border-[#D4AF37]/35 rounded-2xl overflow-hidden shadow-[0_20px_50px_rgba(212,175,55,0.15)] p-2.5"
            >
              <img
                src={galleryItems[selectedIdx].url}
                alt={galleryItems[selectedIdx].title}
                referrerPolicy="no-referrer"
                className="max-h-[65vh] w-auto object-contain rounded-xl"
              />
              <div className="w-full text-center py-4 px-6 bg-[#0D0D0D]/95 mt-2 rounded-xl">
                <span className="font-mono text-[9px] uppercase tracking-widest text-[#D4AF37] block mb-1">
                  {galleryItems[selectedIdx].category}
                </span>
                <h4 className="font-serif text-xl font-medium text-[#F8F5F0]">
                  {galleryItems[selectedIdx].title}
                </h4>
              </div>
            </motion.div>

            {/* Right Nav Arrow */}
            <button
              id="lightbox-next-btn"
              onClick={nextImage}
              className="absolute right-6 p-4 bg-[#141414]/80 hover:bg-[#D4AF37] border border-[#D4AF37]/30 text-[#D4AF37] hover:text-black rounded-full transition-all z-40 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
