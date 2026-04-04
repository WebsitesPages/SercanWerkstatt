"use client";

import { motion } from "framer-motion";
import { MapPinIcon } from "./Icons";
import { CONTACT } from "@/lib/contact";
import SectionHeader from "./SectionHeader";
import GlowButton from "./GlowButton";

export default function Location() {
  return (
    <section id="standort" className="py-24 sm:py-32 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background to-surface/50" />

      <div className="max-w-4xl mx-auto relative">
        <SectionHeader label="Standort" title="So finden Sie uns" />

        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="rounded-3xl overflow-hidden bg-surface/80 backdrop-blur-sm border border-border hover:border-accent/10 transition-colors duration-500 group"
        >
          {/* Map placeholder with atmosphere */}
          <div className="relative h-56 sm:h-72 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-700/40 via-zinc-800/60 to-zinc-900" />

            {/* Animated pin glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(232,168,73,0)",
                    "0 0 0 30px rgba(232,168,73,0.05)",
                    "0 0 0 0 rgba(232,168,73,0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
                className="w-1 h-1 rounded-full"
              />
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                >
                  <MapPinIcon className="w-12 h-12 text-accent mx-auto mb-3 drop-shadow-[0_0_15px_rgba(232,168,73,0.3)]" />
                </motion.div>
                <p className="text-zinc-300 text-base font-medium">
                  {CONTACT.address}
                </p>
              </div>
            </div>
          </div>

          <div className="p-7 sm:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div>
              <h3 className="text-xl font-display font-bold text-white">
                Renginal
              </h3>
              <p className="text-zinc-400 text-sm mt-1">
                Inal Unfallinstandsetzung + Fahrzeuglackierung
              </p>
              <p className="text-zinc-500 text-sm mt-1">{CONTACT.address}</p>
            </div>
            <GlowButton
              href={CONTACT.mapsUrl}
              variant="primary"
              size="md"
              target="_blank"
              rel="noopener noreferrer"
            >
              <MapPinIcon className="w-5 h-5" />
              Route planen
            </GlowButton>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
