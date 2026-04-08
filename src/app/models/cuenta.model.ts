export interface CuentaDto {
  accountId: number;
  userId: number;
  accountName: string;
  currency: string;
  usuarioNombre: string;
}

export interface CuentaCreateDto {
  userId: number;
  accountName: string;
  currency: string;
}

export interface CuentaUpdateDto {
  accountId: number;
  userId: number;
  accountName: string;
  currency: string;
}
