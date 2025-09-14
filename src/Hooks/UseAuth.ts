import { useState } from "react";

export function useAuth() {
  const [token, setToken] = useState<string | null>(null);

  const loginUser = async (username: string, password: string) => {
    // Aquí conectas con AuthService
    const { token } = await import("../Services/AuthService").then((m) =>
      m.login(username, password)
    );
    setToken(token);
    localStorage.setItem("token", token);
  };

  return { token, loginUser };
}