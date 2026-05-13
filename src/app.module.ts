import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalInterceptor } from './common/interceptors/global.interceptor';
import { UserModule } from './user/user.module';
import { UserAddressModule } from './user-address/user-address.module';
import { AuthModule } from './auth/auth.module';
import { ProductModule } from './product/product.module';
import { BrandModule } from './brand/brand.module';
import { CategoryModule } from './category/category.module';
import { ClassifyModule } from './classify/classify.module';
import { CommonModule } from './common/common.module';
import { OrderModule } from './order/order.module';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule], //Import ConfigModule để dùng ConfigService
      inject: [ConfigService], //Inject ConfigService vào useFactory
      useFactory: (config: ConfigService) => ({
        type: config.get<string>('DATABASE_TYPE') as 'mysql',
        host: config.get<string>('DATABASE_HOST'),
        port: config.get<number>('DATABASE_PORT'),
        username: config.get<string>('DATABASE_USERNAME'),
        password: config.get<string>('DATABASE_PASSWORD'),
        database: config.get<string>('DATABASE_NAME'),
        autoLoadEntities: true,
        synchronize: true, // tự động tạo bảng trong csdl
      }),
    }),
    CacheModule.register({
      isGlobal: true,
      stores: [
        createKeyv(
          `redis://${
            process.env.REDIS_PASSWORD
              ? `:${encodeURIComponent(process.env.REDIS_PASSWORD)}@`
              : ''
          }${process.env.REDIS_HOST || '127.0.0.2'}:${
            Number(process.env.REDIS_PORT) || 6379
          }/0`,
          {
            connectionTimeout: 2000,
            throwOnConnectError: true,
          },
        ),
      ],
      ttl: 60 * 5, // 5 phút mặc định
    }),
    UserModule,
    UserAddressModule,
    AuthModule,
    ProductModule,
    BrandModule,
    CategoryModule,
    ClassifyModule,
    OrderModule,
    CommonModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: GlobalInterceptor,
    },
  ],
})
export class AppModule {}
// cái này dùng để app chạy
