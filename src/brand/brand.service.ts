import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Brand } from '../common/entities/brand.entity';
import { CreateBrandDto } from './dto/create-brand.dto';

@Injectable()
export class BrandService {
  constructor(
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
  ) {}

  async create(createBrandDto: CreateBrandDto) {
    const brand = this.brandRepository.create({
      name: createBrandDto.name,
      description: createBrandDto.description,
    });
    return await this.brandRepository.save(brand);
  }

  async findAll() {
    return await this.brandRepository.find();
  }

  async findOne(id: number) {
    return await this.brandRepository.findOneBy({ id });
  }
}
