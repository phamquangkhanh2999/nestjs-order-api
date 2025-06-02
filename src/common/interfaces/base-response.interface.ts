export interface BaseResponse<T> {
  success: boolean;
  message: string;
  data?: T;
}
export interface PaginatedResponse<T> {
  content: T[];
  total: number;
  page: number;
  pageSize: number;
}
