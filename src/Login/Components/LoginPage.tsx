import React, { useState } from "react";
import { useForm } from '@tanstack/react-form';
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../Hooks/userHook";
import { LoginData, LoginSchema } from "../Schemas/loginSchema";
import { AxiosError } from 'axios';
import RadarBackground from "../../Components/UI/RadarBackground";
import ParticlesBackground from "../../Components/UI/BackgroundParticles";
import "../../Components/Style/Login-Lobby-Style.css";

export default function LoginForm() {
  const navigate = useNavigate();
  const mutation = useUser();
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showForm, setShowForm] = useState(false);

  // Login Form
  const loginForm = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }: { value: LoginData }) => {
      setFormErrors({});

      const validation = LoginSchema.safeParse(value);

      if (!validation.success) {
        const fieldErrors: Record<string, string> = {};
        validation.error.issues.forEach((err) => {
          const field = err.path[0] as string;
          fieldErrors[field] = err.message;
        });
        setFormErrors(fieldErrors);
        return;
      }

      try {
        await mutation.loginMutation.mutateAsync({
          username: value.username,
          password: value.password,
        });
        
        // Debug: Verificar cookies después del login
        setTimeout(() => {
          import('../../Utils/Cookies').then(({ cookieUtils }) => {
            cookieUtils.debugCookies();
          });
        }, 100);

        alert('Inicio de sesión exitoso');
        navigate({ to: "/lobby" });
      } catch (err: unknown) {
        let errorMsg = '';
        if (err instanceof AxiosError) {
          errorMsg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          errorMsg = err.message;
        } else {
          errorMsg = String(err);
        }

        setFormErrors({
          general: 'Usuario o contraseña incorrectos',
        });
      }
    },
  });

  // Register Form
  const registerForm = useForm({
    defaultValues: {
      username: '',
      password: '',
    },
    onSubmit: async ({ value }) => {
      try {
        await mutation.createMutation.mutateAsync({
          username: value.username,
          password: value.password,
        });
        alert('Usuario registrado exitosamente');
        setIsLogin(true);
      } catch (err: unknown) {
        let errorMsg = '';
        if (err instanceof AxiosError) {
          errorMsg = err.response?.data?.message || err.message;
        } else if (err instanceof Error) {
          errorMsg = err.message;
        } else {
          errorMsg = String(err);
        }
        setFormErrors({ general: 'Error al registrar el usuario' });
      }
    },
  });

  return (
    <div className="lobby">
      <ParticlesBackground />

      {/* Círculo tipo radar en el fondo */}
      <div className="radar-wrap">
        <RadarBackground />
      </div>

      <div className="panel login-panel">
        <div className="header">
          <h1>Battleship</h1>
        </div>
        {!showForm ? (
          <>
            <div className="header">
              <p>¡Bienvenido capitán!</p>
            </div>
            <div className="actions login-actions">
              <div className="card">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(true);
                    setShowForm(true);
                  }}
                  className="btn primary"
                >
                  Iniciar sesión
                </button>
              </div>
              <div className="card">
                <button
                  type="button"
                  onClick={() => {
                    setIsLogin(false);
                    setShowForm(true);
                  }}
                  className="btn secondary"
                >
                  Registrarse
                </button>
              </div>
            </div>
          </>
        ) : (
          <>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginBottom: '24px' }}>
              <button
                type="button"
                onClick={() => setIsLogin(true)}
                className={`btn sm ${isLogin ? 'primary' : 'secondary'}`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => setIsLogin(false)}
                className={`btn sm ${!isLogin ? 'primary' : 'secondary'}`}
              >
                Registrarse
              </button>
            </div>
            <div className="header">
              <p>
                {isLogin
                  ? "Inicia sesión para comandar tu flota"
                  : "Regístrate para unirte a la batalla"}
              </p>
            </div>
            {/* Formulario de Login */}
            {isLogin && (
              <div className="card form-card">
                {formErrors.general && (
                  <div style={{ color: '#fca5a5', textAlign: 'center', fontSize: '14px', marginBottom: '16px' }}>
                    {formErrors.general}
                  </div>
                )}
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    loginForm.handleSubmit();
                  }}
                >
                  <loginForm.Field name="username">
                    {(field) => (
                      <div>
                        <h3 style={{ marginBottom: '8px' }}>Usuario</h3>
                        <input
                          type="text"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Capitán..."
                          required
                        />
                        {formErrors.username && (
                          <div style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px' }}>
                            {formErrors.username}
                          </div>
                        )}
                      </div>
                    )}
                  </loginForm.Field>

                  <loginForm.Field name="password">
                    {(field) => (
                      <div>
                        <h3 style={{ marginBottom: '8px' }}>Contraseña</h3>
                        <input
                          type={showPassword ? "text" : "password"}
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                        {formErrors.password && (
                          <div style={{ color: '#fca5a5', fontSize: '12px', marginTop: '4px' }}>
                            {formErrors.password}
                          </div>
                        )}
                      </div>
                    )}
                  </loginForm.Field>

                  <button
                    type="submit"
                    disabled={mutation.isLoggingIn}
                    className="btn primary"
                  >
                    {mutation.isLoggingIn ? 'Conectando...' : 'Entrar al Puente de Mando'}
                  </button>
                </form>
              </div>
            )}

            {/* Formulario de Registro */}
            {!isLogin && (
              <div className="card form-card">
                {formErrors.general && (
                  <div style={{ color: '#fca5a5', textAlign: 'center', fontSize: '14px', marginBottom: '16px' }}>
                    {formErrors.general}
                  </div>
                )}
                
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    registerForm.handleSubmit();
                  }}
                >
                  <registerForm.Field name="username">
                    {(field) => (
                      <div>
                        <h3 style={{ marginBottom: '8px' }}>Usuario</h3>
                        <input
                          type="text"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="Capitán..."
                          required
                        />
                      </div>
                    )}
                  </registerForm.Field>

                  <registerForm.Field name="password">
                    {(field) => (
                      <div>
                        <h3 style={{ marginBottom: '8px' }}>Contraseña</h3>
                        <input
                          type="password"
                          name={field.name}
                          value={field.state.value}
                          onBlur={field.handleBlur}
                          onChange={(e) => field.handleChange(e.target.value)}
                          placeholder="••••••••"
                          required
                        />
                      </div>
                    )}
                  </registerForm.Field>

                  <button
                    type="submit"
                    disabled={mutation.isRegistering}
                    className="btn primary"
                  >
                    {mutation.isRegistering ? 'Registrando...' : 'Registrarse'}
                  </button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}