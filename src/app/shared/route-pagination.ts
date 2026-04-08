import { ParamMap } from '@angular/router';

export interface RoutePaginationState {
  pageNumber: number;
  pageSize: number;
  isDescending: boolean;
}

function parsePositiveInt(value: string | null, fallback: number): number {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseBoolean(value: string | null, fallback: boolean): boolean {
  if (value === null) {
    return fallback;
  }

  const normalized = value.trim().toLowerCase();
  if (['true', '1', 'yes'].includes(normalized)) {
    return true;
  }

  if (['false', '0', 'no'].includes(normalized)) {
    return false;
  }

  return fallback;
}

export function readPaginationFromRoute(
  params: ParamMap,
  fallback: RoutePaginationState
): RoutePaginationState {
  const pageNumber = parsePositiveInt(
    params.get('PageNumber') ?? params.get('page') ?? params.get('pageNumber'),
    fallback.pageNumber
  );
  const pageSize = parsePositiveInt(
    params.get('PageSize') ?? params.get('size') ?? params.get('pageSize'),
    fallback.pageSize
  );
  const isDescending = parseBoolean(
    params.get('IsDescending') ?? params.get('descending') ?? params.get('isDescending'),
    fallback.isDescending
  );

  return { pageNumber, pageSize, isDescending };
}
