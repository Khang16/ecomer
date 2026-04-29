import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Media } from 'src/common/entities/media.entity';
import { User } from 'src/common/entities/user.entity';
import { TypeMedia } from 'src/common/enums/media/type-media.enum';
import { Repository } from 'typeorm';
import { UpdateUserCommand } from '../implements/update-user.command';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  async execute(command: UpdateUserCommand): Promise<any> {
    const { id, updateUserDto, file } = command;

    // Fix: Convert string ID to number to match User entity ID type
    const user = await this.userRepository.findOne({
      where: { id: +id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    if (updateUserDto.password) {
      user.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Lọc bỏ các trường undefined để không ghi đè dữ liệu cũ bằng giá trị trống
    const { birthday, ...rest } = updateUserDto;

    Object.assign(user, rest);

    if (birthday) {
      user.birthday = new Date(birthday);
    }

    return await this.userRepository.save(user);
  }
}
