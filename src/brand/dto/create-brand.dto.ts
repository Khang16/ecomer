import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @ApiProperty({ example: 'Nike' })
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 'Nike Brand Description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    description: 'Upload brand image',
    required: false,
  })
  @IsOptional()
  image?: any;
}
