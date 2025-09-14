import { useRoomsQuery, useCreateRoom } from "../Hooks/UseRooms";
import { useNavigate } from "@tanstack/react-router";

export default function Lobby() {
  const { data: rooms, isLoading } = useRoomsQuery();
  const createRoom = useCreateRoom();
  const navigate = useNavigate();

  const handleCreateRoom = async () => {
    const room = await createRoom.CreateRoom("Andres"); // luego pasas el user real
    navigate({ to: `/room/${room.code}` });
  };

  const handleJoin = (code: string) => {
    navigate({ to: `/room/${code}` });
  };

  if (isLoading) return <p>Cargando salas...</p>;

  return (
    <div className="p-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold mb-6">Battleship Multiplayer</h1>

      <button
        onClick={handleCreateRoom}
        className="bg-green-500 text-white px-6 py-2 rounded mb-6"
      >
        Crear sala
      </button>

      <div className="w-full max-w-md">
        {rooms && rooms.length > 0 ? (
          <ul className="space-y-3">
            {rooms.map((room) => (
              <li
                key={room.id}
                className="border p-3 rounded flex justify-between items-center"
              >
                <div>
                  <p className="font-semibold">Codigo de sala: {room.code}</p>
                  <p className="text-sm text-gray-600">
                    Host: {room.owner}
                  </p>
                  <p className="text-sm text-gray-600">
                    Jugadores: ({room.players}/{room.maxPlayers})
                  </p>
                </div>
                <button
                  onClick={() => handleJoin(room.code)}
                  disabled={room.players >= room.maxPlayers}
                  className="bg-blue-500 text-white px-4 py-1 rounded disabled:opacity-50"
                >
                  Unirse
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No hay salas disponibles.</p>
        )}
      </div>
    </div>
  );
}