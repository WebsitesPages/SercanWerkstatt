"use client";

import { motion } from "framer-motion";
import { PhoneIcon, MapPinIcon, EnvelopeIcon } from "./Icons";
import { CONTACT } from "@/lib/contact";

const actions = [
  {
    icon: PhoneIcon,
    label: "Anrufen",
    sub: "Direkt verbinden",
    href: CONTACT.phoneUrl,
    gradient: "from-green-600/20 to-green-900/20",
    border: "border-green-500/20 hover:border-green-400/40",
    iconColor: "text-green-400",
    glow: "group-hover:shadow-green-500/20",
  },
  {
    icon: MapPinIcon,
    label: "Route",
    sub: "Navigation starten",
    href: CONTACT.mapsUrl,
    gradient: "from-blue-600/20 to-blue-900/20",
    border: "border-blue-500/20 hover:border-blue-400/40",
    iconColor: "text-blue-400",
    glow: "group-hover:shadow-blue-500/20",
    external: true,
  },
  {
    icon: EnvelopeIcon,
    label: "E-Mail",
    sub: "Nachricht senden",
    href: CONTACT.emailUrl,
    gradient: "from-accent/20 to-amber-900/20",
    border: "border-accent/20 hover:border-accent/40",
    iconColor: "text-accent",
    glow: "group-hover:shadow-accent/20",
  },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 30, scale: 0.9 },
  show: { opacity: 1, y: 0, scale: 1 },
};

export default function QuickActions() {
  return (
    <section className="relative -mt-20 z-20 px-4 sm:px-6">
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="max-w-lg mx-auto grid grid-cols-3 gap-3"
      >
        {actions.map((action) => (
          <motion.a
            key={action.label}
            variants={item}
            whileHover={{ y: -6, scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            href={action.href}
            target={action.external ? "_blank" : undefined}
            rel={action.external ? "noopener noreferrer" : undefined}
            className={`group flex flex-col items-center justify-center gap-2 py-6 rounded-2xl bg-gradient-to-b ${action.gradient} border ${action.border} backdrop-blur-sm text-white transition-all shadow-lg ${action.glow} group-hover:shadow-xl`}
          >
            <div className={`${action.iconColor} transition-transform group-hover:scale-110`}>
              <action.icon className="w-6 h-6" />
            </div>
            <span className="text-sm font-semibold">{action.label}</span>
            <span className="text-[10px] text-zinc-500 hidden sm:block">
              {action.sub}
            </span>
          </motion.a>
        ))}
      </motion.div>
    </section>
  );
}
