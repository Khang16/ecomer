import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import type { Cache } from 'cache-manager';
import { Media } from 'src/common/entities/media.entity'; // Import thêm Media entity
import { User } from 'src/common/entities/user.entity';
import { Repository } from 'typeorm';
import { StoreUserCommand } from '../implements/store-user.command';

@CommandHandler(StoreUserCommand)
export class StoreUserHandler implements ICommandHandler<StoreUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {}

  async execute(command: StoreUserCommand): Promise<any> {
    const { createUserDto } = command;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      birthday: createUserDto.birthday
        ? new Date(createUserDto.birthday)
        : undefined,
      level: createUserDto.level || 2,
    });

    const savedUser = await this.userRepository.save(user);
    await this.cacheManager.set('users:list:version', Date.now());

    return savedUser;
  }
}
