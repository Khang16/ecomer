import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Classify } from '../common/entities/classify.entity';
import { CreateClassifyDto } from './dto/create-classify.dto';

@Injectable()
export class ClassifyService {
  constructor(
    @InjectRepository(Classify)
    private classifyRepository: Repository<Classify>,
  ) {}

  async create(createClassifyDto: CreateClassifyDto) {
    const classify = this.classifyRepository.create(createClassifyDto);
    return await this.classifyRepository.save(classify);
  }

  async findAll() {
    return await this.classifyRepository.find();
  }

  async findOne(id: number) {
    return await this.classifyRepository.findOneBy({ id });
  }
}
