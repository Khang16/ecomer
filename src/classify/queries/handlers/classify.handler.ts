import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classify } from 'src/common/entities/classify.entity';
import { GetClassifiesQuery, GetClassifyQuery } from '../implements/classify.query';
import { NotFoundException } from '@nestjs/common';

@QueryHandler(GetClassifiesQuery)
export class GetClassifiesHandler implements IQueryHandler<GetClassifiesQuery> {
  constructor(
    @InjectRepository(Classify)
    private readonly classifyRepository: Repository<Classify>,
  ) {}

  async execute(query: GetClassifiesQuery): Promise<Classify[]> {
    return await this.classifyRepository.find({ relations: ['image'] });
  }
}

@QueryHandler(GetClassifyQuery)
export class GetClassifyHandler implements IQueryHandler<GetClassifyQuery> {
  constructor(
    @InjectRepository(Classify)
    private readonly classifyRepository: Repository<Classify>,
  ) {}

  async execute(query: GetClassifyQuery): Promise<Classify> {
    const classify = await this.classifyRepository.findOne({
      where: { id: query.id },
      relations: ['image'],
    });
    if (!classify) {
      throw new NotFoundException(`Classify with ID ${query.id} not found`);
    }
    return classify;
  }
}
