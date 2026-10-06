// ========================
// Auth
// ========================
export const MSG_LOGIN_SUCCESS = 'Login successful';
export const MSG_LOGOUT_SUCCESS = 'Logout successful';
export const MSG_REGISTER_SUCCESS = 'Registration successful';
export const MSG_REFRESH_SUCCESS = 'Token refreshed successfully';
export const MSG_INVALID_CREDENTIALS = 'Invalid email or password';
export const MSG_USER_ALREADY_EXISTS = 'User with this email already exists';
export const MSG_UNAUTHORIZED = 'Unauthorized. Please login to continue';
export const MSG_REFRESH_TOKEN_INVALID = 'Refresh token is invalid or expired';
export const MSG_ACCESS_DENIED = 'Access denied. Insufficient permissions';

// ========================
// Common
// ========================
export const MSG_NOT_FOUND = (resource: string) => `${resource} not found`;
export const MSG_CREATED = (resource: string) => `${resource} created successfully`;
export const MSG_UPDATED = (resource: string) => `${resource} updated successfully`;
export const MSG_DELETED = (resource: string) => `${resource} deleted successfully`;
