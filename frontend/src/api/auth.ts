import type { AuthResponse, RegisterPayload, User } from "../types";
import { api } from "./client";

export async function loginRequest(username: string, password: string) {
  const { data } = await api.post<AuthResponse>("/auth/token/", { username, password });
  return data;
}

export async function refreshAccessToken(refreshToken: string) {
  const { data } = await api.post<AuthResponse>("/auth/token/refresh/", { refresh: refreshToken });
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get<User>("/auth/me/");
  return data;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await api.post<User>("/auth/register/", payload);
  return data;
}
