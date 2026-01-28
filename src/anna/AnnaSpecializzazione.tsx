import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Pill, Stethoscope, Syringe } from "lucide-react";

type Pack = "A" | "B" | "C";

const STORAGE_KEY = "anna_specializzazione_gift_pack";

function fireMedicalConfetti(intensity: "light" | "big" = "light") {
  const duration = intensity === "big" ? 1700 : 900;
  const end = Date.now() + duration;
  const colors = ["#22c55e", "#60a5fa", "#f472b6", "#a78bfa", "#fde047"]; // green/blue/pink/purple/yellow
  const defaults = {
    startVelocity: intensity === "big" ? 34 : 26,
    spread: 360,
    ticks: intensity === "big" ? 70 : 55,
    zIndex: 999,
    gravity: 0.95,
    scalar: intensity === "big" ? 1.1 : 1.0,
  };

  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = intensity === "big" ? 55 : 32;

    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.5, y: 0.32 },
      colors,
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(particleCount * 0.5),
      origin: { x: 0.15, y: 0.35 },
      colors,
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(particleCount * 0.5),
      origin: { x: 0.85, y: 0.35 },
      colors,
    });
  }, intensity === "big" ? 220 : 240);
}

function fireSnowConfetti() {
  const end = Date.now() + 1600;
  const colors = ["#e2e8f0", "#bfdbfe", "#f8fafc"]; // icy whites/blues
  const defaults = { startVelocity: 18, spread: 360, ticks: 80, zIndex: 999, gravity: 0.7, scalar: 0.9 };

  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    confetti({
      ...defaults,
      particleCount: 35,
      origin: { x: 0.5, y: 0.15 },
      colors,
    });
  }, 260);
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

function GiftBox({
  label,
  onPick,
  accent,
  wiggleDelay,
}: {
  label: string;
  onPick: () => void;
  accent: "a" | "b" | "c";
  wiggleDelay: number;
}) {
  const accentGrad =
    accent === "a"
      ? "from-fuchsia-500/25 to-indigo-500/10"
      : accent === "b"
        ? "from-emerald-500/20 to-sky-500/10"
        : "from-amber-400/20 to-rose-500/10";

  return (
    <motion.button
      onClick={onPick}
      className={
        "relative w-full overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br " +
        accentGrad +
        " px-6 py-8 text-left backdrop-blur focus:outline-none focus:ring-2 focus:ring-white/30"
      }
      initial={{ opacity: 0, y: 12 }}
      animate={{
        opacity: 1,
        y: 0,
        rotate: [0, -1.5, 1.5, 0],
      }}
      transition={{
        opacity: { duration: 0.25 },
        y: { duration: 0.25 },
        rotate: { delay: wiggleDelay, duration: 1.1, ease: "easeInOut" },
      }}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.985 }}
      layout
    >
      {/* ribbon */}
      <div className="pointer-events-none absolute inset-0 opacity-55">
        <div className="absolute left-1/2 top-0 h-full w-10 -translate-x-1/2 bg-white/10" />
        <div className="absolute left-0 top-1/2 h-10 w-full -translate-y-1/2 bg-white/10" />
      </div>

      <div className="relative">
        <div className="flex items-center justify-between">
          <div className="text-lg font-semibold">{label}</div>
          <div className="text-2xl">🎁</div>
        </div>
        <div className="mt-2 text-sm text-white/70">
          Tocca per scartare
        </div>
      </div>

      {/* sparkles */}
      <div className="pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 blur-2xl" />
      <div className="pointer-events-none absolute -left-8 -bottom-10 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
    </motion.button>
  );
}

export default function AnnaSpecializzazione() {
  const [picked, setPicked] = useState<Pack | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY) as Pack | null;
    if (saved === "A" || saved === "B" || saved === "C") setPicked(saved);

    // More “medical” confetti at page open
    setTimeout(() => fireMedicalConfetti("big"), 350);
  }, []);

  const onPick = (p: Pack) => {
    setPicked(p);
    window.localStorage.setItem(STORAGE_KEY, p);

    // snow effects only after opening
    setTimeout(() => fireSnowConfetti(), 450);
  };

  const packCopy = useMemo(() => {
    switch (picked) {
      case "A":
        return {
          title: "Pacco A",
          line: "Congratulazioni per la specializzazione: Dottoressa Ginecologa 🩺",
        };
      case "B":
        return {
          title: "Pacco B",
          line: "Ufficialmente ginecologa. Adesso sì che possiamo dirlo 😄",
        };
      case "C":
        return {
          title: "Pacco C",
          line: "Specializzazione sbloccata. Livello: leggenda.",
        };
      default:
        return null;
    }
  }, [picked]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-white">
      <div className="relative mx-auto w-full max-w-md px-4 pb-10 pt-6">
        {/* floating icons: medicine only at start */}
        {!picked && (
          <>
            <FloatingIcon x="8%" y="12%" delay={0.15}>
              <Stethoscope className="h-7 w-7 text-sky-200" />
            </FloatingIcon>
            <FloatingIcon x="82%" y="16%" delay={0.45}>
              <Syringe className="h-7 w-7 text-fuchsia-200" />
            </FloatingIcon>
            <FloatingIcon x="10%" y="70%" delay={0.75}>
              <Pill className="h-7 w-7 text-emerald-200" />
            </FloatingIcon>
          </>
        )}

        <header className="pt-10">
          <div className="text-xs uppercase tracking-widest text-white/55">Per Anna</div>
          <h1 className="mt-2 text-2xl font-semibold leading-tight">
            Una piccola sorpresa
          </h1>
          <p className="mt-2 text-sm text-white/70">
            Tra poco scopri tutto.
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
                className="flex flex-col gap-5"
              >
                <div className="text-center text-sm text-white/75">
                  Tocca un pacco per scartarlo.
                </div>

                <GiftBox label="Pacco A" accent="a" wiggleDelay={0.9} onPick={() => onPick("A")} />
                <GiftBox label="Pacco B" accent="b" wiggleDelay={1.1} onPick={() => onPick("B")} />
                <GiftBox label="Pacco C" accent="c" wiggleDelay={1.3} onPick={() => onPick("C")} />
              </motion.div>
            ) : (
              <motion.div
                key="reveal"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur"
              >
                <div className="flex items-center justify-between">
                  <div className="text-sm font-semibold text-white/90">{packCopy?.title}</div>
                  <Stethoscope className="h-5 w-5 text-emerald-200" />
                </div>

                <div className="mt-3 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4">
                  <div className="text-xs uppercase tracking-widest text-white/55">Voucher</div>
                  <div className="mt-1 text-3xl font-semibold">250€</div>
                  <div className="mt-1 text-sm text-white/75">
                    Per una <span className="font-medium text-white">tuta da sci</span>. La scegli tu dove vuoi.
                  </div>
                </div>

                <div className="mt-4 text-sm text-white/80">{packCopy?.line}</div>
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
