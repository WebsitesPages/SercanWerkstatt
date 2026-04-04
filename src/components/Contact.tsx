"use client";

import { motion } from "framer-motion";
import { PhoneIcon, EnvelopeIcon, MapPinIcon } from "./Icons";
import { CONTACT } from "@/lib/contact";
import SectionHeader from "./SectionHeader";
import GlowButton from "./GlowButton";

const contactCards = [
  {
    icon: PhoneIcon,
    label: "Telefon",
    value: CONTACT.phoneDisplay,
    href: CONTACT.phoneUrl,
    iconBg: "from-green-500/15 to-green-600/5",
    iconBorder: "border-green-500/15 group-hover:border-green-400/30",
    iconColor: "text-green-400",
  },
  {
    icon: EnvelopeIcon,
    label: "E-Mail",
    value: CONTACT.email,
    href: CONTACT.emailUrl,
    iconBg: "from-accent/15 to-amber-600/5",
    iconBorder: "border-accent/15 group-hover:border-accent/30",
    iconColor: "text-accent",
  },
  {
    icon: MapPinIcon,
    label: "Adresse",
    value: CONTACT.addressShort,
    href: CONTACT.mapsUrl,
    external: true,
    iconBg: "from-blue-500/15 to-blue-600/5",
    iconBorder: "border-blue-500/15 group-hover:border-blue-400/30",
    iconColor: "text-blue-400",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const item = {
  hidden: { opacity: 0, y: 30, filter: "blur(6px)" },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Contact() {
  return (
    <section
      id="kontakt"
      className="py-24 sm:py-32 px-4 sm:px-6 relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-surface-light" />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent" />

      {/* Decorative glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-accent/[0.03] rounded-full blur-[100px]" />

      <div className="max-w-4xl mx-auto relative">
        <SectionHeader label="Kontakt" title="Sprechen Sie uns an">
          <p className="mt-4 text-zinc-400 max-w-md mx-auto">
            Rufen Sie an oder schreiben Sie uns eine E-Mail. Wir melden uns
            zeitnah bei Ihnen.
          </p>
        </SectionHeader>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          {contactCards.map((card) => (
            <motion.a
              key={card.label}
              variants={item}
              whileHover={{ y: -6, scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
              href={card.href}
              target={card.external ? "_blank" : undefined}
              rel={card.external ? "noopener noreferrer" : undefined}
              className="group flex flex-col items-center gap-4 p-7 rounded-2xl bg-surface/60 backdrop-blur-sm border border-border hover:border-accent/15 transition-all duration-500 relative overflow-hidden"
            >
              {/* Hover glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-accent/[0.03] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <div
                className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${card.iconBg} flex items-center justify-center ${card.iconColor} border ${card.iconBorder} transition-all duration-500 group-hover:scale-110`}
              >
                <card.icon className="w-7 h-7" />
              </div>
              <div className="text-center relative">
                <p className="font-display font-bold text-white text-lg">
                  {card.label}
                </p>
                <p className="text-sm text-zinc-400 mt-1">{card.value}</p>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
        >
          <GlowButton
            href={CONTACT.phoneUrl}
            variant="primary"
            className="flex-1"
          >
            <PhoneIcon className="w-5 h-5" />
            Anrufen
          </GlowButton>
          <GlowButton
            href={CONTACT.emailUrl}
            variant="secondary"
            className="flex-1"
          >
            <EnvelopeIcon className="w-5 h-5" />
            E-Mail senden
          </GlowButton>
        </motion.div>
      </div>
    </section>
  );
}
