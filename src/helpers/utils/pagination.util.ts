import { DEFAULT_PAGE, DEFAULT_PAGE_SIZE } from '../constants/app.constant';

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

/**
 * Build pagination metadata for list responses
 */
export function buildPaginationMeta(
  page: number = DEFAULT_PAGE,
  limit: number = DEFAULT_PAGE_SIZE,
  total: number = 0,
): PaginationMeta {
  const totalPages = Math.ceil(total / limit);
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

/**
 * Calculate skip value for Prisma pagination
 */
export function calcSkip(page: number, limit: number): number {
  return (page - 1) * limit;
}
