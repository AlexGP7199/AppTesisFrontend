export interface UsuarioDto {
  userId: number;
  fullName: string;
  email: string;
}

export interface UsuarioCreateDto {
  fullName: string;
  email: string;
  password: string;
}

export interface UsuarioUpdateDto {
  userId: number;
  fullName: string;
  email: string;
}
