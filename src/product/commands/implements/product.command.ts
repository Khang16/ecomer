import { CreateProductDto } from 'src/product/dto/create-product.dto';

export class CreateProductCommand {
  constructor(public readonly createProductDto: CreateProductDto) {}
}

export class UpdateProductCommand {
  constructor(
    public readonly id: number,
    public readonly updateProductDto: Partial<CreateProductDto>,
  ) {}
}

export class DeleteProductCommand {
  constructor(public readonly id: number) {}
}
