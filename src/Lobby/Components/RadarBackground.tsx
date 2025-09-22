import React from "react";

export default function RadarBackground() {
  return (
    <div className="relative w-[600px] h-[600px] select-none">
      {/* anillo exterior */}
      <div className="absolute inset-0 rounded-full border border-sky-600/40" />
      {/* anillos */}
      <div className="absolute inset-[5%] rounded-full border border-sky-600/20" />
      <div className="absolute inset-[15%] rounded-full border border-sky-600/20" />

      {/* punto central */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-sky-400 animate-ping" />

      {/* haz de radar: gira desde el centro */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] origin-center animate-radar-sweep"
           style={{
             background:
               "conic-gradient(from 0deg, rgba(56,189,248,0.35), rgba(56,189,248,0.12) 45deg, rgba(56,189,248,0) 90deg)"
           }}
      />
    </div>
  );
}
