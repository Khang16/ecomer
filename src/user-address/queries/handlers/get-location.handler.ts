import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Province } from 'src/common/entities/province.entity';
import { District } from 'src/common/entities/district.entity';
import { Ward } from 'src/common/entities/ward.entity';
import {
  GetDistrictsQuery,
  GetProvincesQuery,
  GetWardsQuery,
} from '../implements/get-location.query';

@QueryHandler(GetProvincesQuery)
export class GetProvincesHandler implements IQueryHandler<GetProvincesQuery> {
  constructor(
    @InjectRepository(Province)
    private readonly provinceRepository: Repository<Province>,
  ) {}

  async execute(query: GetProvincesQuery): Promise<any> {
    return this.provinceRepository.find();
  }
}

@QueryHandler(GetDistrictsQuery)
export class GetDistrictsHandler implements IQueryHandler<GetDistrictsQuery> {
  constructor(
    @InjectRepository(District)
    private readonly districtRepository: Repository<District>,
  ) {}

  async execute(query: GetDistrictsQuery): Promise<any> {
    return this.districtRepository.find({
      where: { province_id: query.provinceId },
    });
  }
}

@QueryHandler(GetWardsQuery)
export class GetWardsHandler implements IQueryHandler<GetWardsQuery> {
  constructor(
    @InjectRepository(Ward)
    private readonly wardRepository: Repository<Ward>,
  ) {}

  async execute(query: GetWardsQuery): Promise<any> {
    return this.wardRepository.find({
      where: { district_id: query.districtId },
    });
  }
}
