import apiAuth from "../../API/APIAuth";
import { 
  Sala, 
  JoinSalaRequest, 
  CreateSalaResponse, 
  JoinSalaResponse 
} from "../Models/salaModel";

// Crear sala - NO envías datos, el backend genera todo
export async function createSala(): Promise<CreateSalaResponse> {
    const response = await apiAuth.post<CreateSalaResponse>("/sala/create");
    return response.data;
}

// Unirse a sala - SÍ envías el código de la sala
export async function joinSala(data: JoinSalaRequest): Promise<JoinSalaResponse> {
    const response = await apiAuth.post<JoinSalaResponse>(`/sala/join`, data);
    return response.data;
}

// Obtener información de una sala específica
export async function getSala(codigo: string): Promise<Sala> {
    const response = await apiAuth.get<Sala>(`/sala/${codigo}`);
    return response.data;
}

// Listar todas las salas disponibles
export async function getSalas(): Promise<Sala[]> {
    const response = await apiAuth.get<Sala[]>("/sala");
    return response.data;
}