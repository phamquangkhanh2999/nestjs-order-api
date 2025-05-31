import { IsString } from 'class-validator';

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
}
