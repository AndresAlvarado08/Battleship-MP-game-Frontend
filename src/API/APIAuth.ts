import axios from "axios";

const APIAuth = axios.create({
  baseURL: "http://localhost:3000/api",
});

export async function register(username: string, password: string) {
  const response = await fetch("http://localhost:5153/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Error en el registro");
  return response.json();
}

export async function login(username: string, password: string) {
  const response = await fetch("http://localhost:5153/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
    credentials: "include",
  });
  if (!response.ok) throw new Error("Usuario o contraseña incorrectos");
  return response.json();
}

export default APIAuth; 