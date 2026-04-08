export interface TransaccionDto {
  transaccionId: number;
  accountId: number;
  categoryId: number;
  contactsId: number | null;
  monto: number;
  moneda: string;
  descripcion: string;
  fecha: string;
  cuentaNombre: string;
  categoriaNombre: string;
  contactoNombre: string | null;
  tipoOperacion: string;
}

export interface TransaccionCreateDto {
  accountId: number;
  categoryId: number;
  contactsId?: number | null;
  monto: number;
  moneda: string;
  descripcion: string;
  fecha: string;
}

export interface TransaccionUpdateDto {
  transaccionId: number;
  accountId: number;
  categoryId: number;
  contactsId?: number | null;
  monto: number;
  moneda: string;
  descripcion: string;
  fecha: string;
}
