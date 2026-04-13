import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { GetUsersQuery } from '../implements/find-user.query';

@QueryHandler(GetUsersQuery)
export class FindUserHandler implements IQueryHandler<GetUsersQuery> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async execute(query: GetUsersQuery): Promise<any> {
    const { id, name, email } = query.filter;

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

    return qb.getMany();
  }
}
