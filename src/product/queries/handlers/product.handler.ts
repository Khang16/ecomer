import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { Inject, NotFoundException } from '@nestjs/common';
import { Product } from 'src/common/entities/product.entity';
import { GetProductsQuery, GetProductQuery } from '../implements/product.query';

@QueryHandler(GetProductsQuery)
export class GetProductsHandler implements IQueryHandler<GetProductsQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(query: GetProductsQuery): Promise<Product[]> {
    const version =
      (await this.cacheManager.get<number>('products:list:version')) ?? 1;
    const cacheKey = `products:list:v${version}`;

    const cached = await this.cacheManager.get<Product[]>(cacheKey);
    if (cached) {
      return cached;
    }

    const result = await this.productRepository.find({
      relations: ['category', 'brand', 'classify', 'thumbnail', 'media'],
    });

    await this.cacheManager.set(cacheKey, result, 5 * 60 * 1000);
    return result;
  }
}

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const version =
      (await this.cacheManager.get<number>('products:list:version')) ?? 1;
    const cacheKey = `products:single:v${version}:${query.id}`;

    const cached = await this.cacheManager.get<Product>(cacheKey);
    if (cached) {
      return cached;
    }

    const product = await this.productRepository.findOne({
      where: { id: query.id },
      relations: ['category', 'brand', 'classify', 'thumbnail', 'media'],
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${query.id} not found`);
    }

    await this.cacheManager.set(cacheKey, product, 5 * 60 * 1000);
    return product;
  }
}
