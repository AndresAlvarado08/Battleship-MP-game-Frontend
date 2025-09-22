import React, { useState } from "react";
import { useSala } from "../../Sala/Hooks/salaHook";
import { useAuth } from "../../Hooks/UseAuth";
import { useNavigate } from "@tanstack/react-router";
import ParticlesBackground from "../../Components/UI/BackgroundParticles";
import RadarBackground from "../../Components/UI/RadarBackground";
import "../../Components/Style/Login-Lobby-Style.css";

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
      <div className="lobby">
        <ParticlesBackground />
        <div className="radar-wrap">
          <RadarBackground />
        </div>
        <div className="panel" style={{ textAlign: 'center' }}>
          <div className="header">
            <h1>Cargando...</h1>
            <p>Verificando autenticación</p>
          </div>
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
            className="btn secondary sm"
            style={{ 
              position: 'absolute', 
              top: '0', 
              right: '0',
              background: 'rgba(185, 28, 28, .90)',
              color: '#fff'
            }}
          >
            Cerrar Sesión
          </button>
          <h1>BATTLESHIP LOBBY</h1>
          <p>Prepárate para la batalla naval</p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="card" style={{ 
            background: 'rgba(127, 29, 29, .60)',
            borderColor: 'rgba(239, 68, 68, .60)',
            color: '#fca5a5',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            {errorMessage}
          </div>
        )}

        {/* Mensaje de no autenticado */}
        {!isAuthenticated && (
          <div className="card" style={{ 
            background: 'rgba(133, 77, 14, .60)',
            borderColor: 'rgba(245, 158, 11, .60)',
            color: '#fde68a',
            textAlign: 'center',
            marginBottom: '24px'
          }}>
            No estás autenticado. Por favor, inicia sesión nuevamente.
            <button 
              onClick={() => navigate({ to: '/' })}
              className="btn sm"
              style={{ 
                marginLeft: '8px',
                background: 'rgba(217, 119, 6, .90)',
                color: '#fff',
                display: 'inline-block',
                width: 'auto'
              }}
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
              style={{ 
                background: 'rgba(234, 88, 12, .90)',
                color: '#fff'
              }}
            >
              {isJoiningSala ? 'UNIÉNDOSE...' : 'UNIRSE A SALA'}
            </button>
          </div>
        </div>

        {/* Lista de Salas Disponibles */}
        <div className="rooms">
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginBottom: '20px' 
          }}>
            <h3 style={{ margin: '0' }}>SALAS DISPONIBLES</h3>
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
            <p className="muted">
              Buscando salas disponibles...
            </p>
          ) : salas && salas.length > 0 ? (
            <ul>
              {salas.map((sala) => (
                <li key={sala.id} className="room">
                  <div>
                    <strong>{sala.codigo}</strong>
                    <div style={{ fontSize: '14px', color: 'rgba(226, 243, 255, .65)' }}>
                      Host: {sala.host} | Jugadores: {sala.jugadores.length}/{sala.maxJugadores}
                    </div>
                    <div style={{ fontSize: '12px', color: 'rgba(226, 243, 255, .50)' }}>
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
                    style={{ width: 'auto' }}
                  >
                    {sala.jugadores.length >= sala.maxJugadores 
                      ? 'SALA LLENA' 
                      : sala.estado !== 'esperando'
                      ? 'EN JUEGO'
                      : 'UNIRSE'}
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="muted">
              No hay salas disponibles. ¡Sé el primero en crear una!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
