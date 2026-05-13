import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { User } from 'src/common/entities/user.entity';
import type { Cache } from 'cache-manager';
import { Repository } from 'typeorm';
import { GetUsersQuery } from '../implements/find-user.query';
import { PaginationResult } from 'src/common/interfaces/pagination-result.interface';

@QueryHandler(GetUsersQuery)
export class FindUserHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(query: GetUsersQuery): Promise<PaginationResult<User>> {
    const { id, name, email, page = 1, limit = 10 } = query.filter;

    const filterKey = JSON.stringify({
      id: id ?? null,
      name: name ?? null,
      email: email ?? null,
      page,
      limit,
    });
    const version =
      (await this.cacheManager.get<number>('users:list:version')) ?? 1;
    const cacheKey = `users:list:v${version}:${filterKey}`;
    const cached =
      await this.cacheManager.get<PaginationResult<User>>(cacheKey);

    if (cached) {
      return cached;
    }

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

    const result = {
      data,
      meta: {
        totalItems,
        itemCount: data.length,
        itemsPerPage: limit,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page,
      },
    };

    await this.cacheManager.set(cacheKey, result, 5 * 60 * 1000);

    return result;
  }
}
