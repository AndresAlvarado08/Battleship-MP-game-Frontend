// Model para la RESPUESTA del backend al crear/obtener una sala
export interface Sala {
    id: string;
    codigo: string;
    maxJugadores: number;
    host: string; // ID o username del host
    jugadores: string[]; // Array de IDs o usernames
    estado: 'esperando' | 'en_juego' | 'terminada';
    fechaCreacion: string;
}

// Model para REQUEST de unirse a sala (sí envías datos)
export interface JoinSalaRequest {
    codigo: string;
}

// Model para REQUEST de crear sala (NO envías datos, pero útil para consistencia)
export interface CreateSalaRequest {
  // Vacío - el backend crea todo automáticamente
}

// Response types para mejor tipado
export type CreateSalaResponse = Sala;
export type JoinSalaResponse = Sala;