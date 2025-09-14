import { Room } from "../Types/Room";

const mockRooms: Room[] = [];

export async function getRooms(): Promise<Room[]> {
  // simula delay
  return new Promise((res) => setTimeout(() => res(mockRooms), 200));
}

export async function createRoom(owner: string): Promise<Room> {
  const newRoom: Room = {
    id: crypto.randomUUID(),
    code: Math.random().toString(36).substring(8).toUpperCase(),
    owner,
    players: 1,
    maxPlayers: 6,
  };
  mockRooms.push(newRoom);
  return newRoom;
}