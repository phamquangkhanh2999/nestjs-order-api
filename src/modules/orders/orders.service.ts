import { Injectable } from '@nestjs/common';
import { supabase } from '../../config/supabase.client';
import { CreateOrderDto } from './dto/create-order.dto';
import { FilterOrderDto } from './dto/filter-order.dto';
import { Order } from './entities/order.entity';

@Injectable()
export class OrdersService {
  async createOrder(dto: CreateOrderDto): Promise<Order[]> {
    const { data, error } = await supabase
      .from('orders')
      .insert([dto])
      .select();

    if (error) throw new Error(error.message);
    return data as Order[];
  }

  async getOrders(filter: FilterOrderDto): Promise<Order[]> {
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (filter.fromDate) {
      query = query.gte('created_at', filter.fromDate);
    }

    if (filter.toDate) {
      query = query.lte('created_at', filter.toDate);
    }

    const { data, error } = await query;

    if (error) throw new Error(error.message);
    return data as Order[];
  }
}
