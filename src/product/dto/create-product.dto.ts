import { IsString, IsInt, IsOptional, MaxLength, Min, IsArray } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({ example: 'Sản phẩm mẫu 1', description: 'Tên sản phẩm', maxLength: 120 })
  @IsString()
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional({ example: 'Mô tả chi tiết sản phẩm', description: 'Mô tả sản phẩm' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 100, description: 'Số lượng tồn kho' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  quantity: number;

  @ApiProperty({ example: 500000, description: 'Giá sản phẩm' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  price: number;

  @ApiPropertyOptional({ example: 1, description: 'ID của hình thu nhỏ (Media ID)' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  thumbnail_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID danh mục sản phẩm' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  product_category_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID thương hiệu' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  brand_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID phân loại' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  classify_id?: number;

  @ApiPropertyOptional({ example: 1, description: 'ID nguồn gốc xuất xứ' })
  @Type(() => Number)
  @IsInt()
  @IsOptional()
  origin_id?: number;


  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Upload multiple product images (max 10)',
  })
  @IsOptional()
  images?: any[];

  @ApiPropertyOptional({
    type: 'array',
    items: { type: 'string', format: 'binary' },
    description: 'Upload multiple product videos (max 5)',
  })
  @IsOptional()
  videos?: any[];
}
