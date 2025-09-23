import React, { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { ISourceOptions } from "@tsparticles/engine";

export default function ParticlesBackground() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => setReady(true));
  }, []);

  const options: ISourceOptions = useMemo(
    () => ({
      background: { color: { value: "transparent" } }, // ¡transparente!
      detectRetina: true,
      particles: {
        number: { value: 120, density: { enable: true, area: 800 } },
        color: { value: "#38bdf8" },
        opacity: { value: 0.35 },
        size: { value: { min: 1.5, max: 3.5 } },
        shape: { type: "circle" },
        move: {
          enable: true,
          speed: 0.6,
          direction: "none",
          outModes: { default: "bounce" },
        },
      },
      interactivity: {
        events: {
          onHover: { enable: true, mode: "bubble" },
        },
        modes: {
          bubble: { distance: 120, size: 6, duration: 2, opacity: 0.5 },
        },
      },
    }),
    []
  );

  if (!ready) return null;

  // fixed + z-0 => no queda detrás del body ni “debajo” por z negativo
  return (
    <Particles
      id="tsparticles"
      options={options}
      className="fixed inset-0 z-0 pointer-events-none"
    />
  );
}
