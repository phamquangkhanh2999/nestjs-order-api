import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { OrdersService } from './orders.service';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  @ApiOperation({
    summary: 'Tạo đơn hàng mới',
    description: `
    Tạo một đơn hàng mới với thông tin chi tiết:
    - Thông tin khách hàng
    - Danh sách sản phẩm và số lượng
    - Địa chỉ giao hàng
    - Phương thức thanh toán
    - Ghi chú đặc biệt (tùy chọn)
  `,
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Thông tin đơn hàng cần tạo',
    examples: {
      singleProduct: {
        summary: 'Đơn hàng đơn giản',
        description: 'Ví dụ về đơn hàng với một sản phẩm',
        value: {
          name: 'Nguyen Van A',
          phone: '0909123456',
          message: 'Tôi cần tư vấn về sản phẩm',
          state: 'Hà Nội',
          district: 'Ba Đình',
          ward: 'Phúc Xá',
          address: '123 Phố Huế',
          product_note: 'Màu đen, giao hàng nhanh',
          quantity: 2,
          utm_source: 'google',
          form_url: 'https://example.com/form',
          utm_medium: 'cpc',
          utm_campaign: 'spring_sale',
          utm_content: 'banner_top',
          utm_term: 'giay_the_thao',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'Đơn hàng được tạo thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            orderNumber: { type: 'string', example: 'ORD-2024-000001' },
            status: { type: 'string', example: 'PENDING' },
            name: { type: 'string', example: 'Nguyen Van A' },
            phone: { type: 'string', example: '0909123456' },
            message: { type: 'string', example: 'Tôi cần tư vấn về sản phẩm' },
            state: { type: 'string', example: 'Hà Nội' },
            district: { type: 'string', example: 'Ba Đình' },
            ward: { type: 'string', example: 'Phúc Xá' },
            address: { type: 'string', example: '123 Phố Huế' },
            product_note: {
              type: 'string',
              example: 'Màu đen, giao hàng nhanh',
            },
            quantity: { type: 'number', example: 2 },
            utm_source: { type: 'string', example: 'google' },
            utm_medium: { type: 'string', example: 'cpc' },
            form_url: { type: 'string', example: 'https://example.com/form' },
            utm_campaign: { type: 'string', example: 'spring_sale' },
            utm_content: { type: 'string', example: 'banner_top' },
            utm_term: { type: 'string', example: 'giay_the_thao' },
            createdAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
            updatedAt: { type: 'string', example: '2024-01-15T10:30:00Z' },
          },
        },
        message: { type: 'string', example: 'Đơn hàng đã được tạo thành công' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu không hợp lệ',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'name should not be empty',
            'phone must be a valid phone number',
            'message should not be empty',
            'state should not be empty',
            'district should not be empty',
            'ward should not be empty',
            'address should not be empty',
            'product_note should not be empty',
            'quantity must be a number',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async create(@Body() createOrderDto: CreateOrderDto) {
    return this.ordersService.createOrder(createOrderDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Lấy danh sách đơn hàng',
    description: `
      Lấy danh sách đơn hàng với các tùy chọn:
      - Phân trang và sắp xếp
      - Lọc theo trạng thái, khách hàng, ngày tháng
      - Tìm kiếm theo số đơn hàng
      - Lọc theo khoảng giá tiền
    `,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Lấy danh sách thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  orderNumber: { type: 'string' },
                  status: { type: 'string' },
                  customerName: { type: 'string' },
                  customerPhone: { type: 'string' },
                  totalAmount: { type: 'number' },
                  createdAt: { type: 'string' },
                },
              },
            },
            pagination: {
              type: 'object',
              properties: {
                page: { type: 'number', example: 1 },
                pageSize: { type: 'number', example: 10 },
                total: { type: 'number', example: 100 },
                totalPages: { type: 'number', example: 10 },
              },
            },
          },
        },
        message: {
          type: 'string',
          example: 'Lấy danh sách đơn hàng thành công',
        },
      },
    },
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Số trang (bắt đầu từ 1)',
    example: 1,
    schema: { default: 1, minimum: 1 },
  })
  @ApiQuery({
    name: 'pageSize',
    required: false,
    type: Number,
    description: 'Số lượng đơn hàng trên mỗi trang (tối đa 100)',
    example: 20,
    schema: { default: 10, minimum: 1, maximum: 100 },
  })
  @ApiQuery({
    name: 'name',
    required: false,
    type: String,
    description: 'Tên khách hàng để lọc đơn hàng',
  })
  @ApiQuery({
    name: 'phone',
    required: false,
    type: String,
    description: 'Số điện thoại khách hàng để lọc đơn hàng',
  })
  async findAll(@Query() filterDto: FilterOrderDto) {
    return this.ordersService.getOrders(filterDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Xóa đơn hàng',
    description:
      'Xóa một đơn hàng theo ID. Chỉ có thể xóa đơn hàng chưa được xử lý.',
  })
  @ApiParam({
    name: 'id',
    description: 'ID của đơn hàng cần xóa',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'Đơn hàng đã được xóa thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        message: { type: 'string', example: 'Đơn hàng đã được xóa thành công' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy đơn hàng với ID đã cho',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Đơn hàng không tồn tại' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description:
      'Yêu cầu không hợp lệ, có thể do ID không hợp lệ hoặc đơn hàng đã được xử lý',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        message: { type: 'string', example: 'Yêu cầu không hợp lệ' },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async remove(@Param('id') id: string) {
    return this.ordersService.deleteOrder(id);
  }

  @Post('update/:id')
  @ApiOperation({
    summary: 'Cập nhật đơn hàng',
    description: `
      Cập nhật thông tin đơn hàng theo ID. Chỉ có thể cập nhật các trường chưa được xử lý.
    `,
  })
  @ApiParam({
    name: 'id',
    description: 'ID của đơn hàng cần cập nhật',
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @ApiBody({
    type: CreateOrderDto,
    description: 'Thông tin đơn hàng cần cập nhật',
    examples: {
      updateOrder: {
        summary: 'Cập nhật đơn hàng',
        description: 'Ví dụ về cập nhật thông tin đơn hàng',
        value: {
          name: 'Nguyen Van B',
          phone: '0909123457',
          message: 'Cập nhật thông tin sản phẩm',
          state: 'Hà Nội',
          district: 'Ba Đình',
          ward: 'Phúc Xá',
          address: '456 Phố Huế',
          product_note: 'Màu đỏ, giao hàng nhanh',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Đơn hàng được cập nhật thành công',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: true },
        data: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              example: '123e4567-e89b-12d3-a456-426614174000',
            },
            orderNumber: { type: 'string', example: 'ORD-2024-000001' },
            status: { type: 'string', example: 'PENDING' },
            name: { type: 'string', example: 'Nguyen Van B' },
            phone: { type: 'string', example: '0909123457' },
            updatedAt: { type: 'string', example: '2024-01-15T11:30:00Z' },
          },
        },
        message: {
          type: 'string',
          example: 'Đơn hàng đã được cập nhật thành công',
        },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Không tìm thấy đơn hàng với ID đã cho',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 404 },
        message: { type: 'string', example: 'Đơn hàng không tồn tại' },
        error: { type: 'string', example: 'Not Found' },
      },
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Dữ liệu không hợp lệ hoặc đơn hàng đã được xử lý',
    schema: {
      type: 'object',
      properties: {
        success: { type: 'boolean', example: false },
        statusCode: { type: 'number', example: 400 },
        message: {
          type: 'array',
          items: { type: 'string' },
          example: [
            'phone must be a valid phone number',
            'Không thể cập nhật đơn hàng đã được xử lý',
          ],
        },
        error: { type: 'string', example: 'Bad Request' },
      },
    },
  })
  async update(
    @Param('id') id: string,
    @Body() updateOrderDto: CreateOrderDto,
  ) {
    return this.ordersService.updateOrder(id, updateOrderDto);
  }
}
