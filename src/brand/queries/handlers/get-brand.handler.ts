import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/common/entities/brand.entity';
import { GetBrandQuery } from '../implements/get-brands.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetBrandQuery)
export class GetBrandHandler implements IQueryHandler<GetBrandQuery> {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async execute(query: GetBrandQuery): Promise<Brand> {
    const brand = await this.brandRepository.findOne({
      where: { id: query.id },
      relations: ['image'],
    });
    if (!brand) {
      throw new NotFoundException(`Brand with ID ${query.id} not found`);
    }
    return brand;
  }
}
