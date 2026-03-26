import { Login, LoginDto } from "@/types/login";
import { api } from "./api";
import { logoutFront } from "@/utils/auth";

export const authLogin = async ({ email, password }: LoginDto) => {
  const response = await api.post<Login>(
    "/auth/v1/login",
    { email, password },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response;
};

export const logout = async () => {
  const response = await api.post<void>('/auth/v1/logout');
  logoutFront();
  return response;
};