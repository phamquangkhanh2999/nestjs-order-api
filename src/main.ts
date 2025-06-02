// src/main.ts
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
dotenv.config();

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription(
      `
      ## Mô tả
      API quản lý hệ thống thương mại điện tử bao gồm:
      - Quản lý người dùng và xác thực
      - Quản lý sản phẩm và danh mục
      - Quản lý đơn hàng và thanh toán
      - Quản lý kho hàng và vận chuyển
      
      ## Xác thực
      API sử dụng JWT Bearer Token để xác thực. Thêm token vào header:
      \`Authorization: Bearer <your-token>\`
      
      ## Mã lỗi thường gặp
      - 400: Bad Request - Dữ liệu không hợp lệ
      - 401: Unauthorized - Chưa xác thực
      - 403: Forbidden - Không có quyền truy cập
      - 404: Not Found - Không tìm thấy tài nguyên
      - 422: Unprocessable Entity - Lỗi validation
      - 500: Internal Server Error - Lỗi server
    `,
    )
    .setVersion('1.0.0')
    // .setContact(
    //   'API Support',
    //   'https://your-website.com',
    //   'support@your-domain.com',
    // )
    .setLicense('MIT License', 'https://opensource.org/licenses/MIT')
    .addServer('http://localhost:3000', 'Development Server')
    .addServer('https://nestjs-order-api.onrender.com', 'Staging Server')
    // .addServer('https://api.your-domain.com', 'Production Server')
    // .addBearerAuth(
    //   {
    //     type: 'http',
    //     scheme: 'bearer',
    //     bearerFormat: 'JWT',
    //     name: 'JWT',
    //     description: 'Enter JWT token',
    //     in: 'header',
    //   },
    //   'JWT-auth',
    // )
    .addApiKey(
      {
        type: 'apiKey',
        name: 'X-API-Key',
        in: 'header',
        description: 'API Key for external integrations',
      },
      'API-Key',
    )
    // .addTag('auth', 'Xác thực và phân quyền')
    // .addTag('users', 'Quản lý người dùng')
    // .addTag('products', 'Quản lý sản phẩm')
    // .addTag('categories', 'Quản lý danh mục')
    .addTag('orders', 'Quản lý đơn hàng')
    // .addTag('payments', 'Thanh toán')
    // .addTag('inventory', 'Quản lý kho')
    // .addTag('shipping', 'Vận chuyển')
    // .addTag('analytics', 'Báo cáo và thống kê')
    .build();
  const document = SwaggerModule.createDocument(app, config, {
    operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
    deepScanRoutes: true,
  });
  // Custom CSS for Swagger UI
  const customCss = `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #3b82f6; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 20px; border-radius: 8px; }
    .swagger-ui .info .description p { color: #64748b; }
    .swagger-ui .btn.authorize { background-color: #10b981; border-color: #10b981; }
    .swagger-ui .btn.authorize:hover { background-color: #059669; }
  `;

  SwaggerModule.setup('api-docs', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
      displayRequestDuration: true,
      filter: true,
      showExtensions: true,
      showCommonExtensions: true,
      defaultModelsExpandDepth: 2,
      defaultModelExpandDepth: 2,
      docExpansion: 'list',
      deepLinking: true,
      displayOperationId: false,
      tryItOutEnabled: true,
    },
    customCss,
    customSiteTitle: 'E-Commerce API Documentation',
    customfavIcon: '/favicon.ico',
  });
  await app.listen(3000);
  console.log(`🚀 Application is running on: http://localhost:3000`);
  console.log(`📚 Swagger UI is available at: http://localhost:3000/api-docs`);
}
bootstrap();
