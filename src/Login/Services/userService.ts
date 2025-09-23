import apiAuth from "../../API/APIAuth";
import { User } from "../Models/userModel";
import { LoginForm } from "../Models/loginModel";

export async function createUser(LoginForm: LoginForm): Promise<User> {
  const { data } = await apiAuth.post(`/auth/register`, LoginForm);
  return data;
}

export async function loginUser(LoginForm: LoginForm): Promise<User> {
  const { data } = await apiAuth.post("/auth/login", LoginForm);
  return data;
}

export async function logoutUser(): Promise<void> {
  await apiAuth.post(`/auth/logout`); // el backend limpia las cookies
}
