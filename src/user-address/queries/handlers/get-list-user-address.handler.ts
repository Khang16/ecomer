import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from 'src/common/entities/user-address.entity';
import { Repository } from 'typeorm';
import { GetListUserAddressQuery } from '../implements/get-list-user-address.query';

@QueryHandler(GetListUserAddressQuery)
export class GetListUserAddressHandler implements IQueryHandler<GetListUserAddressQuery> {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {}

  async execute(query: GetListUserAddressQuery): Promise<any> {
    const { id, name } = query;

    const queryBuilder = this.userAddressRepository
      .createQueryBuilder('address')
      .leftJoinAndSelect('address.province', 'province')
      .leftJoinAndSelect('address.district', 'district')
      .leftJoinAndSelect('address.ward', 'ward')
      .leftJoinAndSelect('address.user', 'user');

    if (id) {
      queryBuilder.andWhere('address.id = :id', { id });
    }

    if (name) {
      queryBuilder.andWhere('address.name LIKE :name', { name: `%${name}%` });
    }

    return await queryBuilder.getMany();
  }
}
