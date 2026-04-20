import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from 'src/common/entities/product.entity';
import { GetProductsQuery, GetProductQuery } from '../implements/product.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(query: GetProductsQuery): Promise<Product[]> {
    return await this.productRepository.find({
      relations: ['category', 'brand', 'classify', 'thumbnail', 'media'],
    });
  }
}

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: query.id },
      relations: ['category', 'brand', 'classify', 'thumbnail', 'media'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${query.id} not found`);
    }
    return product;
  }
}
