import { CreateProductDto } from 'src/product/dto/create-product.dto';

export class CreateProductCommand {
  constructor(
    public readonly createProductDto: CreateProductDto,
    public readonly files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
  ) {}
}

export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly updateProductDto: Partial<CreateProductDto>,
    public readonly files: {
      images?: Express.Multer.File[];
      videos?: Express.Multer.File[];
    },
  ) {}
}

export class DeleteProductCommand {
  constructor(public readonly id: number) {}
}
