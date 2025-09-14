import APIAuth from "../API/APIAuth";

export async function fetchRooms() {
  const res = await fetch(`${APIAuth}/rooms`);
  return res.json();
}