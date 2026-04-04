"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useRef, type ReactNode } from "react";

type GlowButtonProps = {
  children: ReactNode;
  href: string;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  className?: string;
  target?: string;
  rel?: string;
};

export default function GlowButton({
  children,
  href,
  variant = "primary",
  size = "lg",
  className = "",
  target,
  rel,
}: GlowButtonProps) {
  const ref = useRef<HTMLAnchorElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 300, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 300, damping: 20 });

  const glowX = useTransform(springX, (v) => `${v}px`);
  const glowY = useTransform(springY, (v) => `${v}px`);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  const baseClasses =
    size === "lg"
      ? "px-8 py-4 text-lg gap-3"
      : "px-6 py-3 text-base gap-2";

  const variantClasses = {
    primary:
      "bg-gradient-to-r from-accent via-amber-400 to-accent text-black font-bold animate-gradient-shift",
    secondary:
      "bg-transparent border-2 border-zinc-600 text-white font-semibold hover:border-accent/60",
    ghost:
      "bg-white/[0.04] border border-white/[0.08] text-white font-medium hover:bg-white/[0.08]",
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      target={target}
      rel={rel}
      onMouseMove={handleMouseMove}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: "spring", stiffness: 400, damping: 15 }}
      className={`relative inline-flex items-center justify-center rounded-2xl overflow-hidden cursor-pointer ${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {variant === "primary" && (
        <motion.div
          className="absolute w-32 h-32 rounded-full bg-white/30 blur-xl pointer-events-none"
          style={{ left: glowX, top: glowY, x: "-50%", y: "-50%" }}
        />
      )}
      {variant === "secondary" && (
        <motion.div
          className="absolute w-24 h-24 rounded-full bg-accent/20 blur-xl pointer-events-none"
          style={{ left: glowX, top: glowY, x: "-50%", y: "-50%" }}
        />
      )}

      <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
        <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer" />
      </div>

      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.a>
  );
}
