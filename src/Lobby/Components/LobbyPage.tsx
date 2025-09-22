import React, { useState } from "react";
import { useSala } from "../../Sala/Hooks/salaHook";
import { useAuth } from "../../Hooks/UseAuth";
import { useNavigate } from "@tanstack/react-router";
import ParticlesBackground from "../../Components/UI/BackgroundParticles";
import RadarBackground from "../../Components/UI/RadarBackground";
import "../../Components/Style/Style.css";

export default function Lobby() {
  const { isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();
  const {
    salas,
    isLoadingSalas,
    createSalaMutation,
    isCreatingSala,
    joinSalaMutation,
    isJoiningSala,
    refetchSalas
  } = useSala();
  
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  /*
  // Si está cargando la autenticación, mostrar loading
  if (isAuthLoading) {
    return (
      <div className="relative min-h-screen bg-slate-950 overflow-hidden flex items-center justify-center">
        <ParticlesBackground />
        <div className="relative z-10 text-center">
          <h1 className="text-4xl font-extrabold text-sky-400 mb-4 tracking-widest uppercase font-['Russo_One']">
            Cargando...
          </h1>
          <p className="text-xl text-sky-300 font-['Russo_One']">
            Verificando autenticación
          </p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, ya se redirigirá automáticamente por el hook
  if (!isAuthenticated) {
    return null;
  }
    */

  const handleCreateSala = async () => {
    try {
      setErrorMessage("");
      const nuevaSala = await createSalaMutation.mutateAsync();
      console.log("Sala creada:", nuevaSala);
      navigate({ to: `/sala/${nuevaSala.codigo}` });
    } catch (error) {
      console.error("Error al crear sala:", error);
      setErrorMessage("Error al crear la sala. Intenta nuevamente.");
    }
  };

  const handleJoinSala = async (codigo?: string) => {
    const codigoToUse = codigo || joinCode.trim().toUpperCase();
    if (!codigoToUse) {
      setErrorMessage("Por favor ingresa un código de sala");
      return;
    }

    try {
      setErrorMessage("");
      const salaJoined = await joinSalaMutation.mutateAsync({ codigo: codigoToUse });
      console.log("Te uniste a la sala:", salaJoined);
      navigate({ to: `/sala/${salaJoined.codigo}` });
    } catch (error) {
      console.error("Error al unirse a la sala:", error);
      setErrorMessage("No se pudo unir a la sala. Verifica el código.");
    }
  };

  return (
    <div className="lobby">
      {/* Partículas de fondo */}
      <ParticlesBackground />
      
      {/* Radar centrado */}
      <div className="radar-wrap">
        <RadarBackground />
      </div>

      {/* Panel central */}
      <div className="panel">
        
        {/* Header */}
        <div className="header" style={{ position: 'relative' }}>
          <button 
            onClick={logout}
            className="btn sm secondary"
            style={{ 
              position: 'absolute', 
              top: '0', 
              right: '0',
              background: 'rgba(185, 28, 28, 0.8)',
              color: '#fff',
              width: 'auto'
            }}
          >
            Cerrar Sesión
          </button>
          <h1>BATTLESHIP LOBBY</h1>
          <p>Prepárate para la batalla naval</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div style={{ 
            margin: '16px 0',
            padding: '16px',
            background: 'rgba(127, 29, 29, 0.5)',
            border: '1px solid rgba(239, 68, 68, 1)',
            borderRadius: '12px',
            color: '#fecaca',
            textAlign: 'center'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Mensaje de no autenticado */}
        {!isAuthenticated && (
          <div style={{ 
            margin: '16px 0',
            padding: '16px',
            background: 'rgba(113, 63, 18, 0.5)',
            border: '1px solid rgba(245, 158, 11, 1)',
            borderRadius: '12px',
            color: '#fed7aa',
            textAlign: 'center'
          }}>
            No estás autenticado. Por favor, inicia sesión nuevamente.
            <button 
              onClick={() => navigate({ to: '/' })}
              className="btn sm primary"
              style={{ marginLeft: '8px', width: 'auto' }}
            >
              Ir al Login
            </button>
          </div>
        )}

        {/* Cards de acciones */}
        <div className="actions">
          
          {/* Card Crear Sala */}
          <div className="card">
            <h3>CREAR SALA</h3>
            <div className="sub">
              El servidor creará automáticamente una nueva sala
            </div>
            <button 
              className="btn primary"
              onClick={handleCreateSala}
              disabled={isCreatingSala}
            >
              {isCreatingSala ? 'CREANDO SALA...' : 'CREAR SALA'}
            </button>
          </div>

          {/* Card Unirse a Sala */}
          <div className="card">
            <h3>UNIRSE A SALA</h3>
            <div className="sub">
              Ingresa el código de la sala
            </div>
            <input
              type="text"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder="Ej: ABC123"
              maxLength={6}
            />
            <button 
              className="btn secondary"
              onClick={() => handleJoinSala()}
              disabled={isJoiningSala || !joinCode.trim()}
            >
              {isJoiningSala ? 'UNIÉNDOSE...' : 'UNIRSE A SALA'}
            </button>
          </div>
        </div>

        {/* Lista de Salas Disponibles */}
        <div className="rooms">
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3>SALAS DISPONIBLES</h3>
              <button 
                onClick={() => refetchSalas()}
                className="btn sm primary"
                disabled={isLoadingSalas}
                style={{ width: 'auto' }}
              >
                {isLoadingSalas ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
            
            {isLoadingSalas ? (
              <div className="muted">
                Buscando salas disponibles...
              </div>
            ) : salas && salas.length > 0 ? (
              <ul style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>
                {salas.map((sala) => (
                  <li key={sala.id} className="room">
                    <div>
                      <div style={{ fontSize: '18px', fontWeight: '800', marginBottom: '4px' }}>
                        {sala.codigo}
                      </div>
                      <div style={{ fontSize: '12px', opacity: '0.8' }}>
                        Host: {sala.host}
                      </div>
                      <div style={{ fontSize: '12px', opacity: '0.8' }}>
                        Jugadores: {sala.jugadores.length}/{sala.maxJugadores}
                      </div>
                      <div style={{ fontSize: '11px', opacity: '0.7' }}>
                        Estado: {sala.estado.toUpperCase()}
                      </div>
                    </div>
                    <button
                      className="btn sm primary"
                      disabled={
                        sala.jugadores.length >= sala.maxJugadores || 
                        sala.estado !== 'esperando' ||
                        isJoiningSala
                      }
                      onClick={() => handleJoinSala(sala.codigo)}
                      style={{ width: 'auto', minWidth: '80px', fontSize: '12px' }}
                    >
                      {sala.jugadores.length >= sala.maxJugadores 
                        ? 'LLENA' 
                        : sala.estado !== 'esperando'
                        ? 'EN JUEGO'
                        : 'UNIRSE'}
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="muted">
                No hay salas disponibles. ¡Sé el primero en crear una!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
