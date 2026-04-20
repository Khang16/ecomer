import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from 'src/common/entities/brand.entity';
import { GetBrandsQuery } from '../implements/get-brands.query';

@QueryHandler(GetBrandsQuery)
export class GetBrandsHandler implements IQueryHandler<GetBrandsQuery> {
  constructor(
    @InjectRepository(Brand)
    private readonly brandRepository: Repository<Brand>,
  ) {}

  async execute(query: GetBrandsQuery): Promise<Brand[]> {
    return await this.brandRepository.find({ relations: ['image'] });
  }
}
