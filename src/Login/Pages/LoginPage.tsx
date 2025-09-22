import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { login, register } from "../../API/APIAuth";

// MISMAS UI Y ESTILOS GLOBALES DEL LOBBY
import ParticlesBackground from "../../Components/UI/BackgroundParticles";
import RadarBackground from "../../Components/UI/RadarBackground";
import "../../Components/Style/Style.css";

export default function LoginPage() {
  // ---- estado (SIN CAMBIOS DE LÓGICA) ----
  const [showForm, setShowForm] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [registerUsername, setRegisterUsername] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [registerConfirm, setRegisterConfirm] = useState("");

  const navigate = useNavigate();
  const playSonar = () => new Audio("/sounds/sonar.mp3").play();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await login(username, password);
      console.log("Login exitoso:", data);
      playSonar();
      navigate({ to: "/lobby", replace: true });
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

  // ---- VISTA con mismos contenedores que LobbyPage ----
  return (
    <div className="lobby">{/* mismo root que Lobby */}
      <ParticlesBackground />
      <RadarBackground /> {/* mismo radar (centrado/cono) */}

      <div className="panel">{/* mismo contenedor del card grande */}
        <div className="header">{/* igual que Lobby */}
          <h1>BATTLESHIP</h1>
          <p>Inicia sesión o regístrate para comandar tu flota</p>
        </div>

        {/* mismas columnas que en Lobby */}
        <div className="actions">
          {/* ===== Card: Iniciar sesión ===== */}
          <div className="card">
            <h3>INICIAR SESIÓN</h3>

            {/* Estado compacto (mostrar solo botón) igual al flujo que ya tenías */}
            {!showForm || !isLogin ? (
              <>
                <p className="sub">Accede con tu usuario</p>
                <button
                  type="button"
                  className="btn primary"
                  onClick={() => {
                    setIsLogin(true);
                    setShowForm(true);
                  }}
                >
                  Iniciar sesión
                </button>
              </>
            ) : (
              <form onSubmit={handleLogin}>
                <p className="sub">Ingresa tus credenciales</p>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Usuario"
                  required
                />
                <input
                  style={{ marginTop: 10 }}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
                <button type="submit" className="btn primary" style={{ marginTop: 14 }}>
                  Entrar al Puente de Mando
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  style={{ marginTop: 10 }}
                  onClick={() => setShowForm(false)}
                >
                  Volver
                </button>
              </form>
            )}
          </div>

          {/* ===== Card: Registrarse ===== */}
          <div className="card">
            <h3>REGISTRARSE</h3>

            {!showForm || isLogin ? (
              <>
                <p className="sub">Crea tu cuenta nueva</p>
                <button
                  type="button"
                  className="btn secondary"
                  onClick={() => {
                    setIsLogin(false);
                    setShowForm(true);
                  }}
                >
                  Registrarse
                </button>
              </>
            ) : (
              <form onSubmit={handleRegister}>
                <p className="sub">Completa los datos</p>
                <input
                  type="text"
                  value={registerUsername}
                  onChange={(e) => setRegisterUsername(e.target.value)}
                  placeholder="Usuario"
                  required
                />
                <input
                  style={{ marginTop: 10 }}
                  type="password"
                  value={registerPassword}
                  onChange={(e) => setRegisterPassword(e.target.value)}
                  placeholder="Contraseña"
                  required
                />
                <input
                  style={{ marginTop: 10 }}
                  type="password"
                  value={registerConfirm}
                  onChange={(e) => setRegisterConfirm(e.target.value)}
                  placeholder="Confirmar contraseña"
                  required
                />
                <button type="submit" className="btn primary" style={{ marginTop: 14 }}>
                  Registrarse
                </button>
                <button
                  type="button"
                  className="btn secondary"
                  style={{ marginTop: 10 }}
                  onClick={() => setShowForm(false)}
                >
                  Volver
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
