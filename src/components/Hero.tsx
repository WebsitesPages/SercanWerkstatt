"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PhoneIcon, MapPinIcon } from "./Icons";
import { CONTACT } from "@/lib/contact";
import GlowButton from "./GlowButton";

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -40]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0c0c10] to-background" />

        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(232,168,73,0.3) 40px, rgba(232,168,73,0.3) 41px)",
          }}
        />

        {/* Single ambient glow – lightweight */}
        <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[400px] bg-amber-500/[0.06] rounded-full blur-[120px]" />

        <div className="absolute inset-0 overflow-hidden">
          <div
            className="absolute top-0 w-[200px] h-full bg-gradient-to-r from-transparent via-white/[0.02] to-transparent animate-light-sweep"
            style={{ animationDuration: "8s" }}
          />
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 w-full max-w-5xl mx-auto px-5 sm:px-6 text-center pt-[env(safe-area-inset-top)] pt-24 pb-32"
      >
        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/20 bg-accent/[0.06] text-sm text-accent mb-8 sm:mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          Kfz-Meisterbetrieb in München
        </motion.div>

        {/* Headline – responsive, nie abgeschnitten */}
        <motion.h1
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display font-extrabold tracking-tight leading-[1.1]"
        >
          <span className="block text-[clamp(1.75rem,7vw,4.5rem)] text-white">
            Unfallinstandsetzung
          </span>
          <span className="block mt-1">
            <span className="text-accent text-[clamp(2rem,8vw,4.5rem)]">& </span>
            <span className="text-white text-[clamp(1.75rem,7vw,4.5rem)]">Lackierung</span>
          </span>
          <span className="block text-zinc-500 text-[clamp(1.4rem,5vw,3rem)] mt-2">
            in München
          </span>
        </motion.h1>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-6 text-base sm:text-lg text-zinc-400 max-w-md mx-auto leading-relaxed"
        >
          Saubere Arbeit. Faire Preise.
          <br />
          <span className="text-zinc-300">Direkte Kommunikation.</span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <GlowButton
            href={CONTACT.phoneUrl}
            variant="primary"
            size="lg"
            className="w-full sm:w-auto"
          >
            <PhoneIcon className="w-5 h-5" />
            Jetzt anrufen
          </GlowButton>
          <GlowButton
            href={CONTACT.mapsUrl}
            variant="secondary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto"
          >
            <MapPinIcon className="w-5 h-5" />
            Route planen
          </GlowButton>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-zinc-600 uppercase tracking-[0.2em]">
            Scrollen
          </span>
          <div className="w-[1px] h-10 relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
              className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
