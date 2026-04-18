import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { UserAddress } from 'src/common/entities/user-address.entity';
import { Repository } from 'typeorm';
import { GetListUserAddressQuery } from '../implements/get-list-user-address.query';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

@QueryHandler(GetListUserAddressQuery)
export class GetListUserAddressHandler implements IQueryHandler<GetListUserAddressQuery> {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {}

  async execute(
    query: GetListUserAddressQuery,
  ): Promise<PaginationResult<UserAddress>> {
    const { id, name, page = 1, limit = 10 } = query;
    const skip = (page - 1) * limit;

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

    queryBuilder.skip(skip).take(limit);

    const [data, totalItems] = await queryBuilder.getManyAndCount();

    return {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };
  }
}
