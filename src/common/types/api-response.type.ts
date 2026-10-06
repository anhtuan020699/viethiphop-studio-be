export interface ApiResponse<T = null> {
  success: boolean;
  message?: string;
  data?: T;
  meta?: Record<string, any>;
}

export interface ApiErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    timestamp: string;
    path?: string;
  };
}
