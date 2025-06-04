import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  message: string;

  @IsString()
  state: string;

  @IsString()
  district: string;

  @IsString()
  ward: string;

  @IsString()
  address: string;

  @IsString()
  product_note: string;

  @IsNumber()
  @IsOptional()
  quantity: number; // 11. Số lượng

  @IsString()
  @IsOptional()
  utm_source?: string; // 15.

  @IsString()
  @IsOptional()
  utm_medium?: string; // 16.

  @IsString()
  @IsOptional()
  utm_campaign?: string; // 17.

  @IsString()
  @IsOptional()
  utm_content?: string; // 18.

  @IsString()
  @IsOptional()
  utm_term?: string; // 19.
}
