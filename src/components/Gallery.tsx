"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const placeholders = [
  "Werkstatt Innenansicht",
  "Lackierarbeit Detail",
  "Fahrzeug nach Reparatur",
  "Felgenaufbereitung",
];

export default function Gallery() {
  return (
    <section className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-light" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      <div className="max-w-6xl mx-auto relative">
        <SectionHeader label="Einblicke" title="Aus unserer Werkstatt" />

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {placeholders.map((label, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 40, scale: 0.9 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="aspect-[4/3] relative rounded-2xl overflow-hidden bg-zinc-800/50 border border-border hover:border-accent/20 group cursor-pointer transition-colors duration-500"
            >
              {/* Layered gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/50 via-zinc-800/60 to-zinc-900/80" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

              {/* Hover light effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.06] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Shimmer on hover */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/[0.04] to-transparent group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </div>

              <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
                <svg
                  className="w-9 h-9 text-zinc-500 mb-3 group-hover:text-accent/60 transition-colors duration-500 group-hover:scale-110 transform"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.2}
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
                  />
                </svg>
                <span className="text-zinc-500 text-xs sm:text-sm text-center font-medium group-hover:text-zinc-300 transition-colors duration-500">
                  {label}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Replace placeholders with real photos: 800x600px WebP recommended */}
        <p className="mt-8 text-center text-zinc-600 text-xs">
          Bilder werden in Kürze ergänzt.
        </p>
      </div>
    </section>
  );
}
