import apiAuth from "../../API/APIAuth";
import { User } from "../Models/userModel";
import { LoginForm } from "../Models/loginModel";
import { cookieUtils } from "../../Utils/Cookies";

export async function createUser(LoginForm: LoginForm): Promise<User> {
    const response = await apiAuth.post(`/auth/register`, LoginForm);
    return response.data;
}

export async function loginUser(LoginForm: LoginForm): Promise<User> {
    const response = await apiAuth.post("/auth/login", LoginForm);
    return response.data;
}

export async function logoutUser(): Promise<void> {
    try {
        await apiAuth.post(`/auth/logout`);
    } finally {
        // Limpiar cookies del frontend (por si acaso)
        cookieUtils.removeToken()
    }
}