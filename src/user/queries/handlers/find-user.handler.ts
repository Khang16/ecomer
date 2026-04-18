import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { GetUsersQuery } from '../implements/find-user.query';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

@QueryHandler(GetUsersQuery)
export class FindUserHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetUsersQuery): Promise<PaginationResult<User>> {
    const { id, name, email, page = 1, limit = 10 } = query.filter;
    const skip = (page - 1) * limit;

    const qb = this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.avatar', 'avatar');
    if (id) {
      qb.andWhere('user.id = :id', { id });
    }

    if (name) {
      qb.andWhere('user.name LIKE :name', { name: `%${name}%` });
    }

    if (email) {
      qb.andWhere('user.email LIKE :email', { email: `%${email}%` });
    }

    qb.skip(skip).take(limit);

    const [data, totalItems] = await qb.getManyAndCount();

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
