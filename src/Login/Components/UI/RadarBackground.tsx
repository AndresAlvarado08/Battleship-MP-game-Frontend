// components/ui/RadarBackground.tsx
export default function RadarBackground() {
  return (
    <div className="absolute w-[600px] h-[600px] rounded-full border border-sky-600/40 flex items-center justify-center overflow-hidden">
      {/* Círculo central pulsante */}
      <div className="absolute w-4 h-4 rounded-full bg-sky-400 animate-ping"></div>

      {/* Círculo interior */}
      <div className="absolute w-[70%] h-[70%] rounded-full border border-sky-600/20"></div>
      {/* Círculo medio */}
      <div className="absolute w-[90%] h-[90%] rounded-full border border-sky-600/20"></div>

      {/* Haz de radar */}
      <div className="absolute w-[300%] h-[300%] bg-gradient-to-r from-sky-500/30 via-sky-500/10 to-transparent origin-top-left rotate-0 animate-radar-sweep"></div>
    </div>
  );
}
