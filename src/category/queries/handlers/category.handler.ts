import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductCategory } from 'src/common/entities/product-categories.entity';
import { GetCategoriesQuery, GetCategoryQuery } from '../implements/category.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetCategoriesQuery)
export class GetCategoriesHandler implements IQueryHandler<GetCategoriesQuery> {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async execute(query: GetCategoriesQuery): Promise<ProductCategory[]> {
    return await this.categoryRepository.find({ relations: ['image'] });
  }
}

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  constructor(
    @InjectRepository(ProductCategory)
    private readonly categoryRepository: Repository<ProductCategory>,
  ) {}

  async execute(query: GetCategoryQuery): Promise<ProductCategory> {
    const category = await this.categoryRepository.findOne({
      where: { id: query.id },
      relations: ['image'],
    });
    if (!category) {
      throw new NotFoundException(`Category with ID ${query.id} not found`);
    }
    return category;
  }
}
