export type LoginUser = {
  EMAIL: string;
  NOMBRE: string;
  APELLIDO: string;
  FEC_NACIMIENTO: string;
  GENERO: string;
  NICK: string | null;
  EXPERIENCIA: string;
  SUBSCRITO: number;
};

export type AuthApiResponse = {
  code: number;
  msgrsp: string;
  token?: string;
  accessToken?: string;
  accessTokenExpiresAt?: string;
  refreshToken?: string;
  refreshTokenExpiresAt?: string;
  sessionId?: number;
  usuario?: LoginUser;
  usuarios?: LoginUser[];
};

export type AuthSession = {
  accessToken: string;
  accessTokenExpiresAt: string;
  refreshToken: string;
  refreshTokenExpiresAt: string;
  sessionId?: number;
  user: LoginUser;
};

export type RegisterPayload = {
  email: string;
  password: string;
  nombre: string;
  apellido: string;
  fecNacimiento: string;
  genero: 'M' | 'F' | 'O';
  nick: string;
  subscrito?: boolean;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type PushTokenPayload = {
  pushToken: string;
};