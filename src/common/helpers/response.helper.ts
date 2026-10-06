import { ApiResponse } from '../types/api-response.type';
import { PaginationMeta } from '@helpers/utils/pagination.util';

/**
 * Base response helper — dùng trong Controller/Service để tạo response chuẩn
 *
 * @example
 * return ResponseHelper.success(user, 'Login successful');
 * return ResponseHelper.paginated(users, paginationMeta);
 * return ResponseHelper.noContent();
 */
export class ResponseHelper {
  // ─────────────────────────────────────────────────
  // Success — có data
  // ─────────────────────────────────────────────────
  static success<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      ...(message && { message }),
      data,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  // ─────────────────────────────────────────────────
  // Success — không có data (204-style)
  // ─────────────────────────────────────────────────
  static noContent(message?: string): ApiResponse<null> {
    return {
      success: true,
      ...(message && { message }),
      data: null,
      meta: { timestamp: new Date().toISOString() },
    };
  }

  // ─────────────────────────────────────────────────
  // Paginated list
  // ─────────────────────────────────────────────────
  static paginated<T>(
    data: T[],
    pagination: PaginationMeta,
    message?: string,
  ): ApiResponse<T[]> {
    return {
      success: true,
      ...(message && { message }),
      data,
      meta: {
        timestamp: new Date().toISOString(),
        pagination,
      },
    };
  }

  // ─────────────────────────────────────────────────
  // Created (201)
  // ─────────────────────────────────────────────────
  static created<T>(data: T, message?: string): ApiResponse<T> {
    return {
      success: true,
      ...(message && { message }),
      data,
      meta: { timestamp: new Date().toISOString() },
    };
  }
}
