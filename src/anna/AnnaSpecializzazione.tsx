import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Pill, Stethoscope, Syringe } from "lucide-react";

type Pack = "A" | "B" | "C";

const STORAGE_KEY = "anna_specializzazione_gift_pack";

const MED_SHAPES = (() => {
  // canvas-confetti supports emoji/text shapes
  const anyConfetti = confetti as any;
  const mk = (text: string) => anyConfetti.shapeFromText({ text, scalar: 1.05 });
  return [mk("🩺"), mk("💊"), mk("🧬"), mk("🩹"), mk("🧪")];
})();

function fireMedicalConfetti(intensity: "light" | "big" = "light") {
  const duration = intensity === "big" ? 1600 : 900;
  const end = Date.now() + duration;
  const defaults = {
    startVelocity: intensity === "big" ? 34 : 26,
    spread: 360,
    ticks: intensity === "big" ? 85 : 70,
    zIndex: 999,
    gravity: 0.9,
    scalar: intensity === "big" ? 1.2 : 1.05,
  };

  const pickShape = () => MED_SHAPES[Math.floor(Math.random() * MED_SHAPES.length)];

  const interval = setInterval(() => {
    const timeLeft = end - Date.now();
    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    const particleCount = intensity === "big" ? 42 : 26;

    const shapes = [pickShape(), pickShape()];

    confetti({
      ...defaults,
      particleCount,
      origin: { x: 0.5, y: 0.28 },
      shapes,
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(particleCount * 0.55),
      origin: { x: 0.18, y: 0.32 },
      shapes,
    });

    confetti({
      ...defaults,
      particleCount: Math.floor(particleCount * 0.55),
      origin: { x: 0.82, y: 0.32 },
      shapes,
    });
  }, intensity === "big" ? 200 : 230);
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
  const glow =
    accent === "a"
      ? "from-fuchsia-500/25 to-indigo-500/10"
      : accent === "b"
        ? "from-emerald-500/20 to-sky-500/10"
        : "from-amber-400/20 to-rose-500/10";

  return (
    <motion.button
      onClick={onPick}
      className="relative w-full py-5 focus:outline-none"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      whileTap={{ scale: 0.985 }}
      layout
    >
      <motion.div
        className={
          "mx-auto flex h-32 w-32 items-center justify-center rounded-[2.25rem] border border-white/15 bg-gradient-to-br " +
          glow +
          " shadow-[0_0_0_1px_rgba(255,255,255,0.06),0_20px_60px_-30px_rgba(0,0,0,0.7)] backdrop-blur"
        }
        initial={{ rotate: 0 }}
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ delay: wiggleDelay, duration: 1.25, ease: "easeInOut" }}
      >
        <div className="text-6xl leading-none">🎁</div>
      </motion.div>

      <div className="mt-3 text-center text-base font-semibold text-white/90">{label}</div>
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
          line: "",
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
            Congratulazioni Dottoressa Ginecologa Anna Giudici 🩺
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

                <div className="flex flex-col gap-2">
                  <GiftBox label="Pacco A" accent="a" wiggleDelay={0.9} onPick={() => onPick("A")} />
                  <GiftBox label="Pacco B" accent="b" wiggleDelay={1.1} onPick={() => onPick("B")} />
                  <GiftBox label="Pacco C" accent="c" wiggleDelay={1.3} onPick={() => onPick("C")} />
                </div>
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

                {packCopy?.line ? (
                  <div className="mt-4 text-sm text-white/80">{packCopy.line}</div>
                ) : null}
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
