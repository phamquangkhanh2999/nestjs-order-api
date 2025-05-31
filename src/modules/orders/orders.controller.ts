import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { BaseResponse } from '../../common/interfaces/base-response.interface';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { Order } from './entities/order.entity';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(
    @Body() dto: CreateOrderDto,
    @Res() res: Response,
  ): Promise<Response<BaseResponse<Order>>> {
    try {
      const order = await this.ordersService.createOrder(dto);
      return res.status(HttpStatus.CREATED).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error: unknown) {
      let message = 'Failed to create order';
      if (error instanceof Error) {
        message = error.message;
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      });
    }
  }

  @Get()
  async findAll(
    @Query() filter: FilterOrderDto,
    @Res() res: Response,
  ): Promise<Response<BaseResponse<Order[]>>> {
    try {
      const orders = await this.ordersService.getOrders(filter);
      return res.status(HttpStatus.OK).json({
        success: true,
        message: 'Orders fetched successfully',
        data: orders,
      });
    } catch (error: unknown) {
      let message = 'Failed to fetch orders';
      if (error instanceof Error) {
        message = error.message;
      }
      return res.status(HttpStatus.BAD_REQUEST).json({
        success: false,
        message,
      });
    }
  }
}
