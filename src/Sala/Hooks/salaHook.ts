import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createSala, joinSala, getSala, getSalas, exitSala } from "../Services/salaService";
import { useAuth } from "../../Hooks/UseAuth";
import type { Sala } from "../Models/salaModel";

export const useSala = () => {
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuth();

  const {
    data: salas = [],
    isLoading: isLoadingSalas,
    isError: isErrorSalas,
    error: errorSalas,
    refetch: refetchSalas,
  } = useQuery<Sala[]>({
    queryKey: ["salas"],
    queryFn: getSalas,
    enabled: isAuthenticated,
    staleTime: 30_000,
    retry: (failureCount, error: any) => {
      const status = error?.response?.status;
      if (status === 401 || status === 403) return false;
      return failureCount < 3;
    },
  });

  const createSalaMutation = useMutation({
    mutationFn: () => createSala(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["salas"] });
    },
  });

  const joinSalaMutation = useMutation({
    mutationFn: (codigo: string) => joinSala(codigo),
    onSuccess: (salaJoined) => {
      queryClient.invalidateQueries({ queryKey: ["salas"] });
      queryClient.setQueryData(["sala", salaJoined.codigo], salaJoined);
    },
  });

    const exitSalaMutation = useMutation({
      mutationFn: (codigo: string) => exitSala(codigo),
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["salas"] });
      },
    });

  const useSalaById = (codigo: string) =>
    useQuery<Sala>({
      queryKey: ["sala", codigo],
      queryFn: () => getSala(codigo),
      enabled: isAuthenticated && !!codigo,
      staleTime: 15_000,
    });


  return {
    salas, isLoadingSalas, isErrorSalas, errorSalas, refetchSalas,
    createSalaMutation, isCreatingSala: createSalaMutation.isPending,
    joinSalaMutation, isJoiningSala: joinSalaMutation.isPending,
    exitSalaMutation, isExitingSala: exitSalaMutation.isPending,
    useSalaById,
  };
};
