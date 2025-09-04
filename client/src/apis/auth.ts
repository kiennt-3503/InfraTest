import { GET, POST, DEL } from "@/lib/api";
import { AuthResponse, LoginBody, SignUpBody, UserInfo } from "@/types/auth";

export const login = (body: LoginBody) =>
  POST<AuthResponse, LoginBody>("/api/v1/login", body);

export const signup = (body: SignUpBody) =>
  POST<AuthResponse, SignUpBody>("/api/v1/sign_up", body);

export const logout = (token: string) =>
  DEL<{ message: string }>("/api/v1/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

export const verifyToken = () => GET<UserInfo>("/api/v1/me");
