import { HttpStatus } from '@nestjs/common';
import { ApiResponse } from '../common/interfaces/api-response.interface';

export class ResponseWrapper {
  static success<T>(
    data: T,
    message: string = 'Thành công',
    description: string = 'Request processed successfully',
    code: number = HttpStatus.OK,
  ): ApiResponse<T> {
    return {
      code,
      data,
      description,
      error_code: 0,
      message,
      success: true,
      timestamp: Date.now(),
    };
  }

  static error<T = null>(
    message: string = 'Có lỗi xảy ra',
    description: string = 'An error occurred',
    code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    error_code: number = 1,
    data: T = null as T,
  ): ApiResponse<T> {
    return {
      code,
      data,
      description,
      error_code,
      message,
      success: false,
      timestamp: Date.now(),
    };
  }

  // Alternative method for errors without data
  static errorWithoutData(
    message: string = 'Có lỗi xảy ra',
    description: string = 'An error occurred',
    code: number = HttpStatus.INTERNAL_SERVER_ERROR,
    error_code: number = 1,
  ): ApiResponse<null> {
    return {
      code,
      data: null,
      description,
      error_code,
      message,
      success: false,
      timestamp: Date.now(),
    };
  }

  // Method for validation errors with specific error details
  static validationError<T = Record<string, string[]>>(
    validationErrors: T,
    message: string = 'Dữ liệu không hợp lệ',
    description: string = 'Validation failed',
    code: number = HttpStatus.BAD_REQUEST,
    error_code: number = 400,
  ): ApiResponse<T> {
    return {
      code,
      data: validationErrors,
      description,
      error_code,
      message,
      success: false,
      timestamp: Date.now(),
    };
  }

  // Method for paginated success responses
  static paginatedSuccess<T>(
    content: T[],
    total: number,
    page: number,
    pageSize: number,
    message: string = 'Lấy dữ liệu thành công',
    description: string = 'Data retrieved successfully',
    code: number = HttpStatus.OK,
  ): ApiResponse<{
    content: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
  }> {
    const totalPages = Math.ceil(total / pageSize);
    const hasNext = page < totalPages;
    const hasPrevious = page > 1;

    return {
      code,
      data: {
        content,
        total,
        page,
        pageSize,
        totalPages,
        hasNext,
        hasPrevious,
      },
      description,
      error_code: 0,
      message,
      success: true,
      timestamp: Date.now(),
    };
  }
}
