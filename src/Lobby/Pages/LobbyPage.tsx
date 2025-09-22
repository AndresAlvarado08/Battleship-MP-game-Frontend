import React, { useState } from "react";
import { useRoomsQuery, useCreateRoom } from "../../Hooks/UseRooms";
import { useNavigate } from "@tanstack/react-router";
import ParticlesBackground from "../Components/BackgroundParticles";
import RadarBackground from "../Components//RadarBackground";
import "../Style/Lobby.css"; // <-- importa tu CSS

export default function Lobby() {
  const { data: rooms, isLoading } = useRoomsQuery();
  const createRoom = useCreateRoom();
  const navigate = useNavigate();

  const [players, setPlayers] = useState<number>(2);
  const [joinCode, setJoinCode] = useState("");

  const handleCreateRoom = async () => {
    const room = await createRoom.CreateRoom("Andres");
    navigate({ to: `/room/${room.code}` });
  };
  const handleJoin = (code: string) => {
    const c = code.trim();
    if (c) navigate({ to: `/room/${c}` });
  };

  return (
    <div className="lobby">
      {/* Radar centrado */}
      <div className="radar-wrap">
        <div className="radar">
          <div className="ring r1"></div>
          <div className="ring r2"></div>
          <div className="ring r3"></div>
          <div className="dot"></div>
          <div className="beam"></div>
        </div>
      </div>

      {/* Panel central */}
      <div className="panel">
        <div className="header">
          <h1>DESCRIPCIÓN DEL JUEGO</h1>
          <p>Battleship no es un mmo no lineal</p>
        </div>

        {/* === Dos cards lado a lado === */}
        <div className="actions">
          <div className="card">
            <h3>CREAR SALA</h3>
            <p className="sub">número de jugadores</p>
            <input
              type="number"
              min={2}
              max={6}
              value={players}
              onChange={(e) => setPlayers(Number(e.target.value))}
            />
            <button className="btn primary" onClick={handleCreateRoom}>
              Crear sala
            </button>
          </div>

          <div className="card">
            <h3>INGRESAR A SALA</h3>
            <p className="sub">código</p>
            <input
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
              placeholder="ABC12"
            />
            <button className="btn secondary" onClick={() => handleJoin(joinCode)}>
              Ingresar a sala
            </button>
          </div>
        </div>

        {/* Debajo puedes dejar tus tableros / lista de salas */}
        <div className="rooms">
          {isLoading ? (
            <p className="muted">Cargando salas…</p>
          ) : rooms && rooms.length ? (
            <ul>
              {rooms.map((room) => (
                <li key={room.id} className="room">
                  <div>
                    <div><strong>Código:</strong> {room.code}</div>
                    <div>Host: {room.owner}</div>
                    <div>Jugadores: ({room.players}/{room.maxPlayers})</div>
                  </div>
                  <button
                    className="btn primary sm"
                    disabled={room.players >= room.maxPlayers}
                    onClick={() => handleJoin(room.code)}
                  >
                    Unirse
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">No hay salas disponibles.</p>
          )}
        </div>
      </div>
    </div>
  );
}
