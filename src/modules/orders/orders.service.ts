import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ApiResponse } from '../../common/interfaces/api-response.interface';
import { supabase } from '../../config/supabase.client';
import { buildDateFilter } from '../../utils/function';
import { ResponseWrapper } from '../../utils/response-wrapper.util';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  async createOrder(dto: CreateOrderDto): Promise<ApiResponse<Order | null>> {
    try {
      const result = await supabase
        .from('orders')
        .insert([dto])
        .select()
        .single();
      const data = result.data as Order | null;
      const error = result.error;

      if (error) {
        return ResponseWrapper.error<null>(
          'Tạo đơn hàng thất bại',
          `Failed to create order: ${error.message}`,
          HttpStatus.BAD_REQUEST,
          1001,
          null,
        );
      }

      return ResponseWrapper.success(
        data as Order,
        'Tạo đơn hàng thành công',
        'Order created successfully',
        HttpStatus.CREATED,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        return ResponseWrapper.error<null>(
          'Tạo đơn hàng thất bại',
          error.message,
          error.getStatus(),
          1001,
          null,
        );
      }
      return ResponseWrapper.error<null>(
        'Lỗi hệ thống khi tạo đơn hàng',
        'Internal server error while creating order',
        HttpStatus.INTERNAL_SERVER_ERROR,
        1000,
        null,
      );
    }
  }

  async getOrders(filter: FilterOrderDto): Promise<
    ApiResponse<{
      content: Order[];
      total: number;
      page: number;
      pageSize: number;
      totalPages: number;
      hasNext: boolean;
      hasPrevious: boolean;
    } | null>
  > {
    try {
      const { name, phone, created_at, page = 1, pageSize = 10 } = filter;
      // Validate pagination parameters
      if (page < 1 || pageSize < 1) {
        return ResponseWrapper.error<null>(
          'Tham số phân trang không hợp lệ',
          'Page and pageSize must be positive numbers',
          HttpStatus.BAD_REQUEST,
          2001,
          null,
        );
      }
      // Tính offset cho pagination
      const offset = (page - 1) * pageSize;

      let query = supabase.from('orders').select('*', { count: 'exact' });
      // Apply filters
      if (name?.trim()) {
        query = query.ilike('name', `%${name.trim()}%`);
      }

      if (phone?.trim()) {
        query = query.ilike('phone', `%${phone.trim()}%`);
      }

      if (created_at) {
        const dateFilter = buildDateFilter(created_at);
        if (!dateFilter) {
          return ResponseWrapper.error<null>(
            'Định dạng ngày không hợp lệ',
            'Invalid date format',
            HttpStatus.BAD_REQUEST,
            2002,
            null,
          );
        }
        query = query
          .gte('created_at', dateFilter.startDate)
          .lte('created_at', dateFilter.endDate);
      }
      // Apply sorting and pagination
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(offset, offset + pageSize - 1);

      if (error) {
        return ResponseWrapper.error<null>(
          'Lấy danh sách đơn hàng thất bại',
          `Failed to get orders: ${error.message}`,
          HttpStatus.BAD_REQUEST,
          2003,
          null,
        );
      }
      return ResponseWrapper.paginatedSuccess(
        data as Order[],
        count || 0,
        page,
        pageSize,
        'Lấy danh sách đơn hàng thành công',
        'Orders retrieved successfully',
      );
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (_error) {
      return ResponseWrapper.error<null>(
        'Lỗi hệ thống khi lấy danh sách đơn hàng',
        'Internal server error while getting orders',
        HttpStatus.INTERNAL_SERVER_ERROR,
        2000,
        null,
      );
    }
  }
  // Xóa đơn hàng (soft delete hoặc hard delete)
  async deleteOrder(orderId: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from('orders')
        .delete()
        .eq('id', orderId);

      if (error) {
        return ResponseWrapper.error<null>(
          'Xóa đơn hàng thất bại',
          `Failed to delete order: ${error.message}`,
          HttpStatus.BAD_REQUEST,
          3001,
          null,
        );
      }

      return ResponseWrapper.success(
        null,
        'Xóa đơn hàng thành công',
        'Order deleted successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        return ResponseWrapper.error<null>(
          'Xóa đơn hàng thất bại',
          error.message,
          error.getStatus(),
          3001,
          null,
        );
      }
      return ResponseWrapper.error<null>(
        'Lỗi hệ thống khi xóa đơn hàng',
        'Internal server error while deleting order',
        HttpStatus.INTERNAL_SERVER_ERROR,
        3000,
        null,
      );
    }
  }
  // update
  async updateOrder(
    id: string,
    updateData: Partial<CreateOrderDto>,
  ): Promise<ApiResponse<Order | null>> {
    try {
      const result = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      const data = result.data as Order | null;
      const error = result.error;
      if (error) {
        return ResponseWrapper.error<null>(
          'Cập nhật đơn hàng thất bại',
          `Failed to update order: ${error.message}`,
          HttpStatus.BAD_REQUEST,
          4001,
          null,
        );
      }

      return ResponseWrapper.success(
        data as Order,
        'Cập nhật đơn hàng thành công',
        'Order updated successfully',
        HttpStatus.OK,
      );
    } catch (error) {
      if (error instanceof HttpException) {
        return ResponseWrapper.error<null>(
          'Cập nhật đơn hàng thất bại',
          error.message,
          error.getStatus(),
          4001,
          null,
        );
      }
      return ResponseWrapper.error<null>(
        'Lỗi hệ thống khi cập nhật đơn hàng',
        'Internal server error while updating order',
        HttpStatus.INTERNAL_SERVER_ERROR,
        4000,
        null,
      );
    }
  }
}
