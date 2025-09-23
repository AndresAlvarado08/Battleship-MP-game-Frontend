// src/Sala/Services/salaService.ts
import apiAuth from "../../API/APIAuth";
import type { Sala } from "../Models/salaModel";

// Mientras el backend está fijo en 6, mantenemos este fallback.
// Cuando el backend empiece a enviar el valor real, se usará el del backend automáticamente.
const FALLBACK_MAX = 6;

/**
 * Intenta leer el máximo de varias formas comunes que puede enviar el backend.
 * Si no viene, retorna undefined (y luego cae al fallback).
 */
function pickMax(raw: any): number | undefined {
  const candidates = [
    raw?.maxJugadores,
    raw?.MaxJugadores,
    raw?.max_players,
    raw?.maxPlayers,
    raw?.capacidad,
    raw?.capacidadMaxima,
    raw?.capacity,
    raw?.reglas?.maxJugadores,
  ];
  const val = candidates.find((v) => v !== undefined && v !== null);
  const n = Number(val);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/** Normaliza SIEMPRE el shape a lo que usa el front */
function normalizeSala(raw: any): Sala {
  const max = pickMax(raw);
  const jugadores =
    Array.isArray(raw?.jugadores) ? raw.jugadores
    : Array.isArray(raw?.players) ? raw.players
    : [];

  return {
    // claves "canónicas" que usa el front
    codigo: String(raw?.codigo ?? raw?.Codigo ?? raw?.code ?? ""),
    host: String(raw?.host ?? raw?.anfitrion ?? raw?.owner ?? ""),
    jugadores: jugadores.map(String),
    maxJugadores: (typeof max === "number" && max > 0) ? max : FALLBACK_MAX,
    estado: String(raw?.estado ?? raw?.Status ?? raw?.status ?? "esperando").toLowerCase(),
    // campos auxiliares si tu modelo los tiene
    id: raw?.id ?? raw?.Id ?? raw?.ID,
    // ...cualquier otro campo que quieras conservar
  } as Sala;
}

/** Crear sala — tu backend actual “funcional” */
export async function createSala(): Promise<Sala> {
  // Mantengo el endpoint que ya te funciona. (Si es /sala/create en tu API, cámbialo aquí.)
  const { data } = await apiAuth.post("/sala/crear");
  return normalizeSala(data);
}

/** Unirse a sala — sin body (usa código en la URL) */
export async function joinSala(codigo: string): Promise<Sala> {
  const { data } = await apiAuth.post(`/sala/unirse/${encodeURIComponent(codigo)}`);
  return normalizeSala(data);
}

/** Obtener una sala por código */
export async function getSala(codigo: string): Promise<Sala> {
  const { data } = await apiAuth.get(`/sala/${encodeURIComponent(codigo)}`);
  return normalizeSala(data);
}

/** Listar salas */
export async function getSalas(): Promise<Sala[]> {
  const { data } = await apiAuth.get("/sala");
  return Array.isArray(data) ? data.map(normalizeSala) : [];
}

/**
 * Salir de sala.
 * Soporta dos variantes:
 *  1) POST /sala/salir/{codigo}
 *  2) POST /sala/salir   (body: { codigo })
 * Devuelve void porque el front no necesita el payload.
 */
export async function exitSala(codigo?: string): Promise<void> {
  try {
    if (codigo) {
      await apiAuth.post(`/sala/salir/${encodeURIComponent(codigo)}`);
      return;
    }
    // si no pasaron código, intenta sin path param (el backend podría resolver por usuario autenticado)
    await apiAuth.post("/sala/salir");
  } catch (err: any) {
    // fallback: intenta la otra variante si la primera falló por 404/405
    const status = err?.response?.status;
    if (status === 404 || status === 405) {
      if (codigo) {
        await apiAuth.post("/sala/salir", { codigo });
        return;
      }
      throw err;
    }
    throw err;
  }
}
