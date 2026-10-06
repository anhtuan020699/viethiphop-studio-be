import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiExtraModels,
  ApiResponse,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiTooManyRequestsResponse,
  ApiInternalServerErrorResponse,
  getSchemaPath,
} from '@nestjs/swagger';

// ─────────────────────────────────────────────────────────────────
// Base wrapper schema (success response)
// ─────────────────────────────────────────────────────────────────
const wrapSuccessSchema = <T extends Type>(model: T, isArray = false) => ({
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string' },
    data: isArray
      ? { type: 'array', items: { $ref: getSchemaPath(model) } }
      : { $ref: getSchemaPath(model) },
    meta: {
      type: 'object',
      properties: {
        timestamp: { type: 'string', example: new Date().toISOString() },
      },
    },
  },
});

const paginatedSchema = <T extends Type>(model: T) => ({
  properties: {
    success: { type: 'boolean', example: true },
    message: { type: 'string' },
    data: { type: 'array', items: { $ref: getSchemaPath(model) } },
    meta: {
      type: 'object',
      properties: {
        timestamp: { type: 'string' },
        pagination: {
          type: 'object',
          properties: {
            page: { type: 'number', example: 1 },
            limit: { type: 'number', example: 20 },
            total: { type: 'number', example: 100 },
            totalPages: { type: 'number', example: 5 },
            hasNext: { type: 'boolean', example: true },
            hasPrev: { type: 'boolean', example: false },
          },
        },
      },
    },
  },
});

const errorSchema = (code: string, message: string) => ({
  properties: {
    success: { type: 'boolean', example: false },
    error: {
      type: 'object',
      properties: {
        code: { type: 'string', example: code },
        message: { type: 'string', example: message },
      },
    },
    meta: {
      type: 'object',
      properties: {
        timestamp: { type: 'string' },
        path: { type: 'string' },
      },
    },
  },
});

// ─────────────────────────────────────────────────────────────────
// ✅ 200 OK — với data model
// ─────────────────────────────────────────────────────────────────
export const ApiSuccessResponse = <T extends Type>(
  model: T,
  description = 'Success',
) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      schema: wrapSuccessSchema(model),
    }),
  );

// ─────────────────────────────────────────────────────────────────
// ✅ 201 Created
// ─────────────────────────────────────────────────────────────────
export const ApiCreatedSuccessResponse = <T extends Type>(
  model: T,
  description = 'Created successfully',
) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiCreatedResponse({
      description,
      schema: wrapSuccessSchema(model),
    }),
  );

// ─────────────────────────────────────────────────────────────────
// ✅ 200 OK — list (array)
// ─────────────────────────────────────────────────────────────────
export const ApiListResponse = <T extends Type>(
  model: T,
  description = 'List fetched successfully',
) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      schema: wrapSuccessSchema(model, true),
    }),
  );

// ─────────────────────────────────────────────────────────────────
// ✅ 200 OK — paginated list
// ─────────────────────────────────────────────────────────────────
export const ApiPaginatedResponse = <T extends Type>(
  model: T,
  description = 'Paginated list',
) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiOkResponse({
      description,
      schema: paginatedSchema(model),
    }),
  );

// ─────────────────────────────────────────────────────────────────
// ❌ Common error decorators (bundle dùng cho mọi route)
// ─────────────────────────────────────────────────────────────────

/** 400 Bad Request */
export const ApiBadRequest = (message = 'Validation failed') =>
  ApiBadRequestResponse({
    description: 'Bad Request',
    schema: errorSchema('VALIDATION_ERROR', message),
  });

/** 401 Unauthorized */
export const ApiUnauthorized = (message = 'Unauthorized. Please login') =>
  ApiUnauthorizedResponse({
    description: 'Unauthorized',
    schema: errorSchema('UNAUTHORIZED', message),
  });

/** 403 Forbidden */
export const ApiForbidden = (message = 'Access denied') =>
  ApiForbiddenResponse({
    description: 'Forbidden',
    schema: errorSchema('FORBIDDEN', message),
  });

/** 404 Not Found */
export const ApiNotFound = (resource = 'Resource') =>
  ApiNotFoundResponse({
    description: 'Not Found',
    schema: errorSchema('NOT_FOUND', `${resource} not found`),
  });

/** 429 Too Many Requests */
export const ApiTooManyRequests = () =>
  ApiTooManyRequestsResponse({
    description: 'Too Many Requests',
    schema: errorSchema('TOO_MANY_REQUESTS', 'Rate limit exceeded'),
  });

/** 500 Internal Server Error */
export const ApiServerError = () =>
  ApiInternalServerErrorResponse({
    description: 'Internal Server Error',
    schema: errorSchema('INTERNAL_SERVER_ERROR', 'Internal server error'),
  });

// ─────────────────────────────────────────────────────────────────
// 🎁 Bundle decorators — gom nhóm cho tiện
// ─────────────────────────────────────────────────────────────────

/** Bundle: 401 + 403 — dùng cho routes cần auth */
export const ApiAuthErrors = () =>
  applyDecorators(ApiUnauthorized(), ApiForbidden());

/** Bundle: 400 + 401 + 403 — dùng cho mutation routes */
export const ApiMutationErrors = () =>
  applyDecorators(ApiBadRequest(), ApiUnauthorized(), ApiForbidden());

/** Bundle: 400 + 401 + 403 + 404 — dùng cho update/delete */
export const ApiCrudErrors = () =>
  applyDecorators(
    ApiBadRequest(),
    ApiUnauthorized(),
    ApiForbidden(),
    ApiNotFound(),
  );
