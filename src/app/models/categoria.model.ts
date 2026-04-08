export interface CategoriaDto {
  categoryId: number;
  name: string;
  operationType: string;
}

export interface CategoriaCreateDto {
  name: string;
  operationType: string;
}

export interface CategoriaUpdateDto {
  categoryId: number;
  name: string;
  operationType: string;
}
