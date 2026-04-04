"use client";

import { motion } from "framer-motion";

export default function SectionHeader({
  label,
  title,
  children,
}: {
  label: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="text-center mb-16">
      <motion.span
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="inline-flex items-center gap-3 text-accent text-sm font-semibold tracking-[0.2em] uppercase"
      >
        <span className="w-8 h-px bg-accent/40" />
        {label}
        <span className="w-8 h-px bg-accent/40" />
      </motion.span>
      <motion.h2
        initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
        whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        className="mt-4 text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold text-white tracking-tight"
      >
        {title}
      </motion.h2>
      {children && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>
      )}
    </div>
  );
}
