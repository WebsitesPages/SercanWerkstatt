"use client";

import { motion } from "framer-motion";
import SectionHeader from "./SectionHeader";

const steps = [
  {
    num: "01",
    title: "Kontakt",
    text: "Rufen Sie uns an oder kommen Sie vorbei. Wir besprechen Ihr Anliegen.",
  },
  {
    num: "02",
    title: "Begutachtung",
    text: "Wir begutachten den Schaden und erstellen einen transparenten Kostenvoranschlag.",
  },
  {
    num: "03",
    title: "Reparatur",
    text: "Fachgerechte Instandsetzung mit hochwertigen Materialien und Techniken.",
  },
  {
    num: "04",
    title: "Übergabe",
    text: "Gemeinsame Endkontrolle und Übergabe. Ihr Fahrzeug ist wieder einsatzbereit.",
  },
];

export default function Process() {
  return (
    <section id="ablauf" className="py-24 sm:py-32 px-4 sm:px-6 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-background via-surface/50 to-background" />

      <div className="max-w-4xl mx-auto relative">
        <SectionHeader
          label="So läuft es ab"
          title="In 4 Schritten zum Ergebnis"
        />

        <div className="relative">
          {/* Animated vertical timeline line */}
          <div className="absolute left-7 sm:left-9 top-0 bottom-0 w-px overflow-hidden hidden sm:block">
            <motion.div
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full bg-gradient-to-b from-accent/40 via-accent/20 to-transparent origin-top"
            />
          </div>

          <div className="space-y-8 sm:space-y-10">
            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, x: -40, filter: "blur(4px)" }}
                whileInView={{ opacity: 1, x: 0, filter: "blur(0px)" }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.15,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className="flex gap-6 sm:gap-8 items-start group"
              >
                {/* Step circle with pulse */}
                <div className="relative flex-shrink-0">
                  <motion.div
                    whileInView={{
                      boxShadow: [
                        "0 0 0 0 rgba(232,168,73,0)",
                        "0 0 0 12px rgba(232,168,73,0.1)",
                        "0 0 0 0 rgba(232,168,73,0)",
                      ],
                    }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 2,
                      delay: 0.5 + i * 0.2,
                      repeat: 0,
                    }}
                    className="w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-surface border-2 border-accent/40 flex items-center justify-center group-hover:border-accent group-hover:bg-accent/10 transition-all duration-500"
                  >
                    <span className="text-accent font-display font-bold text-base sm:text-lg">
                      {step.num}
                    </span>
                  </motion.div>
                </div>

                <div className="pt-2 sm:pt-4">
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-white group-hover:text-accent transition-colors duration-300">
                    {step.title}
                  </h3>
                  <p className="mt-2 text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md">
                    {step.text}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
