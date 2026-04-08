export interface ContactDto {
  contactsId: number;
  userId: number;
  name: string;
  type: string;
  email: string;
  phone: string;
  usuarioNombre: string;
}

export interface ContactCreateDto {
  userId: number;
  name: string;
  type: string;
  email: string;
  phone: string;
}

export interface ContactUpdateDto {
  contactsId: number;
  userId: number;
  name: string;
  type: string;
  email: string;
  phone: string;
}
