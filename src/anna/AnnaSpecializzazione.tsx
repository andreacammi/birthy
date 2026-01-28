import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { HeartPulse, Mountain, Snowflake, Stethoscope } from "lucide-react";

type Pack = "A" | "B" | "C";

const STORAGE_KEY = "anna_specializzazione_gift_pack";

function fireConfettiOnce() {
  const end = Date.now() + 1200;
  const defaults = { startVelocity: 25, spread: 360, ticks: 55, zIndex: 999 };

  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    confetti({
      ...defaults,
      particleCount: 35,
      origin: { x: 0.5, y: 0.35 },
      colors: ["#60a5fa", "#34d399", "#f472b6", "#fde047", "#a78bfa"],
    });
  }, 220);
}

function FloatingIcon({
  children,
  delay = 0,
  x,
  y,
}: {
  children: React.ReactNode;
  delay?: number;
  x: string;
  y: string;
}) {
  return (
    <motion.div
      className="pointer-events-none absolute opacity-40"
      style={{ left: x, top: y }}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{
        opacity: 0.45,
        y: [0, -10, 0],
        rotate: [0, 6, 0],
      }}
      transition={{
        delay,
        duration: 3.8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      {children}
    </motion.div>
  );
}

function PackCard({
  label,
  subtitle,
  onPick,
  tone,
}: {
  label: string;
  subtitle: string;
  onPick: () => void;
  tone: "ice" | "rose" | "mint";
}) {
  const gradient =
    tone === "ice"
      ? "from-sky-500/25 to-indigo-500/15"
      : tone === "rose"
        ? "from-fuchsia-500/20 to-rose-500/15"
        : "from-emerald-500/20 to-teal-500/15";

  return (
    <motion.button
      onClick={onPick}
      className={
        "w-full rounded-2xl border border-white/15 bg-gradient-to-br " +
        gradient +
        " px-5 py-4 text-left backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/30"
      }
      whileTap={{ scale: 0.985 }}
      whileHover={{ y: -2 }}
      layout
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-base font-semibold text-white">{label}</div>
          <div className="mt-1 text-sm text-white/70">{subtitle}</div>
        </div>
        <div className="text-xl">🎁</div>
      </div>
      <div className="mt-3 text-xs text-white/55">Tocca per aprire</div>
    </motion.button>
  );
}

export default function AnnaSpecializzazione() {
  const [picked, setPicked] = useState<Pack | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Pack | null;
    if (saved === "A" || saved === "B" || saved === "C") setPicked(saved);
  }, []);

  const onPick = (p: Pack) => {
    setPicked(p);
    window.localStorage.setItem(STORAGE_KEY, p);
    // a tiny delay so animations start, then confetti
    setTimeout(() => fireConfettiOnce(), 350);
  };

  const packCopy = useMemo(() => {
    // keep it fun but not cringe: tiny variations
    switch (picked) {
      case "A":
        return {
          title: "Pacco A — Modalità: neve ⛷️",
          line: "Congratulazioni per la specializzazione: Dottoressa Ginecologa 💙",
        };
      case "B":
        return {
          title: "Pacco B — Modalità: vetta 🏔️",
          line: "Ufficialmente ginecologa. Adesso sì che possiamo dirlo 😄",
        };
      case "C":
        return {
          title: "Pacco C — Modalità: missione compiuta 🩺",
          line: "Specializzazione sbloccata. Livello: leggenda.",
        };
      default:
        return null;
    }
  }, [picked]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="relative mx-auto w-full max-w-md px-4 pb-10 pt-6">
        {/* floating icons */}
        <FloatingIcon x="6%" y="10%" delay={0.2}>
          <Snowflake className="h-7 w-7 text-sky-300" />
        </FloatingIcon>
        <FloatingIcon x="80%" y="12%" delay={0.5}>
          <Stethoscope className="h-7 w-7 text-fuchsia-300" />
        </FloatingIcon>
        <FloatingIcon x="10%" y="68%" delay={0.8}>
          <Mountain className="h-7 w-7 text-indigo-300" />
        </FloatingIcon>
        <FloatingIcon x="82%" y="72%" delay={1.1}>
          <HeartPulse className="h-7 w-7 text-rose-300" />
        </FloatingIcon>

        <header className="pt-10">
          <div className="text-xs uppercase tracking-widest text-white/55">
            Per Anna
          </div>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">
            Una piccola sorpresa (non aprire troppo in fretta)
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Oggi niente quiz. Solo tre pacchi. Scegline uno.
          </p>
        </header>

        <main className="mt-6">
          <AnimatePresence initial={false} mode="popLayout">
            {!picked ? (
              <motion.div
                key="choices"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex flex-col gap-4"
              >
                <PackCard
                  label="Pacco A"
                  subtitle="Un po’ di neve, un po’ di stile"
                  tone="ice"
                  onPick={() => onPick("A")}
                />

                <PackCard
                  label="Pacco B"
                  subtitle="Per quando la montagna chiama"
                  tone="mint"
                  onPick={() => onPick("B")}
                />

                <PackCard
                  label="Pacco C"
                  subtitle="Per celebrare come si deve"
                  tone="rose"
                  onPick={() => onPick("C")}
                />

                <div className="mt-1 text-center text-xs text-white/45">
                  (Se ricarichi la pagina, niente trucchi: il pacco scelto resta.)
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur"
              >
                <div className="text-sm font-semibold text-white/90">
                  {packCopy?.title}
                </div>

                <div className="mt-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4">
                  <div className="text-xs uppercase tracking-widest text-white/55">
                    Voucher
                  </div>
                  <div className="mt-1 text-3xl font-semibold">250€</div>
                  <div className="mt-1 text-sm text-white/75">
                    Per una <span className="font-medium text-white">tuta da sci</span>.
                    La scegli tu dove vuoi.
                  </div>
                </div>

                <div className="mt-4 text-sm text-white/80">
                  {packCopy?.line}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    className="rounded-xl bg-white/10 px-4 py-2 text-sm text-white/80 hover:bg-white/15"
                    onClick={() => {
                      window.localStorage.removeItem(STORAGE_KEY);
                      setPicked(null);
                    }}
                  >
                    Reset (solo test)
                  </button>

                  <div className="text-xs text-white/45">🩺 + ⛷️</div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="mt-8 text-center text-xs text-white/35">
          Fatto con amore (e un po’ di CSS).
        </footer>
      </div>
    </div>
  );
}
