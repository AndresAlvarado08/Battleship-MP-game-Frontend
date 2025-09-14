import { useState } from "react";
import ParticlesBackground from "../Components/UI/BackgroundParticles";
import RadarBackground from "../Components/UI/RadarBackground";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const playSonar = () => {
  const audio = new Audio("/sounds/sonar.mp3");
  audio.play();
};

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Aquí iría tu lógica de login (fetch al backend)
    console.log("Login:", username, password);
    playSonar();
  };


  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-950 overflow-hidden">
      <ParticlesBackground />

      {/* Círculo tipo radar en el fondo */}
      <div className="absolute inset-0 flex items-center justify-center">
      <RadarBackground />
      </div>

      <div className="relative z-10 bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-2xl shadow-2xl p-8 max-w-sm w-full">
        <h1 className="text-4xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One']">
          Battleship
        </h1>
        <p className="text-4xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One']">
          Inicia sesión para comandar tu flota
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-4xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One']">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Capitán..."
              className="text-4xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One'] w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>

          <div>
            <label className="text-4xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One']">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="text-4xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One'] w-full p-3 rounded-lg bg-slate-800 text-white border border-slate-600 focus:border-sky-500 focus:ring-2 focus:ring-sky-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="text-4xl font-extrabold text-sky-400 text-center tracking-widest uppercase font-['Russo_One'] w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 rounded-lg shadow-md transition-colors duration-200"
          >
            Entrar al Puente de Mando
          </button>
        </form>
      </div>
    </div>
  );
}
