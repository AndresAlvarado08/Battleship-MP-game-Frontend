import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createRoom, getRooms } from "../Services/TestRoom";
import { Room } from "../Types/Room";

 export const useRoomsQuery = () => {
  return useQuery<Room[]>({
    queryKey: ["room"],
    queryFn: getRooms,
  });
};

export const useCreateRoom = () => {
  const queryClient = useQueryClient();

    const createMutation = useMutation({
      mutationFn: (owner: string) => createRoom(owner), 
      onSuccess: () =>{queryClient.invalidateQueries({ queryKey: ["room"] });
    console.log("Sala creada exitosamente");
    },
      onError: () => console.error("Error al crear la sala"),
    })

    return {
      CreateRoom: createMutation.mutateAsync
    }

};