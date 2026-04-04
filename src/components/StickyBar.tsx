"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { PhoneIcon, MapPinIcon } from "./Icons";
import { CONTACT } from "@/lib/contact";

export default function StickyBar() {
  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  return (
    <motion.div
      style={{ opacity }}
      className="fixed bottom-0 left-0 right-0 z-50 md:hidden"
    >
      <div className="h-6 bg-gradient-to-t from-black/90 to-transparent" />

      <div className="bg-black/95 backdrop-blur-xl border-t border-white/[0.06] px-4 pb-[env(safe-area-inset-bottom)] pt-2.5 pb-3">
        <div className="flex gap-3 max-w-md mx-auto">
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={CONTACT.phoneUrl}
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 bg-gradient-to-r from-accent via-amber-400 to-accent animate-gradient-shift text-black font-bold rounded-xl shadow-lg shadow-accent/20"
          >
            <PhoneIcon className="w-5 h-5" />
            Anrufen
          </motion.a>
          <motion.a
            whileTap={{ scale: 0.95 }}
            href={CONTACT.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 inline-flex items-center justify-center gap-2 py-3.5 border border-zinc-600 text-white font-semibold rounded-xl bg-white/[0.04] backdrop-blur-sm"
          >
            <MapPinIcon className="w-5 h-5" />
            Route
          </motion.a>
        </div>
      </div>
    </motion.div>
  );
}
