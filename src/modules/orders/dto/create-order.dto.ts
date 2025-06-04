import { IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateOrderDto {
  @IsString()
  name: string;

  @IsString()
  phone: string;

  @IsString()
  @IsOptional()
  message: string;

  @IsString()
  @IsOptional()
  state: string;

  @IsString()
  @IsOptional()
  district: string;

  @IsString()
  @IsOptional()
  ward: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  product_note: string;

  @IsNumber()
  @IsOptional()
  quantity: number; // 11. Số lượng

  @IsString()
  @IsOptional()
  utm_source?: string; // 15.

  @IsString()
  @IsOptional()
  form_url?: string; // form URL

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
