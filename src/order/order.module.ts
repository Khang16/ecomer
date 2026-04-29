import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CqrsModule } from '@nestjs/cqrs';
import { Order } from 'src/common/entities/order.entity';
import { PaymendMethod } from 'src/common/entities/payment-method.entity';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { OrderCommandHandlers } from './commands/handlers';

@Module({
  imports: [TypeOrmModule.forFeature([Order, PaymendMethod]), CqrsModule],
  controllers: [OrderController],
  providers: [OrderService, ...OrderCommandHandlers],
})
export class OrderModule {}
