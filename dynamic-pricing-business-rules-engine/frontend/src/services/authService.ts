import api from "../api/axios";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
}

export const login = async (
  credentials: LoginRequest,
): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>(
    "/auth/login",
    credentials,
  );

  return response.data;
};

export const logout = (): void => {
  localStorage.removeItem("access_token");
  sessionStorage.removeItem("access_token");
};


