export interface BaseResponse<T> {
  isSuccess: boolean;
  data: T;
  message: string;
  errors: string[] | null;
}

export interface PagedResponse<T> {
  items: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PaginationParams {
  pageNumber: number;
  pageSize: number;
  isDescending?: boolean;
}
