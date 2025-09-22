import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSala, joinSala, getSala, getSalas } from "../Services/salaService";
import { JoinSalaRequest, Sala } from "../Models/salaModel";
import { cookieUtils } from "../../Utils/Cookies";

export const useSala = () => {
    const queryClient = useQueryClient();
    const hasToken = cookieUtils.hasToken();

    // Query para obtener todas las salas
    const {
        data: salas = [],
        isLoading: isLoadingSalas,
        isError: isErrorSalas,
        error: errorSalas,
        refetch: refetchSalas,
    } = useQuery<Sala[]>({
        queryKey: ["salas"],
        queryFn: getSalas,
        enabled: hasToken, // Solo ejecutar si hay token
        staleTime: 30 * 1000, // 30 segundos
        retry: (failureCount, error: any) => {
            // No reintentar si es error de autenticación
            if (error?.response?.status === 401 || error?.response?.status === 403) {
                return false;
            }
            return failureCount < 3;
        },
    });

    // Mutation para CREAR sala (no envías datos)
    const createSalaMutation = useMutation({
        mutationFn: () => createSala(), // No parámetros
        onSuccess: (newSala) => {
            queryClient.invalidateQueries({ queryKey: ["salas"] });
            console.log("Sala creada exitosamente:", newSala);
        },
        onError: (error) => {
            console.error("Error al crear la sala:", error);
        },
    });

    // Mutation para UNIRSE a sala (sí envías código)
    const joinSalaMutation = useMutation({
        mutationFn: (data: JoinSalaRequest) => joinSala(data),
        onSuccess: (salaJoined) => {
            queryClient.invalidateQueries({ queryKey: ["salas"] });
            queryClient.setQueryData(["sala", salaJoined.codigo], salaJoined);
            console.log("Te uniste a la sala:", salaJoined);
        },
        onError: (error) => {
            console.error("Error al unirse a la sala:", error);
        },
    });

    // Query para obtener una sala específica
    const useSalaById = (codigo: string) => {
        return useQuery<Sala>({
            queryKey: ["sala", codigo],
            queryFn: () => getSala(codigo),
            enabled: !!codigo, // Solo ejecutar si hay código
            staleTime: 15 * 1000, // 15 segundos
        });
    };

    return {
        // Datos de salas
        salas,
        isLoadingSalas,
        isErrorSalas,
        errorSalas,
        refetchSalas,

        // Crear sala
        createSalaMutation,
        isCreatingSala: createSalaMutation.isPending,
        createSalaError: createSalaMutation.error,

        // Unirse a sala  
        joinSalaMutation,
        isJoiningSala: joinSalaMutation.isPending,
        joinSalaError: joinSalaMutation.error,

        // Hook para sala específica
        useSalaById,
    };
};