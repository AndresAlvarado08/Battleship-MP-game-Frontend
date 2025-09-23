import React from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import ParticlesBackground from "../Components/UI/BackgroundParticles";
import RadarBackground from "../Components/UI/RadarBackground";
import "../Components/Style/Login-Lobby-Style.css";

const VIDEO_ID = "dQw4w9WgXcQ";
const PLAYLIST = "RDdQw4w9WgXcQ";
// embed con autoplay, sin sugeridos externos y con playlist
const YT_EMBED = `https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&rel=0&modestbranding=1&playsinline=1&list=${PLAYLIST}&start_radio=1`;


export default function GamePage() {
  const navigate = useNavigate();
  const { codigo } = useParams({ from: "/battleship/$codigo/play" }) as { codigo: string };

  return (
    <div className="lobby">
      <ParticlesBackground />
      <div className="radar-wrap"><RadarBackground /></div>

      {/* Volver a la sala o lobby */}
      <button
        className="btn sm secondary"
        onClick={() => navigate({ to: `/sala/${codigo}` })}
        style={{ position: "absolute", top: 20, left: 20, width: "auto", zIndex: 10 }}
      >
        Volver a la sala
      </button>

      <div className="panel" style={{ maxWidth: 1000 }}>
        <div className="header" style={{ position: "relative" }}>
          <h1>PARTIDA — SALA {codigo?.toUpperCase()}</h1>
          <p>¡Buena suerte, capitán! ⚓</p>
        </div>

        {/* Contenedor responsive del video */}
        <div className="card" style={{ overflow: "hidden" }}>
          <div
            style={{
              position: "relative",
              paddingBottom: "56.25%", // 16:9
              height: 0,
              width: "100%",
            }}
          >
            <iframe
              title="Battleship Gameplay"
              src={YT_EMBED}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: 0,
                borderRadius: 12,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
