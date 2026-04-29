import { CreateOrderDto } from 'src/order/dto/create-order.dto';

export class CreateOrderCommand {
  constructor(public readonly createOrderDto: CreateOrderDto) {}
}
