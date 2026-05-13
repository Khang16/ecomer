import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import type { Cache } from 'cache-manager';
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { DeleteUserCommand } from '../implements/delete-user.command';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(command: DeleteUserCommand): Promise<any> {
    const { id } = command;

    const user = await this.userRepository.findOne({ where: { id: +id } });

    if (!user) {
      throw new Error('User not found');
    }

    await this.userRepository.delete(user.id);
    await this.cacheManager.set('users:list:version', Date.now());

    return true;
  }
}
