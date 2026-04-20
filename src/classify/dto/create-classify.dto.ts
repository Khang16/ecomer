import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateClassifyDto {
  @ApiProperty({ example: 'Men' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Men classification', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Upload classify image',
    required: false,
  })
  @IsOptional()
  image?: any;
}
