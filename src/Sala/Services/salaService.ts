import apiAuth from "../../API/APIAuth";
import type { Sala } from "../Models/salaModel";

/** Normaliza la forma que venga del backend a { maxJugadores } */
function normalizeSala(raw: any): Sala {
  
  const max =
    raw.maxJugadores ??
    raw.MaxJugadores ??
    raw.maximoJugadores ??
    raw.maxPlayers ??
    raw.max_players ??
    raw.capacidad ??
    raw.capacidadMaxima ??
    raw.maximo ??
    2; // fallback seguro

  // Normalizar el host - probar diferentes posibles nombres de campo
  const host = 
    raw.host ??
    raw.Host ??
    raw.hostName ??
    raw.hostname ??
    raw.creador ??
    raw.owner ??
    raw.propietario ??
    "Desconocido";

  const normalized = {
    ...raw,
    maxJugadores: Number(max),
    estado: String(raw.estado ?? raw.status ?? "esperando").toLowerCase(),
    jugadores: Array.isArray(raw.jugadores) ? raw.jugadores : [],
    host: String(host),
  };
  return normalized;
}

// Crear sala - backend: POST /sala/crear
export async function createSala(): Promise<Sala> {
  const { data } = await apiAuth.post("/sala/crear");
  return normalizeSala(data);
}

// Unirse a sala - backend: POST /sala/unirse/{codigo}  (sin body)
export async function joinSala(codigo: string): Promise<Sala> {
  const { data } = await apiAuth.post(`/sala/unirse/${encodeURIComponent(codigo)}`);
  return normalizeSala(data);
}

// Obtener una sala
export async function getSala(codigo: string): Promise<Sala> {
  const { data } = await apiAuth.get(`/sala/${encodeURIComponent(codigo)}`);
  return normalizeSala(data);
}

// Listar salas
export async function getSalas(): Promise<Sala[]> {
  const { data } = await apiAuth.get("/sala");
  return Array.isArray(data) ? data.map(normalizeSala) : [];
}

export async function exitSala(codigo: string): Promise<void> {
  await apiAuth.post(`/sala/salir/${encodeURIComponent(codigo)}`);
}