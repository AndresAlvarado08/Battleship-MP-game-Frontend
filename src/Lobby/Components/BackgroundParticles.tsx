// components/ui/ParticlesBackground.tsx
import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim"; // o loadFull desde 'tsparticles' si instalas tsparticles

export default function ParticlesBackground() {
  const [initDone, setInitDone] = useState(false);

  useEffect(() => {
    // initParticlesEngine se encarga de inicializar el engine correctamente
    initParticlesEngine(async (engine) => {
      // carga solo las features necesarias (slim). Para todo, usar loadFull(engine).
      await loadSlim(engine);
    }).then(() => setInitDone(true));
  }, []);

  const options = useMemo(() => ({
  background: { color: "#0f172a" },
  particles: {
    color: { value: "#38bdf8" }, // azul claro
    move: { enable: true, speed: 0.8, direction: "none", outModes: "bounce" },
    number: { value: 80 },
    opacity: { value: 0.2 },
    shape: { type: "circle" },
    size: { value: { min: 2, max: 6 } },
  },
  interactivity: {
    events: {
      onHover: { enable: true, mode: "bubble" },
    },
    modes: {
      bubble: {
        distance: 2,
        size: 10,
        duration: 2,
        opacity: 0.4,
      },
    },
  },
  detectRetina: true,
}), []);

    return (
      <Particles id="tsparticles" options={options} className="absolute inset-0 -z-10" />
    );
}
