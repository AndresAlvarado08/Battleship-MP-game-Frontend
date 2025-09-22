import React, { useState } from "react";
import { useForm } from '@tanstack/react-form';
import { useNavigate } from "@tanstack/react-router";
import { useUser } from "../Hooks/userHook";
import { LoginData, LoginSchema } from "../Schemas/loginSchema";
import { AxiosError } from 'axios';
import ParticlesBackground from "./BackgroundParticles";
import RadarBackground from "./RadarBackground";

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

        if (typeof errorMsg === 'string' && errorMsg.includes('deshabilitado')) {
          alert('El usuario está deshabilitado. Contacta al administrador.');
        } else {
          setFormErrors({
            general: 'Credenciales incorrectas o error en el servidor',
          });
        }
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
        alert('Registro exitoso');
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
        setFormErrors({ general: 'Error al registrar usuario' });
      }
    },
  });

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
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  loginForm.handleSubmit();
                }} 
                className="space-y-6"
              >
                {formErrors.general && (
                  <div className="text-red-400 text-center text-sm">
                    {formErrors.general}
                  </div>
                )}

                <loginForm.Field name="username">
                  {(field) => (
                    <div className="flex flex-col items-center">
                      <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                        Usuario
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Capitán..."
                        className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                        required
                      />
                      {formErrors.username && (
                        <span className="text-red-400 text-sm mt-1">{formErrors.username}</span>
                      )}
                    </div>
                  )}
                </loginForm.Field>

                <loginForm.Field name="password">
                  {(field) => (
                    <div className="flex flex-col items-center mt-6">
                      <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                        Contraseña
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                        required
                      />
                      {formErrors.password && (
                        <span className="text-red-400 text-sm mt-1">{formErrors.password}</span>
                      )}
                    </div>
                  )}
                </loginForm.Field>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={mutation.isLoggingIn}
                    className="w-80 max-w-full text-2xl font-extrabold text-sky-100 text-center tracking-widest uppercase font-['Russo_One'] bg-gradient-to-r from-sky-600/60 via-sky-500/60 to-sky-400/60 hover:from-sky-400/80 hover:to-sky-600/80 shadow-lg hover:shadow-sky-400/40 py-3 rounded-xl transition-all duration-200 outline-none ring-1 ring-sky-700 hover:ring-2 hover:ring-sky-300 border-2 border-black disabled:opacity-50"
                  >
                    {mutation.isLoggingIn ? 'Conectando...' : 'Entrar al Puente de Mando'}
                  </button>
                </div>
              </form>
            )}

            {/* Formulario de Registro */}
            {!isLogin && (
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  registerForm.handleSubmit();
                }} 
                className="space-y-6"
              >
                {formErrors.general && (
                  <div className="text-red-400 text-center text-sm">
                    {formErrors.general}
                  </div>
                )}

                <registerForm.Field name="username">
                  {(field) => (
                    <div className="flex flex-col items-center">
                      <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                        Usuario
                      </label>
                      <input
                        type="text"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="Capitán..."
                        className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                        required
                      />
                    </div>
                  )}
                </registerForm.Field>

                <registerForm.Field name="password">
                  {(field) => (
                    <div className="flex flex-col items-center mt-6">
                      <label className="block mb-2 text-xl font-extrabold text-sky-400 tracking-widest uppercase font-['Russo_One']">
                        Contraseña
                      </label>
                      <input
                        type="password"
                        name={field.name}
                        value={field.state.value}
                        onBlur={field.handleBlur}
                        onChange={(e) => field.handleChange(e.target.value)}
                        placeholder="••••••••"
                        className="w-80 max-w-full p-3 rounded-xl bg-slate-800/40 text-white border border-sky-700 shadow-md focus:border-sky-400 focus:ring-2 focus:ring-sky-500 outline-none text-lg text-center font-['Russo_One'] transition-all duration-200"
                        required
                      />
                    </div>
                  )}
                </registerForm.Field>

                <div className="flex justify-center">
                  <button
                    type="submit"
                    disabled={mutation.isRegistering}
                    className="w-80 max-w-full text-2xl font-extrabold text-sky-100 text-center tracking-widest uppercase font-['Russo_One'] bg-gradient-to-r from-sky-600/60 via-sky-500/60 to-sky-400/60 hover:from-sky-400/80 hover:to-sky-600/80 shadow-lg hover:shadow-sky-400/40 py-3 rounded-xl transition-all duration-200 outline-none ring-1 ring-sky-700 hover:ring-2 hover:ring-sky-300 border-2 border-black disabled:opacity-50"
                  >
                    {mutation.isRegistering ? 'Registrando...' : 'Registrarse'}
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