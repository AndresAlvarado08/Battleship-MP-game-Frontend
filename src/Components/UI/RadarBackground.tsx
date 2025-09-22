import React from "react";

/** Radar del Lobby/Login (mismo DOM y clases) */
export default function RadarBackground() {
  return (
    <div className="radar-wrap" aria-hidden>
      <div className="radar">
        {/* Anillos */}
        <div className="ring r1" />
        <div className="ring r2" />
        <div className="ring r3" />
        <div className="ring r4" />

        {/* Haz (cono) */}
        <div className="beam" />

        {/* Punto central */}
        <div className="dot" />
      </div>
    </div>
  );
}
