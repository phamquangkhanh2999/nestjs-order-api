import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), OrdersModule],
})
export class AppModule {}
