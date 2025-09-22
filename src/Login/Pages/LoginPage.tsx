import React, { useState } from "react";
import { login, register } from "../../API/APIAuth";  
import ParticlesBackground from "../Components/UI/BackgroundParticles";
import RadarBackground from "../Components/UI/RadarBackground";
import { useNavigate } from "@tanstack/react-router";

export default function LoginPage() {
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");

  const playSonar = () => {
    const audio = new Audio("/sounds/sonar.mp3");
    audio.play();
  };
  const navigate = useNavigate();
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      console.log("Login exitoso:", data);
      playSonar();
      navigate({ to: "/lobby", replace: true }); // <-- redirección
    } catch (error) {
      alert("Usuario o contraseña incorrectos");
      console.error(error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (registerPassword !== registerConfirm) {
      alert("Las contraseñas no coinciden");
      return;
    }
    try {
      await register(registerUsername, registerPassword);
      alert("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setIsLogin(true);
      setRegisterUsername("");
      setRegisterPassword("");
      setRegisterConfirm("");
      setShowForm(false);
    } catch (error) {
      alert("Error al registrar usuario");
      console.error(error);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 overflow-hidden">
      <ParticlesBackground />

      {/* Círculo tipo radar en el fondo */}
      <div className="absolute inset-0 flex items-center justify-center">
        <RadarBackground />
      </div>

      <div className="relative z-10 bg-slate-900/80 backdrop-blur-md rounded-2xl shadow-2xl p-8 max-w-sm w-full">
        <h1 className="text-4xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One']">
          Battleship
        </h1>
        {!showForm ? (
          <>
            <p className="text-2xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One'] mt-8">
              ¡Bienvenido capitán!
            </p>
            <div className="flex justify-center gap-4 my-10">
              <button
                type="button"
                onClick={() => {
                  setIsLogin(true);
                  setShowForm(true);
                }}
                className="px-6 py-3 rounded-xl font-bold uppercase transition-all duration-200 border-2 bg-sky-500/80 text-white border-black shadow text-xl"
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(false);
                  setShowForm(true);
                }}
                className="px-6 py-3 rounded-xl font-bold uppercase transition-all duration-200 border-2 bg-slate-800/40 text-sky-400 border-sky-700 text-xl"
              >
                Registrarse
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-center gap-4 my-6">
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`px-4 py-2 rounded-xl font-bold uppercase transition-all duration-200 border-2 ${
                  isLogin
                    ? "bg-sky-500/80 text-white border-black shadow"
                    : "bg-slate-800/40 text-sky-400 border-sky-700"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`px-4 py-2 rounded-xl font-bold uppercase transition-all duration-200 border-2 ${
                  !isLogin
                    ? "bg-sky-500/80 text-white border-black shadow"
                    : "bg-slate-800/40 text-sky-400 border-sky-700"
                }`}
              >
                Registrarse
              </button>
            </div>
            <p className="text-2xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One'] mb-6">
              {isLogin
                ? "Inicia sesión para comandar tu flota"
                : "Regístrate para unirte a la batalla"}
            </p>
            {/* Formulario de Login */}
            {isLogin && (
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="flex flex-col items-center">
                  <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                    Usuario
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Capitán..."
                    className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                    required
                  />
                </div>

                <div className="flex flex-col items-center mt-6">
                  <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                    required
                  />
                </div>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-80 max-w-full text-2xl font-extrabold text-sky-100 text-center tracking-widest uppercase font-['Russo_One'] bg-gradient-to-r from-sky-600/60 via-sky-500/60 to-sky-400/60 hover:from-sky-400/80 hover:to-sky-600/80 shadow-lg hover:shadow-sky-400/40 py-3 rounded-xl transition-all duration-200 outline-none ring-1 ring-sky-700 hover:ring-2 hover:ring-sky-300 border-2 border-black"
                  >
                    Entrar al Puente de Mando
                  </button>
                </div>
              </form>
            )}

            {/* Formulario de Registro */}
            {!isLogin && (
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="flex flex-col items-center">
                  <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                    Usuario
                  </label>
                  <input
                    type="text"
                    value={registerUsername}
                    onChange={(e) => setRegisterUsername(e.target.value)}
                    placeholder="Capitán..."
                    className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex flex-col items-center mt-6">
                  <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex flex-col items-center mt-6">
                  <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                    Confirmar Contraseña
                  </label>
                  <input
                    type="password"
                    value={registerConfirm}
                    onChange={(e) => setRegisterConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                    required
                  />
                </div>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="w-80 max-w-full text-2xl font-extrabold text-sky-100 text-center tracking-widest uppercase font-['Russo_One'] bg-gradient-to-r from-sky-600/60 via-sky-500/60 to-sky-400/60 hover:from-sky-400/80 hover:to-sky-600/80 shadow-lg hover:shadow-sky-400/40 py-3 rounded-xl transition-all duration-200 outline-none ring-1 ring-sky-700 hover:ring-2 hover:ring-sky-300 border-2 border-black"
                  >
                    Registrarse
                  </button>
                </div>
              </form>
            )}
          </>
        )}
      </div>
    </div>
  );
}
