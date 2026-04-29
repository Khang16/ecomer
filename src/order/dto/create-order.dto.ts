import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus } from 'src/common/enums/order/order.enum';

export class CreateOrderDto {
  @ApiProperty({ example: 250000, description: 'Tong tien don hang' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  total_rice!: number;

  @ApiProperty({ enum: OrderStatus })
  @Type(() => Number)
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @ApiProperty({ example: 'Giao gio hanh chinh', required: false })
  @IsString()
  @IsOptional()
  note?: string;

  @ApiProperty({ example: 1, description: 'ID nguoi dat hang' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  user_id!: number;

  @ApiProperty({ example: 1, description: 'ID phuong thuc thanh toan' })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  payment_method_id!: number;
}
