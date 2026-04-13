import { FindManyOptions, Repository } from 'typeorm';

export class BaseRepository<T extends { id: number }> extends Repository<T> {
  async findOneById(id: number): Promise<T | null> {
    return this.findOneBy({ id } as any);
  }

  async findAll(options?: FindManyOptions<T>): Promise<T[]> {
    return this.find(options);
  }
}
