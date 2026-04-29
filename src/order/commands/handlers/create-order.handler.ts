import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Order } from 'src/common/entities/order.entity';
import { CreateOrderCommand } from '../implements/order.command';

@CommandHandler(CreateOrderCommand)
export class CreateOrderHandler implements ICommandHandler<CreateOrderCommand> {
  constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
  ) {}

  async execute(command: CreateOrderCommand): Promise<Order> {
    const { createOrderDto } = command;
    const order = this.orderRepository.create(createOrderDto);

    return await this.orderRepository.save(order);
  }
}
