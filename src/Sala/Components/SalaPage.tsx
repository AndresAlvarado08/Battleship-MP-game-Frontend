// src/Pages/SalaPage.tsx
import React, { useEffect, useRef } from "react";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useSala } from "../../Sala/Hooks/salaHook";
import ParticlesBackground from "../../Components/UI/BackgroundParticles";
import RadarBackground from "../../Components/UI/RadarBackground";
import "../../Components/Style/Login-Lobby-Style.css";

// Ajusta estas rutas si tu app usa paths distintos
const SETUP_ROUTE = (codigo: string) => `/battleship/${codigo}/setup`;
const GAME_ROUTE  = (codigo: string) => `/battleship/${codigo}/play`;

// Fallback mientras el backend esté fijo en 6
const FALLBACK_MAX = 6;

export default function SalaPage() {
  const navigate = useNavigate();
  // Debe coincidir con el path registrado en el router: '/sala/$codigo'
  const { codigo } = useParams({ from: "/sala/$codigo" }) as { codigo: string };

  const { useSalaById, exitSalaMutation, isExitingSala } = useSala();
  const {
    data: sala,
    isLoading,
    isError,
    error,
    refetch,
  } = useSalaById(codigo);

  // Polling suave para refrescar el estado de la sala
  useEffect(() => {
    const id = setInterval(() => refetch(), 3000);
    return () => clearInterval(id);
  }, [refetch]);

  // Evita navegaciones repetidas durante el polling
  const lastRouteRef = useRef<string | null>(null);
  const safeNavigate = (to: string) => {
    if (lastRouteRef.current === to) return;
    lastRouteRef.current = to;
    navigate({ to });
  };

  // Redirecciones según estado/capacidad
  useEffect(() => {
    if (!sala) return;

    const estadoNorm = String(sala.estado ?? "esperando")
      .toLowerCase()
      .replace(/\s+/g, "_"); // "en curso" -> "en_curso"

    const max = typeof sala.maxJugadores === "number" && sala.maxJugadores > 0
      ? sala.maxJugadores
      : FALLBACK_MAX;

    const ocupados = Array.isArray(sala.jugadores) ? sala.jugadores.length : 0;
    const llena = ocupados >= max;

    // 1) Si está esperando y se llenó => setup de barcos
    if (estadoNorm === "esperando" && llena) {
      safeNavigate(SETUP_ROUTE(sala.codigo));
      return;
    }

    // 2) Si está en curso => pantalla del juego
    const enCurso = ["en_curso", "en_juego", "jugando", "in_game", "running"].includes(estadoNorm);
    if (enCurso) {
      safeNavigate(GAME_ROUTE(sala.codigo));
      return;
    }
  }, [sala, navigate]);

  // Función para salir de la sala
  const handleExitSala = async () => {
    try {
      await exitSalaMutation.mutateAsync(codigo);
      navigate({ to: "/lobby" });
    } catch (error) {
      console.error("Error al salir de la sala:", error);
    }
  };

  const estadoUi =
    sala
      ? (String(sala.estado).toLowerCase() === "esperando" ? "PREPARTIDA" : String(sala.estado).toUpperCase())
      : "Cargando...";

  const maxUi = (sala?.maxJugadores ?? FALLBACK_MAX);
  const jugadoresUi = Array.isArray(sala?.jugadores) ? sala!.jugadores.length : 0;

  return (
    <div className="lobby">
      <ParticlesBackground />
      <div className="radar-wrap">
        <RadarBackground />
      </div>

      {/* Botón para volver al lobby - esquina superior izquierda */}
      <button
        className="btn sm secondary"
        onClick={handleExitSala}
        disabled={isExitingSala}
        style={{
          position: "absolute",
          top: "20px",
          left: "20px",
          width: "auto",
          zIndex: 10
        }}
      >
        {isExitingSala ? "SALIENDO..." : "VOLVER AL LOBBY"}
      </button>

      <div className="panel">
        <div className="header" style={{ position: "relative" }}>
          <h1>CÓDIGO DE SALA: {codigo?.toUpperCase()}</h1>
          <p>Estado: {estadoUi}</p>
          <button
            className="btn sm primary"
            onClick={() => refetch()}
            style={{ position: "absolute", right: 0, top: 0, width: "auto" }}
          >
            ACTUALIZAR
          </button>
        </div>

        {isLoading && <p className="muted">Cargando sala…</p>}

        {isError && (
          <div
            className="card"
            style={{
              background: "rgba(127, 29, 29, .60)",
              borderColor: "rgba(239, 68, 68, .60)",
              color: "#fca5a5",
              textAlign: "center",
            }}
          >
            {String((error as any)?.message ?? "No se pudo cargar la sala")}
          </div>
        )}

        {sala && (
          <div className="card" style={{ gap: 12 }}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <div>
                <strong>Host: </strong>
                {sala.host || "No definido"}
              </div>
              <div>
                <strong>Jugadores: </strong> {jugadoresUi}/{maxUi}
              </div>
            </div>
            
            {/* Botón centrado en su propia línea */}
            <div style={{ textAlign: "center", marginTop: "12px" }}>
              <button
                className="btn sm secondary"
                onClick={() => navigator.clipboard?.writeText(sala.codigo)}
                style={{ width: "auto" }}
              >
                COPIAR CÓDIGO
              </button>
            </div>

            <div className="sub" style={{ marginTop: 8 }}>
              Jugadores en sala
            </div>
            {Array.isArray(sala.jugadores) && sala.jugadores.length > 0 ? (
              <ul style={{ marginTop: 6, lineHeight: 1.6 }}>
                {sala.jugadores.map((nick, i) => (
                  <li
                    key={`${nick}-${i}`}
                    className="room"
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <span>{nick}</span>
                    {nick === sala.host && (
                      <span style={{ fontSize: 12, opacity: 0.8 }}>(host)</span>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="muted">Aún no hay jugadores en esta sala.</p>
            )}

            <div
              className="card"
              style={{
                marginTop: 14,
                background: "rgba(30, 64, 175, .45)",
                borderColor: "rgba(59, 130, 246, .5)",
                color: "#dbeafe",
              }}
            >
              {(() => {
                const estadoNorm = String(sala.estado ?? "").toLowerCase().replace(/\s+/g, "_");
                if (estadoNorm === "esperando") {
                  return jugadoresUi < maxUi
                    ? "Esperando jugadores para iniciar (PREPARTIDA)…"
                    : "Sala completa. Enviando a colocar barcos…";
                }
                return "La partida está en curso. Redirigiendo al juego…";
              })()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
