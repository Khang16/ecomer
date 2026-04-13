import { Repository, FindManyOptions, ObjectLiteral } from 'typeorm';

export interface IBaseRepository<
  T extends ObjectLiteral,
> extends Repository<T> {
  findOneById(id: number): Promise<T | null>;

  findAll(options?: FindManyOptions<T>): Promise<T[]>;
}
