import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from '@tanstack/react-router';
import '../App.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { search } = useLocation(); 
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState('');

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await auth.login(form);
      // Redirige a donde el usuario intentaba ir, o al inicio del juego
      const to = (search && search.redirect) ? search.redirect : '/inicio';
      navigate({ to });
    } catch (error) {
      setErr(error.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 360, margin: '48px auto' }}>
      <h1 style={{ marginBottom: 16 }}>Login de users</h1>
      <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 12 }}>
        <label>
          Username
          <input
            name="username"
            value={form.username}
            onChange={handleChange}
            placeholder="tu usuario"
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? 'Entrando…' : 'Ingresar'}
        </button>
      </form>

      {err ? <p style={{ color: 'tomato' }}>{err}</p> : null}

      <p style={{ marginTop: 12 }}>
        ¿No tienes cuenta? <Link to="/registro">Registrarse</Link>
      </p>
    </div>
  );
}
