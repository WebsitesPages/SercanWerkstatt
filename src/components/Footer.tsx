import { CONTACT } from "@/lib/contact";

export default function Footer() {
  return (
    <footer className="relative py-10 px-4 sm:px-6 pb-28 md:pb-10 border-t border-white/[0.04]">
      <div className="absolute inset-0 bg-gradient-to-t from-black to-background" />

      <div className="max-w-6xl mx-auto relative flex flex-col sm:flex-row items-center justify-between gap-5 text-sm text-zinc-500">
        <div className="text-center sm:text-left">
          <p className="font-display font-bold text-zinc-300 text-base tracking-tight">
            RENGINAL
          </p>
          <p className="text-zinc-600 mt-1">
            Inal Unfallinstandsetzung + Fahrzeuglackierung
          </p>
        </div>
        <div className="text-center sm:text-right">
          <p className="text-zinc-600">{CONTACT.address}</p>
          <p className="mt-1">
            <a
              href={CONTACT.phoneUrl}
              className="hover:text-accent transition-colors duration-300"
            >
              {CONTACT.phoneDisplay}
            </a>
            <span className="mx-2 text-zinc-700">|</span>
            <a
              href={CONTACT.emailUrl}
              className="hover:text-accent transition-colors duration-300"
            >
              {CONTACT.email}
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
