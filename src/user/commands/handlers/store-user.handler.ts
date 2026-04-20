import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Media } from 'src/common/entities/media.entity'; // Import thêm Media entity
import { User } from 'src/common/entities/user.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
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

    let avatarMedia: Media | undefined = undefined;
    if (file) {
      // Create Media for avatar using the uploaded file's path
      avatarMedia = this.mediaRepository.create({
        url: `/uploads/${file.filename}`,
        type: TypeMedia.USER_AVATAR,
      });
      avatarMedia = await this.mediaRepository.save(avatarMedia);
    } else {
      avatarMedia = this.mediaRepository.create({
        url: `/uploads/avatar-default.png`,
        type: TypeMedia.USER_AVATAR,
      });
      avatarMedia = await this.mediaRepository.save(avatarMedia);
    }

    const user = this.userRepository.create({
      name: createUserDto.name,
      email: createUserDto.email,
      password: hashedPassword,
      phone: createUserDto.phone,
      gender: createUserDto.gender,
      birthday: createUserDto.birthday
        ? new Date(createUserDto.birthday)
        : undefined,
      is_confirmed: createUserDto.is_confirmed,
      level: createUserDto.level || 2,
      avatar_id: avatarMedia ? avatarMedia.id : undefined,
    });

    return this.userRepository.save(user);
  }
}
