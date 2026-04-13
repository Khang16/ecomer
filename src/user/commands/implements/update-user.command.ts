import { UpdateUserDto } from 'src/user/dtos/update-user.dto';

export class UpdateUserCommand {
  constructor(
    public readonly id: string,
    public readonly updateUserDto: UpdateUserDto,
    public readonly file?: Express.Multer.File,
  ) {}
}
