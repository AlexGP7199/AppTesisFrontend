export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface RefreshTokenRequest {
  token: string;
  refreshToken: string;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  tokenExpiration: string;
  userId: number;
  fullName: string;
  email: string;
}
