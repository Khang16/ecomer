import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
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
  ) {}

  async execute(command: StoreUserCommand): Promise<any> {
    const { createUserDto, file } = command;

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      birthday: createUserDto.birthday
        ? new Date(createUserDto.birthday)
        : undefined,
      level: createUserDto.level || 2,
    });

    return this.userRepository.save(user);
  }
}
