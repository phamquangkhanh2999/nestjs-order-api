export interface ApiResponse<T = unknown> {
  code: number;
  data: T;
  description: string;
  error_code: number;
  message: string;
  success: boolean;
  timestamp: number;
}
