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
    <div className="relative min-h-screen bg-slate-950 overflow-hidden">
      {/* Partículas de fondo */}
      <ParticlesBackground />
      
      {/* Radar centrado */}
      <div className="absolute inset-0 flex items-center justify-center">
        <RadarBackground />
      </div>

      {/* Panel central */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6">
        
        {/* Header */}
        <div className="text-center mb-8 relative">
          <button 
            onClick={logout}
            className="absolute top-0 right-0 px-4 py-2 bg-red-600/60 hover:bg-red-500/80 text-white rounded-lg transition-all duration-200 font-['Russo_One'] text-sm"
          >
            Cerrar Sesión
          </button>
          <h1 className="text-5xl font-extrabold text-sky-400 mb-4 tracking-widest uppercase font-['Russo_One']">
            BATTLESHIP LOBBY
          </h1>
          <p className="text-xl text-sky-300 font-['Russo_One']">
            Prepárate para la batalla naval
          </p>
        </div>

        {/* Error Message */}
        {errorMessage && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-500 rounded-xl text-red-200 text-center backdrop-blur-sm">
            {errorMessage}
          </div>
        )}

        {/* Mensaje de no autenticado */}
        {!isAuthenticated && (
          <div className="mb-6 p-4 bg-yellow-900/50 border border-yellow-500 rounded-xl text-yellow-200 text-center backdrop-blur-sm">
            No estás autenticado. Por favor, inicia sesión nuevamente.
            <button 
              onClick={() => navigate({ to: '/login' })}
              className="ml-2 px-3 py-1 bg-yellow-600 hover:bg-yellow-500 rounded text-white text-sm"
            >
              Ir al Login
            </button>
          </div>
        )}

        {/* Cards de acciones */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-4xl mb-8">
          
          {/* Card Crear Sala */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-sky-700 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-sky-400 text-center mb-6 tracking-widest uppercase font-['Russo_One']">
              CREAR SALA
            </h3>
            <p className="text-sky-300 text-center mb-4 font-['Russo_One']">
              El servidor creará automáticamente una nueva sala
            </p>
            <div className="flex justify-center">
              <button 
                className="w-full text-xl font-extrabold text-sky-100 bg-gradient-to-r from-sky-600/60 via-sky-500/60 to-sky-400/60 hover:from-sky-400/80 hover:to-sky-600/80 shadow-lg hover:shadow-sky-400/40 py-4 px-8 rounded-xl transition-all duration-200 outline-none ring-1 ring-sky-700 hover:ring-2 hover:ring-sky-300 border-2 border-black disabled:opacity-50 font-['Russo_One'] disabled:cursor-not-allowed"
                onClick={handleCreateSala}
                disabled={isCreatingSala}
              >
                {isCreatingSala ? 'CREANDO SALA...' : 'CREAR SALA'}
              </button>
            </div>
          </div>

          {/* Card Unirse a Sala */}
          <div className="bg-slate-900/80 backdrop-blur-md border border-sky-700 rounded-2xl p-8 shadow-2xl">
            <h3 className="text-2xl font-extrabold text-sky-400 text-center mb-6 tracking-widest uppercase font-['Russo_One']">
              UNIRSE A SALA
            </h3>
            <p className="text-sky-300 text-center mb-4 font-['Russo_One']">
              Ingresa el código de la sala
            </p>
            <div className="space-y-4">
              <input
                type="text"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="Ej: ABC123"
                className="w-full p-4 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200 placeholder-slate-400"
                maxLength={6}
              />
              <button 
                className="w-full text-xl font-extrabold text-sky-100 bg-gradient-to-r from-orange-600/60 via-orange-500/60 to-orange-400/60 hover:from-orange-400/80 hover:to-orange-600/80 shadow-lg hover:shadow-orange-400/40 py-4 px-8 rounded-xl transition-all duration-200 outline-none ring-1 ring-orange-700 hover:ring-2 hover:ring-orange-300 border-2 border-black disabled:opacity-50 font-['Russo_One'] disabled:cursor-not-allowed"
                onClick={() => handleJoinSala()}
                disabled={isJoiningSala || !joinCode.trim()}
              >
                {isJoiningSala ? 'UNIÉNDOSE...' : 'UNIRSE A SALA'}
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Salas Disponibles */}
        <div className="w-full max-w-6xl">
          <div className="bg-slate-900/80 backdrop-blur-md border border-sky-700 rounded-2xl p-8 shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                SALAS DISPONIBLES
              </h3>
              <button 
                onClick={() => refetchSalas()}
                className="px-4 py-2 bg-sky-600/60 hover:bg-sky-500/80 text-white rounded-lg transition-all duration-200 font-['Russo_One'] text-sm"
                disabled={isLoadingSalas}
              >
                {isLoadingSalas ? 'Cargando...' : 'Actualizar'}
              </button>
            </div>
            
            {isLoadingSalas ? (
              <p className="text-sky-300 text-center text-lg font-['Russo_One']">
                Buscando salas disponibles...
              </p>
            ) : salas && salas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {salas.map((sala) => (
                  <div key={sala.id} className="bg-slate-800/60 border border-sky-600 rounded-xl p-6 hover:border-sky-400 transition-all duration-200">
                    <div className="text-center mb-4">
                      <div className="text-2xl font-bold text-sky-300 font-['Russo_One']">
                        {sala.codigo}
                      </div>
                      <div className="text-sm text-sky-400 font-['Russo_One']">
                        Host: {sala.host}
                      </div>
                      <div className="text-sm text-sky-400 font-['Russo_One']">
                        Jugadores: {sala.jugadores.length}/{sala.maxJugadores}
                      </div>
                      <div className="text-xs text-sky-500 font-['Russo_One'] mt-1">
                        Estado: {sala.estado.toUpperCase()}
                      </div>
                    </div>
                    <button
                      className="w-full text-sm font-bold text-white bg-sky-600/80 hover:bg-sky-500 py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed font-['Russo_One']"
                      disabled={
                        sala.jugadores.length >= sala.maxJugadores || 
                        sala.estado !== 'esperando' ||
                        isJoiningSala
                      }
                      onClick={() => handleJoinSala(sala.codigo)}
                    >
                      {sala.jugadores.length >= sala.maxJugadores 
                        ? 'SALA LLENA' 
                        : sala.estado !== 'esperando'
                        ? 'EN JUEGO'
                        : 'UNIRSE'}
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sky-300 text-center text-lg font-['Russo_One']">
                No hay salas disponibles. ¡Sé el primero en crear una!
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
