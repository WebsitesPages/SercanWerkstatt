"use client";

import { motion } from "framer-motion";
import {
  WrenchIcon,
  ChatBubbleIcon,
  ShieldCheckIcon,
  SparklesIcon,
} from "./Icons";
import SectionHeader from "./SectionHeader";

const reasons = [
  {
    icon: WrenchIcon,
    title: "Saubere Arbeit",
    text: "Jeder Auftrag wird mit höchster Sorgfalt und Präzision ausgeführt. Keine halben Sachen.",
    delay: 0,
  },
  {
    icon: ChatBubbleIcon,
    title: "Direkte Kommunikation",
    text: "Klare Absprachen, ehrliche Einschätzung. Sie wissen immer, woran Sie sind.",
    delay: 0.1,
  },
  {
    icon: ShieldCheckIcon,
    title: "Erfahrung",
    text: "Jahrelange Erfahrung in Unfallinstandsetzung und Fahrzeuglackierung. Wir kennen unser Handwerk.",
    delay: 0.2,
  },
  {
    icon: SparklesIcon,
    title: "Präzise Umsetzung",
    text: "Detailgenau und termingerecht. Ihr Fahrzeug sieht aus wie vor dem Schaden.",
    delay: 0.3,
  },
];

export default function WhyUs() {
  return (
    <section
      id="warum"
      className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Atmospheric background */}
      <div className="absolute inset-0 bg-surface-light" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Floating decorative elements */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -right-32 w-64 h-64 border border-accent/[0.05] rounded-full"
      />
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ duration: 80, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-20 -left-20 w-48 h-48 border border-accent/[0.04] rounded-full"
      />

      <div className="max-w-5xl mx-auto relative">
        <SectionHeader
          label="Warum Renginal"
          title="Darauf können Sie sich verlassen"
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-4xl mx-auto">
          {reasons.map((r) => (
            <motion.div
              key={r.title}
              initial={{ opacity: 0, x: -30, filter: "blur(6px)" }}
              whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.7,
                delay: r.delay,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={{ x: 6 }}
              className="group flex gap-5 p-6 rounded-2xl bg-surface/60 backdrop-blur-sm border border-border hover:border-accent/20 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover reveal glow */}
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 w-20 h-20 bg-accent/[0.06] rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

              <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-gradient-to-br from-accent/15 to-accent/5 flex items-center justify-center text-accent border border-accent/10 group-hover:border-accent/30 group-hover:scale-110 transition-all duration-500">
                <r.icon className="w-6 h-6" />
              </div>
              <div className="relative">
                <h3 className="font-display font-bold text-white text-lg">
                  {r.title}
                </h3>
                <p className="mt-2 text-zinc-400 text-sm leading-relaxed">
                  {r.text}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
