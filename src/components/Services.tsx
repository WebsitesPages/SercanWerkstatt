"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef } from "react";
import SectionHeader from "./SectionHeader";

const services = [
  {
    title: "Unfallinstandsetzung",
    description:
      "Professionelle Reparatur nach Unfallschäden. Wir bringen Ihr Fahrzeug in den Originalzustand zurück.",
    num: "01",
  },
  {
    title: "Fahrzeuglackierung",
    description:
      "Präzise Lackierarbeiten mit hochwertigen Materialien. Vom Spot-Repair bis zur Komplettlackierung.",
    num: "02",
  },
  {
    title: "Felgenservice",
    description:
      "Felgenaufbereitung und Reparatur. Beschädigte Felgen werden fachgerecht instandgesetzt.",
    num: "03",
  },
  {
    title: "Gutachten",
    description:
      "Schadenbegutachtung und Dokumentation. Wir koordinieren den gesamten Ablauf für Sie.",
    num: "04",
  },
  {
    title: "Achsvermessung",
    description:
      "Exakte Fahrwerkvermessung mit moderner Technik. Für sicheres Fahrverhalten und gleichmäßigen Reifenverschleiß.",
    num: "05",
  },
  {
    title: "Wartung & Reparatur",
    description:
      "Klassischer Kfz-Service. Zuverlässige Wartung und Reparatur für alle Fahrzeugmarken.",
    num: "06",
  },
];

function TiltCard({
  children,
  index,
}: {
  children: React.ReactNode;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const rotateX = useSpring(useTransform(mouseY, [-0.5, 0.5], [6, -6]), {
    stiffness: 200,
    damping: 20,
  });
  const rotateY = useSpring(useTransform(mouseX, [-0.5, 0.5], [-6, 6]), {
    stiffness: 200,
    damping: 20,
  });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set((e.clientX - rect.left) / rect.width - 0.5);
    mouseY.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformPerspective: 800 }}
      className="will-change-transform"
    >
      {children}
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="leistungen" className="py-24 sm:py-32 px-4 sm:px-6 relative">
      {/* Ambient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface to-background" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/[0.03] rounded-full blur-[150px]" />

      <div className="max-w-6xl mx-auto relative">
        <SectionHeader label="Unsere Leistungen" title="Was wir für Sie tun" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {services.map((service, i) => (
            <TiltCard key={service.num} index={i}>
              <div className="group relative p-7 sm:p-8 rounded-2xl bg-surface/80 backdrop-blur-sm border border-border hover:border-accent/20 transition-all duration-500 h-full overflow-hidden">
                {/* Hover glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/[0.04] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Light reflection on hover */}
                <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/[0.06] rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                <span className="relative text-6xl font-display font-black text-white/[0.04] group-hover:text-accent/10 transition-colors duration-500">
                  {service.num}
                </span>

                <h3 className="relative mt-3 text-xl font-display font-bold text-white group-hover:text-accent transition-colors duration-300">
                  {service.title}
                </h3>
                <p className="relative mt-3 text-zinc-400 text-sm leading-relaxed">
                  {service.description}
                </p>

                {/* Bottom accent line */}
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-accent/30 to-transparent scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-center" />
              </div>
            </TiltCard>
          ))}
        </div>
      </div>
    </section>
  );
}
