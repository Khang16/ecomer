import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Electronics' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Electronic gadgets and devices', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;
}
