export async function login(username: string, password: string) {
  // Aquí harías fetch a tu backend: POST /auth/login
  // Por ahora simulemos un JWT
  return {
    token: "fake-jwt-token-" + Date.now(),
    user: { username },
  };
}