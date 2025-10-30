export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  code?: string;
}

export interface ErrorResponse {
  message: string;
  status: number;
  error?: string;
}