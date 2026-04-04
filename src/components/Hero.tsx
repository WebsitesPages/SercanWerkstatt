"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { PhoneIcon, MapPinIcon } from "./Icons";
import { CONTACT } from "@/lib/contact";
import GlowButton from "./GlowButton";

const headlineWords = ["Unfallinstandsetzung", "&", "Lackierung"];
const subWords = ["in", "München"];

export default function Hero() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const textY = useTransform(scrollYProgress, [0, 1], [0, -60]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-[100dvh] flex items-center justify-center overflow-hidden"
    >
      {/* Layered background */}
      <motion.div className="absolute inset-0" style={{ y: bgY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-[#0c0c10] to-background" />

        {/* Animated diagonal lines - workshop aesthetic */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "repeating-linear-gradient(45deg, transparent, transparent 40px, rgba(232,168,73,0.3) 40px, rgba(232,168,73,0.3) 41px)",
          }}
        />

        {/* Moving ambient light orbs */}
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -20, 10, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[15%] left-[20%] w-[500px] h-[400px] bg-amber-500/[0.06] rounded-full blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, -40, 20, 0],
            y: [0, 30, -15, 0],
            scale: [1, 0.9, 1.1, 1],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-[20%] right-[15%] w-[400px] h-[350px] bg-amber-600/[0.04] rounded-full blur-[120px]"
        />

        {/* Light sweep across scene */}
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
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-36"
      >
        {/* Badge with glow */}
        <motion.div
          initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-accent/20 bg-accent/[0.06] text-sm text-accent mb-10"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-accent" />
          </span>
          Kfz-Meisterbetrieb in München
        </motion.div>

        {/* Headline - staggered word reveal */}
        <div className="mb-2">
          <div className="flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 px-2">
            {headlineWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ y: 40, opacity: 0, filter: "blur(8px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 0.9,
                  delay: 0.3 + i * 0.12,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={`font-display font-extrabold tracking-tight ${
                  word === "&"
                    ? "text-accent text-5xl sm:text-6xl lg:text-7xl"
                    : "text-white text-4xl sm:text-5xl lg:text-7xl"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Sub headline */}
        <div className="mb-8">
          <div className="flex items-baseline justify-center gap-x-4">
            {subWords.map((word, i) => (
              <motion.span
                key={word}
                initial={{ y: 30, opacity: 0, filter: "blur(6px)" }}
                animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
                transition={{
                  duration: 0.8,
                  delay: 0.7 + i * 0.1,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="font-display text-3xl sm:text-4xl lg:text-5xl tracking-tight text-zinc-500"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1 }}
          className="text-lg sm:text-xl text-zinc-400 max-w-lg mx-auto leading-relaxed"
        >
          Inal Unfallinstandsetzung + Fahrzeuglackierung.
          <br />
          <span className="text-zinc-300">
            Saubere Arbeit. Faire Preise. Direkte Kommunikation.
          </span>
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <GlowButton href={CONTACT.phoneUrl} variant="primary" size="lg">
            <PhoneIcon className="w-5 h-5" />
            Jetzt anrufen
          </GlowButton>
          <GlowButton
            href={CONTACT.mapsUrl}
            variant="secondary"
            size="lg"
            target="_blank"
            rel="noopener noreferrer"
          >
            <MapPinIcon className="w-5 h-5" />
            Route planen
          </GlowButton>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
        >
          <span className="text-xs text-zinc-600 uppercase tracking-[0.2em] font-body">
            Mehr entdecken
          </span>
          <div className="w-[1px] h-12 relative overflow-hidden">
            <motion.div
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
              className="absolute inset-x-0 h-1/2 bg-gradient-to-b from-transparent via-accent to-transparent"
            />
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
