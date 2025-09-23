import apiAuth from "../../API/APIAuth";

export interface ValidateResponse {
  valid: boolean;
  username?: string;
  message?: string;
}

export interface UserResponse {
  username: string;
}

export async function validate(): Promise<ValidateResponse> {
  const { data } = await apiAuth.get<ValidateResponse>("/auth/validate");
  return data;
}

export async function getUser(): Promise<UserResponse> {
  const { data } = await apiAuth.get<UserResponse>("/auth/user");
  return data;
}
