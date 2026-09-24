import axios from 'axios';

const AUTH_API_URL = 'https://dummyjson.com/auth/login';

export interface LoginRequest {
  username: string;
  password: string;
  expiresInMins?: number;
}

export interface LoginResponse {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  gender: string;
  image: string;
  accessToken: string;
  refreshToken: string;
}

export const loginUser = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  const response = await axios.post<LoginResponse>(
    AUTH_API_URL,
    {
      username: credentials.username,
      password: credentials.password,
      expiresInMins: credentials.expiresInMins ?? 30,
    }
  );

  return response.data;
};