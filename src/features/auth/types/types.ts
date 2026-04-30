export type LoginUser = {
  EMAIL: string;
  NOMBRE: string;
  APELLIDO: string;
  FEC_NACIMIENTO: string;
  GENERO: string;
  NICK: string | null;
  EXPERIENCIA: string;
  SUBSCRITO: number;

  /**
   * Campos físicos opcionales porque el backend puede no devolverlos todavía.
   * Cuando actualices la API, idealmente deberían venir desde TB_USUARIOS
   * o desde una tabla separada de perfil físico.
   */
  PESO_KG?: number | string | null;
  ALTURA_CM?: number | string | null;
  PESO_OBJETIVO_KG?: number | string | null;
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

  /**
   * Datos necesarios para dashboard de peso, calorías estimadas,
   * IMC inicial, progreso corporal y métricas de evolución.
   */
  pesoKg: number;
  alturaCm: number;
  pesoObjetivoKg?: number | null;
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type PushTokenPayload = {
  pushToken: string;
};